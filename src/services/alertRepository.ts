import { Alert, AlertSeverity, AlertStatus } from "@/types/alert";
import { RiskLevel } from "@/types/risk";
import { MOCK_ALERTS } from "@/lib/demo/alerts";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

const LOCAL_ALERTS_KEY = "bhushakti_local_alerts";

interface SupabaseAlertRow {
  id: string;
  district_id: string;
  risk_zone_id?: string | null;
  district_name: string;
  risk_zone_name?: string | null;
  title: string;
  severity: AlertSeverity;
  status: AlertStatus;
  risk_score: number;
  risk_level: RiskLevel;
  trigger_reason: string;
  affected_population_estimate: number;
  affected_roads?: unknown;
  recommended_actions?: unknown;
  response_priority: Alert["responsePriority"];
  issued_at: string;
  acknowledged_at?: string | null;
  acknowledged_by?: string | null;
  resolved_at?: string | null;
}

export const alertRepository = {
  async getActive(): Promise<Alert[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("alerts")
          .select("*")
          .eq("status", "ACTIVE")
          .order("issued_at", { ascending: false });

        const alertRows = data as unknown as SupabaseAlertRow[] | null;

        if (!error && alertRows && alertRows.length > 0) {
          return alertRows.map((a) => ({
            id: a.id,
            title: a.title,
            severity: a.severity,
            status: a.status,
            riskScore: Number(a.risk_score),
            riskLevel: a.risk_level,
            districtId: a.district_id,
            districtName: a.district_name,
            riskZoneId: a.risk_zone_id || undefined,
            riskZoneName: a.risk_zone_name || undefined,
            locationPoint: { latitude: 23.7385, longitude: 92.7092 },
            triggerReason: a.trigger_reason,
            affectedPopulationEstimate: a.affected_population_estimate,
            affectedRoads: Array.isArray(a.affected_roads) ? (a.affected_roads as string[]) : [],
            recommendedActions: Array.isArray(a.recommended_actions) ? (a.recommended_actions as string[]) : [],
            responsePriority: a.response_priority,
            issuedAt: a.issued_at,
            acknowledgedAt: a.acknowledged_at || undefined,
            acknowledgedBy: a.acknowledged_by || undefined,
            resolvedAt: a.resolved_at || undefined,
          }));
        }
      } catch (err) {
        console.warn("Supabase alerts fetch failed, using local/demo:", err);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_ALERTS_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as Alert[];
        } catch {
          // ignore
        }
      }
    }

    return MOCK_ALERTS;
  },

  async acknowledge(id: string, acknowledgedBy: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const ackTime = new Date().toISOString();

    if (supabase && isSupabaseConfigured()) {
      try {
        await (supabase.from("alerts") as any)
          .update({
            acknowledged_at: ackTime,
            acknowledged_by: acknowledgedBy,
          })
          .eq("id", id);
      } catch (err) {
        console.warn("Supabase acknowledge alert failed:", err);
      }
    }

    if (typeof window !== "undefined") {
      const alerts = await this.getActive();
      const item = alerts.find((a) => a.id === id);
      if (item) {
        item.acknowledgedAt = ackTime;
        item.acknowledgedBy = acknowledgedBy;
        localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(alerts));
      }
    }

    return true;
  },

  async resolve(id: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    const resolveTime = new Date().toISOString();

    if (supabase && isSupabaseConfigured()) {
      try {
        await (supabase.from("alerts") as any)
          .update({
            status: "RESOLVED",
            resolved_at: resolveTime,
          })
          .eq("id", id);
      } catch (err) {
        console.warn("Supabase resolve alert failed:", err);
      }
    }

    if (typeof window !== "undefined") {
      const alerts = await this.getActive();
      const filtered = alerts.filter((a) => a.id !== id);
      localStorage.setItem(LOCAL_ALERTS_KEY, JSON.stringify(filtered));
    }

    return true;
  },
};
