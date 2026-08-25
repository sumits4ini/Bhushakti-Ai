"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Database, Radio, Cpu, Bell, Shield, Cloud, CheckCircle2, RefreshCw } from "lucide-react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [supabaseConnected, setSupabaseConnected] = useState(isSupabaseConfigured());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <PageShell>
      <AuthGuard
        allowedRoles={["ADMIN"]}
        fallbackTitle="System Settings Restricted"
        fallbackDescription="Access to telemetry feeds, database configurations, and government API connections is restricted to SDMA Administrative Directors."
      >
        <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  System Configuration & Telemetry Feeds
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-mono font-semibold">
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Manage database connections, AI vision adapters, IMD/ISRO telemetry endpoints, and alert broadcast gateways
              </p>
            </div>

            <Button size="sm" variant="default" className="text-xs gap-1.5" onClick={handleSave}>
              {saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
              {saved ? "Saved Successfully" : "Save Configuration"}
            </Button>
          </div>

          {/* Configuration Sections */}
          <div className="space-y-6">
            {/* Database & PostGIS Status */}
            <Card className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-500" />
                    PostGIS Database & Spatial Engine
                  </CardTitle>
                  <span
                    className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                      supabaseConnected
                        ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                        : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                    }`}
                  >
                    {supabaseConnected ? "SUPABASE POSTGIS CONNECTED" : "DEMO / STANDALONE MODE"}
                  </span>
                </div>
                <CardDescription className="text-xs">
                  PostgreSQL spatial extension and vector geometry layer status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="p-3 rounded-lg border bg-card flex items-center justify-between font-mono">
                  <span>Spatial Projection:</span>
                  <strong className="text-foreground">EPSG:4326 (WGS 84 / Geographic)</strong>
                </div>
                <div className="p-3 rounded-lg border bg-card flex items-center justify-between font-mono">
                  <span>Database Engine:</span>
                  <strong className="text-foreground">PostgreSQL 16 + PostGIS 3.4</strong>
                </div>
                <div className="p-3 rounded-lg border bg-card flex items-center justify-between font-mono">
                  <span>Connection Mode:</span>
                  <strong className="text-foreground">
                    {supabaseConnected ? "Cloud Supabase Client" : "Resilient Local Data Access Layer"}
                  </strong>
                </div>
              </CardContent>
            </Card>

            {/* Telemetry Ingestion Source */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-500" />
                  Environmental Telemetry Feeds
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time rainfall, soil moisture, and pore water telemetry sources
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <div className="font-semibold text-foreground">IMD Automated Weather Station Network</div>
                    <div className="text-muted-foreground text-[11px]">AWS feeds from 38 telemetry stations across 8 NER states</div>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">CONNECTED</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <div className="font-semibold text-foreground">ISRO MOSDAC Soil Moisture Satellite Inversion</div>
                    <div className="text-muted-foreground text-[11px]">Daily 1km resolution microwave soil moisture index</div>
                  </div>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Vision Model Adapter Settings */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-500" />
                  AI Computer Vision Adapter
                </CardTitle>
                <CardDescription className="text-xs">
                  Configuration for ground crack & slope failure image analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border bg-card space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Active Vision Adapter:</span>
                    <strong className="text-foreground font-mono">Prototype / Heuristic CV Engine</strong>
                  </div>
                  <div className="p-3 rounded-lg border bg-card space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Optional Cloud Vision:</span>
                    <strong className="text-muted-foreground font-mono">OpenAI / Gemini Vision Adapter</strong>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AuthGuard>
    </PageShell>
  );
}
