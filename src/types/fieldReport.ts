import { Coordinate } from './geo';

export type UserRole = 'ADMIN' | 'FIELD_OFFICER' | 'CITIZEN';

export type ReportType =
  | 'CRACK'
  | 'SLOPE_MOVEMENT'
  | 'ROAD_BLOCKED'
  | 'ROCKFALL'
  | 'DEBRIS'
  | 'EROSION'
  | 'OTHER';

export type ReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ReportStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'ACTIONED' | 'REJECTED';

export type SyncStatus = 'SYNCED' | 'PENDING_SYNC' | 'FAILED';

export interface VisionIndicator {
  name: string;
  detected: boolean;
  confidence: number; // 0.0 to 1.0
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  boundingBox?: [number, number, number, number];
}

export interface VisionAnalysisResult {
  analyzedAt: string;
  source: 'AI Vision Analysis' | 'Prototype / Simulated Analysis';
  detectedIndicators: VisionIndicator[];
  overallSeverity: ReportSeverity;
  riskContributionPoints: number;
  confidenceScore: number;
  recommendedImmediateAction: string;
}

export interface FieldReportMedia {
  id: string;
  url: string;
  mediaType: 'IMAGE' | 'VIDEO';
  thumbnailUrl?: string;
  visionAnalysis?: VisionAnalysisResult;
}

export interface FieldReport {
  id: string;
  reporterRole: UserRole;
  reporterName: string;
  reporterPhone?: string;
  riskZoneId?: string;
  riskZoneName?: string;
  districtId?: string;
  districtName?: string;
  location: Coordinate;
  locationAddress?: string;
  reportType: ReportType;
  severity: ReportSeverity;
  observedCracks: boolean;
  slopeMovementDetected: boolean;
  roadBlocked: boolean;
  roadBlockageDegree?: 'CLEAR' | 'PARTIAL' | 'COMPLETE';
  description: string;
  media: FieldReportMedia[];
  status: ReportStatus;
  syncStatus: SyncStatus;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}
