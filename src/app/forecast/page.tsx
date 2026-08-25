import React from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/common/RiskBadge";
import { CloudRain, TrendingUp, AlertTriangle, Clock, Calendar, Droplets } from "lucide-react";
import { MOCK_FORECAST_DAYS } from "@/lib/demo";

export default function ForecastPage() {
  const hourlyCurve = [
    { offset: "Current (+0h)", score: 87, level: "CRITICAL", rain: "24.5 mm/h", confidence: "94%" },
    { offset: "+3 Hours", score: 89, level: "CRITICAL", rain: "32.0 mm/h", confidence: "91%" },
    { offset: "+6 Hours", score: 93, level: "CRITICAL", rain: "38.5 mm/h", confidence: "87%" },
    { offset: "+12 Hours", score: 78, level: "CRITICAL", rain: "18.0 mm/h", confidence: "82%" },
    { offset: "+24 Hours", score: 62, level: "HIGH", rain: "8.5 mm/h", confidence: "78%" },
  ];

  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                24-Hour Predictive Landslide Risk Forecast
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-400 font-mono font-semibold">
                Predictive AI Curve
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Simulated weather-linked landslide hazard forecast based on projected IMD monsoon squall trajectories
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              7-Day Synoptic Outlook
            </Button>
          </div>
        </div>

        {/* 24h Hourly Risk Trajectory Table / Visualizer */}
        <Card className="border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Target Zone: Aizawl — Hunthar Veng Corridor (NH-54)
                </CardTitle>
                <CardDescription className="text-xs">
                  Hazard index trajectory projecting peak risk at +6 Hours (Score 93) due to incoming squall
                </CardDescription>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold border border-rose-500/40">
                PEAK RISK: +6h
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-y bg-muted/50 text-muted-foreground font-mono">
                    <th className="p-3 font-semibold">Forecast Window</th>
                    <th className="p-3 font-semibold">Predicted Hazard Score</th>
                    <th className="p-3 font-semibold">Risk Classification</th>
                    <th className="p-3 font-semibold">Projected Rainfall Rate</th>
                    <th className="p-3 font-semibold">Model Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {hourlyCurve.map((row, i) => (
                    <tr key={i} className="hover:bg-accent/40 transition-colors">
                      <td className="p-3 font-bold text-foreground font-mono">
                        {row.offset}
                      </td>
                      <td className="p-3 font-mono font-extrabold text-sm">
                        {row.score} / 100
                      </td>
                      <td className="p-3">
                        <RiskBadge levelOrScore={row.score} showScore={false} size="sm" />
                      </td>
                      <td className="p-3 font-mono text-muted-foreground flex items-center gap-1">
                        <Droplets className="w-3.5 h-3.5 text-blue-500" />
                        {row.rain}
                      </td>
                      <td className="p-3 font-mono text-muted-foreground">
                        {row.confidence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 4-Day Synoptic Weather Overview */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">
            Synoptic 4-Day Monsoon Deluge Outlook (North Eastern Region)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_FORECAST_DAYS.map((day, idx) => (
              <Card key={idx} className="border bg-card/60">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold text-foreground">
                      {day.dayLabel}
                    </CardTitle>
                    <span className="text-[10px] font-mono text-muted-foreground">{day.date}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <CloudRain className="w-4 h-4" />
                    <span>{day.condition.replace(/_/g, " ")}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b text-muted-foreground">
                    <span>Expected Rainfall:</span>
                    <strong className="text-foreground font-mono">{day.expectedRainfallMm} mm</strong>
                  </div>
                  <div className="flex justify-between py-1 text-muted-foreground">
                    <span>Saturation Risk:</span>
                    <RiskBadge levelOrScore={day.soilMoistureSaturationRisk} showScore={false} size="sm" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
