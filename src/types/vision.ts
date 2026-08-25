import { ReportType, ReportSeverity } from "./fieldReport";

export interface DetectedVisualIndicator {
  name: string;
  category: 'CRACK' | 'EROSION' | 'DEBRIS' | 'ROCKFALL' | 'BLOCKED_ROAD' | 'VEGETATION_DISTURBANCE';
  confidence: number;            // 0.0 - 1.0
  severity: ReportSeverity;
  riskContribution: number;      // Points (+2 to +15)
  description: string;
}

export interface DetailedVisionAnalysis {
  reportId?: string;
  source: 'Prototype Vision Analysis' | 'YOLOv8-Geotech-Model' | 'Edge-CV-Heuristic';
  analyzedAt: string;
  confidenceScore: number;       // e.g. 0.92
  detectedIndicators: DetectedVisualIndicator[];
  overallSeverity: ReportSeverity;
  totalRiskContribution: number; // Sum of points
  recommendedImmediateAction: string;
  isPrototype: boolean;
  disclaimer: string;
}

export interface IVisionAnalysisService {
  analyzeImage(
    imageDataUrlOrBuffer: string,
    reportType: ReportType,
    observedCracks?: boolean,
    roadBlocked?: boolean
  ): Promise<DetailedVisionAnalysis>;
}
