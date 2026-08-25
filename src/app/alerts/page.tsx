import React from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/common/RiskBadge";
import { AlertTriangle, ShieldAlert, CheckCircle2, Bell, Radio, Share2 } from "lucide-react";
import { MOCK_ALERTS } from "@/lib/demo";
import { formatDate } from "@/lib/utils";

export default function AlertsPage() {
  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Active Landslide Alerts & Bulletins
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-mono font-semibold">
                {MOCK_ALERTS.length} ACTIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automated multi-level warnings broadcast to State Disaster Management Authorities and public channels
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Bell className="w-3.5 h-3.5" />
              Broadcast Notification
            </Button>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="space-y-4">
          {MOCK_ALERTS.map((alert) => (
            <Card
              key={alert.id}
              className={`border transition-all ${
                alert.severity === "CRITICAL"
                  ? "border-rose-500/50 bg-rose-500/5 shadow-md shadow-rose-500/10"
                  : "border-orange-500/40 bg-orange-500/5"
              }`}
            >
              <CardHeader className="pb-3">
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
                      <CardTitle className="text-base font-bold text-foreground">
                        {alert.title}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <span>{alert.districtName}</span>
                        <span>•</span>
                        <span className="font-mono">Issued: {formatDate(alert.issuedAt)}</span>
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

              <CardContent className="space-y-4 text-xs">
                {/* Trigger Reason Box */}
                <div className="p-3 rounded-lg bg-card/80 border text-foreground leading-relaxed">
                  <strong className="text-muted-foreground font-mono uppercase block mb-1">
                    Trigger Cause & Telemetry:
                  </strong>
                  {alert.triggerReason}
                </div>

                {/* Impact & Recommended Action Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 p-3 rounded-lg bg-muted/40 border">
                    <span className="font-semibold text-foreground block">
                      Estimated Vulnerable Footprint:
                    </span>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Population: <strong>{alert.affectedPopulationEstimate.toLocaleString()} residents</strong></li>
                      <li>• Affected Roads: <strong>{alert.affectedRoads.join(", ")}</strong></li>
                    </ul>
                  </div>

                  <div className="space-y-2 p-3 rounded-lg bg-muted/40 border">
                    <span className="font-semibold text-foreground block">
                      Recommended Immediate Directives:
                    </span>
                    <ul className="space-y-1 text-muted-foreground">
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
                <div className="flex items-center justify-between pt-2 border-t text-[11px] text-muted-foreground">
                  <div>
                    {alert.acknowledgedBy ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        ✓ Acknowledged by {alert.acknowledgedBy}
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        ⏳ Awaiting SDMA Acknowledgement
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                      <Share2 className="w-3 h-3" />
                      Share
                    </Button>
                    <Button size="sm" variant="critical" className="h-7 text-xs">
                      Acknowledge & Dispatch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
