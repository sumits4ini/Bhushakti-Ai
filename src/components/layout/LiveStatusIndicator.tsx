"use client";

import React, { useState, useEffect } from "react";
import { Radio, AlertOctagon } from "lucide-react";
import Link from "next/link";

export function LiveStatusIndicator() {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Live Ingestion Feed Pill */}
      <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono">
        <span
          className={`w-2 h-2 rounded-full bg-emerald-500 transition-opacity duration-700 ${
            pulse ? "opacity-100 scale-110" : "opacity-40 scale-90"
          }`}
        />
        <Radio className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        <span className="font-semibold">TELEMETRY LIVE</span>
        <span className="text-[10px] opacity-75 hidden xl:inline">IMD/ISRO</span>
      </div>

      {/* Active Critical Alerts Notice */}
      <Link
        href="/alerts"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-300 font-bold hover:bg-rose-500/25 transition-all shadow-[0_0_8px_rgba(244,63,94,0.2)]"
      >
        <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
        <span>2 CRITICAL ALERTS</span>
      </Link>
    </div>
  );
}
