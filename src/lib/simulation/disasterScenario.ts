import { RiskLevel, RiskTrend } from "@/types/risk";
import { ReportType } from "@/types/fieldReport";

export interface SimulationStep {
  stepNumber: number;
  title: string;
  phaseLabel: 'ENVIRONMENTAL_TRIGGER' | 'GEOTECHNICAL_SATURATION' | 'TERRAIN_SUSCEPTIBILITY' | 'FIELD_REPORT' | 'AI_VISION' | 'RISK_FUSION' | 'CRITICAL_ALERT' | 'P1_RESPONSE_DISPATCH';
  description: string;
  telemetry: {
    rainfall24h: number;
    rainfall1h: number;
    soilMoisturePct: number;
    slopeAngleDeg: number;
    riskScore: number;
    riskLevel: RiskLevel;
    trend: RiskTrend;
  };
  highlightFactor: string;
  fieldReportData?: {
    reporter: string;
    type: ReportType;
    message: string;
    photoUrl: string;
    crackWidthCm: number;
  };
  visionDetection?: {
    indicator: string;
    confidence: number;
    severity: string;
    riskContributionPts: number;
  };
  alertPayload?: {
    title: string;
    severity: 'CRITICAL';
    priority: 'P1';
    affectedPop: number;
    threatenedRoad: string;
  };
  taskPayload?: {
    title: string;
    agency: string;
    status: 'DEPLOYED';
    personnel: number;
    directives: string[];
  };
}

export const AIZAWL_DISASTER_SCENARIO: SimulationStep[] = [
  {
    stepNumber: 0,
    title: "Initial Baseline Monitoring State",
    phaseLabel: "ENVIRONMENTAL_TRIGGER",
    description: "Standard monsoon showers recorded along NH-54 valley. Subsoil infiltration is stable within safety thresholds.",
    telemetry: {
      rainfall24h: 42.0,
      rainfall1h: 6.5,
      soilMoisturePct: 58.0,
      slopeAngleDeg: 38.5,
      riskScore: 48,
      riskLevel: "MODERATE",
      trend: "STABLE",
    },
    highlightFactor: "Baseline monsoon precipitation (42mm/24h). Slope shear resistance intact.",
  },
  {
    stepNumber: 1,
    title: "Step 1: Heavy Cloudburst Deluge Surge",
    phaseLabel: "ENVIRONMENTAL_TRIGGER",
    description: "Intense convective rainband stalls over Aizawl ridge. 24h cumulative rainfall accelerates rapidly from 42mm to 96mm.",
    telemetry: {
      rainfall24h: 96.0,
      rainfall1h: 24.0,
      soilMoisturePct: 65.0,
      slopeAngleDeg: 38.5,
      riskScore: 67,
      riskLevel: "HIGH",
      trend: "RISING",
    },
    highlightFactor: "24h rainfall surged to 96mm (+19.0 pts). Landslide hazard elevated to HIGH.",
  },
  {
    stepNumber: 2,
    title: "Step 2: Subsoil Geotechnical Saturation",
    phaseLabel: "GEOTECHNICAL_SATURATION",
    description: "Rapid hydraulic percolation saturates weathered shale overburden. Volumetric soil moisture jumps from 58% to 76%.",
    telemetry: {
      rainfall24h: 104.0,
      rainfall1h: 28.0,
      soilMoisturePct: 76.0,
      slopeAngleDeg: 38.5,
      riskScore: 74,
      riskLevel: "HIGH",
      trend: "RISING",
    },
    highlightFactor: "Soil moisture reached 76% (+7.0 pts). Positive pore water pressure reducing effective shear strength.",
  },
  {
    stepNumber: 3,
    title: "Step 3: Terrain & Historical Cluster Amplification",
    phaseLabel: "TERRAIN_SUSCEPTIBILITY",
    description: "AI Risk Engine fuses steep 38.5° slope gradient, road cut proximity (20m), and 8 historical GSI landslide records in the buffer.",
    telemetry: {
      rainfall24h: 112.0,
      rainfall1h: 30.0,
      soilMoisturePct: 80.0,
      slopeAngleDeg: 38.5,
      riskScore: 81,
      riskLevel: "CRITICAL",
      trend: "RISING",
    },
    highlightFactor: "Slope angle (38.5°) + historical cluster crossed critical stability threshold (Score: 81/100, CRITICAL).",
  },
  {
    stepNumber: 4,
    title: "Step 4: Ground Truth Field Patrol Submission",
    phaseLabel: "FIELD_REPORT",
    description: "SDRF Inspector L. Sailo encounters active tension crack along NH-54 highway shoulder and submits geo-tagged ground photo.",
    telemetry: {
      rainfall24h: 114.0,
      rainfall1h: 32.0,
      soilMoisturePct: 82.0,
      slopeAngleDeg: 38.5,
      riskScore: 81,
      riskLevel: "CRITICAL",
      trend: "RISING",
    },
    highlightFactor: "Live Ground Observation: '12cm longitudinal shear crack detected along highway verge.'",
    fieldReportData: {
      reporter: "Inspector L. Sailo (SDRF 3rd Bn)",
      type: "CRACK",
      message: "Continuous 12cm aperture shear fissure cutting across NH-54 carriageway near milestone 14.",
      photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
      crackWidthCm: 12,
    },
  },
  {
    stepNumber: 5,
    title: "Step 5: Edge AI Computer Vision Feature Extraction",
    phaseLabel: "AI_VISION",
    description: "Vision Analysis Engine processes the ground image, detecting transverse tension crack with high confidence.",
    telemetry: {
      rainfall24h: 116.0,
      rainfall1h: 34.0,
      soilMoisturePct: 83.0,
      slopeAngleDeg: 38.5,
      riskScore: 81,
      riskLevel: "CRITICAL",
      trend: "RISING",
    },
    highlightFactor: "Computer Vision: Transverse Tension Shear Crack (94% confidence, CRITICAL severity, +7.5 pts).",
    visionDetection: {
      indicator: "Transverse Tension Shear Crack",
      confidence: 0.94,
      severity: "CRITICAL",
      riskContributionPts: 7.5,
    },
  },
  {
    stepNumber: 6,
    title: "Step 6: Multimodal AI Risk Score Recalibration",
    phaseLabel: "RISK_FUSION",
    description: "AI Fusion Engine incorporates the verified ground crack telemetry into the multi-factor model, escalating score from 81 to 89.",
    telemetry: {
      rainfall24h: 118.5,
      rainfall1h: 36.5,
      soilMoisturePct: 84.5,
      slopeAngleDeg: 38.5,
      riskScore: 89,
      riskLevel: "CRITICAL",
      trend: "RISING",
    },
    highlightFactor: "Risk Score surged to 89/100 (CRITICAL). Projected failure window: Next 2–4 hours.",
  },
  {
    stepNumber: 7,
    title: "Step 7: Autonomous Emergency Red Alert Broadcast",
    phaseLabel: "CRITICAL_ALERT",
    description: "System triggers P1 Emergency Red Alert and broadcasts immediate bulletins via in-app console, SMS proxy, and VHF relays.",
    telemetry: {
      rainfall24h: 118.5,
      rainfall1h: 36.5,
      soilMoisturePct: 84.5,
      slopeAngleDeg: 38.5,
      riskScore: 89,
      riskLevel: "CRITICAL",
      trend: "RISING",
    },
    highlightFactor: "P1 Red Alert Issued: 'EMERGENCY: Immediate Landslide Failure Imminent at Aizawl NH-54 Corridor.'",
    alertPayload: {
      title: "EMERGENCY: Imminent Landslide Failure at NH-54 Hunthar",
      severity: "CRITICAL",
      priority: "P1",
      affectedPop: 1450,
      threatenedRoad: "NH-54 Silchar-Aizawl National Lifeline",
    },
  },
  {
    stepNumber: 8,
    title: "Step 8: Automated P1 Tactical Response Dispatch",
    phaseLabel: "P1_RESPONSE_DISPATCH",
    description: "System auto-generates P1 response dispatch ticket assigned to SDRF 1st Bn and BRO Highway Wing with operational directives.",
    telemetry: {
      rainfall24h: 118.5,
      rainfall1h: 36.5,
      soilMoisturePct: 84.5,
      slopeAngleDeg: 38.5,
      riskScore: 89,
      riskLevel: "CRITICAL",
      trend: "RISING",
    },
    highlightFactor: "Tactical Unit Dispatched: SDRF 1st Bn & BRO (16 Specialists with Hydraulic Loaders & Crackmeters).",
    taskPayload: {
      title: "P1 Dispatch: Halt NH-54 Transit & Deploy Slope Stabilization Unit",
      agency: "SDRF Quick Response 1st Bn & BRO Highway Wing",
      status: "DEPLOYED",
      personnel: 16,
      directives: [
        "Halt commercial transit across NH-54 milestone 14 immediately.",
        "Pre-position heavy hydraulic earthmovers & searchlights.",
        "Broadcast safety advisory to 1,450 downhill residents in Hunthar Veng.",
        "Install electronic extensometers across 12cm tension fissure.",
      ],
    },
  },
];
