import { FieldReport, ReportSeverity, ReportType, UserRole } from "@/types/fieldReport";
import { DetailedVisionAnalysis } from "@/types/vision";
import { Alert } from "@/types/alert";
import { ResponseTask } from "@/types/responseTask";
import { reportRepository } from "./reportRepository";
import { alertRepository } from "./alertRepository";
import { responseRepository } from "./responseRepository";
import { visionAnalysisService } from "@/lib/ai/visionAnalysisService";
import { riskEngine } from "@/lib/ai/riskEngine";

export interface PipelineSubmissionInput {
  reporterRole: UserRole;
  reporterName: string;
  reporterPhone?: string;
  districtName: string;
  riskZoneId?: string;
  location: { latitude: number; longitude: number };
  locationAddress?: string;
  reportType: ReportType;
  severity: ReportSeverity;
  observedCracks: boolean;
  slopeMovementDetected: boolean;
  roadBlocked: boolean;
  roadBlockageDegree?: "CLEAR" | "PARTIAL" | "COMPLETE";
  description: string;
  imageDataUrl?: string;
}

export interface PipelineExecutionResult {
  report: FieldReport;
  visionAnalysis: DetailedVisionAnalysis;
  evaluatedRiskScore: number;
  alertTriggered: boolean;
  generatedAlert?: Alert;
  generatedTask?: ResponseTask;
}

export const fieldSubmissionPipeline = {
  /**
   * Executes the unified 6-step processing pipeline for field observations
   */
  async processFieldReport(input: PipelineSubmissionInput): Promise<PipelineExecutionResult> {
    // 1. Run AI Vision Analysis on ground photo
    const visionAnalysis = await visionAnalysisService.analyzeImage(
      input.imageDataUrl || "",
      input.reportType,
      input.observedCracks,
      input.roadBlocked
    );

    // 2. Persist Report to Repository
    const report = await reportRepository.create({
      reporterRole: input.reporterRole,
      reporterName: input.reporterName,
      reporterPhone: input.reporterPhone,
      districtName: input.districtName,
      riskZoneId: input.riskZoneId || "zone-aizawl-hunthar",
      location: input.location,
      locationAddress: input.locationAddress,
      reportType: input.reportType,
      severity: visionAnalysis.overallSeverity || input.severity,
      observedCracks: input.observedCracks,
      slopeMovementDetected: input.slopeMovementDetected,
      roadBlocked: input.roadBlocked,
      roadBlockageDegree: input.roadBlockageDegree || "CLEAR",
      description: input.description,
      media: input.imageDataUrl
        ? [
            {
              id: `med-${Date.now()}`,
              mediaType: "IMAGE",
              url: input.imageDataUrl,
              visionAnalysis: {
                source: "AI Vision Analysis",
                analyzedAt: visionAnalysis.analyzedAt,
                confidenceScore: visionAnalysis.confidenceScore,
                riskContributionPoints: visionAnalysis.totalRiskContribution,
                detectedIndicators: visionAnalysis.detectedIndicators.map((d) => ({
                  name: d.name,
                  detected: true,
                  confidence: d.confidence,
                  severity: d.severity,
                })),
                overallSeverity: visionAnalysis.overallSeverity,
                recommendedImmediateAction: visionAnalysis.recommendedImmediateAction,
              },
            },
          ]
        : [],
      status: input.reporterRole === "CITIZEN" ? "PENDING_VERIFICATION" : "VERIFIED",
    });

    // 3. Compute Updated Hazard Score via Risk Engine
    const evalPrediction = riskEngine.predict({
      rainfall_1h: 22.0,
      rainfall_6h: 64.0,
      rainfall_24h: 112.0,
      rainfall_72h: 210.0,
      soil_moisture: 82.0,
      slope: 38.0,
      elevation: 1100,
      land_cover: input.roadBlocked ? "ROAD_CUT" : "DEGRADED_SCRUB",
      historical_event_density: 8,
      distance_to_road: input.roadBlocked ? 10 : 60,
      satellite_change_score: 0.65,
      field_report_score: visionAnalysis.totalRiskContribution,
    });

    const evaluatedRiskScore = evalPrediction.riskScore;
    let alertTriggered = false;
    let generatedAlert: Alert | undefined;
    let generatedTask: ResponseTask | undefined;

    // 4. Alert Trigger Check (If Score >= 76 or Road Blocked)
    if (evaluatedRiskScore >= 76 || input.roadBlocked || visionAnalysis.overallSeverity === "CRITICAL") {
      alertTriggered = true;
      const newAlertTitle = input.roadBlocked
        ? `EMERGENCY: Road Blockage & Slope Failure at ${input.districtName}`
        : `CRITICAL ALERT: Geotechnical Crack Failure at ${input.districtName}`;

      generatedAlert = {
        id: `alt-${Date.now()}`,
        title: newAlertTitle,
        severity: "CRITICAL",
        status: "ACTIVE",
        riskScore: evaluatedRiskScore,
        riskLevel: "CRITICAL",
        districtId: "dist-aizawl",
        districtName: input.districtName,
        locationPoint: input.location,
        triggerReason: `Verified ground observation: ${visionAnalysis.detectedIndicators.map((i) => i.name).join(", ")}. Ground risk contribution +${visionAnalysis.totalRiskContribution} pts.`,
        affectedPopulationEstimate: 1450,
        affectedRoads: [input.locationAddress || "NH-54 Lifeline Highway"],
        recommendedActions: [
          "Halt transit across affected corridor immediately.",
          "Mobilize SDRF 1st Bn earthmoving loaders.",
          "Issue public alert advisory to local residents.",
        ],
        responsePriority: "P1",
        issuedAt: new Date().toISOString(),
      };

      // 5. Automated Emergency Response Task Allocation
      generatedTask = await responseRepository.create({
        alertId: generatedAlert.id,
        districtName: input.districtName,
        title: `P1 Emergency Dispatch: Clear & Stabilize ${input.districtName}`,
        priority: "P1",
        status: "DEPLOYED",
        actionType: input.roadBlocked ? "ROAD_CLEARANCE" : "SLOPE_STABILIZATION",
        assignedAgency: "SDRF Quick Response 1st Bn & BRO Highway Team",
        targetLocation: input.location,
        locationDescription: input.locationAddress || `${input.location.latitude}, ${input.location.longitude}`,
        description: `Automated dispatch triggered following field report (${input.reportType}): ${visionAnalysis.recommendedImmediateAction}`,
        allocatedPersonnel: 12,
        equipmentRequired: ["Hydraulic Excavator", "Tension Crackmeter", "LED Warning Signs"],
      });
    }

    return {
      report,
      visionAnalysis,
      evaluatedRiskScore,
      alertTriggered,
      generatedAlert,
      generatedTask,
    };
  },
};
