import { RiskLevel } from './risk';

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface District {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  center: Coordinate;
  vulnerabilityIndex: number; // 0 to 100
  totalRiskZones: number;
  criticalZonesCount: number;
  populationEstimate: number;
  areaKm2: number;
}

export interface RiskZone {
  id: string;
  districtId: string;
  districtName: string;
  state: string;
  name: string;
  zoneCode: string;
  center: Coordinate;
  currentRiskScore: number; // 0 to 100
  currentRiskLevel: RiskLevel;
  slopeAngleDeg: number;
  elevationM: number;
  soilType: string;
  vegetationCover: string;
  historicalLandslideCount: number;
  recentFieldReportCount: number;
  primaryThreatCorridor: string;
  lastEvaluatedAt: string;
}

export type RoadClassification = 'NATIONAL_HIGHWAY' | 'STATE_HIGHWAY' | 'DISTRICT_ROAD' | 'RURAL_ACCESS';

export interface VulnerableRoad {
  id: string;
  districtId: string;
  roadName: string;
  code: string;
  classification: RoadClassification;
  importanceWeight: number; // 1.0 to 3.0
  lengthKm: number;
  isBlocked: boolean;
  blockageSeverity?: 'NONE' | 'PARTIAL' | 'TOTAL';
  blockageReason?: string;
  associatedRiskZoneId?: string;
  coordinates: Coordinate[];
}

export interface VulnerableVillage {
  id: string;
  districtId: string;
  name: string;
  location: Coordinate;
  population: number;
  households: number;
  vulnerabilityTier: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  nearestShelterDistanceKm: number;
  contactOfficialPhone?: string;
}

export interface HistoricalLandslideEvent {
  id: string;
  districtId: string;
  locationName: string;
  coordinates: Coordinate;
  incidentDate: string;
  severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CATASTROPHIC';
  fatalities: number;
  displacedCount: number;
  triggerFactor: string;
  infrastructureDamage: string;
}
