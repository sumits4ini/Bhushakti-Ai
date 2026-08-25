import { District } from "@/types/geo";
import { MOCK_DISTRICTS } from "@/lib/demo/districts";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface SupabaseDistrictRow {
  id: string;
  name: string;
  state: string;
  state_code: string;
  vulnerability_index: number;
  population_estimate: number;
  area_km2: number;
}

export const districtRepository = {
  async getAll(): Promise<District[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("districts")
          .select("*")
          .order("vulnerability_index", { ascending: false });

        const districtRows = data as unknown as SupabaseDistrictRow[] | null;

        if (!error && districtRows && districtRows.length > 0) {
          return districtRows.map((d) => ({
            id: d.id,
            name: d.name,
            state: d.state,
            stateCode: d.state_code,
            center: { latitude: 25.5788, longitude: 91.8933 },
            vulnerabilityIndex: Number(d.vulnerability_index),
            totalRiskZones: 10,
            criticalZonesCount: 3,
            populationEstimate: d.population_estimate,
            areaKm2: Number(d.area_km2),
          }));
        }
      } catch (err) {
        console.warn("Supabase districts fetch failed, fallback to local:", err);
      }
    }

    return MOCK_DISTRICTS;
  },

  async getById(id: string): Promise<District | null> {
    const districts = await this.getAll();
    return districts.find((d) => d.id === id) || null;
  },

  async getByState(stateName: string): Promise<District[]> {
    const districts = await this.getAll();
    return districts.filter((d) => d.state.toLowerCase() === stateName.toLowerCase());
  },
};
