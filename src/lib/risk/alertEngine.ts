import { AlertSeverity, ResponsePriority } from "@/types/alert";
import { RiskTrend } from "@/types/risk";

export interface AlertEngineInput {
  riskScore: number;
  riskTrend: RiskTrend;
  rainfall1h: number;
  rainfall24h: number;
  populationAffected: number;
  infrastructureImportance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  hasRoadBlockage?: boolean;
  hasCracks?: boolean;
  fieldReportsCount?: number;
  confidence?: number;
  locationName: string;
  districtName: string;
  threatCorridor?: string;
}

export interface AlertEvaluationResult {
  alertNeeded: boolean;
  severity: AlertSeverity;
  priority: ResponsePriority;
  title: string;
  triggerReason: string;
  recommendedActions: string[];
  priorityScore: number; // 0 - 100
  affectedRoads: string[];
  suggestedAgency: string;
  suggestedActionType: 'ROAD_CLEARANCE' | 'VILLAGE_EVACUATION' | 'DRONE_SURVEY' | 'TRAFFIC_DIVERSION' | 'SLOPE_STABILIZATION';
}

export class AlertEngine {
  /**
   * Evaluates input telemetry to determine alert severity and tactical response priority.
   */
  public evaluate(input: AlertEngineInput): AlertEvaluationResult {
    // 1. Calculate Alert Severity Tier
    let severity: AlertSeverity = "INFO";
    if (input.riskScore >= 76 || input.hasRoadBlockage || (input.riskScore >= 70 && input.hasCracks)) {
      severity = "CRITICAL";
    } else if (input.riskScore >= 51 || input.rainfall24h >= 80 || input.hasCracks) {
      severity = "WARNING";
    } else if (input.riskScore >= 26 || input.rainfall24h >= 40) {
      severity = "WATCH";
    } else {
      severity = "INFO";
    }

    // 2. Multi-Factor Priority Calculation (P1 - P4)
    // Formula: Risk Severity (35%) + Population Impact (25%) + Road/Infra Criticality (25%) + Trend/Confidence (15%)
    let priorityPoints = 0;

    // A. Risk Score Weight (up to 35 pts)
    priorityPoints += (input.riskScore / 100) * 35;

    // B. Population Impact Weight (up to 25 pts)
    if (input.populationAffected > 2500) priorityPoints += 25;
    else if (input.populationAffected > 1000) priorityPoints += 18;
    else if (input.populationAffected > 300) priorityPoints += 10;
    else priorityPoints += 5;

    // C. Infrastructure & Highway Importance (up to 25 pts)
    if (input.hasRoadBlockage) priorityPoints += 25;
    else if (input.infrastructureImportance === "CRITICAL") priorityPoints += 22;
    else if (input.infrastructureImportance === "HIGH") priorityPoints += 16;
    else if (input.infrastructureImportance === "MEDIUM") priorityPoints += 10;
    else priorityPoints += 4;

    // D. Trend & Urgency Modifier (up to 15 pts)
    if (input.riskTrend === "RISING") priorityPoints += 10;
    if (input.rainfall1h >= 25) priorityPoints += 5;

    const finalPriorityScore = Math.min(100, Math.round(priorityPoints));

    let priority: ResponsePriority = "P4";
    if (finalPriorityScore >= 75 || input.hasRoadBlockage || input.riskScore >= 85) {
      priority = "P1";
    } else if (finalPriorityScore >= 55 || input.riskScore >= 65) {
      priority = "P2";
    } else if (finalPriorityScore >= 35 || input.riskScore >= 40) {
      priority = "P3";
    } else {
      priority = "P4";
    }

    // 3. Generate Trigger Reason & Contextual Title
    let title = "";
    if (severity === "CRITICAL") {
      title = input.hasRoadBlockage
        ? `EMERGENCY RED ALERT: Road Severance & Active Landslip in ${input.districtName}`
        : `CRITICAL RED ALERT: High-Hazard Landslide Failure Imminent in ${input.districtName}`;
    } else if (severity === "WARNING") {
      title = `ORANGE WARNING: Accelerating Landslide Susceptibility in ${input.districtName}`;
    } else if (severity === "WATCH") {
      title = `YELLOW WATCH: Elevated Monsoon Infiltration in ${input.districtName}`;
    } else {
      title = `ADVISORY: Routine Meteorological Surveillance in ${input.districtName}`;
    }

    const triggerReasons: string[] = [];
    if (input.riskScore >= 76) triggerReasons.push(`Landslide Hazard Index reached ${Math.round(input.riskScore)}/100 (CRITICAL)`);
    if (input.rainfall24h >= 80) triggerReasons.push(`24h cumulative rainfall exceeded threshold (${input.rainfall24h}mm)`);
    if (input.hasRoadBlockage) triggerReasons.push(`Ground survey confirmed carriageway obstruction`);
    if (input.hasCracks) triggerReasons.push(`Field crackmeters detected active tension fissure movement`);
    if (input.riskTrend === "RISING") triggerReasons.push(`Orographic squall advancing (+${input.rainfall1h}mm/h intensity)`);

    const triggerReason = triggerReasons.join("; ") || `Baseline monitoring parameters updated for ${input.locationName}.`;

    // 4. Generate Recommended Actions
    const recommendedActions: string[] = [];
    if (severity === "CRITICAL") {
      recommendedActions.push(`Halt all heavy vehicular transit on ${input.threatCorridor || "primary highway corridor"} immediately.`);
      recommendedActions.push("Pre-position SDRF 1st Bn quick response team with hydraulic earthmovers & searchlights.");
      recommendedActions.push(`Issue urgent safety broadcast to ${input.populationAffected.toLocaleString()} vulnerable residents.`);
    } else if (severity === "WARNING") {
      recommendedActions.push("Dispatch technical inspection patrol to measure slope fissure apertures.");
      recommendedActions.push("Restrict night transit for multi-axle freight carriers.");
      recommendedActions.push("Maintain VHF radio standby with local village councils.");
    } else if (severity === "WATCH") {
      recommendedActions.push("Inspect roadside culverts and clear silt runoff blockages.");
      recommendedActions.push("Increase automated weather station telemetry polling to 15-minute intervals.");
    } else {
      recommendedActions.push("Maintain standard background automated surveillance.");
    }

    // Suggested Agency & Action Type
    let suggestedAgency = "SDRF Quick Response 1st Battalion";
    let suggestedActionType: AlertEvaluationResult["suggestedActionType"] = "SLOPE_STABILIZATION";

    if (input.hasRoadBlockage) {
      suggestedAgency = "Border Roads Organisation (BRO) & SDRF Highway Wing";
      suggestedActionType = "ROAD_CLEARANCE";
    } else if (input.populationAffected > 2000 && severity === "CRITICAL") {
      suggestedAgency = "State Disaster Management Authority (SDMA) Evacuation Unit";
      suggestedActionType = "VILLAGE_EVACUATION";
    }

    return {
      alertNeeded: severity !== "INFO",
      severity,
      priority,
      title,
      triggerReason,
      recommendedActions,
      priorityScore: finalPriorityScore,
      affectedRoads: [input.threatCorridor || "NH-54 Lifeline Highway"],
      suggestedAgency,
      suggestedActionType,
    };
  }
}

export const alertEngine = new AlertEngine();
