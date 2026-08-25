"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/common/RiskBadge";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Flame,
  CloudRain,
  Droplets,
  TrendingUp,
  ShieldAlert,
  Camera,
  Sparkles,
  MapPin,
  CheckCircle2,
  Radio,
  Clock,
  Layers,
  ArrowRight,
  Info,
  Check,
  Send,
  Zap,
} from "lucide-react";
import { AIZAWL_DISASTER_SCENARIO, SimulationStep } from "@/lib/simulation/disasterScenario";
import { formatDate } from "@/lib/utils";

export default function DisasterSimulationPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 1.5x, 2x

  const activeStep: SimulationStep = AIZAWL_DISASTER_SCENARIO[currentStepIndex];

  // Auto-play interval
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      const intervalMs = 4500 / playbackSpeed;
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= AIZAWL_DISASTER_SCENARIO.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (currentStepIndex < AIZAWL_DISASTER_SCENARIO.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  return (
    <PageShell>
      <div className="p-3 sm:p-6 space-y-5 max-w-7xl mx-auto w-full pb-16">
        {/* Top Header & Simulation Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
                <Flame className="w-6 h-6 text-rose-500 animate-pulse" />
                Live Disaster Simulation Mode
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                DETERMINISTIC DEMO
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Demonstrating the full autonomous sequence: Environmental Infiltration → AI Inference → Field CV → P1 Red Alert & Response
            </p>
          </div>

          {/* Player Controls Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-card/90 border p-1.5 rounded-xl shadow-md">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              title="Previous Step"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant={isPlaying ? "destructive" : "default"}
              size="sm"
              className="h-8 text-xs font-bold gap-1.5 px-3 shadow-xs"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {currentStepIndex >= AIZAWL_DISASTER_SCENARIO.length - 1 ? "Replay" : "Play"}
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleNext}
              disabled={currentStepIndex >= AIZAWL_DISASTER_SCENARIO.length - 1}
              title="Next Step"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleRestart}
              title="Restart Simulation to Step 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>

            {/* Speed Selector */}
            <div className="border-l pl-2 flex items-center gap-1 font-mono text-[11px]">
              {[1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded font-bold transition-colors ${
                    playbackSpeed === spd
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 8-STAGE TIMELINE TRACK */}
        <div className="p-3.5 rounded-xl border bg-card/80 shadow-inner space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-muted-foreground">
            <span>SCENARIO TIMELINE: EXTREME RAINFALL — AIZAWL (NH-54)</span>
            <span className="text-foreground">
              Stage {activeStep.stepNumber} of {AIZAWL_DISASTER_SCENARIO.length - 1}
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-9 gap-1.5">
            {AIZAWL_DISASTER_SCENARIO.map((step, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isPassed = idx < currentStepIndex;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(idx);
                  }}
                  className={`p-2 rounded-lg text-left border transition-all text-xs ${
                    isCurrent
                      ? "bg-primary text-primary-foreground font-bold border-primary shadow-md scale-105 ring-2 ring-primary/40"
                      : isPassed
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-semibold"
                      : "bg-muted/40 text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <div className="font-mono text-[10px] flex items-center justify-between">
                    <span>#{step.stepNumber}</span>
                    {isPassed && <Check className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <div className="text-[10px] truncate mt-0.5">
                    {step.telemetry.riskScore}/100
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* MAIN STAGE WORKSPACE: Left Story & Telemetry + Right Dynamic Visual Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Stage Narrative & Real-Time Sensors (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Active Step Narrative Card */}
            <Card className="border bg-card shadow-md">
              <CardHeader className="p-4 pb-2 border-b bg-muted/40">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase">
                    {activeStep.phaseLabel.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    Hunthar Veng, Aizawl
                  </span>
                </div>
                <CardTitle className="text-base font-extrabold text-foreground mt-1">
                  {activeStep.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 space-y-4 text-xs">
                <p className="text-foreground leading-relaxed">
                  {activeStep.description}
                </p>

                {/* Highlighted Physics / Model Trigger */}
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/25 text-foreground leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-700 dark:text-amber-300 font-bold block mb-0.5">
                      Model Activation Trigger:
                    </strong>
                    {activeStep.highlightFactor}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Telemetry Gauges Grid */}
            <Card className="border bg-card shadow-md">
              <CardHeader className="p-4 pb-2 border-b">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Synchronized Telemetry Sensors (Live)
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 space-y-3 text-xs font-mono">
                {/* Hero Hazard Score */}
                <div className="p-3 rounded-xl border bg-background shadow-inner flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-muted-foreground block font-bold">
                      Hazard Index ($LHI$)
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-3xl font-black text-foreground">
                        {activeStep.telemetry.riskScore}
                      </span>
                      <span className="text-muted-foreground">/ 100</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <RiskBadge levelOrScore={activeStep.telemetry.riskScore} showScore={false} size="md" />
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {activeStep.telemetry.trend}
                    </span>
                  </div>
                </div>

                {/* 24h Rain & Soil Moisture */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-lg border bg-muted/40 space-y-1">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <CloudRain className="w-3 h-3 text-blue-500" />
                      24h Rainfall
                    </span>
                    <strong className="text-base text-foreground block">
                      {activeStep.telemetry.rainfall24h} mm
                    </strong>
                    <span className="text-[9px] text-muted-foreground block">
                      (1h: {activeStep.telemetry.rainfall1h} mm/h)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg border bg-muted/40 space-y-1">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-teal-500" />
                      Soil Moisture
                    </span>
                    <strong className="text-base text-foreground block">
                      {activeStep.telemetry.soilMoisturePct}%
                    </strong>
                    <span className="text-[9px] text-muted-foreground block">
                      Pore pressure surge
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Contextual Visual Viewport (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Viewport 1: Field Photo with AI CV Bounding Box (Steps 4 & 5) */}
            {activeStep.fieldReportData || activeStep.visionDetection ? (
              <Card className="border bg-card shadow-xl overflow-hidden animate-in fade-in duration-300">
                <CardHeader className="p-4 border-b bg-muted/40 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    <CardTitle className="text-sm font-bold text-foreground">
                      Field Ground Truth & Edge Computer Vision Detection
                    </CardTitle>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold">
                    CV Inference: 94% Conf
                  </span>
                </CardHeader>

                <CardContent className="p-4 space-y-3 text-xs">
                  {/* Photo with Bounding Box Overlay */}
                  <div className="relative rounded-xl overflow-hidden border bg-black max-h-72 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeStep.fieldReportData?.photoUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80"}
                      alt="Ground crack observation"
                      className="w-full h-full object-cover max-h-64"
                    />

                    {/* Simulated CV Bounding Box */}
                    <div className="absolute top-12 left-1/4 right-1/4 bottom-16 border-2 border-rose-500 bg-rose-500/20 rounded shadow-lg animate-pulse flex flex-col justify-between p-1.5 pointer-events-none">
                      <span className="bg-rose-600 text-white font-mono text-[9px] px-1 py-0.2 rounded font-bold self-start">
                        [CRACK] Transverse Shear (12cm) 94%
                      </span>
                      <span className="bg-black/75 text-rose-300 font-mono text-[9px] px-1 py-0.2 rounded self-end">
                        Severity: CRITICAL (+7.5 pts)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/40 border space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
                      <span>Submitted by: {activeStep.fieldReportData?.reporter || "Inspector L. Sailo"}</span>
                      <span className="font-mono text-muted-foreground">NH-54 milestone 14</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {activeStep.fieldReportData?.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : activeStep.alertPayload ? (
              /* Viewport 2: Emergency Red Alert Broadcast Banner (Step 7) */
              <Card className="border-rose-500/50 bg-rose-500/5 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 animate-bounce">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded bg-rose-600 text-white uppercase">
                      P1 EMERGENCY RED ALERT BROADCAST
                    </span>
                    <h3 className="text-base font-black text-foreground mt-1">
                      {activeStep.alertPayload.title}
                    </h3>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border bg-card/90 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Threat Corridor:</span>
                      <strong className="text-foreground">{activeStep.alertPayload.threatenedRoad}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Vulnerable Population:</span>
                      <strong className="text-foreground">{activeStep.alertPayload.affectedPop.toLocaleString()} residents</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t text-[11px] space-y-1">
                    <strong className="text-foreground block">Autonomous Broadcast Channels:</strong>
                    <div className="flex flex-wrap gap-2 text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[10px]">
                      <span>✓ In-App SDMA Console</span>
                      <span>✓ Multi-Channel SMS Proxy</span>
                      <span>✓ State VHF Relay Standby</span>
                    </div>
                  </div>
                </div>
              </Card>
            ) : activeStep.taskPayload ? (
              /* Viewport 3: P1 Response Task Dispatch Ticket (Step 8) */
              <Card className="border-blue-500/50 bg-blue-500/5 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300">
                        P1 RESPONSE TICKET #DSP-2026-08
                      </span>
                      <h3 className="text-base font-black text-foreground mt-0.5">
                        {activeStep.taskPayload.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40">
                    DEPLOYED
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border bg-card/90 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Assigned Agency:</span>
                      <strong className="text-foreground">{activeStep.taskPayload.agency}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">Mobilized Specialists:</span>
                      <strong className="text-foreground">{activeStep.taskPayload.personnel} Personnel with Excavator</strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t">
                    <span className="font-bold text-foreground block text-[11px]">
                      Mandatory Tactical Directives:
                    </span>
                    <ul className="space-y-1 text-muted-foreground text-[11px]">
                      {activeStep.taskPayload.directives.map((dir, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{dir}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ) : (
              /* Viewport 4: Baseline GIS Map Context (Steps 0–3) */
              <Card className="border bg-card shadow-md p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Geospatial Risk Hotspot (Hunthar Veng Corridor, Aizawl)
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Coordinates: 23.7385° N, 92.7092° E • NH-54 Highway Sector
                    </CardDescription>
                  </div>
                  <RiskBadge levelOrScore={activeStep.telemetry.riskScore} showScore size="sm" />
                </div>

                {/* Tactical Mini GIS Visual Card */}
                <div className="h-64 rounded-xl border bg-slate-950 p-4 relative overflow-hidden flex flex-col justify-between shadow-inner">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293720_1px,transparent_1px),linear-gradient(to_bottom,#1f293720_1px,transparent_1px)] bg-[size:24px_24px]" />

                  {/* Pulsing Hotspot Center */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-2">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-24 h-24 rounded-full bg-rose-500/20 animate-ping" />
                      <span className="absolute w-16 h-16 rounded-full bg-rose-500/35 animate-pulse" />
                      <div className="relative z-10 w-10 h-10 rounded-full bg-rose-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-2xl border-2 border-white">
                        {activeStep.telemetry.riskScore}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-white bg-black/80 px-2 py-0.5 rounded border border-white/20">
                      MZ-AZL-01 (Hunthar Veng Ridge)
                    </span>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Slope: 38.5° | Elev: 1132m</span>
                    <span className="text-rose-400 font-bold">Threat: NH-54 Highway</span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* BOTTOM HACKATHON SUMMARY BAR */}
        <div className="p-4 rounded-xl border bg-muted/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <strong className="text-foreground block">
              Smart India Hackathon 2026 Presentation Ready:
            </strong>
            <span className="text-muted-foreground">
              Deterministic 8-stage operational flow verifying end-to-end data pipelines from meteorological sensors to field response dispatch.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/dashboard">Command Center</Link>
            </Button>
            <Button asChild variant="default" size="sm" className="text-xs gap-1.5 font-bold shadow-md">
              <Link href="/response">
                Open Response Center <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
