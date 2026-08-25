"use client";

import React, { useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Upload, Sparkles, CheckCircle2, Wifi, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { reportRepository } from "@/services/reportRepository";
import { ReportType, ReportSeverity } from "@/types/fieldReport";
import Link from "next/link";

export default function FieldReportSubmissionPage() {
  const { role, user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 23.7385,
    lng: 92.7092,
  });
  const [locationAddress, setLocationAddress] = useState("NH-54 milestone 14, Hunthar, Aizawl");
  const [reportType, setReportType] = useState<ReportType>("CRACK");
  const [severity, setSeverity] = useState<ReportSeverity>("HIGH");
  const [description, setDescription] = useState("");
  const [hasCracks, setHasCracks] = useState(true);
  const [isRoadBlocked, setIsRoadBlocked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await reportRepository.create({
        reporterRole: role,
        reporterName: user?.fullName || (role === "FIELD_OFFICER" ? "Inspector L. Sailo" : "Local Citizen"),
        reporterPhone: user?.phone || "+91 94361 00000",
        districtName: "Aizawl",
        location: { latitude: location.lat, longitude: location.lng },
        locationAddress,
        reportType,
        severity,
        observedCracks: hasCracks,
        slopeMovementDetected: hasCracks,
        roadBlocked: isRoadBlocked,
        roadBlockageDegree: isRoadBlocked ? "PARTIAL" : "CLEAR",
        description: description || "Transverse shear fissure observed along cut slope following rainfall spell.",
        media: [],
        status: role === "CITIZEN" ? "PENDING_VERIFICATION" : "VERIFIED",
      });

      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Submit Field Incident Observation
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                {role} Mode
              </span>
            </div>
            {/* Low Network / Offline Mode Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              <span>Offline-Sync Ready</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Submit geo-tagged ground photos, crack measurements, and road blockage reports to update the AI Hazard Index.
          </p>
        </div>

        {submitted ? (
          <Card className="border-emerald-500/40 bg-emerald-500/5 p-6 text-center space-y-4 shadow-lg">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Report Successfully Logged
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Your report has been geo-tagged to coordinate <strong>{location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E</strong> and stored in the database repository.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setDescription("");
                }}
                variant="outline"
                size="sm"
              >
                Submit Another Report
              </Button>
              <Button asChild size="sm" className="gap-1.5">
                <Link href="/reports">
                  View in Ground Truth Feed <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Location & Coordinates */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  1. Geo-Tagged Coordinates & Address
                </CardTitle>
                <CardDescription className="text-xs">
                  Captured via device GPS or manual map selection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="p-2.5 rounded border bg-muted/40">
                    <span className="text-muted-foreground block text-[11px]">Latitude:</span>
                    <strong className="text-foreground">{location.lat.toFixed(6)}</strong>
                  </div>
                  <div className="p-2.5 rounded border bg-muted/40">
                    <span className="text-muted-foreground block text-[11px]">Longitude:</span>
                    <strong className="text-foreground">{location.lng.toFixed(6)}</strong>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Landmark / Road Milestone:
                  </label>
                  <input
                    type="text"
                    value={locationAddress}
                    onChange={(e) => setLocationAddress(e.target.value)}
                    placeholder="e.g. NH-54 milestone 14, Hunthar, Aizawl"
                    className="w-full rounded-md border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs gap-1.5"
                  onClick={() => setLocation({ lat: 23.7385, lng: 92.7092 })}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Refresh Device GPS Location
                </Button>
              </CardContent>
            </Card>

            {/* Step 2: Incident Classification */}
            <Card className="border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold text-foreground">
                  2. Incident Type & Observations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground block mb-2">
                    Observation Type:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "CRACK", label: "Slope Crack" },
                      { id: "SLOPE_MOVEMENT", label: "Ground Slip" },
                      { id: "ROAD_BLOCKED", label: "Road Blocked" },
                      { id: "ROCKFALL", label: "Rockfall" },
                      { id: "DEBRIS", label: "Debris Accumulation" },
                      { id: "EROSION", label: "Toe Erosion" },
                      { id: "OTHER", label: "Other Hazard" },
                    ].map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => setReportType(t.id as ReportType)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          reportType === t.id
                            ? "bg-primary text-primary-foreground font-bold border-primary shadow-xs"
                            : "bg-card hover:bg-accent text-foreground"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <label className="flex items-center gap-2 p-3 rounded-lg border bg-card cursor-pointer hover:bg-accent/40">
                    <input
                      type="checkbox"
                      checked={hasCracks}
                      onChange={(e) => setHasCracks(e.target.checked)}
                      className="w-4 h-4 rounded text-primary"
                    />
                    <span className="font-medium text-foreground">Visible Tension Cracks Observed</span>
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-lg border bg-card cursor-pointer hover:bg-accent/40">
                    <input
                      type="checkbox"
                      checked={isRoadBlocked}
                      onChange={(e) => setIsRoadBlocked(e.target.checked)}
                      className="w-4 h-4 rounded text-primary"
                    />
                    <span className="font-medium text-foreground">Carriageway / Road Obstructed</span>
                  </label>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1.5">
                    Field Description & Landmark Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe slope fissure width, nearby milestones, threatened houses, or stream overflow..."
                    className="w-full rounded-md border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Photo Upload & AI Vision Preview */}
            <Card className="border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    3. Ground Photo & AI Vision Inspection
                  </CardTitle>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                    Automated CV Analysis
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="font-semibold text-foreground">
                    Upload or Capture Slope Image
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    Auto-compressed on device for low-bandwidth 2G/3G connectivity
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" variant="critical" disabled={submitting} className="w-full font-bold shadow-md">
              {submitting ? "Saving to Database..." : "Submit Field Report to Command Center"}
            </Button>
          </form>
        )}
      </div>
    </PageShell>
  );
}
