"use client";

import React, { useState, useMemo } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/common/RiskBadge";
import {
  BrainCircuit,
  Sliders,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Droplets,
  Mountain,
  Compass,
  Cpu,
  History,
  Info,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { riskEngine } from "@/lib/ai/riskEngine";
import { SCENARIO_PRESETS, ScenarioPreset } from "@/lib/ai/mlModelService";
import { EnvironmentalFeatures, RiskPredictionResult } from "@/types/riskEngine";

export default function RiskAnalyticsPage() {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("aizawl-deluge");
  const [features, setFeatures] = useState<EnvironmentalFeatures>(SCENARIO_PRESETS[0].features);
  const [history, setHistory] = useState<Array<{ timestamp: string; score: number; level: string; label: string }>>([
    { timestamp: "10 mins ago", score: 87, level: "CRITICAL", label: "Aizawl Deluge (Hunthar)" },
    { timestamp: "1 hour ago", score: 92, level: "CRITICAL", label: "Sikkim Cloudburst (NH-10)" },
    { timestamp: "3 hours ago", score: 68, level: "HIGH", label: "Shillong Escarpment Runoff" },
  ]);

  // Compute live prediction from deterministic engine
  const prediction: RiskPredictionResult = useMemo(() => {
    return riskEngine.predict(features);
  }, [features]);

  const handleSelectPreset = (preset: ScenarioPreset) => {
    setSelectedPresetId(preset.id);
    setFeatures({ ...preset.features });

    // Add to history
    const evalResult = riskEngine.predict(preset.features);
    setHistory((prev) => [
      {
        timestamp: "Just now",
        score: evalResult.riskScore,
        level: evalResult.riskLevel,
        label: preset.name.split("(")[0].trim(),
      },
      ...prev.slice(0, 4),
    ]);
  };

  const handleSliderChange = (key: keyof EnvironmentalFeatures, value: number | string) => {
    setSelectedPresetId("custom");
    setFeatures((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const metadata = riskEngine.getModelMetadata();

  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                AI Landslide Risk Engine & Explainability
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-mono font-bold">
                PROTOTYPE v1.0
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Explainable multi-factor hazard scoring fusing 12 environmental, hydrological, and geotechnical signals
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">
              Inference: <strong>~12ms (Deterministic)</strong>
            </span>
          </div>
        </div>

        {/* Scenario Presets Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Pre-Calibrated Geohazard Scenarios (North East India):
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SCENARIO_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                      : "bg-card hover:bg-accent/50 border-border/80"
                  }`}
                >
                  <div className="font-bold text-xs text-foreground truncate">
                    {preset.name}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {preset.location}
                  </div>
                  <div className="text-[11px] text-muted-foreground line-clamp-2 mt-1.5 leading-tight">
                    {preset.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN WORKSPACE: Inputs Simulator (Left) + AI Assessment & Explainability (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 12-Feature Interactive Telemetry Simulator (5 cols) */}
          <Card className="lg:col-span-5 border bg-card shadow-xs">
            <CardHeader className="p-4 border-b pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  12 Input Environmental Features
                </CardTitle>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  Live Adjustments
                </span>
              </div>
              <CardDescription className="text-xs">
                Modify sensor parameters to inspect real-time hazard index recalculation
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-4 text-xs">
              {/* Feature 1: 24h Rainfall */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">24h Cumulative Deluge:</span>
                  <span className="font-mono font-bold text-foreground">{features.rainfall_24h} mm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="350"
                  step="2"
                  value={features.rainfall_24h}
                  onChange={(e) => handleSliderChange("rainfall_24h", Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>0 mm (Dry)</span>
                  <span className="text-rose-500 font-bold">100 mm (Critical Deluge)</span>
                  <span>350 mm</span>
                </div>
              </div>

              {/* Feature 2: 1h Rainfall */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">1h Cloudburst Intensity:</span>
                  <span className="font-mono font-bold text-foreground">{features.rainfall_1h} mm/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={features.rainfall_1h}
                  onChange={(e) => handleSliderChange("rainfall_1h", Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>0 mm/h</span>
                  <span className="text-amber-500 font-bold">25 mm/h (Squall)</span>
                  <span>80 mm/h</span>
                </div>
              </div>

              {/* Feature 3: Soil Moisture */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Geotechnical Soil Moisture:</span>
                  <span className="font-mono font-bold text-foreground">{features.soil_moisture}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={features.soil_moisture}
                  onChange={(e) => handleSliderChange("soil_moisture", Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>10% (Dry)</span>
                  <span className="text-rose-500 font-bold">75% (Saturation Limit)</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Feature 4: Slope Angle */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Terrain Slope Angle:</span>
                  <span className="font-mono font-bold text-foreground">{features.slope}°</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="70"
                  step="1"
                  value={features.slope}
                  onChange={(e) => handleSliderChange("slope", Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>5° (Gentle)</span>
                  <span className="text-amber-500 font-bold">35° (Critical Slope)</span>
                  <span>70°</span>
                </div>
              </div>

              {/* Feature 5: Historical Landslides */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Historical Slide Density (5km buffer):</span>
                  <span className="font-mono font-bold text-foreground">{features.historical_event_density} events</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={features.historical_event_density}
                  onChange={(e) => handleSliderChange("historical_event_density", Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                />
              </div>

              {/* Feature 6: Distance to Road */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Distance to Cut Road / Highway:</span>
                  <span className="font-mono font-bold text-foreground">{features.distance_to_road} meters</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="800"
                  step="5"
                  value={features.distance_to_road}
                  onChange={(e) => handleSliderChange("distance_to_road", Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                />
              </div>

              {/* Feature 7: Ground Truth Field Crack Observations */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-medium text-foreground">Field Report Crack Score:</span>
                  <span className="font-mono font-bold text-foreground">+{features.field_report_score} pts</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="1"
                  value={features.field_report_score}
                  onChange={(e) => handleSliderChange("field_report_score", Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
                />
              </div>

              {/* Feature 8: Land Cover Selector */}
              <div>
                <label className="font-medium text-foreground block mb-1">
                  Land Cover & Anthropic Load:
                </label>
                <select
                  value={features.land_cover}
                  onChange={(e) => handleSliderChange("land_cover", e.target.value)}
                  className="w-full p-2 rounded border bg-background text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="ROAD_CUT">Road Cut Slope Surcharge (+6 pts)</option>
                  <option value="SETTLEMENT_SURCHARGE">Dense Residential Settlement Load (+7 pts)</option>
                  <option value="DEGRADED_SCRUB">Degraded Scrub / Exposed Soil (+5 pts)</option>
                  <option value="FOREST_CANOPY">Stable Forest Canopy (+1 pt)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: AI Risk Fusion Output & SHAP Explainability (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Risk Assessment Score Card */}
            <Card className="border bg-card shadow-md">
              <CardHeader className="p-4 border-b bg-muted/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base font-black text-foreground">
                      Prototype AI Risk Assessment
                    </CardTitle>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-foreground/10 text-foreground font-semibold">
                    Confidence: {(prediction.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-5 space-y-4">
                {/* Hero Score Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border bg-background shadow-inner">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground font-bold">
                      Calculated Landslide Hazard Index ($LHI$)
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl sm:text-5xl font-black text-foreground font-mono">
                        {prediction.riskScore}
                      </span>
                      <span className="text-lg text-muted-foreground font-mono">/ 100</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-1.5">
                    <RiskBadge levelOrScore={prediction.riskScore} showScore={false} size="lg" />
                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                      {prediction.trend === "RISING" ? (
                        <>
                          <TrendingUp className="w-4 h-4" />
                          <span>Trajectory: RISING</span>
                        </>
                      ) : prediction.trend === "FALLING" ? (
                        <>
                          <TrendingDown className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500">Trajectory: FALLING</span>
                        </>
                      ) : (
                        <>
                          <Minus className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Trajectory: STABLE</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* SHAP-STYLE FACTOR ATTRIBUTION BREAKDOWN */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Explainability Breakdown — WHY is the Risk High?
                    </h4>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      Total Points: {prediction.riskScore}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {prediction.factors.map((factor) => (
                      <div key={factor.id} className="space-y-1 p-2 rounded-lg border bg-card/60">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-foreground">{factor.name}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-muted text-muted-foreground font-mono">
                              {factor.category}
                            </span>
                          </div>
                          <span className="font-mono text-foreground font-bold">
                            +{factor.contributionPoints} pts ({factor.normalizedPct}%)
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              factor.severity === "critical"
                                ? "bg-rose-500"
                                : factor.severity === "high"
                                ? "bg-orange-500"
                                : factor.severity === "moderate"
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(100, (factor.contributionPoints / 32) * 100)}%` }}
                          />
                        </div>

                        <p className="text-[11px] text-muted-foreground leading-tight pt-0.5">
                          {factor.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* LEVEL-AWARE TACTICAL RECOMMENDATIONS */}
                <div className="space-y-2 pt-3 border-t">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    Recommended Decision-Support Directives
                  </h4>
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    {prediction.recommendations.map((rec, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-card border flex items-start gap-2 text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 24-HOUR PREDICTIVE FORECAST TRAJECTORY */}
                <div className="space-y-2 pt-3 border-t">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    24-Hour Projected Predictive Trajectory
                  </h4>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
                    {prediction.forecast24h.map((f, i) => (
                      <div key={i} className="p-2 rounded-lg border bg-muted/40 space-y-1">
                        <span className="text-[10px] text-muted-foreground block">{f.timeOffset}</span>
                        <strong className="text-foreground text-sm block">{f.predictedScore}</strong>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-card border font-bold">
                          {f.predictedLevel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* BOTTOM METADATA & RECENT INFERENCE LOG */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Model Metadata Panel (2 cols) */}
          <Card className="md:col-span-2 border">
            <CardHeader className="p-4 border-b">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-bold text-foreground">
                  Model Architecture & Evaluation Parameters
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-2.5 rounded bg-muted/40 border">
                  <span className="text-[10px] text-muted-foreground block">Model Architecture</span>
                  <strong className="text-foreground">{metadata.modelName.split(" ")[1]} GBDT</strong>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border">
                  <span className="text-[10px] text-muted-foreground block">Model Version</span>
                  <strong className="text-foreground">{metadata.version.split(" ")[0]}</strong>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border">
                  <span className="text-[10px] text-muted-foreground block">Features Analyzed</span>
                  <strong className="text-foreground">12 Tabular Features</strong>
                </div>
                <div className="p-2.5 rounded bg-muted/40 border">
                  <span className="text-[10px] text-muted-foreground block">Evaluation State</span>
                  <strong className="text-emerald-600 dark:text-emerald-400">READY (Deterministic)</strong>
                </div>
              </div>

              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-[11px] text-muted-foreground flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Academic & Hackathon Disclaimer:</strong> {metadata.disclaimer}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prediction History Log */}
          <Card className="border">
            <CardHeader className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-bold text-foreground">
                    Simulation Audit Log
                  </CardTitle>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">Recent Runs</span>
              </div>
            </CardHeader>
            <CardContent className="p-3 space-y-2 text-xs">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded border bg-card/60 text-[11px]">
                  <div>
                    <div className="font-semibold text-foreground truncate max-w-[130px]">{h.label}</div>
                    <span className="text-[10px] text-muted-foreground font-mono">{h.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-foreground">{h.score}/100</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                        h.level === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                          : "bg-orange-500/20 text-orange-700 dark:text-orange-300"
                      }`}
                    >
                      {h.level}
                    </span>
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
