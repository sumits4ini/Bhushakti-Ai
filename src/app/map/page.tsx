import React from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/common/RiskBadge";
import { Map, Layers, Filter, Compass, AlertCircle, Eye } from "lucide-react";
import { MOCK_RISK_ZONES, MOCK_DISTRICTS } from "@/lib/demo";

export default function MapPage() {
  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                GIS Landslide Risk Map
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-mono font-semibold">
                PostGIS Ready
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Interactive multi-layer spatial risk heatmap, road corridors, and settlement vulnerability
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Layers className="w-3.5 h-3.5" />
              Layer Toggles
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5" />
              District Filter
            </Button>
          </div>
        </div>

        {/* Map Viewport Shell */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Map Container */}
          <div className="lg:col-span-3 rounded-xl border bg-card/60 overflow-hidden shadow-inner flex flex-col min-h-[520px]">
            {/* Map Toolbar */}
            <div className="p-3 border-b bg-muted/40 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-foreground flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-primary" />
                  NER VIEWPORT: 25.5788° N, 91.8933° E
                </span>
                <span className="text-muted-foreground hidden sm:inline">•</span>
                <span className="text-muted-foreground hidden sm:inline">Zoom: Level 7</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] text-muted-foreground font-mono">Heatmap Active</span>
              </div>
            </div>

            {/* Map Visual Area Placeholder Shell (Phase 4 will attach dynamic Leaflet/MapLibre) */}
            <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
              {/* Tactical Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />

              <div className="relative z-10 max-w-md space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <Map className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    GIS Spatial Viewport Initialized
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Connecting to PostGIS Vector Tile Pipeline. Full Leaflet GIS mapping canvas will render in Phase 4 with interactive heatmap layers for all 8 NER states.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    8 Districts Registered
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    12 Hotspots Indexed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Selected Zone Telemetry Panel */}
          <Card className="border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-foreground">
                  Zone Intelligence
                </CardTitle>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </div>
              <CardDescription className="text-xs">
                Inspecting active high-risk coordinate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              <div className="p-3 rounded-lg border bg-rose-500/10 border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">Hunthar Veng (Aizawl)</span>
                  <RiskBadge levelOrScore={87} showScore size="sm" />
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  NH-54 Silchar-Aizawl Corridor
                </div>
              </div>

              <div className="space-y-2 font-mono">
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">24h Rainfall:</span>
                  <span className="font-bold text-foreground">118.5 mm</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Soil Saturation:</span>
                  <span className="font-bold text-foreground">84.5%</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">Slope Gradient:</span>
                  <span className="font-bold text-foreground">38.5°</span>
                </div>
                <div className="flex justify-between py-1 border-b">
                  <span className="text-muted-foreground">AI Confidence:</span>
                  <span className="font-bold text-foreground">91%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Historical Events:</span>
                  <span className="font-bold text-foreground">8 in 5km</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-muted/60 text-[11px] space-y-1">
                <div className="font-semibold text-foreground flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Recommended Action:
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Restrict heavy transit on NH-54; deploy SDRF crack monitoring team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
