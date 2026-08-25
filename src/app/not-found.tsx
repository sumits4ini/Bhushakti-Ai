import React from "react";
import Link from "next/link";
import { Mountain, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
        <Mountain className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-2">
        404
      </h1>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Disaster Intelligence Zone Not Found
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
        The requested district telemetry route or risk coordinate does not exist in the BHUSHAKTI North Eastern spatial registry.
      </p>
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </Button>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/dashboard">
            <Home className="w-3.5 h-3.5" />
            Command Center
          </Link>
        </Button>
      </div>
    </div>
  );
}
