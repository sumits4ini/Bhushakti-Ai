"use client";

import dynamic from "next/dynamic";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export const GISMapDynamic = dynamic(
  () => import("./GISMapViewer").then((mod) => mod.GISMapViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[480px] rounded-xl border bg-muted/20 flex items-center justify-center">
        <LoadingSpinner text="Rendering PostGIS Spatial Layers..." />
      </div>
    ),
  }
);
