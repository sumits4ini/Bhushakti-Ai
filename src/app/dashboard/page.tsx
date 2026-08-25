import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  MapPin,
  Flame,
  Camera,
  Layers,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
} from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/common/RiskBadge";
import { MOCK_DISTRICTS, MOCK_RISK_ZONES, MOCK_ALERTS, MOCK_FIELD_REPORTS } from "@/lib/demo";

export default function DashboardPage() {
  const criticalZones = MOCK_RISK_ZONES.filter((z) => z.currentRiskLevel === "CRITICAL");
  const highRiskZones = MOCK_RISK_ZONES.filter((z) => z.currentRiskLevel === "HIGH");
  const activeAlerts = MOCK_ALERTS.filter((a) => a.status === "ACTIVE");

  const stats = [
    {
      title: "Active Critical Zones",
      value: criticalZones.length,
      unit: "zones (Score ≥ 76)",
      change: "+1 in last 3h",
      icon: <Flame className="w-5 h-5 text-rose-500" />,
      color: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    },
    {
      title: "High Risk Zones",
      value: highRiskZones.length,
      unit: "zones (Score 51–75)",
      change: "Rainfall surge",
      icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      color: "border-orange-500/40 bg-orange-500/10 text-orange-700 dark:text-orange-300",
    },
    {
      title: "Active Red Alerts",
      value: activeAlerts.length,
      unit: "issued advisories",
      change: "2 P1 Dispatches",
      icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
      color: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300",
    },
    {
      title: "Field Reports (24h)",
      value: MOCK_FIELD_REPORTS.length,
      unit: "ground truth submissions",
      change: "2 Verified",
      icon: <Camera className="w-5 h-5 text-blue-500" />,
      color: "border-blue-500/40 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    },
  ];

  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Disaster Command Center
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
                OPERATIONAL
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              North Eastern Region • Multi-Source AI Landslide Risk Surveillance
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
              <Link href="/map">
                <Layers className="w-3.5 h-3.5" />
                GIS Map View
              </Link>
            </Button>
            <Button asChild size="sm" variant="critical" className="gap-1.5 text-xs">
              <Link href="/field-report">
                <Camera className="w-3.5 h-3.5" />
                Submit Observation
              </Link>
            </Button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <Card key={idx} className="border shadow-xs hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className={`p-1.5 rounded-md border ${stat.color}`}>
                  {stat.icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-foreground font-mono">
                  {stat.value}
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                  <span>{stat.unit}</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Middle Section: Active Risk Hotspots & Recent Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Risk Hotspots Table (2 cols) */}
          <Card className="lg:col-span-2 border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  High & Critical Landslide Hotspots
                </CardTitle>
                <CardDescription className="text-xs">
                  Prioritized by real-time Landslide Hazard Index ($LHI$)
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
                <Link href="/risk">
                  All Zones <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-y bg-muted/50 text-muted-foreground font-mono">
                      <th className="p-3 font-semibold">Zone / Corridor</th>
                      <th className="p-3 font-semibold">District / State</th>
                      <th className="p-3 font-semibold">Slope</th>
                      <th className="p-3 font-semibold">Risk Level</th>
                      <th className="p-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MOCK_RISK_ZONES.map((zone) => (
                      <tr
                        key={zone.id}
                        className="hover:bg-accent/40 transition-colors group"
                      >
                        <td className="p-3">
                          <div className="font-semibold text-foreground flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                            {zone.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate max-w-[220px]">
                            {zone.primaryThreatCorridor}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-medium text-foreground">
                            {zone.districtName}
                          </span>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {zone.state}
                          </div>
                        </td>
                        <td className="p-3 font-mono font-medium">
                          {zone.slopeAngleDeg}°
                        </td>
                        <td className="p-3">
                          <RiskBadge levelOrScore={zone.currentRiskScore} showScore size="sm" />
                        </td>
                        <td className="p-3 text-right">
                          <Button asChild variant="outline" size="sm" className="h-7 text-[11px] px-2">
                            <Link href={`/risk?zone=${zone.id}`}>Inspect</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Active Alerts Feed */}
          <Card className="border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold text-foreground">
                  Active Alerts
                </CardTitle>
                <CardDescription className="text-xs">
                  Triggered by threshold cross
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
                <Link href="/alerts">
                  View All <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_ALERTS.slice(0, 3).map((alert) => (
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

        {/* Bottom Section: District Vulnerability Summary */}
        <Card className="border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold text-foreground">
              NER District Surveillance Coverage
            </CardTitle>
            <CardDescription className="text-xs">
              Vulnerability rating based on topography, historical slide frequency, and monsoon exposure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MOCK_DISTRICTS.slice(0, 8).map((dist) => (
                <div
                  key={dist.id}
                  className="p-3 rounded-lg border bg-card/50 space-y-1 hover:bg-accent/40 transition-colors"
                >
                  <div className="font-semibold text-xs text-foreground truncate">
                    {dist.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {dist.state} • {dist.totalRiskZones} zones
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-muted-foreground">Vuln. Index</span>
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      {dist.vulnerabilityIndex}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
