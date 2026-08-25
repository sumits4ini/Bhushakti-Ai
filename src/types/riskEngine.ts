import { RiskLevel, RiskTrend, FactorSeverity } from "./risk";

export interface EnvironmentalFeatures {
  rainfall_1h: number;             // in mm (0 - 150)
  rainfall_6h: number;             // in mm (0 - 300)
  rainfall_24h: number;            // in mm (0 - 600)
  rainfall_72h: number;            // in mm (0 - 1200)
  soil_moisture: number;           // percentage (0 - 100%)
  slope: number;                   // degrees (0 - 90°)
  elevation: number;               // meters MSL (0 - 5000)
  land_cover: 'DEGRADED_SCRUB' | 'SETTLEMENT_SURCHARGE' | 'FOREST_CANOPY' | 'ROAD_CUT' | 'AGRICULTURAL_TERRACE' | 'BARREN_ROCK';
  historical_event_density: number;// count in 5km geological radius (0 - 30)
  distance_to_road: number;        // distance in meters to nearest highway/corridor (0 - 2000)
  satellite_change_score: number;  // remote sensing index / NDVI loss (0.0 - 1.0)
  field_report_score: number;      // verified ground crack/movement points (0 - 30)
}

export interface ExplainableFactor {
  id: string;
  name: string;
  category: 'HYDROLOGICAL' | 'GEOTECHNICAL' | 'TOPOGRAPHICAL' | 'GEOLOGICAL' | 'ANTHROPOGENIC' | 'REMOTE_SENSING' | 'GROUND_TRUTH';
  inputValue: string | number;
  unit?: string;
  contributionPoints: number;      // Points added to total score
  normalizedPct: number;          // % of total risk score
  severity: FactorSeverity;
  description: string;
  triggerThresholdCrossed: boolean;
}

export interface RiskPredictionResult {
  riskScore: number;               // 0 to 100 Landslide Hazard Index (LHI)
  riskLevel: RiskLevel;            // LOW, MODERATE, HIGH, CRITICAL
  confidence: number;              // 0.0 to 1.0 (e.g. 0.91)
  trend: RiskTrend;                // RISING, STABLE, FALLING
  evaluatedAt: string;
  factors: ExplainableFactor[];
  recommendations: string[];
  forecast24h: {
    timeOffset: '+0h' | '+3h' | '+6h' | '+12h' | '+24h';
    predictedScore: number;
    predictedLevel: RiskLevel;
    projectedRainfallMm: number;
  }[];
  modelMetadata: EngineMetadata;
}

export interface EngineMetadata {
  modelName: string;
  version: string;
  featuresAnalyzed: number;
  predictionType: string;
  confidenceEstimate: string;
  status: 'DECISION_SUPPORT_PROTOTYPE';
  disclaimer: string;
}

export interface IRiskModel {
  predict(features: EnvironmentalFeatures): RiskPredictionResult;
  explain(features: EnvironmentalFeatures): ExplainableFactor[];
  getModelMetadata(): EngineMetadata;
}
