"use client";

import React, { useState } from "react";
import { RiskZone } from "@/types/geo";
import { RiskBadge } from "@/components/common/RiskBadge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  MapPin,
  Flame,
  CheckCircle2,
  Droplets,
  Camera,
  Layers,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { alertRepository } from "@/services/alertRepository";
import { responseRepository } from "@/services/responseRepository";

interface ZoneDetailPanelProps {
  zone: RiskZone;
  onClose?: () => void;
}

export function ZoneDetailPanel({ zone, onClose }: ZoneDetailPanelProps) {
  const { role, user } = useAuth();
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const isCritical = zone.currentRiskLevel === "CRITICAL";
  const isHigh = zone.currentRiskLevel === "HIGH";

  // Detailed Explainability Factors for this zone
  const factors = [
    {
      name: "24h Cumulative Rainfall",
      value: isCritical ? "118.5 mm" : isHigh ? "76.0 mm" : "32.0 mm",
      contribution: isCritical ? 29.4 : isHigh ? 21.0 : 8.5,
      severity: isCritical ? "critical" : isHigh ? "high" : "low",
      category: "Hydrological Deluge",
    },
    {
      name: "Soil Moisture Saturation",
      value: isCritical ? "84.5%" : isHigh ? "72.0%" : "48.0%",
      contribution: isCritical ? 24.1 : isHigh ? 18.5 : 9.0,
      severity: isCritical ? "critical" : isHigh ? "high" : "moderate",
      category: "Geotechnical Saturation",
    },
    {
      name: "Slope Gradient Steepness",
      value: `${zone.slopeAngleDeg}°`,
      contribution: zone.slopeAngleDeg > 35 ? 18.0 : 12.0,
      severity: zone.slopeAngleDeg > 35 ? "high" : "moderate",
      category: "Topographical Susceptibility",
    },
    {
      name: "Historical Slide Density",
      value: `${zone.historicalLandslideCount} in 5km buffer`,
      contribution: zone.historicalLandslideCount > 5 ? 9.5 : 4.0,
      severity: zone.historicalLandslideCount > 5 ? "moderate" : "low",
      category: "GSI Geological History",
    },
    {
      name: "Field Vision Crack Signal",
      value: zone.recentFieldReportCount > 0 ? "12cm Active Fissure" : "Stable Baseline",
      contribution: zone.recentFieldReportCount > 0 ? 6.0 : 0.0,
      severity: zone.recentFieldReportCount > 0 ? "high" : "low",
      category: "Ground Truth",
    },
  ];

  const handleQuickDispatch = async () => {
    await responseRepository.create({
      riskZoneId: zone.id,
      riskZoneName: zone.name,
      districtName: zone.districtName,
      title: `P1 Emergency Dispatch: Secure ${zone.name}`,
      priority: "P1",
      status: "DEPLOYED",
      actionType: "TRAFFIC_DIVERSION",
      assignedAgency: "SDRF Quick Response 1st Bn",
      targetLocation: zone.center,
      locationDescription: zone.primaryThreatCorridor,
      description: `Immediate field stabilization dispatched following hazard index score ${Math.round(zone.currentRiskScore)} alert.`,
      allocatedPersonnel: 16,
      equipmentRequired: ["Geotech Crackmeters", "Earthmovers", "LED Highway Signs"],
    });

    setActionSuccess("SDRF Response Task Successfully Dispatched!");
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <Card className="h-full border bg-card/95 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden text-xs">
      {/* Header */}
      <CardHeader className="p-4 border-b bg-muted/40 space-y-1.5 shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                {zone.zoneCode}
              </span>
              <span className="text-muted-foreground font-mono text-[10px]">
                {zone.districtName}, {zone.state}
              </span>
            </div>
            <CardTitle className="text-base font-extrabold text-foreground mt-1 leading-tight">
              {zone.name}
            </CardTitle>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
              aria-label="Close Zone Panel"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Hazard Score Hero Row */}
        <div className="flex items-center justify-between p-3 rounded-lg border bg-card shadow-inner mt-2">
          <div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase block">
              Landslide Hazard Index
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-black text-foreground font-mono">
                {Math.round(zone.currentRiskScore)}
              </span>
              <span className="text-muted-foreground font-mono">/ 100</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <RiskBadge levelOrScore={zone.currentRiskScore} showScore={false} size="lg" />
            <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trend: RISING (+6h)
            </span>
          </div>
        </div>
      </CardHeader>

      {/* Scrollable Content Body */}
      <CardContent className="p-4 space-y-5 overflow-y-auto flex-1">
        {/* Success Alert Pill */}
        {actionSuccess && (
          <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* 1. WHY IS THE RISK INCREASING? (Explainability Breakdown) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-amber-500" />
              WHY is Risk Increasing? (AI Fusion)
            </h4>
            <span className="text-[10px] font-mono text-muted-foreground">SHAP Attribution</span>
          </div>

          <div className="space-y-2">
            {factors.map((f, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-medium text-foreground">
                    {f.name}
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {f.value} • <strong className="text-foreground">+{f.contribution} pts</strong>
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      f.severity === "critical"
                        ? "bg-rose-500"
                        : f.severity === "high"
                        ? "bg-orange-500"
                        : "bg-amber-500"
                    }`}
                    style={{ width: `${(f.contribution / 32) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. TELEMETRY & TERRAIN PARAMETERS */}
        <div className="space-y-2 pt-2 border-t font-mono">
          <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
            Telemetry Sensor Feeds
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-muted/40 border">
              <span className="text-muted-foreground block text-[10px]">Slope Angle</span>
              <strong className="text-foreground">{zone.slopeAngleDeg}° Gradient</strong>
            </div>
            <div className="p-2 rounded bg-muted/40 border">
              <span className="text-muted-foreground block text-[10px]">Elevation</span>
              <strong className="text-foreground">{zone.elevationM} m MSL</strong>
            </div>
            <div className="p-2 rounded bg-muted/40 border">
              <span className="text-muted-foreground block text-[10px]">Threat Corridor</span>
              <strong className="text-foreground truncate block">{zone.primaryThreatCorridor}</strong>
            </div>
            <div className="p-2 rounded bg-muted/40 border">
              <span className="text-muted-foreground block text-[10px]">AI Confidence</span>
              <strong className="text-foreground">91.4% Calibrated</strong>
            </div>
          </div>
        </div>

        {/* 3. WHAT SHOULD AUTHORITIES DO NEXT? */}
        <div className="space-y-2 pt-2 border-t">
          <h4 className="font-bold text-foreground flex items-center gap-1.5 text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-500" />
            Recommended Directives
          </h4>
          <div className="space-y-1.5 text-[11px] text-muted-foreground">
            <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 flex items-start gap-1.5 text-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <span>Restrict heavy commercial transport on <strong>{zone.primaryThreatCorridor}</strong>.</span>
            </div>
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 flex items-start gap-1.5 text-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>Pre-position SDRF crack monitoring team with earthmoving loaders.</span>
            </div>
            <div className="p-2 rounded bg-muted/50 border flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>Broadcast safety warning to downhill village elders & settlement heads.</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Footer Action Buttons */}
      <div className="p-3 border-t bg-muted/40 shrink-0 flex items-center justify-between gap-2">
        <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1">
          <Link href="/reports">
            <Camera className="w-3 h-3" />
            Photos
          </Link>
        </Button>
        <Button
          size="sm"
          variant="critical"
          className="h-8 text-xs gap-1.5 font-bold shadow-md"
          onClick={handleQuickDispatch}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Dispatch P1 SDRF Team
        </Button>
      </div>
    </Card>
  );
}
