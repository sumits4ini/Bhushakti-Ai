import { RiskZone, VulnerableRoad, VulnerableVillage, HistoricalLandslideEvent } from "@/types/geo";
import { WeatherObservation } from "@/types/weather";
import { RiskLevel } from "@/types/risk";
import { MOCK_RISK_ZONES, MOCK_ROADS, MOCK_VILLAGES } from "@/lib/demo/riskZones";
import { MOCK_WEATHER_OBSERVATIONS } from "@/lib/demo/weather";
import { MOCK_HISTORICAL_EVENTS } from "@/lib/demo/historicalEvents";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface SupabaseRiskZoneRow {
  id: string;
  district_id: string;
  name: string;
  zone_code: string;
  current_risk_score: number;
  current_risk_level: RiskLevel;
  slope_angle_deg: number;
  elevation_m: number;
  soil_type: string | null;
  vegetation_cover: string | null;
  historical_event_count: number;
  primary_threat_corridor: string | null;
  last_evaluated_at: string;
  districts?: {
    name: string;
    state: string;
  };
}

export const riskRepository = {
  async getAllRiskZones(): Promise<RiskZone[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("risk_zones")
          .select("*, districts(name, state)")
          .order("current_risk_score", { ascending: false });

        const zoneRows = data as unknown as SupabaseRiskZoneRow[] | null;

        if (!error && zoneRows && zoneRows.length > 0) {
          return zoneRows.map((z) => ({
            id: z.id,
            districtId: z.district_id,
            districtName: z.districts?.name || "NER District",
            state: z.districts?.state || "NER",
            name: z.name,
            zoneCode: z.zone_code,
            center: { latitude: 23.7385, longitude: 92.7092 },
            currentRiskScore: Number(z.current_risk_score),
            currentRiskLevel: z.current_risk_level,
            slopeAngleDeg: Number(z.slope_angle_deg),
            elevationM: Number(z.elevation_m),
            soilType: z.soil_type || "Weathered Shale",
            vegetationCover: z.vegetation_cover || "Scrub",
            historicalLandslideCount: z.historical_event_count,
            recentFieldReportCount: 2,
            primaryThreatCorridor: z.primary_threat_corridor || "State Corridor",
            lastEvaluatedAt: z.last_evaluated_at,
          }));
        }
      } catch (err) {
        console.warn("Supabase risk zones fetch failed, fallback to local:", err);
      }
    }

    return MOCK_RISK_ZONES;
  },

  async getRiskZoneById(id: string): Promise<RiskZone | null> {
    const zones = await this.getAllRiskZones();
    return zones.find((z) => z.id === id) || null;
  },

  async getRiskZonesByDistrict(districtId: string): Promise<RiskZone[]> {
    const zones = await this.getAllRiskZones();
    return zones.filter((z) => z.districtId === districtId);
  },

  async getVulnerableRoads(): Promise<VulnerableRoad[]> {
    return MOCK_ROADS;
  },

  async getVulnerableVillages(): Promise<VulnerableVillage[]> {
    return MOCK_VILLAGES;
  },

  async getHistoricalLandslides(): Promise<HistoricalLandslideEvent[]> {
    return MOCK_HISTORICAL_EVENTS;
  },

  async getWeatherForZone(zoneId: string): Promise<WeatherObservation | null> {
    return MOCK_WEATHER_OBSERVATIONS[zoneId] || MOCK_WEATHER_OBSERVATIONS["zone-aizawl-hunthar"] || null;
  },
};
