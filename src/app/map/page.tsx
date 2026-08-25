"use client";

import React, { useState, useEffect } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { GISMapDynamic } from "@/components/gis/GISMapDynamic";
import { MapLayerControls } from "@/components/gis/MapLayerControls";
import { DistrictSelector } from "@/components/gis/DistrictSelector";
import { ZoneDetailPanel } from "@/components/gis/ZoneDetailPanel";
import { MapLayersState } from "@/components/gis/GISMapViewer";
import { EXTENDED_RISK_ZONES, EXTENDED_INFRASTRUCTURE, NER_DISTRICT_BOUNDS } from "@/lib/gis/geoData";
import { MOCK_ROADS, MOCK_VILLAGES, MOCK_HISTORICAL_EVENTS } from "@/lib/demo";
import { reportRepository } from "@/services/reportRepository";
import { alertRepository } from "@/services/alertRepository";
import { FieldReport } from "@/types/fieldReport";
import { Alert } from "@/types/alert";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, PanelRightClose, PanelRightOpen, Layers } from "lucide-react";

export default function MapPage() {
  const [selectedDistrictKey, setSelectedDistrictKey] = useState("all");
  const [selectedZoneId, setSelectedZoneId] = useState<string>("zone-aizawl-hunthar");
  const [flyToCoords, setFlyToCoords] = useState<{ lat: number; lng: number; zoom: number } | null>(null);
  const [showSidePanel, setShowSidePanel] = useState(true);

  const [layers, setLayers] = useState<MapLayersState>({
    riskHeatmap: true,
    roads: true,
    villages: true,
    infrastructure: true,
    historicalLandslides: true,
    fieldReports: true,
    alerts: true,
  });

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [reports, setReports] = useState<FieldReport[]>([]);

  useEffect(() => {
    async function loadData() {
      const [alts, reps] = await Promise.all([
        alertRepository.getActive(),
        reportRepository.getAll(),
      ]);
      setAlerts(alts);
      setReports(reps);
    }
    loadData();
  }, []);

  const handleToggleLayer = (key: keyof MapLayersState) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectDistrict = (key: string) => {
    setSelectedDistrictKey(key);
    const bounds = NER_DISTRICT_BOUNDS[key];
    if (bounds) {
      setFlyToCoords({ lat: bounds.lat, lng: bounds.lng, zoom: bounds.zoom });
    }
  };

  const handleSelectZone = (zoneId: string) => {
    setSelectedZoneId(zoneId);
    setShowSidePanel(true);
    const zone = EXTENDED_RISK_ZONES.find((z) => z.id === zoneId);
    if (zone) {
      setFlyToCoords({
        lat: zone.center.latitude,
        lng: zone.center.longitude,
        zoom: 12,
      });
    }
  };

  const selectedZone = EXTENDED_RISK_ZONES.find((z) => z.id === selectedZoneId) || EXTENDED_RISK_ZONES[0];

  return (
    <PageShell>
      <div className="h-[calc(100vh-4rem)] w-full flex flex-col overflow-hidden relative">
        {/* Top Floating GIS Toolbar */}
        <div className="absolute top-4 left-4 z-[1000] flex flex-wrap items-center gap-2">
          <DistrictSelector
            selectedKey={selectedDistrictKey}
            onSelectDistrict={handleSelectDistrict}
          />

          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs gap-1.5 bg-card/90 backdrop-blur-sm border-border/80 shadow-md text-foreground"
            onClick={() => setShowSidePanel(!showSidePanel)}
          >
            {showSidePanel ? (
              <>
                <PanelRightClose className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hide Intelligence Panel</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Show Intelligence Panel</span>
              </>
            )}
          </Button>
        </div>

        {/* Floating Layer Controls (Top Right) */}
        <MapLayerControls layers={layers} onToggleLayer={handleToggleLayer} />

        {/* GIS Viewport & Intelligence Drawer */}
        <div className="flex-1 w-full h-full flex overflow-hidden relative">
          {/* Main Map Viewport */}
          <div className="flex-1 h-full relative">
            <GISMapDynamic
              riskZones={EXTENDED_RISK_ZONES}
              roads={MOCK_ROADS}
              villages={MOCK_VILLAGES}
              infrastructure={EXTENDED_INFRASTRUCTURE}
              historicalLandslides={MOCK_HISTORICAL_EVENTS}
              fieldReports={reports}
              alerts={alerts}
              layers={layers}
              selectedZoneId={selectedZoneId}
              onSelectZone={handleSelectZone}
              flyToCoords={flyToCoords}
              className="w-full h-full"
            />
          </div>

          {/* Collapsible Intelligence Side Drawer */}
          {showSidePanel && (
            <div className="w-full sm:w-96 md:w-[420px] h-full z-[1000] shadow-2xl transition-all duration-300">
              <ZoneDetailPanel
                zone={selectedZone}
                onClose={() => setShowSidePanel(false)}
              />
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
