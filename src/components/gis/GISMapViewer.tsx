"use client";

import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { RiskZone, VulnerableRoad, VulnerableVillage, HistoricalLandslideEvent } from "@/types/geo";
import { FieldReport } from "@/types/fieldReport";
import { Alert } from "@/types/alert";
import { InfrastructureAsset } from "@/lib/gis/geoData";
import { getRiskConfig } from "@/lib/risk/riskStatus";
import { useTheme } from "next-themes";

export interface MapLayersState {
  riskHeatmap: boolean;
  roads: boolean;
  villages: boolean;
  infrastructure: boolean;
  historicalLandslides: boolean;
  fieldReports: boolean;
  alerts: boolean;
}

interface GISMapViewerProps {
  riskZones: RiskZone[];
  roads: VulnerableRoad[];
  villages: VulnerableVillage[];
  infrastructure: InfrastructureAsset[];
  historicalLandslides: HistoricalLandslideEvent[];
  fieldReports: FieldReport[];
  alerts: Alert[];
  layers: MapLayersState;
  selectedZoneId?: string;
  onSelectZone: (zoneId: string) => void;
  flyToCoords?: { lat: number; lng: number; zoom: number } | null;
  className?: string;
}

export function GISMapViewer({
  riskZones,
  roads,
  villages,
  infrastructure,
  historicalLandslides,
  fieldReports,
  alerts,
  layers,
  selectedZoneId,
  onSelectZone,
  flyToCoords,
  className,
}: GISMapViewerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layerGroupsRef = useRef<{
    riskZones: L.LayerGroup;
    roads: L.LayerGroup;
    villages: L.LayerGroup;
    infrastructure: L.LayerGroup;
    historical: L.LayerGroup;
    fieldReports: L.LayerGroup;
    alerts: L.LayerGroup;
  }>({
    riskZones: L.layerGroup(),
    roads: L.layerGroup(),
    villages: L.layerGroup(),
    infrastructure: L.layerGroup(),
    historical: L.layerGroup(),
    fieldReports: L.layerGroup(),
    alerts: L.layerGroup(),
  });

  const { theme } = useTheme();
  const [mapReady, setMapReady] = useState(false);

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Fix default Leaflet icon paths
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map(mapContainerRef.current, {
      center: [25.5788, 91.8933], // Shillong / Central NER
      zoom: 7,
      zoomControl: false,
      attributionControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Initial tile layer (CartoDB Dark / Voyager)
    const isDark = document.documentElement.classList.contains("dark");
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 18,
      subdomains: "abcd",
    }).addTo(map);

    tileLayerRef.current = tiles;

    // Add all layer groups to map
    Object.values(layerGroupsRef.current).forEach((group) => {
      group.addTo(map);
    });

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Update Tiles on Theme Change
  useEffect(() => {
    if (!tileLayerRef.current || !mapInstanceRef.current) return;
    const isDark = theme === "dark" || document.documentElement.classList.contains("dark");
    const tileUrl = isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

    tileLayerRef.current.setUrl(tileUrl);
  }, [theme]);

  // 3. Handle FlyTo
  useEffect(() => {
    if (!mapInstanceRef.current || !flyToCoords) return;
    mapInstanceRef.current.flyTo(
      [flyToCoords.lat, flyToCoords.lng],
      flyToCoords.zoom,
      { duration: 1.5 }
    );
  }, [flyToCoords]);

  // 4. Render Layers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapReady) return;
    const groups = layerGroupsRef.current;

    // --- A. RISK ZONES LAYER ---
    groups.riskZones.clearLayers();
    if (layers.riskHeatmap) {
      riskZones.forEach((zone) => {
        const config = getRiskConfig(zone.currentRiskScore);
        const isSelected = zone.id === selectedZoneId;

        // Custom HTML marker with score badge & pulse ring
        const isCritical = zone.currentRiskLevel === "CRITICAL";
        const isHigh = zone.currentRiskLevel === "HIGH";

        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer group">
            ${
              isCritical
                ? `<span class="absolute w-12 h-12 rounded-full bg-rose-500/30 animate-ping"></span>
                   <span class="absolute w-8 h-8 rounded-full bg-rose-500/50 animate-pulse"></span>`
                : isHigh
                ? `<span class="absolute w-9 h-9 rounded-full bg-orange-500/25 animate-pulse"></span>`
                : ""
            }
            <div class="relative z-10 flex items-center justify-center px-2 py-0.5 rounded-full border shadow-lg font-mono font-bold text-xs transition-transform duration-200 ${
              isSelected ? "scale-125 ring-2 ring-white" : "hover:scale-110"
            }" style="background-color: ${config.accentColor}; color: #ffffff; border-color: ${
          isSelected ? "#ffffff" : "rgba(255,255,255,0.7)"
        }; box-shadow: 0 0 14px ${config.accentColor}99;">
              <span class="text-[10px] mr-1">${zone.currentRiskLevel === "CRITICAL" ? "🔴" : "⚠️"}</span>
              <span>${Math.round(zone.currentRiskScore)}</span>
            </div>
            <div class="absolute -bottom-4 whitespace-nowrap px-1.5 py-0.2 rounded bg-black/85 text-[10px] font-sans font-semibold text-white border border-white/20 pointer-events-none">
              ${zone.name.split(" ")[0]}
            </div>
          </div>
        `;

        const markerIcon = L.divIcon({
          html: iconHtml,
          className: "custom-risk-marker",
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        const marker = L.marker([zone.center.latitude, zone.center.longitude], {
          icon: markerIcon,
        });

        // Popup
        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; min-width: 220px; padding: 4px;">
            <div style="font-weight: 800; font-size: 13px; color: ${config.accentColor}; margin-bottom: 2px;">
              ${zone.name}
            </div>
            <div style="font-size: 10px; color: #888; margin-bottom: 8px;">
              ${zone.districtName}, ${zone.state} • ${zone.zoneCode}
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-top: 1px solid #eee;">
              <span>Hazard Score:</span>
              <strong style="color: ${config.accentColor};">${Math.round(zone.currentRiskScore)} / 100 (${zone.currentRiskLevel})</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-top: 1px solid #eee;">
              <span>Slope Angle:</span>
              <strong>${zone.slopeAngleDeg}°</strong>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 4px 0; border-top: 1px solid #eee;">
              <span>Threat Corridor:</span>
              <strong>${zone.primaryThreatCorridor}</strong>
            </div>
            <div style="margin-top: 8px; text-align: center;">
              <span style="display: inline-block; font-size: 10px; background: #2563eb; color: #fff; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                Click marker to inspect in Command Drawer
              </span>
            </div>
          </div>
        `);

        marker.on("click", () => {
          onSelectZone(zone.id);
        });

        marker.addTo(groups.riskZones);

        // Circular risk radius buffer on map
        L.circle([zone.center.latitude, zone.center.longitude], {
          radius: isCritical ? 3500 : isHigh ? 2500 : 1500,
          color: config.accentColor,
          fillColor: config.accentColor,
          fillOpacity: isCritical ? 0.18 : 0.12,
          weight: 1.5,
          dashArray: isCritical ? "4, 4" : undefined,
        }).addTo(groups.riskZones);
      });
    }

    // --- B. ROADS & CORRIDORS LAYER ---
    groups.roads.clearLayers();
    if (layers.roads) {
      roads.forEach((road) => {
        const latlngs = road.coordinates.map((c) => [c.latitude, c.longitude] as [number, number]);
        const polyline = L.polyline(latlngs, {
          color: road.isBlocked ? "#ef4444" : "#3b82f6",
          weight: road.isBlocked ? 5 : 3.5,
          dashArray: road.isBlocked ? "6, 6" : undefined,
          opacity: 0.9,
        });

        polyline.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 2px;">
            <strong>${road.roadName}</strong> (${road.code})<br/>
            <span style="color: ${road.isBlocked ? "#ef4444" : "#10b981"}; font-weight: bold;">
              ${road.isBlocked ? "⚠️ HAZARD / BLOCKED" : "✓ CLEAR / PASSABLE"}
            </span><br/>
            ${road.blockageReason ? `<p style="font-size: 11px; margin-top: 4px; color: #555;">${road.blockageReason}</p>` : ""}
          </div>
        `);

        polyline.addTo(groups.roads);
      });
    }

    // --- C. VILLAGES & SETTLEMENTS LAYER ---
    groups.villages.clearLayers();
    if (layers.villages) {
      villages.forEach((v) => {
        const iconHtml = `
          <div class="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border border-slate-400 text-white text-[10px] shadow" title="${v.name} (${v.population.toLocaleString()} pop)">
            🏘️
          </div>
        `;
        const icon = L.divIcon({ html: iconHtml, className: "village-marker", iconSize: [24, 24] });
        const marker = L.marker([v.location.latitude, v.location.longitude], { icon });
        marker.bindPopup(`
          <div style="font-size: 12px;">
            <strong>${v.name} Settlement</strong><br/>
            Population: <strong>${v.population.toLocaleString()}</strong> (${v.households} households)<br/>
            Vulnerability Tier: <strong style="color: #ef4444;">${v.vulnerabilityTier}</strong>
          </div>
        `);
        marker.addTo(groups.villages);
      });
    }

    // --- D. INFRASTRUCTURE LAYER ---
    groups.infrastructure.clearLayers();
    if (layers.infrastructure) {
      infrastructure.forEach((inf) => {
        const iconHtml = `
          <div class="flex items-center justify-center w-6 h-6 rounded bg-blue-900 border border-blue-400 text-white text-[11px] shadow" title="${inf.name}">
            ${inf.category === "BRIDGE" ? "🌉" : inf.category === "TELECOM_TOWER" ? "📡" : "⚡"}
          </div>
        `;
        const icon = L.divIcon({ html: iconHtml, className: "infra-marker", iconSize: [24, 24] });
        const marker = L.marker([inf.location.latitude, inf.location.longitude], { icon });
        marker.bindPopup(`
          <div style="font-size: 12px;">
            <strong>${inf.name}</strong><br/>
            Category: ${inf.category}<br/>
            Status: <strong style="color: ${inf.status === "OPERATIONAL" ? "#10b981" : "#ef4444"};">${inf.status}</strong><br/>
            <p style="font-size: 11px; margin-top: 4px;">${inf.details}</p>
          </div>
        `);
        marker.addTo(groups.infrastructure);
      });
    }

    // --- E. HISTORICAL LANDSLIDES LAYER ---
    groups.historical.clearLayers();
    if (layers.historicalLandslides) {
      historicalLandslides.forEach((hist) => {
        const iconHtml = `
          <div class="flex items-center justify-center w-6 h-6 rounded-full bg-amber-950 border border-amber-500 text-amber-300 text-[10px] shadow" title="Historical Slide: ${hist.locationName}">
            📜
          </div>
        `;
        const icon = L.divIcon({ html: iconHtml, className: "hist-marker", iconSize: [24, 24] });
        const marker = L.marker([hist.coordinates.latitude, hist.coordinates.longitude], { icon });
        marker.bindPopup(`
          <div style="font-size: 12px;">
            <strong style="color: #d97706;">GSI Historical Event: ${hist.locationName}</strong><br/>
            Date: <strong>${hist.incidentDate}</strong> • Severity: <strong>${hist.severity}</strong><br/>
            Fatalities: <strong>${hist.fatalities}</strong> | Displaced: <strong>${hist.displacedCount}</strong><br/>
            <p style="font-size: 11px; margin-top: 4px; color: #555;">${hist.triggerFactor}</p>
          </div>
        `);
        marker.addTo(groups.historical);
      });
    }

    // --- F. FIELD REPORTS LAYER ---
    groups.fieldReports.clearLayers();
    if (layers.fieldReports) {
      fieldReports.forEach((rep) => {
        const iconHtml = `
          <div class="flex items-center justify-center w-6 h-6 rounded-full bg-purple-900 border-2 border-purple-400 text-white text-[10px] shadow animate-pulse" title="Field Report: ${rep.reportType}">
            📷
          </div>
        `;
        const icon = L.divIcon({ html: iconHtml, className: "report-marker", iconSize: [24, 24] });
        const marker = L.marker([rep.location.latitude, rep.location.longitude], { icon });
        marker.bindPopup(`
          <div style="font-size: 12px;">
            <strong style="color: #9333ea;">Field Ground Truth: ${rep.reportType}</strong><br/>
            Submitted by: <strong>${rep.reporterName}</strong> (${rep.reporterRole})<br/>
            Status: <strong>${rep.status}</strong><br/>
            <p style="font-size: 11px; margin-top: 4px;">${rep.description}</p>
          </div>
        `);
        marker.addTo(groups.fieldReports);
      });
    }

    // --- G. ACTIVE ALERTS LAYER ---
    groups.alerts.clearLayers();
    if (layers.alerts) {
      alerts.forEach((alt) => {
        const iconHtml = `
          <div class="flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 border-2 border-white text-white font-bold text-xs shadow-lg shadow-rose-600/50 animate-bounce" title="${alt.title}">
            🚨
          </div>
        `;
        const icon = L.divIcon({ html: iconHtml, className: "alert-marker", iconSize: [28, 28] });
        const marker = L.marker([alt.locationPoint.latitude, alt.locationPoint.longitude], { icon });
        marker.bindPopup(`
          <div style="font-size: 12px;">
            <strong style="color: #e11d48;">🚨 ${alt.title}</strong><br/>
            Priority: <strong>${alt.responsePriority}</strong> | Affected Pop: <strong>${alt.affectedPopulationEstimate.toLocaleString()}</strong><br/>
            <p style="font-size: 11px; margin-top: 4px;">${alt.triggerReason}</p>
          </div>
        `);
        marker.addTo(groups.alerts);
      });
    }
  }, [
    mapReady,
    layers,
    riskZones,
    roads,
    villages,
    infrastructure,
    historicalLandslides,
    fieldReports,
    alerts,
    selectedZoneId,
    onSelectZone,
  ]);

  return (
    <div className={`relative w-full h-full min-h-[480px] rounded-xl overflow-hidden ${className || ""}`}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {!mapReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-xs">
          <div className="text-xs font-mono font-semibold text-muted-foreground animate-pulse">
            Initializing PostGIS Vector Viewport...
          </div>
        </div>
      )}
    </div>
  );
}
