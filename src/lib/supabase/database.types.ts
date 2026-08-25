export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRoleEnum = 'ADMIN' | 'FIELD_OFFICER' | 'CITIZEN';
export type RiskLevelEnum = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type ReportTypeEnum = 'CRACK' | 'SLOPE_MOVEMENT' | 'ROAD_BLOCKED' | 'ROCKFALL' | 'DEBRIS' | 'EROSION' | 'OTHER';
export type ReportStatusEnum = 'PENDING_VERIFICATION' | 'VERIFIED' | 'ACTIONED' | 'REJECTED';
export type AlertSeverityEnum = 'INFO' | 'WATCH' | 'WARNING' | 'CRITICAL';
export type AlertStatusEnum = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'EXPIRED';
export type ResponsePriorityEnum = 'P1' | 'P2' | 'P3' | 'P4';
export type TaskStatusEnum = 'PENDING_DISPATCH' | 'DEPLOYED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type RoadClassificationEnum = 'NATIONAL_HIGHWAY' | 'STATE_HIGHWAY' | 'DISTRICT_ROAD' | 'RURAL_ACCESS';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: UserRoleEnum;
          phone: string | null;
          organization: string | null;
          district_jurisdiction: string | null;
          badge_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: UserRoleEnum;
          phone?: string | null;
          organization?: string | null;
          district_jurisdiction?: string | null;
          badge_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          role?: UserRoleEnum;
          phone?: string | null;
          organization?: string | null;
          district_jurisdiction?: string | null;
          badge_number?: string | null;
          updated_at?: string;
        };
      };
      districts: {
        Row: {
          id: string;
          name: string;
          state: string;
          state_code: string;
          center_point: unknown;
          boundary: unknown | null;
          vulnerability_index: number;
          population_estimate: number;
          area_km2: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          state: string;
          state_code: string;
          center_point: unknown;
          boundary?: unknown | null;
          vulnerability_index?: number;
          population_estimate?: number;
          area_km2?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          state?: string;
          state_code?: string;
          center_point?: unknown;
          boundary?: unknown | null;
          vulnerability_index?: number;
          population_estimate?: number;
          area_km2?: number;
          updated_at?: string;
        };
      };
      risk_zones: {
        Row: {
          id: string;
          district_id: string;
          name: string;
          zone_code: string;
          center_point: unknown;
          boundary: unknown | null;
          current_risk_score: number;
          current_risk_level: RiskLevelEnum;
          slope_angle_deg: number;
          elevation_m: number;
          soil_type: string | null;
          vegetation_cover: string | null;
          historical_event_count: number;
          primary_threat_corridor: string | null;
          last_evaluated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          district_id: string;
          name: string;
          zone_code: string;
          center_point: unknown;
          boundary?: unknown | null;
          current_risk_score?: number;
          current_risk_level?: RiskLevelEnum;
          slope_angle_deg: number;
          elevation_m: number;
          soil_type?: string | null;
          vegetation_cover?: string | null;
          historical_event_count?: number;
          primary_threat_corridor?: string | null;
          last_evaluated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          district_id?: string;
          name?: string;
          zone_code?: string;
          center_point?: unknown;
          boundary?: unknown | null;
          current_risk_score?: number;
          current_risk_level?: RiskLevelEnum;
          slope_angle_deg?: number;
          elevation_m?: number;
          soil_type?: string | null;
          vegetation_cover?: string | null;
          historical_event_count?: number;
          primary_threat_corridor?: string | null;
          last_evaluated_at?: string;
        };
      };
      field_reports: {
        Row: {
          id: string;
          reporter_id: string | null;
          reporter_role: UserRoleEnum;
          reporter_name: string;
          reporter_phone: string | null;
          risk_zone_id: string | null;
          district_id: string | null;
          district_name: string | null;
          location_point: unknown;
          latitude: number;
          longitude: number;
          location_address: string | null;
          report_type: ReportTypeEnum;
          severity: string;
          observed_cracks: boolean;
          slope_movement_detected: boolean;
          road_blocked: boolean;
          road_blockage_degree: string;
          description: string;
          status: ReportStatusEnum;
          sync_status: string;
          verified_at: string | null;
          verified_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reporter_id?: string | null;
          reporter_role?: UserRoleEnum;
          reporter_name: string;
          reporter_phone?: string | null;
          risk_zone_id?: string | null;
          district_id?: string | null;
          district_name?: string | null;
          location_point?: unknown;
          latitude: number;
          longitude: number;
          location_address?: string | null;
          report_type: ReportTypeEnum;
          severity?: string;
          observed_cracks?: boolean;
          slope_movement_detected?: boolean;
          road_blocked?: boolean;
          road_blockage_degree?: string;
          description: string;
          status?: ReportStatusEnum;
          sync_status?: string;
          verified_at?: string | null;
          verified_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reporter_id?: string | null;
          reporter_role?: UserRoleEnum;
          reporter_name?: string;
          reporter_phone?: string | null;
          risk_zone_id?: string | null;
          district_id?: string | null;
          district_name?: string | null;
          latitude?: number;
          longitude?: number;
          location_address?: string | null;
          report_type?: ReportTypeEnum;
          severity?: string;
          observed_cracks?: boolean;
          slope_movement_detected?: boolean;
          road_blocked?: boolean;
          road_blockage_degree?: string;
          description?: string;
          status?: ReportStatusEnum;
          sync_status?: string;
          verified_at?: string | null;
          verified_by?: string | null;
          updated_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          district_id: string;
          risk_zone_id: string | null;
          district_name: string;
          risk_zone_name: string | null;
          title: string;
          severity: AlertSeverityEnum;
          status: AlertStatusEnum;
          risk_score: number;
          risk_level: RiskLevelEnum;
          location_point: unknown;
          trigger_reason: string;
          affected_population_estimate: number;
          affected_roads: Json;
          recommended_actions: Json;
          response_priority: ResponsePriorityEnum;
          issued_at: string;
          acknowledged_at: string | null;
          acknowledged_by: string | null;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          district_id: string;
          risk_zone_id?: string | null;
          district_name: string;
          risk_zone_name?: string | null;
          title: string;
          severity: AlertSeverityEnum;
          status?: AlertStatusEnum;
          risk_score: number;
          risk_level: RiskLevelEnum;
          location_point?: unknown;
          trigger_reason: string;
          affected_population_estimate?: number;
          affected_roads?: Json;
          recommended_actions?: Json;
          response_priority?: ResponsePriorityEnum;
          issued_at?: string;
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          district_id?: string;
          risk_zone_id?: string | null;
          district_name?: string;
          risk_zone_name?: string | null;
          title?: string;
          severity?: AlertSeverityEnum;
          status?: AlertStatusEnum;
          risk_score?: number;
          risk_level?: RiskLevelEnum;
          trigger_reason?: string;
          affected_population_estimate?: number;
          affected_roads?: Json;
          recommended_actions?: Json;
          response_priority?: ResponsePriorityEnum;
          acknowledged_at?: string | null;
          acknowledged_by?: string | null;
          resolved_at?: string | null;
        };
      };
      response_tasks: {
        Row: {
          id: string;
          alert_id: string | null;
          risk_zone_id: string | null;
          risk_zone_name: string | null;
          district_name: string;
          title: string;
          priority: ResponsePriorityEnum;
          status: TaskStatusEnum;
          action_type: string;
          assigned_agency: string;
          target_location: unknown;
          location_description: string;
          description: string;
          allocated_personnel: number;
          equipment_required: Json;
          estimated_completion_time: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          alert_id?: string | null;
          risk_zone_id?: string | null;
          risk_zone_name?: string | null;
          district_name: string;
          title: string;
          priority?: ResponsePriorityEnum;
          status?: TaskStatusEnum;
          action_type: string;
          assigned_agency: string;
          target_location?: unknown;
          location_description: string;
          description: string;
          allocated_personnel?: number;
          equipment_required?: Json;
          estimated_completion_time?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          alert_id?: string | null;
          risk_zone_id?: string | null;
          risk_zone_name?: string | null;
          district_name?: string;
          title?: string;
          priority?: ResponsePriorityEnum;
          status?: TaskStatusEnum;
          action_type?: string;
          assigned_agency?: string;
          location_description?: string;
          description?: string;
          allocated_personnel?: number;
          equipment_required?: Json;
          estimated_completion_time?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
