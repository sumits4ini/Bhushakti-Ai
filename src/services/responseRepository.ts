import { ResponseTask, TaskStatus, ResponsePriority } from "@/types/responseTask";
import { MOCK_RESPONSE_TASKS } from "@/lib/demo/responseTasks";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

const LOCAL_TASKS_KEY = "bhushakti_local_response_tasks";

interface SupabaseResponseTaskRow {
  id: string;
  alert_id?: string | null;
  risk_zone_id?: string | null;
  risk_zone_name?: string | null;
  district_name: string;
  title: string;
  priority: ResponsePriority;
  status: TaskStatus;
  action_type: ResponseTask["actionType"];
  assigned_agency: string;
  location_description: string;
  description: string;
  allocated_personnel: number;
  equipment_required?: unknown;
  estimated_completion_time?: string | null;
  created_at: string;
  updated_at: string;
}

export const responseRepository = {
  async getAll(): Promise<ResponseTask[]> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from("response_tasks")
          .select("*")
          .order("created_at", { ascending: false });

        const taskRows = data as unknown as SupabaseResponseTaskRow[] | null;

        if (!error && taskRows && taskRows.length > 0) {
          return taskRows.map((t) => ({
            id: t.id,
            alertId: t.alert_id || undefined,
            riskZoneId: t.risk_zone_id || undefined,
            riskZoneName: t.risk_zone_name || undefined,
            districtName: t.district_name,
            title: t.title,
            priority: t.priority,
            status: t.status,
            actionType: t.action_type,
            assignedAgency: t.assigned_agency,
            targetLocation: { latitude: 23.7385, longitude: 92.7092 },
            locationDescription: t.location_description,
            description: t.description,
            allocatedPersonnel: t.allocated_personnel,
            equipmentRequired: Array.isArray(t.equipment_required) ? (t.equipment_required as string[]) : [],
            estimatedCompletionTime: t.estimated_completion_time || undefined,
            createdAt: t.created_at,
            updatedAt: t.updated_at,
          }));
        }
      } catch (err) {
        console.warn("Supabase response tasks fetch failed, using local/demo:", err);
      }
    }

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_TASKS_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as ResponseTask[];
        } catch {
          // ignore
        }
      }
    }

    return MOCK_RESPONSE_TASKS;
  },

  async updateStatus(id: string, status: TaskStatus): Promise<boolean> {
    const supabase = getSupabaseClient();
    const updateTime = new Date().toISOString();

    if (supabase && isSupabaseConfigured()) {
      try {
        await (supabase.from("response_tasks") as any)
          .update({
            status,
            updated_at: updateTime,
          })
          .eq("id", id);
      } catch (err) {
        console.warn("Supabase update task status failed:", err);
      }
    }

    if (typeof window !== "undefined") {
      const tasks = await this.getAll();
      const item = tasks.find((t) => t.id === id);
      if (item) {
        item.status = status;
        item.updatedAt = updateTime;
        localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
      }
    }

    return true;
  },

  async create(taskData: Omit<ResponseTask, "id" | "createdAt" | "updatedAt">): Promise<ResponseTask> {
    const newTask: ResponseTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      const tasks = await this.getAll();
      tasks.unshift(newTask);
      localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
    }

    return newTask;
  },
};
