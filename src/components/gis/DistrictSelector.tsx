"use client";

import React from "react";
import { Compass, ChevronDown } from "lucide-react";
import { NER_DISTRICT_BOUNDS } from "@/lib/gis/geoData";

interface DistrictSelectorProps {
  selectedKey: string;
  onSelectDistrict: (key: string) => void;
}

export function DistrictSelector({ selectedKey, onSelectDistrict }: DistrictSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm p-1 rounded-lg border border-border/80 text-xs shadow-md">
      <Compass className="w-3.5 h-3.5 text-primary ml-1.5 shrink-0" />
      <select
        value={selectedKey}
        onChange={(e) => onSelectDistrict(e.target.value)}
        className="bg-transparent font-semibold text-foreground focus:outline-none cursor-pointer py-1 pr-2 text-xs"
        aria-label="Focus District Viewport"
      >
        {Object.entries(NER_DISTRICT_BOUNDS).map(([key, item]) => (
          <option key={key} value={key} className="bg-popover text-popover-foreground">
            {item.name} ({item.state})
          </option>
        ))}
      </select>
    </div>
  );
}
