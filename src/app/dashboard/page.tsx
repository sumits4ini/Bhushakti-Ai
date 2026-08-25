"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/common/RiskBadge";
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Flame,
  Camera,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Compass,
  Radio,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { TopMetricsBar } from "@/components/gis/TopMetricsBar";
import { DistrictSelector } from "@/components/gis/DistrictSelector";
import { MapLayerControls } from "@/components/gis/MapLayerControls";
import { ZoneDetailPanel } from "@/components/gis/ZoneDetailPanel";
import { GISMapDynamic } from "@/components/gis/GISMapDynamic";
import { MapLayersState } from "@/components/gis/GISMapViewer";
import { EXTENDED_RISK_ZONES, EXTENDED_INFRASTRUCTURE, NER_DISTRICT_BOUNDS } from "@/lib/gis/geoData";
import { MOCK_ROADS, MOCK_VILLAGES, MOCK_HISTORICAL_EVENTS } from "@/lib/demo";
import { reportRepository } from "@/services/reportRepository";
import { alertRepository } from "@/services/alertRepository";
import { responseRepository } from "@/services/responseRepository";
import { FieldReport } from "@/types/fieldReport";
import { Alert } from "@/types/alert";
import { ResponseTask } from "@/types/responseTask";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [selectedDistrictKey, setSelectedDistrictKey] = useState("all");
  const [selectedZoneId, setSelectedZoneId] = useState<string>("zone-aizawl-hunthar");
  const [flyToCoords, setFlyToCoords] = useState<{ lat: number; lng: number; zoom: number } | null>(null);

  const [layers, setLayers] = useState<MapLayersState>({
    riskHeatmap: true,
    roads: true,
    villages: true,
    infrastructure: true,
    historicalLandslides: true,
    fieldReports: true,
    alerts: true,
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [tasks, setTasks] = useState<ResponseTask[]>([]);

  useEffect(() => {
    async function loadData() {
      const [alts, reps, tsks] = await Promise.all([
        alertRepository.getActive(),
        reportRepository.getAll(),
        responseRepository.getAll(),
      ]);
      setAlerts(alts);
      setReports(reps);
      setTasks(tsks);
    }
    loadData();
  }, []);

  const handleToggleLayer = (key: keyof MapLayersState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectDistrict = (key: string) => {
    setSelectedDistrictKey(key);
    const bounds = NER_DISTRICT_BOUNDS[key];
    if (bounds) {
      setFlyToCoords({ lat: bounds.lat, lng: bounds.lng, zoom: bounds.zoom });
    }
  };

  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    const zone = EXTENDED_RISK_ZONES.find((z) => z.id === zoneId);
    if (zone) {
      setFlyToCoords({
        lat: zone.center.latitude,
        lng: zone.center.longitude,
        zoom: 12,
      });
    }
  };

  const selectedZone = EXTENDED_RISK_ZONES.find((z) => z.id === selectedZoneId) || EXTENDED_RISK_ZONES[0];

  const criticalZones = EXTENDED_RISK_ZONES.filter((z) => z.currentRiskLevel === "CRITICAL");
  const highZones = EXTENDED_RISK_ZONES.filter((z) => z.currentRiskLevel === "HIGH");

  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-5 max-w-7xl mx-auto w-full">
        {/* Top Control Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Disaster Command Center
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                GIS SURVEILLANCE ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              North Eastern Region (NER) • AI Multi-Factor Landslide Risk Intelligence Platform (SIH26001 / MDoNER)
            </p>
          </div>

          {/* Quick Actions & District Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <DistrictSelector
              selectedKey={selectedDistrictKey}
              onSelectDistrict={handleSelectDistrict}
            />
            <Button asChild size="sm" variant="default" className="gap-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md">
              <Link href="/simulation">
                <Flame className="w-3.5 h-3.5 fill-current" />
                Live Simulation
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs font-bold">
              <Link href="/field-report">
                <Camera className="w-3.5 h-3.5" />
                Submit Observation
              </Link>
            </Button>
          </div>
        </div>

        {/* 6 Key Operational Metrics Bar */}
        <TopMetricsBar
          criticalCount={criticalZones.length}
          highCount={highZones.length}
          alertsCount={alerts.length}
          roadsAtRiskCount={MOCK_ROADS.length}
          reportsCount={reports.length}
          tasksCount={tasks.length}
        />

        {/* MAIN GIS WORKSPACE: Map (Left/Center) + Intelligence Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[580px]">
          {/* Main GIS Map Viewport (8 Columns on Desktop) */}
          <div className="lg:col-span-8 rounded-xl border bg-card relative shadow-inner flex flex-col overflow-hidden min-h-[500px]">
            {/* Floating Map Layer Toggles */}
            <MapLayerControls layers={layers} onToggleLayer={handleToggleLayer} />

            {/* Tactical Viewport Header Pill */}
            <div className="absolute top-3 left-3 z-[1000] flex items-center gap-2 bg-card/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/80 text-xs shadow-md font-mono">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span className="font-bold text-foreground">
                {NER_DISTRICT_BOUNDS[selectedDistrictKey]?.name || "All NER"}
              </span>
              <span className="text-muted-foreground">• PostGIS WGS84</span>
            </div>

            {/* Interactive Leaflet Map Component */}
            <GISMapDynamic
              riskZones={EXTENDED_RISK_ZONES}
              roads={MOCK_ROADS}
              villages={MOCK_VILLAGES}
              infrastructure={EXTENDED_INFRASTRUCTURE}
              historicalLandslides={MOCK_HISTORICAL_EVENTS}
              fieldReports={reports}
              alerts={alerts}
              layers={layers}
              selectedZoneId={selectedZoneId}
              onSelectZone={handleSelectZone}
              flyToCoords={flyToCoords}
              className="w-full h-full"
            />
          </div>

          {/* Right-Side Command Intelligence Panel (4 Columns on Desktop) */}
          <div className="lg:col-span-4 h-full min-h-[500px]">
            <ZoneDetailPanel zone={selectedZone} />
          </div>
        </div>

        {/* BOTTOM INTELLIGENCE SUMMARY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
          {/* 1. Hotspot Zone Priority Ranking Table */}
          <Card className="lg:col-span-2 border">
            <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-foreground">
                  NER Landslide Risk Hotspots & Corridors
                </CardTitle>
                <CardDescription className="text-xs">
                  Click any zone to focus GIS map and inspect explainable SHAP weights
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
                <Link href="/risk">
                  Explainability Engine <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/40 text-muted-foreground font-mono">
                      <th className="p-3 font-semibold">Zone / State</th>
                      <th className="p-3 font-semibold">Threat Corridor</th>
                      <th className="p-3 font-semibold">Slope</th>
                      <th className="p-3 font-semibold">Hazard Score</th>
                      <th className="p-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {EXTENDED_RISK_ZONES.map((zone) => {
                      const isSelected = zone.id === selectedZoneId;
                      return (
                        <tr
                          key={zone.id}
                          onClick={() => handleSelectZone(zone.id)}
                          className={`hover:bg-accent/50 cursor-pointer transition-colors ${
                            isSelected ? "bg-primary/10 font-semibold" : ""
                          }`}
                        >
                          <td className="p-3">
                            <div className="font-bold text-foreground flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                              {zone.name}
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {zone.districtName}, {zone.state}
                            </div>
                          </td>
                          <td className="p-3 text-[11px] text-muted-foreground truncate max-w-[200px]">
                            {zone.primaryThreatCorridor}
                          </td>
                          <td className="p-3 font-mono">
                            {zone.slopeAngleDeg}°
                          </td>
                          <td className="p-3">
                            <RiskBadge levelOrScore={zone.currentRiskScore} showScore size="sm" />
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="h-7 text-[11px] px-2.5"
                            >
                              {isSelected ? "Inspecting" : "Focus"}
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* 2. Active Alerts & Emergency Directives Feed */}
          <Card className="border">
            <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-foreground">
                  Active Red Alerts
                </CardTitle>
                <CardDescription className="text-xs">
                  Early warnings issued across NER
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
                <Link href="/alerts">
                  All ({alerts.length}) <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {alerts.slice(0, 3).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 rounded-lg border bg-card/80 space-y-2 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-foreground leading-tight">
                      {alert.title}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono">
                      {alert.responsePriority}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {alert.triggerReason}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono pt-1 border-t">
                    <span>{alert.districtName}</span>
                    <span>{alert.affectedPopulationEstimate.toLocaleString()} affected</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
