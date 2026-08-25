"use client";

import React, { useState, useEffect } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/common/RiskBadge";
import {
  CloudRain,
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  AlertTriangle,
  Zap,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  Compass,
  CheckCircle2,
  Activity,
  Calendar,
} from "lucide-react";
import { weatherProvider } from "@/lib/weather";
import { CurrentWeather, WeatherForecast24h, RainfallHistory } from "@/types/weather";
import { alertRepository } from "@/services/alertRepository";

export default function WeatherForecastPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string>("aizawl");
  const [isScenarioActive, setIsScenarioActive] = useState<boolean>(false);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast24h | null>(null);
  const [history, setHistory] = useState<RainfallHistory | null>(null);
  const [scenarioNotice, setScenarioNotice] = useState<string | null>(null);

  const loadWeatherData = async (locId: string, scenario: boolean) => {
    const [curr, fc, hist] = await Promise.all([
      weatherProvider.getCurrentWeather(locId, scenario),
      weatherProvider.getForecast(locId, scenario),
      weatherProvider.getRainfallHistory(locId, scenario),
    ]);
    setCurrentWeather(curr);
    setForecast(fc);
    setHistory(hist);
  };

  useEffect(() => {
    loadWeatherData(selectedLocationId, isScenarioActive);
  }, [selectedLocationId, isScenarioActive]);

  const handleTriggerScenario = async () => {
    setIsScenarioActive(true);
    setScenarioNotice(
      "⚡ Heavy Monsoon Deluge Scenario Activated: 38.5 mm/h cloudburst simulated. Geotechnical pore pressure threshold crossed. Hazard score surged to 89 (CRITICAL)."
    );
  };

  const handleResetScenario = () => {
    setIsScenarioActive(false);
    setScenarioNotice(null);
  };

  if (!currentWeather || !forecast || !history) {
    return (
      <PageShell>
        <div className="p-6 text-center text-muted-foreground animate-pulse font-mono text-xs">
          Loading Meteorological Telemetry Stream...
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header & Simulation Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Weather Telemetry & 24-Hour Landslide Forecast
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-mono font-bold">
                IMD & ISRO ENSEMBLE
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Coupled hydrological-geotechnical predictive model analyzing rainfall infiltration and slope shear degradation
            </p>
          </div>

          {/* Location Picker & Scenario Trigger */}
          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedLocationId}
              onChange={(e) => setSelectedLocationId(e.target.value)}
              className="bg-card border px-3 py-1.5 rounded-lg text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
              aria-label="Select Weather Station"
            >
              <option value="aizawl">Mizoram: Aizawl (NH-54)</option>
              <option value="gangtok">Sikkim: Gangtok (NH-10)</option>
              <option value="shillong">Meghalaya: Shillong / Sohra</option>
              <option value="kohima">Nagaland: Kohima (NH-29)</option>
              <option value="itanagar">Arunachal: Itanagar (NH-415)</option>
            </select>

            {!isScenarioActive ? (
              <Button
                size="sm"
                variant="critical"
                className="text-xs font-bold gap-1.5 shadow-md"
                onClick={handleTriggerScenario}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Simulate Heavy Rainfall Scenario
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="text-xs font-bold gap-1.5 border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-500/10 shadow-sm"
                onClick={handleResetScenario}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset to Baseline Telemetry
              </Button>
            )}
          </div>
        </div>

        {/* Heavy Rainfall Scenario Alert Banner if Active */}
        {isScenarioActive && (
          <div className="p-3.5 rounded-xl border border-rose-500/50 bg-rose-500/10 shadow-lg flex items-start justify-between gap-3 text-xs animate-in fade-in duration-300">
            <div className="flex items-start gap-2.5">
              <Zap className="w-5 h-5 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <strong className="text-rose-700 dark:text-rose-300 font-bold block text-sm">
                  ⚡ Heavy Monsoon Deluge Simulation Active
                </strong>
                <p className="text-muted-foreground mt-0.5 leading-relaxed">
                  Simulated cloudburst surge: <strong>+{currentWeather.rainfall1hMm} mm/h</strong> hourly intensity, <strong>{currentWeather.rainfall24hMm} mm</strong> 24h total. Soil moisture saturated at <strong>{currentWeather.soilMoisturePct}%</strong>. Landslide Hazard Index elevated to <strong>CRITICAL (Score: 89/100)</strong>.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleResetScenario}
              className="shrink-0 text-[11px] h-7 gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          </div>
        )}

        {/* 1. CURRENT WEATHER TELEMETRY METRIC CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Current Rainfall (1h) */}
          <Card className="border">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[10px] font-mono uppercase font-bold">1h Rain Intensity</span>
                <CloudRain className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-foreground font-mono">
                {currentWeather.rainfall1hMm} <span className="text-xs font-normal">mm/h</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                {currentWeather.rainfall1hMm > 20 ? "⚠️ Heavy Squall" : "Moderate Rain"}
              </div>
            </CardContent>
          </Card>

          {/* 24h Cumulative Rainfall */}
          <Card className="border">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[10px] font-mono uppercase font-bold">24h Cumulative</span>
                <Layers className="w-4 h-4 text-primary" />
              </div>
              <div className="text-2xl font-black text-foreground font-mono">
                {currentWeather.rainfall24hMm} <span className="text-xs font-normal">mm</span>
              </div>
              <div className="text-[10px] text-rose-600 dark:text-rose-400 font-mono font-bold">
                {currentWeather.rainfall24hMm > 100 ? "🚨 Deluge Threshold" : "Elevated"}
              </div>
            </CardContent>
          </Card>

          {/* Geotechnical Soil Moisture */}
          <Card className="border">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[10px] font-mono uppercase font-bold">Soil Moisture</span>
                <Droplets className="w-4 h-4 text-teal-500" />
              </div>
              <div className="text-2xl font-black text-foreground font-mono">
                {currentWeather.soilMoisturePct}%
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                {currentWeather.soilMoisturePct > 80 ? "Critical Saturation" : "Moist Subsoil"}
              </div>
            </CardContent>
          </Card>

          {/* 72h Antecedent Rain */}
          <Card className="border">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[10px] font-mono uppercase font-bold">72h Antecedent</span>
                <Calendar className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-foreground font-mono">
                {currentWeather.rainfall72hMm} <span className="text-xs font-normal">mm</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                3-Day Pre-Softening
              </div>
            </CardContent>
          </Card>

          {/* Temperature & Humidity */}
          <Card className="border">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[10px] font-mono uppercase font-bold">Temp & Humidity</span>
                <Thermometer className="w-4 h-4 text-orange-500" />
              </div>
              <div className="text-2xl font-black text-foreground font-mono">
                {currentWeather.temperatureC}°C
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                RH: {currentWeather.humidityPct}% Saturation
              </div>
            </CardContent>
          </Card>

          {/* Wind Speed & Direction */}
          <Card className="border">
            <CardContent className="p-3.5 space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[10px] font-mono uppercase font-bold">Surface Wind</span>
                <Wind className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl font-black text-foreground font-mono">
                {currentWeather.windSpeedKmh} <span className="text-xs font-normal">km/h</span>
              </div>
              <div className="text-[10px] text-muted-foreground font-mono">
                Heading: {currentWeather.windDirection}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. 24-HOUR STEP FORECAST CARDS (Now, +3h, +6h, +12h, +24h) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-primary" />
              24-Hour Coupled Hazard Trajectory (Now → +24h)
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              Station: {currentWeather.stationSource}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {forecast.steps.map((step, idx) => (
              <Card
                key={idx}
                className={`border transition-all ${
                  step.projectedRiskLevel === "CRITICAL"
                    ? "border-rose-500/50 bg-rose-500/5 shadow-md shadow-rose-500/5"
                    : step.projectedRiskLevel === "HIGH"
                    ? "border-orange-500/40 bg-orange-500/5"
                    : "border-border/80 bg-card"
                }`}
              >
                <CardHeader className="p-3.5 pb-2 border-b bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-foreground">
                      {step.timeOffset}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Conf: {(step.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-3.5 space-y-3 text-xs">
                  {/* Score & Badge */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground font-mono block">Hazard Score</span>
                      <div className="text-2xl font-black font-mono text-foreground">
                        {step.projectedRiskScore}
                      </div>
                    </div>
                    <RiskBadge levelOrScore={step.projectedRiskScore} showScore={false} size="sm" />
                  </div>

                  {/* Rainfall & Soil Moisture row */}
                  <div className="p-2 rounded bg-muted/40 border space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rainfall:</span>
                      <strong className="text-foreground">{step.rainfallMm} mm/h</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Soil Moisture:</span>
                      <strong className="text-foreground">{step.soilMoisturePct}%</strong>
                    </div>
                  </div>

                  {/* Summary Text */}
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {step.summary}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 3. MULTI-METRIC TREND CHARTS (Rainfall, Hazard Score, Soil Moisture) */}
        <Card className="border">
          <CardHeader className="p-4 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Coupled Multi-Signal Hydrogeological Curves (-24h to +24h)
              </CardTitle>
              <CardDescription className="text-xs">
                Visualizing non-linear correlation between precipitation intensity and landslide vulnerability score
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-6">
            {/* SVG Visual Curves */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Curve 1: Rainfall Trend */}
              <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                    Precipitation Intensity (mm/h)
                  </span>
                  <span className="font-mono text-[11px] font-bold text-blue-500">
                    Peak: {Math.max(...forecast.steps.map((s) => s.rainfallMm))} mm/h
                  </span>
                </div>
                <div className="h-28 w-full flex items-end justify-between gap-1.5 pt-4">
                  {forecast.steps.map((s, i) => {
                    const heightPct = Math.min(100, (s.rainfallMm / 45) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500 shadow-sm"
                          style={{ height: `${Math.max(12, heightPct)}%` }}
                        />
                        <span className="text-[10px] font-mono text-muted-foreground">{s.timeOffset}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Curve 2: Hazard Score Trend */}
              <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    Hazard Score ($LHI$) Curve
                  </span>
                  <span className="font-mono text-[11px] font-bold text-rose-500">
                    Peak: {Math.max(...forecast.steps.map((s) => s.projectedRiskScore))}/100
                  </span>
                </div>
                <div className="h-28 w-full flex items-end justify-between gap-1.5 pt-4">
                  {forecast.steps.map((s, i) => {
                    const heightPct = s.projectedRiskScore;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className={`w-full rounded-t transition-all duration-500 shadow-sm ${
                            s.projectedRiskScore >= 76
                              ? "bg-gradient-to-t from-rose-600 to-rose-400"
                              : s.projectedRiskScore >= 51
                              ? "bg-gradient-to-t from-orange-600 to-orange-400"
                              : "bg-gradient-to-t from-amber-600 to-amber-400"
                          }`}
                          style={{ height: `${Math.max(15, heightPct)}%` }}
                        />
                        <span className="text-[10px] font-mono text-muted-foreground">{s.timeOffset}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Curve 3: Soil Moisture Saturation */}
              <div className="p-4 rounded-xl border bg-muted/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-teal-500" />
                    Soil Moisture Saturation (%)
                  </span>
                  <span className="font-mono text-[11px] font-bold text-teal-500">
                    {currentWeather.soilMoisturePct}% Saturation
                  </span>
                </div>
                <div className="h-28 w-full flex items-end justify-between gap-1.5 pt-4">
                  {forecast.steps.map((s, i) => {
                    const heightPct = s.soilMoisturePct;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-teal-600 to-teal-400 transition-all duration-500 shadow-sm"
                          style={{ height: `${Math.max(15, heightPct)}%` }}
                        />
                        <span className="text-[10px] font-mono text-muted-foreground">{s.timeOffset}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Disclaimer Bar */}
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-muted-foreground flex items-start gap-2">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div>
                <strong>Meteorological Data Source & Adapter Architecture:</strong> Powered by the pluggable{" "}
                <code className="font-mono text-foreground font-semibold">WeatherProvider</code> architecture.
                Currently operating in simulated demonstration mode (IMD AWS & MOSDAC ensemble proxy). Ready for
                direct production integration with live government REST API keys without architectural refactoring.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
