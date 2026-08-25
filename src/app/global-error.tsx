"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 bg-slate-900 border border-rose-500/40 rounded-xl text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100">
            Critical System Halt
          </h2>
          <p className="text-xs text-slate-400">
            A root-level exception halted the BHUSHAKTI AI runtime.
          </p>
          <pre className="p-3 bg-slate-950 rounded text-left text-xs font-mono text-rose-400 overflow-x-auto">
            {error.message || "Unknown root runtime failure."}
          </pre>
          <Button
            onClick={() => reset()}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reload BHUSHAKTI AI
          </Button>
        </div>
      </body>
    </html>
  );
}
