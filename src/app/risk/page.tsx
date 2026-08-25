import React from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/common/RiskBadge";
import { BrainCircuit, Activity, Cpu, Sliders, Info, ShieldCheck } from "lucide-react";
import { MOCK_RISK_ZONES } from "@/lib/demo";

export default function RiskAnalyticsPage() {
  const sampleFactors = [
    { name: "24h Cumulative Rainfall", value: "118.5 mm", contribution: 29.4, severity: "critical", category: "Hydrological" },
    { name: "Soil Moisture Saturation", value: "84.5%", contribution: 24.1, severity: "critical", category: "Geotechnical" },
    { name: "Slope Gradient Steepness", value: "38.5°", contribution: 18.0, severity: "high", category: "Topographical" },
    { name: "Historical Landslide Density", value: "8 in 5km buffer", contribution: 9.5, severity: "moderate", category: "Geological" },
    { name: "Field Vision Crack Signal", value: "12cm Active Fissure", contribution: 6.0, severity: "high", category: "Ground Truth" },
  ];

  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                AI Landslide Risk Engine & Explainability
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono font-semibold">
                Multi-Factor Fusion
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Transparent feature contributions, SHAP-style explainability breakdown, and prototype mathematical weights
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Sliders className="w-3.5 h-3.5" />
              Adjust Feature Weights
            </Button>
          </div>
        </div>

        {/* Model Metadata Card */}
        <Card className="border bg-card/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                <CardTitle className="text-base font-bold text-foreground">
                  Model Architecture: Multi-Source Landslide Risk Fusion v1.0
                </CardTitle>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                12 Features Analyzed
              </span>
            </div>
            <CardDescription className="text-xs">
              Combines hydrological threshold functions, geotechnical pore pressure curves, and spatial susceptibility layers into a 0–100 Landslide Hazard Index ($LHI$).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-muted/40 border">
              <div className="text-muted-foreground">Inference Algorithm</div>
              <div className="font-bold text-foreground mt-1">Weighted Ensemble GBDT</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border">
              <div className="text-muted-foreground">Confidence Metric</div>
              <div className="font-bold text-foreground mt-1">91.4% (Calibrated)</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border">
              <div className="text-muted-foreground">Hydrological Weight ($w_R$)</div>
              <div className="font-bold text-foreground mt-1">0.35 (Deluge Sensitive)</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/40 border">
              <div className="text-muted-foreground">Evaluation Latency</div>
              <div className="font-bold text-foreground mt-1">~14ms Serverless</div>
            </div>
          </CardContent>
        </Card>

        {/* Explainability Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Factor Breakdown (2 cols) */}
          <Card className="lg:col-span-2 border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-foreground">
                Factor Contribution Breakdown — Hunthar Veng Corridor
              </CardTitle>
              <CardDescription className="text-xs">
                Score: 87 / 100 (CRITICAL) • Explains exactly why the AI generated this risk level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sampleFactors.map((factor, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">
                      {factor.name} ({factor.category})
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {factor.value} • <strong className="text-foreground">+{factor.contribution} pts</strong>
                    </span>
                  </div>
                  {/* Progress bar representing weight */}
                  <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        factor.severity === "critical"
                          ? "bg-rose-500"
                          : factor.severity === "high"
                          ? "bg-orange-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${(factor.contribution / 35) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Decision Support Guidelines */}
          <Card className="border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500" />
                Prototype Decision Thresholds
              </CardTitle>
              <CardDescription className="text-xs">
                Guiding disaster management protocol
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                <div className="font-bold text-emerald-700 dark:text-emerald-400">
                  0–25: LOW
                </div>
                <div className="text-muted-foreground mt-0.5">Routine background telemetry.</div>
              </div>
              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30">
                <div className="font-bold text-amber-700 dark:text-amber-400">
                  26–50: MODERATE
                </div>
                <div className="text-muted-foreground mt-0.5">Increased block-level watch.</div>
              </div>
              <div className="p-2.5 rounded bg-orange-500/10 border border-orange-500/30">
                <div className="font-bold text-orange-700 dark:text-orange-400">
                  51–75: HIGH
                </div>
                <div className="text-muted-foreground mt-0.5">Pre-position quick response teams.</div>
              </div>
              <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30">
                <div className="font-bold text-rose-700 dark:text-rose-400">
                  76–100: CRITICAL
                </div>
                <div className="text-muted-foreground mt-0.5">Immediate evacuation & highway halt.</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
