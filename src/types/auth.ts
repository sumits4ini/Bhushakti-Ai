import { UserRole } from "./fieldReport";

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  organization?: string;
  districtJurisdiction?: string;
  badgeNumber?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthSession {
  user: UserProfile | null;
  token?: string;
  expiresAt?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}
