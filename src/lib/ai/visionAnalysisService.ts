import {
  IVisionAnalysisService,
  DetailedVisionAnalysis,
  DetectedVisualIndicator,
} from "@/types/vision";
import { ReportType, ReportSeverity } from "@/types/fieldReport";

export class PrototypeVisionAnalysisService implements IVisionAnalysisService {
  /**
   * Analyzes an uploaded or camera-captured field image.
   * Uses deterministic heuristic extraction and pattern matching to simulate edge computer vision inference.
   */
  public async analyzeImage(
    imageDataUrlOrBuffer: string,
    reportType: ReportType,
    observedCracks: boolean = false,
    roadBlocked: boolean = false
  ): Promise<DetailedVisionAnalysis> {
    // Simulate lightweight on-device edge neural network latency (150ms)
    await new Promise((resolve) => setTimeout(resolve, 150));

    const detectedIndicators: DetectedVisualIndicator[] = [];

    // 1. Crack / Shear Fissure Detection
    if (reportType === "CRACK" || observedCracks) {
      detectedIndicators.push({
        name: "Transverse Tension Shear Crack",
        category: "CRACK",
        confidence: 0.94,
        severity: "CRITICAL",
        riskContribution: 7.5,
        description: "Continuous longitudinal fracture detected along upper slope cut; estimated aperture 8–15cm.",
      });
    }

    // 2. Road Blockage & Carriageway Debris
    if (reportType === "ROAD_BLOCKED" || roadBlocked) {
      detectedIndicators.push({
        name: "Carriageway Obstruction & Mudflow",
        category: "BLOCKED_ROAD",
        confidence: 0.96,
        severity: "CRITICAL",
        riskContribution: 5.0,
        description: "Boulders and wet debris flow inundating both highway lanes; zero vehicular clearance.",
      });
    }

    // 3. Slope Mass Movement / Slump
    if (reportType === "SLOPE_MOVEMENT") {
      detectedIndicators.push({
        name: "Rotational Slope Toe Slump",
        category: "DEBRIS",
        confidence: 0.91,
        severity: "HIGH",
        riskContribution: 6.0,
        description: "Downward rotational shear displacement of saturated topsoil overburden.",
      });
    }

    // 4. Rockfall / Talus Deposit
    if (reportType === "ROCKFALL") {
      detectedIndicators.push({
        name: "Fresh Detached Boulder Talus",
        category: "ROCKFALL",
        confidence: 0.93,
        severity: "HIGH",
        riskContribution: 4.5,
        description: "Angular rock fragments (>1.5m diameter) deposited on asphalt verge from jointed rock face.",
      });
    }

    // 5. Gully & Toe Erosion
    if (reportType === "EROSION") {
      detectedIndicators.push({
        name: "Severe Drainage Gully Scour",
        category: "EROSION",
        confidence: 0.88,
        severity: "MEDIUM",
        riskContribution: 3.5,
        description: "Concentrated runoff scour undermining road embankment retaining foundation.",
      });
    }

    // 6. Vegetation Disturbance (Default secondary check)
    if (detectedIndicators.length > 0) {
      detectedIndicators.push({
        name: "Tilted Mountain Tree Canopy (Jackstrawed Timber)",
        category: "VEGETATION_DISTURBANCE",
        confidence: 0.85,
        severity: "MEDIUM",
        riskContribution: 2.0,
        description: "Non-vertical tree trunks indicating active creep movement of the underlying soil layer.",
      });
    } else {
      // Baseline minor ground disturbance
      detectedIndicators.push({
        name: "Superficial Topsoil Rill Runoff",
        category: "EROSION",
        confidence: 0.82,
        severity: "LOW",
        riskContribution: 1.5,
        description: "Minor sheet runoff; no acute structural displacement observed in frame.",
      });
    }

    const totalRiskContribution = Math.min(
      15,
      detectedIndicators.reduce((acc, ind) => acc + ind.riskContribution, 0)
    );

    const hasCritical = detectedIndicators.some((ind) => ind.severity === "CRITICAL");
    const hasHigh = detectedIndicators.some((ind) => ind.severity === "HIGH");
    const overallSeverity: ReportSeverity = hasCritical ? "CRITICAL" : hasHigh ? "HIGH" : "MEDIUM";

    // Immediate action recommendation
    let recommendedImmediateAction = "Continue regular monitoring and log photographic baseline.";
    if (overallSeverity === "CRITICAL") {
      recommendedImmediateAction = "Halt transit on affected road immediately; deploy SDRF emergency stabilization crew and alert downstream settlements.";
    } else if (overallSeverity === "HIGH") {
      recommendedImmediateAction = "Dispatch technical inspection team to measure crack progression with extensometers and clear drainage culverts.";
    }

    return {
      source: "Prototype Vision Analysis",
      analyzedAt: new Date().toISOString(),
      confidenceScore: 0.92,
      detectedIndicators,
      overallSeverity,
      totalRiskContribution,
      recommendedImmediateAction,
      isPrototype: true,
      disclaimer: "Prototype Vision Analysis: Edge feature extraction benchmark for demonstration. Ready for fine-tuned YOLOv8/ResNet integration.",
    };
  }
}

export const visionAnalysisService = new PrototypeVisionAnalysisService();
