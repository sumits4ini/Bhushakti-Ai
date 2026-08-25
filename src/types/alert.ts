import { Coordinate } from './geo';
import { RiskLevel } from './risk';

export type AlertSeverity = 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'EXPIRED';

export type ResponsePriority = 'P1' | 'P2' | 'P3' | 'P4';

export interface Alert {
  id: string;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  districtId: string;
  districtName: string;
  riskZoneId?: string;
  riskZoneName?: string;
  locationPoint: Coordinate;
  triggerReason: string;
  affectedPopulationEstimate: number;
  affectedRoads: string[];
  recommendedActions: string[];
  responsePriority: ResponsePriority;
  issuedAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
}
