"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, AlertTriangle, ShieldAlert, Truck, Camera, CheckSquare } from "lucide-react";

interface TopMetricsBarProps {
  criticalCount: number;
  highCount: number;
  alertsCount: number;
  roadsAtRiskCount: number;
  reportsCount: number;
  tasksCount: number;
}

export function TopMetricsBar({
  criticalCount,
  highCount,
  alertsCount,
  roadsAtRiskCount,
  reportsCount,
  tasksCount,
}: TopMetricsBarProps) {
  const metrics = [
    {
      label: "Active Critical Zones",
      value: criticalCount,
      subtext: "Score ≥ 76 (Red)",
      icon: <Flame className="w-4 h-4 text-rose-500" />,
      color: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    },
    {
      label: "High Risk Hotspots",
      value: highCount,
      subtext: "Score 51–75 (Orange)",
      icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
      color: "border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300",
    },
    {
      label: "Broadcast Red Alerts",
      value: alertsCount,
      subtext: "Early Warnings",
      icon: <ShieldAlert className="w-4 h-4 text-red-500" />,
      color: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300",
    },
    {
      label: "Roads At Risk",
      value: roadsAtRiskCount,
      subtext: "NH-54 & NH-10",
      icon: <Truck className="w-4 h-4 text-blue-500" />,
      color: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    },
    {
      label: "Field Reports (24h)",
      value: reportsCount,
      subtext: "Ground Observations",
      icon: <Camera className="w-4 h-4 text-purple-500" />,
      color: "border-purple-500/40 bg-purple-500/10 text-purple-700 dark:text-purple-300",
    },
    {
      label: "Response Tasks",
      value: tasksCount,
      subtext: "P1-P4 Dispatched",
      icon: <CheckSquare className="w-4 h-4 text-emerald-500" />,
      color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {metrics.map((m, idx) => (
        <Card key={idx} className="border shadow-xs hover:border-primary/40 transition-colors">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase truncate max-w-[100px]">
                {m.label}
              </span>
              <div className={`p-1 rounded ${m.color}`}>{m.icon}</div>
            </div>
            <div className="text-xl font-black text-foreground font-mono mt-1">
              {m.value}
            </div>
            <div className="text-[10px] text-muted-foreground truncate mt-0.5">
              {m.subtext}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
