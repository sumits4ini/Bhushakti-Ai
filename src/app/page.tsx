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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_CONFIG } from "@/lib/config/site";
import { PageShell } from "@/components/layout/PageShell";
import { RiskBadge } from "@/components/common/RiskBadge";

export default function LandingPage() {
  const pillars = [
    {
      question: "WHERE is the risk?",
      title: "GIS Spatial Intelligence",
      description:
        "PostGIS-powered interactive multi-layer mapping covering critical highway corridors (NH-54, NH-10), vulnerable settlements, and high-slope risk zones across all 8 NER states.",
      icon: <Map className="w-5 h-5 text-blue-500" />,
      badge: "Spatial PostGIS",
    },
    {
      question: "WHY is the risk increasing?",
      title: "Explainable AI Risk Fusion",
      description:
        "Transparent factor breakdown combining 1h/6h/24h/72h rainfall deluge, soil saturation, slope angle, geological fault lines, and historical susceptibility into a 0–100 Hazard Index.",
      icon: <BrainCircuit className="w-5 h-5 text-amber-500" />,
      badge: "SHAP-Style Attribution",
    },
    {
      question: "WHEN could it become critical?",
      title: "24-Hour Predictive Forecast",
      description:
        "Dynamic predictive trajectory mapping risk curves at +3h, +6h, +12h, and +24h to give disaster management authorities actionable lead-time before slope collapse.",
      icon: <CloudRain className="w-5 h-5 text-purple-500" />,
      badge: "Early Warning",
    },
    {
      question: "WHAT should authorities do?",
      title: "Response Prioritization (P1–P4)",
      description:
        "Automated emergency task generator ranking action urgency based on population impact, lifeline road importance, and geotechnical hazard severity.",
      icon: <ShieldAlert className="w-5 h-5 text-rose-500" />,
      badge: "P1 to P4 Dispatch",
    },
  ];

  return (
    <PageShell showSidebar={false}>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-background via-background/90 to-muted/30 py-16 sm:py-24">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-primary via-blue-600 to-rose-600 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Government & Hackathon Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>SIH26001</span>
              <span className="text-muted-foreground">•</span>
              <span>{APP_CONFIG.ministry}</span>
            </div>

            {/* Main Title */}
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground">
                <span className="bg-gradient-to-r from-primary via-blue-600 to-amber-600 bg-clip-text text-transparent">
                  BHUSHAKTI AI
                </span>
                <span className="block text-2xl sm:text-4xl font-extrabold mt-1 text-foreground/90">
                  AI-Powered Landslide Early Warning & Risk Intelligence
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                From environmental signals to actionable warnings — helping disaster authorities and North Eastern communities act before disaster strikes.
              </p>
            </div>

            {/* Quick Live Hazard Telemetry Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 p-2 rounded-xl bg-card border shadow-sm max-w-xl text-xs">
              <span className="font-mono text-muted-foreground flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-500" />
                Live NER Hotspots:
              </span>
              <RiskBadge levelOrScore={87} showScore size="sm" />
              <span className="font-semibold text-foreground">Aizawl (Hunthar)</span>
              <span className="text-muted-foreground">•</span>
              <RiskBadge levelOrScore={92} showScore size="sm" />
              <span className="font-semibold text-foreground">Gangtok (NH-10)</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Button asChild size="lg" className="gap-2 font-semibold shadow-lg shadow-primary/20">
                <Link href="/dashboard">
                  <Mountain className="w-4 h-4" />
                  Open Command Center
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 font-medium">
                <Link href="/map">
                  <Map className="w-4 h-4 text-blue-500" />
                  Explore GIS Map
                </Link>
              </Button>
              <Button asChild variant="critical" size="lg" className="gap-2 font-medium">
                <Link href="/field-report">
                  <Camera className="w-4 h-4" />
                  Citizen / Field Report
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Decision Pillars Section */}
      <section className="py-16 bg-card/50 border-b">
        <div className="container mx-auto px-4 max-w-6xl space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              A Decision-Support Engine, Not a Generic Dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              BHUSHAKTI AI continuously synthesizes multi-source telemetry into clear, explainable answers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <Card key={idx} className="border-border/80 hover:border-primary/50 transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-muted">{pillar.icon}</div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {pillar.badge}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    {pillar.question}
                  </div>
                  <CardTitle className="text-base font-bold text-foreground">
                    {pillar.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pillar.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Focus: 8 NER States */}
      <section className="py-14 bg-background border-b">
        <div className="container mx-auto px-4 max-w-6xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                North Eastern Region Geohazard Coverage
              </h3>
              <p className="text-xs text-muted-foreground">
                Monitoring high-precipitation zones across all 8 Sister States under MDoNER purview.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-1.5">
              <Link href="/risk">
                <BrainCircuit className="w-3.5 h-3.5" />
                View Risk Model
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {APP_CONFIG.nerStates.map((state) => (
              <div
                key={state}
                className="flex items-center gap-2.5 p-3 rounded-lg border bg-card text-xs font-medium text-foreground hover:border-primary/40 transition-colors"
              >
                <Compass className="w-4 h-4 text-primary shrink-0" />
                <span>{state}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-muted/40 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 space-y-2">
          <div className="font-semibold text-foreground">
            {APP_CONFIG.name} — {APP_CONFIG.fullTitle}
          </div>
          <p>
            Smart India Hackathon 2026 • Problem Statement: SIH26001 • {APP_CONFIG.ministry}
          </p>
          <p className="text-[11px] opacity-75">
            Prototype Decision Support Platform. Thresholds and predictions are simulated for demonstration.
          </p>
        </div>
      </footer>
    </PageShell>
  );
}
