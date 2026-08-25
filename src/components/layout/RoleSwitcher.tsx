"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@/types/fieldReport";
import { Shield, UserCheck, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType>({
  role: "ADMIN",
  setRole: () => {},
});

export const useUserRole = () => useContext(RoleContext);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("ADMIN");

  useEffect(() => {
    const saved = localStorage.getItem("bhushakti_user_role") as UserRole;
    if (saved && ["ADMIN", "FIELD_OFFICER", "CITIZEN"].includes(saved)) {
      setRoleState(saved);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem("bhushakti_user_role", newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function RoleSwitcher() {
  const { role, setRole } = useUserRole();

  const roles: { value: UserRole; label: string; icon: React.ReactNode; color: string }[] = [
    {
      value: "ADMIN",
      label: "Authority (SDMA)",
      icon: <Shield className="w-3.5 h-3.5 text-blue-500" />,
      color: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    },
    {
      value: "FIELD_OFFICER",
      label: "Field Officer",
      icon: <UserCheck className="w-3.5 h-3.5 text-emerald-500" />,
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
    {
      value: "CITIZEN",
      label: "Citizen Mode",
      icon: <Users className="w-3.5 h-3.5 text-purple-500" />,
      color: "border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300",
    },
  ];

  return (
    <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/80 text-xs">
      {roles.map((r) => {
        const isActive = role === r.value;
        return (
          <button
            key={r.value}
            onClick={() => setRole(r.value)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium",
              isActive
                ? cn("bg-background shadow-xs border", r.color)
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
            title={`Active role: ${r.label}`}
          >
            {r.icon}
            <span className="hidden sm:inline">{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}
