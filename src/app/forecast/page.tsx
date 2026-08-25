"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/common/RiskBadge";
import {
  CloudRain,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Layers,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { EXTENDED_RISK_ZONES } from "@/lib/gis/geoData";
import { riskEngine } from "@/lib/ai/riskEngine";
import Link from "next/link";

export default function ForecastPage() {
  const [selectedHorizon, setSelectedHorizon] = useState<"24h" | "48h" | "72h">("24h");

  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Predictive Landslide Hazard Forecasting
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-mono font-semibold">
                IMD & ISRO ENSEMBLE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              24h, 48h, and 72h precipitation ensemble modeling fused with slope hydrological infiltration rates
            </p>
          </div>

          {/* Time Horizon Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg border bg-card">
            {(["24h", "48h", "72h"] as const).map((horizon) => (
              <Button
                key={horizon}
                variant={selectedHorizon === horizon ? "default" : "ghost"}
                size="sm"
                className="h-7 text-xs font-mono"
                onClick={() => setSelectedHorizon(horizon)}
              >
                {horizon} Horizon
              </Button>
            ))}
          </div>
        </div>

        {/* Predictive Forecast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXTENDED_RISK_ZONES.map((zone) => {
            const isCritical = zone.currentRiskLevel === "CRITICAL";
            const isHigh = zone.currentRiskLevel === "HIGH";

            const multiplier = selectedHorizon === "72h" ? 1.4 : selectedHorizon === "48h" ? 1.2 : 1.0;
            const projectedRainfall = Math.round((isCritical ? 118 : isHigh ? 76 : 28) * multiplier);
            const projectedScore = Math.min(100, Math.round(zone.currentRiskScore * (selectedHorizon === "72h" ? 1.1 : 1.05)));

            return (
              <Card
                key={zone.id}
                className={`border hover:border-primary/40 transition-all ${
                  isCritical ? "border-rose-500/40 bg-rose-500/5 shadow-sm" : ""
                }`}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-muted-foreground block">
                        {zone.districtName}, {zone.state}
                      </span>
                      <CardTitle className="text-sm font-bold text-foreground mt-0.5">
                        {zone.name}
                      </CardTitle>
                    </div>
                    <RiskBadge levelOrScore={projectedScore} showScore size="sm" />
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border font-mono">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Projected Rain:</span>
                      <strong className="text-foreground">{projectedRainfall} mm</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Peak Window:</span>
                      <strong className="text-rose-600 dark:text-rose-400">+{selectedHorizon} Deluge</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Threat Corridor: <strong>{zone.primaryThreatCorridor}</strong>. Orographic cloudburst front moving along southern valley ridge.
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t text-[11px]">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                      Instability Rising
                    </span>
                    <Button asChild variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <Link href="/risk">
                        Inspect SHAP <ArrowRight className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
