"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { UserProfile, LoginCredentials } from "@/types/auth";
import { UserRole } from "@/types/fieldReport";
import { authService, DEMO_USERS } from "@/services/authService";

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: DEMO_USERS.ADMIN,
  role: "ADMIN",
  isAuthenticated: true,
  isLoading: false,
  login: async () => {},
  logout: async () => {},
  switchRole: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEMO_USERS.ADMIN);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = useCallback(async () => {
    try {
      const current = await authService.getCurrentUser();
      setUser(current || DEMO_USERS.ADMIN);
    } catch {
      setUser(DEMO_USERS.ADMIN);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const loggedIn = await authService.login(credentials);
      setUser(loggedIn);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(DEMO_USERS.CITIZEN);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRole = async (newRole: UserRole) => {
    const updated = await authService.switchDemoRole(newRole);
    setUser(updated);
  };

  const role = user?.role || "CITIZEN";
  const isAuthenticated = Boolean(user && user.role !== "CITIZEN");

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
