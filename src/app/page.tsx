import React from "react";
import Link from "next/link";
import {
  Mountain,
  ShieldAlert,
  BrainCircuit,
  Map,
  Camera,
  Activity,
  ArrowRight,
  ShieldCheck,
  Radio,
  CheckCircle2,
  CloudRain,
  Compass,
  Flame,
  Zap,
  Sparkles,
  Layers,
  Users,
  Eye,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG } from "@/lib/config/site";
import { PageShell } from "@/components/layout/PageShell";
import { RiskBadge } from "@/components/common/RiskBadge";

export default function LandingPage() {
  const steps = [
    {
      num: "01",
      title: "The Problem (SIH26001)",
      desc: "North Eastern Region suffers recurring devastating landslides triggered by monsoonal cloudbursts, cutting off vital lifeline highways (NH-54, NH-10) and isolating hill communities.",
      icon: <Mountain className="w-5 h-5 text-rose-500" />,
      badge: "MDoNER Focus",
    },
    {
      num: "02",
      title: "The Solution",
      desc: "BHUSHAKTI AI provides continuous multi-source hazard fusion combining rainfall telemetry, geotechnical saturation, slope gradients, and historical GSI landslide clusters into actionable early warnings.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      badge: "Real-Time Early Warning",
    },
    {
      num: "03",
      title: "Explainable AI Engine",
      desc: "Transparent SHAP-style attribution breaks down exactly WHY risk is high (+29 pts rainfall, +24 pts soil moisture, +18 pts slope angle) so SDMA authorities make confident, audit-ready decisions.",
      icon: <BrainCircuit className="w-5 h-5 text-purple-500" />,
      badge: "SHAP Explainability",
    },
    {
      num: "04",
      title: "GIS Command Center",
      desc: "Interactive spatial map with 7 vector layers tracking risk hotspots, highway corridors, critical infrastructure, vulnerable settlements, and active red alert perimeters in real time.",
      icon: <Map className="w-5 h-5 text-blue-500" />,
      badge: "PostGIS WGS84",
    },
    {
      num: "05",
      title: "Field Intelligence & Edge CV",
      desc: "Mobile-first offline reporting empowers patrol officers and citizens to capture photo evidence. Edge Computer Vision automatically extracts tension cracks and carriageway blockages.",
      icon: <Camera className="w-5 h-5 text-amber-500" />,
      badge: "Edge Vision Inspection",
    },
    {
      num: "06",
      title: "Autonomous Action Matrix",
      desc: "From hazard spike to tactical response: automated P1–P4 tickets assigned to SDRF 1st Bn and BRO Highway Wing with operational directives (earthmover mobilization, traffic diversion).",
      icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
      badge: "P1 SDRF Dispatch",
    },
  ];

  return (
    <PageShell showSidebar={false}>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-background via-card/50 to-muted/20 py-16 sm:py-24">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-25 pointer-events-none">
          <div className="w-[640px] h-[640px] rounded-full bg-gradient-to-tr from-primary/60 via-blue-700/40 to-rose-600/30 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Government & Hackathon Identity Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-bold">SIH26001</span>
              <span className="text-muted-foreground">•</span>
              <span>{APP_CONFIG.ministry}</span>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <span className="hidden sm:inline">Disaster Management</span>
            </div>

            {/* Main Title & Value Proposition */}
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground">
                <span className="bg-gradient-to-r from-blue-400 via-primary to-amber-500 bg-clip-text text-transparent">
                  BHUSHAKTI AI
                </span>
                <span className="block text-2xl sm:text-4xl font-extrabold mt-1 text-foreground">
                  AI Landslide Early Warning & Risk Intelligence Platform
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                From environmental telemetry to tactical response — an explainable decision-support system designed for the North Eastern Region.
              </p>
            </div>

            {/* Live Hotspot Telemetry Pill */}
            <div className="flex flex-wrap items-center justify-center gap-3 p-2.5 rounded-xl bg-card/90 border border-border/80 shadow-md max-w-2xl text-xs font-mono">
              <span className="text-muted-foreground flex items-center gap-1.5 font-bold">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                Active NER Corridors:
              </span>
              <div className="flex items-center gap-1.5">
                <RiskBadge levelOrScore={87} showScore size="sm" />
                <span className="font-semibold text-foreground">Aizawl (NH-54)</span>
              </div>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1.5">
                <RiskBadge levelOrScore={92} showScore size="sm" />
                <span className="font-semibold text-foreground">Gangtok (NH-10)</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              <Button asChild size="lg" className="gap-2 font-bold shadow-lg shadow-primary/20 text-sm h-11 px-5">
                <Link href="/dashboard">
                  <Mountain className="w-4 h-4" />
                  Open Command Center
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button asChild variant="default" size="lg" className="gap-2 font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 text-sm h-11 px-5">
                <Link href="/simulation">
                  <Flame className="w-4 h-4 fill-current" />
                  Live Disaster Simulation
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="gap-2 font-semibold text-sm h-11 px-4">
                <Link href="/field-report">
                  <Camera className="w-4 h-4 text-primary" />
                  Field Report App
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6-Step End-to-End Operational Architecture */}
      <section className="py-16 bg-card/40 border-b border-border/80">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              How BHUSHAKTI AI Works: Signal to Action
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              A comprehensive decision-support pipeline built specifically for MDoNER disaster management authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {steps.map((step, idx) => (
              <Card key={idx} className="border border-border/80 bg-card hover:border-primary/50 transition-all hover:shadow-md">
                <CardHeader className="p-5 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-muted/60 border border-border/60">
                      {step.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {step.badge}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-muted-foreground">
                    STEP {step.num}
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 pt-2">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* NER 8-State Coverage Matrix */}
      <section className="py-14 bg-background border-b border-border/80">
        <div className="container mx-auto px-4 max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                North Eastern Region Geohazard Registry
              </h3>
              <p className="text-xs text-muted-foreground">
                Continuous telemetry monitoring across all 8 Sister States under MDoNER purview.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <Link href="/risk">
                <BrainCircuit className="w-3.5 h-3.5 text-primary" />
                Explainable Risk Engine
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            {APP_CONFIG.nerStates.map((state) => (
              <div
                key={state}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 bg-card text-xs font-semibold text-foreground hover:border-primary/40 transition-colors"
              >
                <Compass className="w-4 h-4 text-primary shrink-0" />
                <span>{state}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer & Transparency Disclaimer */}
      <footer className="py-8 bg-muted/20 text-center text-xs text-muted-foreground border-t border-border/60">
        <div className="container mx-auto px-4 space-y-2">
          <div className="font-bold text-foreground">
            {APP_CONFIG.name} — {APP_CONFIG.fullTitle}
          </div>
          <p>
            Smart India Hackathon 2026 • Problem Statement: SIH26001 • {APP_CONFIG.ministry}
          </p>
          <p className="text-[11px] opacity-75 font-mono">
            Prototype Decision Support Platform. Meteorological telemetry and computer vision inference are calibrated for demonstration purposes.
          </p>
        </div>
      </footer>
    </PageShell>
  );
}
