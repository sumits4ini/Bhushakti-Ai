export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type RiskTrend = 'RISING' | 'STABLE' | 'FALLING';

export type FactorSeverity = 'low' | 'moderate' | 'high' | 'critical';

export interface RiskFactor {
  id: string;
  name: string;
  category: 'HYDROLOGICAL' | 'TOPOGRAPHICAL' | 'GEOTECHNICAL' | 'HISTORICAL' | 'FIELD_SIGNAL' | 'REMOTE_SENSING';
  value: string | number;
  unit?: string;
  contributionPoints: number; // 0 to 100
  normalizedWeightPct: number; // % of total score
  severity: FactorSeverity;
  description: string;
  isTrigger: boolean;
}

export interface RiskPrediction {
  id: string;
  zoneId: string;
  zoneName: string;
  districtName: string;
  state: string;
  calculatedRiskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  confidenceScore: number; // 0.0 to 1.0 (e.g. 0.91 = 91%)
  trend: RiskTrend;
  evaluatedAt: string;
  modelMetadata: ModelMetadata;
  factors: RiskFactor[];
  recommendations: string[];
  forecast24h: HourlyRiskForecast[];
}

export interface HourlyRiskForecast {
  timeOffset: '+0h' | '+3h' | '+6h' | '+12h' | '+24h';
  timestamp: string;
  predictedRiskScore: number;
  predictedRiskLevel: RiskLevel;
  projectedRainfallMm: number;
  confidenceScore: number;
}

export interface ModelMetadata {
  modelName: string;
  version: string;
  featuresCount: number;
  algorithmType: string;
  decisionSupportDisclaimer: string;
  lastTrainedDate?: string;
}
