import { UserProfile, LoginCredentials } from "@/types/auth";
import { UserRole } from "@/types/fieldReport";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  ADMIN: {
    id: "usr-admin-001",
    email: "admin@bhushakti.gov.in",
    fullName: "Director S. Sharma (SDMA)",
    role: "ADMIN",
    phone: "+91 94361 00001",
    organization: "State Disaster Management Authority (SDMA)",
    districtJurisdiction: "North Eastern Region (All Districts)",
    badgeNumber: "SDMA-DIR-01",
    createdAt: "2026-01-01T00:00:00Z",
  },
  FIELD_OFFICER: {
    id: "usr-officer-002",
    email: "officer.aizawl@bhushakti.gov.in",
    fullName: "Inspector L. Sailo",
    role: "FIELD_OFFICER",
    phone: "+91 98623 55120",
    organization: "SDRF 3rd Battalion & Highway Patrol",
    districtJurisdiction: "Aizawl (NH-54 Corridor)",
    badgeNumber: "SDRF-INSP-34",
    createdAt: "2026-02-15T00:00:00Z",
  },
  CITIZEN: {
    id: "usr-citizen-003",
    email: "citizen@bhushakti.in",
    fullName: "C. Sangma (Resident)",
    role: "CITIZEN",
    phone: "+91 94361 99281",
    organization: "Local Community Observer",
    districtJurisdiction: "East Khasi Hills",
    createdAt: "2026-03-10T00:00:00Z",
  },
};

const AUTH_STORAGE_KEY = "bhushakti_auth_session";

interface SupabaseProfileRow {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string | null;
  organization?: string | null;
  district_jurisdiction?: string | null;
  badge_number?: string | null;
  created_at: string;
}

export const authService = {
  /**
   * Returns the current session from localStorage or Supabase
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    if (typeof window === "undefined") return null;

    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          const profile = data as unknown as SupabaseProfileRow | null;

          if (profile) {
            return {
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name,
              role: profile.role,
              phone: profile.phone ?? undefined,
              organization: profile.organization ?? undefined,
              districtJurisdiction: profile.district_jurisdiction ?? undefined,
              badgeNumber: profile.badge_number ?? undefined,
              createdAt: profile.created_at,
            };
          }
        }
      } catch (err) {
        console.warn("Supabase auth check failed, checking local session:", err);
      }
    }

    // Fallback to local session
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as UserProfile;
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }

    // Default to ADMIN for development convenience
    return DEMO_USERS.ADMIN;
  },

  /**
   * Log in using credentials or demo role
   */
  async login(credentials: LoginCredentials): Promise<UserProfile> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured() && credentials.password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        const profile = profileData as unknown as SupabaseProfileRow | null;

        if (profile) {
          const userProfile: UserProfile = {
            id: profile.id,
            email: profile.email,
            fullName: profile.full_name,
            role: profile.role,
            phone: profile.phone ?? undefined,
            organization: profile.organization ?? undefined,
            districtJurisdiction: profile.district_jurisdiction ?? undefined,
            badgeNumber: profile.badge_number ?? undefined,
            createdAt: profile.created_at,
          };
          if (typeof window !== "undefined") {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userProfile));
          }
          return userProfile;
        }
      }
    }

    // Demo Mode sign in
    let matchedUser: UserProfile = DEMO_USERS.ADMIN;
    if (credentials.role) {
      matchedUser = DEMO_USERS[credentials.role];
    } else {
      const found = Object.values(DEMO_USERS).find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());
      if (found) matchedUser = found;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
      localStorage.setItem("bhushakti_user_role", matchedUser.role);
    }

    return matchedUser;
  },

  /**
   * Quick role switch for prototype testing
   */
  async switchDemoRole(role: UserRole): Promise<UserProfile> {
    const user = DEMO_USERS[role];
    if (typeof window !== "undefined") {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem("bhushakti_user_role", role);
    }
    return user;
  },

  /**
   * Log out
   */
  async logout(): Promise<void> {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Supabase signout failed:", err);
      }
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USERS.CITIZEN));
      localStorage.setItem("bhushakti_user_role", "CITIZEN");
    }
  },

  /**
   * Permission verification helpers
   */
  hasPermission(role: UserRole, requiredRole: UserRole | UserRole[]): boolean {
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    if (role === "ADMIN") return true;
    if (role === "FIELD_OFFICER" && requiredRole === "FIELD_OFFICER") return true;
    return role === requiredRole;
  },
};
