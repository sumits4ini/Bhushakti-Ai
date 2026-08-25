"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/common/RiskBadge";
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Bell,
  Radio,
  Share2,
  RefreshCw,
  Zap,
  RotateCcw,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  Send,
} from "lucide-react";
import { alertRepository } from "@/services/alertRepository";
import { responseRepository } from "@/services/responseRepository";
import { notificationService } from "@/services/notificationService";
import { alertEngine } from "@/lib/risk/alertEngine";
import { Alert, AlertSeverity } from "@/types/alert";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";

export default function AlertsPage() {
  const { role, user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");
  const [scenarioNotice, setScenarioNotice] = useState<string | null>(null);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const data = await alertRepository.getActive();
      setAlerts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  // 1-Click Trigger Critical Scenario
  const handleTriggerCriticalScenario = async () => {
    const evalResult = alertEngine.evaluate({
      riskScore: 94,
      riskTrend: "RISING",
      rainfall1h: 38.5,
      rainfall24h: 164.0,
      populationAffected: 2850,
      infrastructureImportance: "CRITICAL",
      hasRoadBlockage: true,
      hasCracks: true,
      locationName: "Hunthar Veng / NH-54 Corridor",
      districtName: "Aizawl (Mizoram)",
      threatCorridor: "NH-54 Silchar-Aizawl National Lifeline",
    });

    const newAlert: Alert = {
      id: `alt-sim-${Date.now()}`,
      title: evalResult.title,
      severity: "CRITICAL",
      status: "ACTIVE",
      riskScore: 94,
      riskLevel: "CRITICAL",
      districtId: "dist-aizawl",
      districtName: "Aizawl (Mizoram)",
      locationPoint: { latitude: 23.7385, longitude: 92.7092 },
      triggerReason: evalResult.triggerReason,
      affectedPopulationEstimate: 2850,
      affectedRoads: evalResult.affectedRoads,
      recommendedActions: evalResult.recommendedActions,
      responsePriority: "P1",
      issuedAt: new Date().toISOString(),
    };

    // 1. Dispatch Notification
    await notificationService.dispatchAlert(newAlert);

    // 2. Create Response Task
    await responseRepository.create({
      alertId: newAlert.id,
      riskZoneName: "Hunthar Veng Slope",
      districtName: "Aizawl",
      title: "P1 Emergency Dispatch: Mobilize Earthmovers for NH-54 Blockage",
      priority: "P1",
      status: "DEPLOYED",
      actionType: "ROAD_CLEARANCE",
      assignedAgency: evalResult.suggestedAgency,
      targetLocation: newAlert.locationPoint,
      locationDescription: "NH-54 milestone 14, Hunthar, Aizawl",
      description: `Immediate highway clearance & slope stabilization dispatched: ${evalResult.recommendedActions[0]}`,
      allocatedPersonnel: 16,
      equipmentRequired: ["Hydraulic Excavator", "Tension Crackmeter", "LED Warning Lights", "Radio Relay"],
    });

    // 3. Save to local alerts queue
    const list = await alertRepository.getActive();
    list.unshift(newAlert);
    if (typeof window !== "undefined") {
      localStorage.setItem("bhushakti_local_alerts", JSON.stringify(list));
    }
    setAlerts(list);

    setScenarioNotice(
      "⚡ Critical Disaster Scenario Triggered: P1 Emergency Red Alert broadcast to all command consoles. SDRF 1st Battalion Task Dispatched!"
    );
  };

  const handleAcknowledge = async (alertId: string) => {
    const ackBy = user?.fullName || (role === "ADMIN" ? "Director SDMA" : "SDRF Duty Officer");
    await alertRepository.acknowledge(alertId, ackBy);
    await loadAlerts();
  };

  const handleResolve = async (alertId: string) => {
    await alertRepository.resolve(alertId);
    await loadAlerts();
  };

  const filteredAlerts = alerts.filter((a) => {
    if (filterSeverity === "ALL") return true;
    if (filterSeverity === "ACKNOWLEDGED") return !!a.acknowledgedBy;
    return a.severity === filterSeverity;
  });

  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header & Simulation Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Emergency Landslide Alerts & Bulletins
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-mono font-bold">
                {alerts.length} ACTIVE ALERTS
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automated multi-level warnings broadcast across State Disaster Management Authorities and public channels
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button size="sm" variant="outline" onClick={loadAlerts} className="gap-1.5 text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              variant="critical"
              onClick={handleTriggerCriticalScenario}
              className="gap-1.5 text-xs font-bold shadow-md"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              Trigger Critical Scenario
            </Button>
          </div>
        </div>

        {/* Live Scenario Alert Banner if Triggered */}
        {scenarioNotice && (
          <div className="p-3.5 rounded-xl border border-rose-500/50 bg-rose-500/10 shadow-lg flex items-center justify-between gap-3 text-xs animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <Zap className="w-5 h-5 text-rose-500 shrink-0 animate-bounce" />
              <span className="font-semibold text-foreground">{scenarioNotice}</span>
            </div>
            <Button asChild size="sm" variant="default" className="text-xs shrink-0 font-bold">
              <Link href="/response">View in Response Center →</Link>
            </Button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto text-xs">
          {["ALL", "CRITICAL", "WARNING", "WATCH", "ACKNOWLEDGED"].map((sev) => (
            <Button
              key={sev}
              variant={filterSeverity === sev ? "default" : "ghost"}
              size="sm"
              className="h-8 text-xs font-semibold"
              onClick={() => setFilterSeverity(sev)}
            >
              {sev} {sev === "ALL" ? `(${alerts.length})` : ""}
            </Button>
          ))}
        </div>

        {/* Alerts Grid */}
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <Card className="p-8 text-center border-dashed">
              <p className="text-xs text-muted-foreground font-mono">
                No active alerts matching filter {filterSeverity}.
              </p>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`border transition-all ${
                  alert.severity === "CRITICAL"
                    ? "border-rose-500/50 bg-rose-500/5 shadow-md shadow-rose-500/10"
                    : "border-orange-500/40 bg-orange-500/5"
                }`}
              >
                <CardHeader className="p-4 pb-2 border-b bg-muted/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`p-2 rounded-lg ${
                          alert.severity === "CRITICAL"
                            ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                            : "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                        }`}
                      >
                        <ShieldAlert className="w-5 h-5" />
                      </div>
                      <div>
                        <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                          {alert.title}
                        </CardTitle>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 font-mono">
                          <span>{alert.districtName}</span>
                          <span>•</span>
                          <span>Issued: {formatDate(alert.issuedAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <RiskBadge levelOrScore={alert.riskScore} showScore size="sm" />
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-foreground/10 text-foreground">
                        Priority: {alert.responsePriority}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4 text-xs">
                  {/* Trigger Reason Box */}
                  <div className="p-3 rounded-lg bg-card/90 border text-foreground leading-relaxed">
                    <strong className="text-muted-foreground font-mono uppercase block mb-1 text-[10px]">
                      Trigger Cause & Hydrogeological Telemetry:
                    </strong>
                    {alert.triggerReason}
                  </div>

                  {/* Impact & Directives Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 p-3 rounded-lg bg-muted/40 border">
                      <span className="font-bold text-foreground block">
                        Estimated Impact & Footprint:
                      </span>
                      <ul className="space-y-1 text-muted-foreground text-[11px]">
                        <li>• Population at Risk: <strong>{alert.affectedPopulationEstimate.toLocaleString()} residents</strong></li>
                        <li>• Threatened Roads: <strong>{alert.affectedRoads.join(", ")}</strong></li>
                      </ul>
                    </div>

                    <div className="space-y-1.5 p-3 rounded-lg bg-muted/40 border">
                      <span className="font-bold text-foreground block">
                        Actionable Operational Directives:
                      </span>
                      <ul className="space-y-1 text-muted-foreground text-[11px]">
                        {alert.recommendedActions.map((action, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-[11px] text-muted-foreground">
                    <div>
                      {alert.acknowledgedBy ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Acknowledged by {alert.acknowledgedBy} ({alert.acknowledgedAt ? formatDate(alert.acknowledgedAt) : "Recorded"})
                        </span>
                      ) : (
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          ⏳ Awaiting SDMA Acknowledgement
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <Link href="/response">
                          <Radio className="w-3 h-3" />
                          Response Dispatch
                        </Link>
                      </Button>

                      {!alert.acknowledgedBy && (role === "ADMIN" || role === "FIELD_OFFICER") && (
                        <Button
                          size="sm"
                          variant="critical"
                          className="h-7 text-xs font-bold gap-1 shadow-sm"
                          onClick={() => handleAcknowledge(alert.id)}
                        >
                          Acknowledge Alert
                        </Button>
                      )}

                      {alert.acknowledgedBy && (role === "ADMIN" || role === "FIELD_OFFICER") && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs font-bold text-emerald-600 border-emerald-500/40 hover:bg-emerald-500/10"
                          onClick={() => handleResolve(alert.id)}
                        >
                          Mark as Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PageShell>
  );
}
