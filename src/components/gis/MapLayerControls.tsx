"use client";

import React, { useState } from "react";
import { Layers, Check, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapLayersState } from "./GISMapViewer";

interface MapLayerControlsProps {
  layers: MapLayersState;
  onToggleLayer: (layerKey: keyof MapLayersState) => void;
}

export function MapLayerControls({ layers, onToggleLayer }: MapLayerControlsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const layerOptions: { key: keyof MapLayersState; label: string; icon: string; badgeColor: string }[] = [
    { key: "riskHeatmap", label: "Risk Heatmap & Hotspots", icon: "🔴", badgeColor: "text-rose-500" },
    { key: "roads", label: "Highway Corridors (NH-54 / NH-10)", icon: "🛣️", badgeColor: "text-blue-500" },
    { key: "villages", label: "Villages & Settlements", icon: "🏘️", badgeColor: "text-slate-400" },
    { key: "infrastructure", label: "Critical Infrastructure", icon: "🏗️", badgeColor: "text-amber-500" },
    { key: "historicalLandslides", label: "GSI Historical Landslides", icon: "📜", badgeColor: "text-yellow-600" },
    { key: "fieldReports", label: "Ground Truth Field Reports", icon: "📷", badgeColor: "text-purple-500" },
    { key: "alerts", label: "Active Red / Orange Alerts", icon: "🚨", badgeColor: "text-rose-600" },
  ];

  return (
    <div className="absolute top-3 right-3 z-[1000]">
      <div className="bg-card/95 backdrop-blur-md border border-border/80 rounded-lg shadow-xl overflow-hidden transition-all text-xs">
        {/* Toggle Header Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-2 px-3 py-2 w-full hover:bg-accent/50 font-bold text-foreground"
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>GIS Map Layers</span>
          </div>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {/* Expanded Layer Toggles */}
        {isOpen && (
          <div className="p-2 border-t space-y-1 w-64 max-h-72 overflow-y-auto">
            {layerOptions.map((opt) => {
              const isActive = layers[opt.key];
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => onToggleLayer(opt.key)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
                    isActive ? "bg-accent/80 font-semibold text-foreground" : "text-muted-foreground hover:bg-accent/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{opt.icon}</span>
                    <span className="text-[11px] truncate max-w-[150px]">{opt.label}</span>
                  </div>
                  {isActive ? (
                    <Eye className="w-3.5 h-3.5 text-primary" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-muted-foreground opacity-50" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
