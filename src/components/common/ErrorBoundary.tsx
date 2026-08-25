"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset?: () => void;
  title?: string;
  description?: string;
}

export function ErrorDisplay({
  error,
  reset,
  title = "Telemetry & System Error Encountered",
  description = "A component failed to render or process real-time environmental data.",
}: ErrorBoundaryProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-rose-500/30 bg-rose-50/20 dark:bg-rose-950/10 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/15 flex items-center justify-center mb-2">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
          </div>
          <CardTitle className="text-lg font-bold text-foreground">{title}</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="p-3 bg-muted/60 rounded border text-xs font-mono text-left break-words text-rose-700 dark:text-rose-300">
            {error.message || "An unexpected error occurred in the risk engine."}
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {reset && (
              <Button onClick={() => reset()} variant="outline" size="sm" className="gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Computation
              </Button>
            )}
            <Button asChild size="sm" className="gap-1.5">
              <Link href="/dashboard">
                <Home className="w-3.5 h-3.5" />
                Command Center
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
