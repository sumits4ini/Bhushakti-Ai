import { Coordinate } from './geo';
import { ResponsePriority } from './alert';

export type TaskStatus = 'PENDING_DISPATCH' | 'DEPLOYED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type ActionType =
  | 'ROAD_CLEARANCE'
  | 'VILLAGE_EVACUATION'
  | 'DRONE_SURVEY'
  | 'TRAFFIC_DIVERSION'
  | 'SLOPE_STABILIZATION'
  | 'SHELTER_SETUP'
  | 'MEDICAL_DISPATCH';

export interface ResponseTask {
  id: string;
  alertId?: string;
  riskZoneId?: string;
  riskZoneName?: string;
  districtName: string;
  title: string;
  priority: ResponsePriority;
  status: TaskStatus;
  actionType: ActionType;
  assignedAgency: string; // e.g., 'SDRF Quick Response 1st Bn', 'BRO Highway Wing'
  targetLocation: Coordinate;
  locationDescription: string;
  description: string;
  allocatedPersonnel: number;
  equipmentRequired: string[];
  createdAt: string;
  updatedAt: string;
  estimatedCompletionTime?: string;
}
