import { FieldReport, ReportStatus, ReportType, UserRole } from "@/types/fieldReport";
import { MOCK_FIELD_REPORTS } from "@/lib/demo/fieldReports";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

const LOCAL_REPORTS_KEY = "bhushakti_local_field_reports";

interface SupabaseFieldReportRow {
  id: string;
  reporter_id?: string | null;
  reporter_role: UserRole;
  reporter_name: string;
  reporter_phone?: string | null;
  risk_zone_id?: string | null;
  district_id?: string | null;
  district_name?: string | null;
  latitude: number;
  longitude: number;
  location_address?: string | null;
  report_type: ReportType;
  severity: string;
  observed_cracks: boolean;
  slope_movement_detected: boolean;
  road_blocked: boolean;
  road_blockage_degree: string;
  description: string;
  status: ReportStatus;
  sync_status: string;
  verified_at?: string | null;
  verified_by?: string | null;
  created_at: string;
  updated_at: string;
}

export const reportRepository = {
  async getAll(): Promise<FieldReport[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("field_reports")
          .select("*")
          .order("created_at", { ascending: false });

        const reportRows = data as unknown as SupabaseFieldReportRow[] | null;

        if (!error && reportRows && reportRows.length > 0) {
          return reportRows.map((r) => ({
            id: r.id,
            reporterRole: r.reporter_role,
            reporterName: r.reporter_name,
            reporterPhone: r.reporter_phone || undefined,
            riskZoneId: r.risk_zone_id || undefined,
            districtId: r.district_id || undefined,
            districtName: r.district_name || "NER District",
            location: { latitude: Number(r.latitude), longitude: Number(r.longitude) },
            locationAddress: r.location_address || undefined,
            reportType: r.report_type,
            severity: r.severity as FieldReport["severity"],
            observedCracks: r.observed_cracks,
            slopeMovementDetected: r.slope_movement_detected,
            roadBlocked: r.road_blocked,
            roadBlockageDegree: r.road_blockage_degree as FieldReport["roadBlockageDegree"],
            description: r.description,
            media: [],
            status: r.status,
            syncStatus: r.sync_status as FieldReport["syncStatus"],
            createdAt: r.created_at,
            verifiedAt: r.verified_at || undefined,
            verifiedBy: r.verified_by || undefined,
          }));
        }
      } catch (err) {
        console.warn("Supabase field reports fetch failed, using local/demo:", err);
      }
    }

    // Combine mock reports with any locally added reports
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_REPORTS_KEY);
      if (stored) {
        try {
          const localReports = JSON.parse(stored) as FieldReport[];
          return [...localReports, ...MOCK_FIELD_REPORTS];
        } catch {
          // ignore parsing error
        }
      }
    }

    return MOCK_FIELD_REPORTS;
  },

  async getById(id: string): Promise<FieldReport | null> {
    const reports = await this.getAll();
    return reports.find((r) => r.id === id) || null;
  },

  async create(reportData: Omit<FieldReport, "id" | "createdAt" | "syncStatus">): Promise<FieldReport> {
    const newReport: FieldReport = {
      ...reportData,
      id: `rep-${Date.now()}`,
      createdAt: new Date().toISOString(),
      syncStatus: "SYNCED",
    };

    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const payload = {
          reporter_role: newReport.reporterRole,
          reporter_name: newReport.reporterName,
          reporter_phone: newReport.reporterPhone,
          latitude: newReport.location.latitude,
          longitude: newReport.location.longitude,
          location_address: newReport.locationAddress,
          report_type: newReport.reportType,
          severity: newReport.severity,
          observed_cracks: newReport.observedCracks,
          slope_movement_detected: newReport.slopeMovementDetected,
          road_blocked: newReport.roadBlocked,
          road_blockage_degree: newReport.roadBlockageDegree || "CLEAR",
          description: newReport.description,
          status: newReport.status,
          district_name: newReport.districtName,
        };

        const { data, error } = await (supabase.from("field_reports") as any)
          .insert(payload)
          .select()
          .single();

        if (!error && data) {
          newReport.id = (data as { id: string }).id;
        }
      } catch (err) {
        console.warn("Supabase insert report failed, saving locally:", err);
      }
    }

    // Save to local storage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_REPORTS_KEY);
      const list: FieldReport[] = stored ? JSON.parse(stored) : [];
      list.unshift(newReport);
      localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(list));
    }

    return newReport;
  },

  async updateStatus(id: string, status: ReportStatus, verifiedBy?: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await (supabase.from("field_reports") as any)
          .update({
            status,
            verified_at: new Date().toISOString(),
            verified_by: verifiedBy,
          })
          .eq("id", id);
      } catch (err) {
        console.warn("Supabase update report status failed:", err);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_REPORTS_KEY);
      if (stored) {
        const list: FieldReport[] = JSON.parse(stored);
        const item = list.find((r) => r.id === id);
        if (item) {
          item.status = status;
          item.verifiedAt = new Date().toISOString();
          item.verifiedBy = verifiedBy;
          localStorage.setItem(LOCAL_REPORTS_KEY, JSON.stringify(list));
        }
      }
    }

    return true;
  },
};
