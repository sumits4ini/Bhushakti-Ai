"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  BrainCircuit,
  AlertTriangle,
  FileText,
  ShieldAlert,
  CloudRain,
  Camera,
  Settings,
  Home,
  Info,
  Radio,
} from "lucide-react";
import { APP_CONFIG } from "@/lib/config/site";
import { useUserRole } from "./RoleSwitcher";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ReactNode> = {
  Home: <Home className="w-4 h-4" />,
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  Map: <Map className="w-4 h-4" />,
  BrainCircuit: <BrainCircuit className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  CloudRain: <CloudRain className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useUserRole();

  const filteredRoutes = APP_CONFIG.routes.filter(
    (route) => !route.roles || route.roles.includes(role)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-30 w-64 border-r bg-card/95 backdrop-blur-sm transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="py-4 px-3 space-y-1 overflow-y-auto">
          {/* Section Header */}
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Disaster Intelligence
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {filteredRoutes.map((route) => {
              const isActive = pathname === route.href;
              const icon = ICONS[route.iconName] || <Info className="w-4 h-4" />;

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => {
                    if (onClose && window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all group",
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                    route.highlight && !isActive
                      ? "border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-semibold"
                      : ""
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "transition-transform group-hover:scale-110",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      {icon}
                    </span>
                    <span>{route.title}</span>
                  </div>

                  {route.badge && (
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase",
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : route.badgeVariant === "critical"
                          ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {route.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Status Box */}
        <div className="p-3 border-t bg-muted/40 text-[11px] space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>Sensors Online</span>
            </span>
            <span className="font-mono font-bold text-foreground">38/38</span>
          </div>
          <div className="text-[10px] text-muted-foreground leading-tight">
            Decision Support Prototype v1.0 • MDoNER SIH26001
          </div>
        </div>
      </aside>
    </>
  );
}
