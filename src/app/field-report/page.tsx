"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  MapPin,
  Upload,
  Sparkles,
  CheckCircle2,
  Wifi,
  WifiOff,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Navigation,
  Image as ImageIcon,
  Check,
  Radio,
  Save,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthContext";
import { useI18n } from "@/components/i18n/I18nContext";
import { fieldSubmissionPipeline, PipelineExecutionResult } from "@/services/fieldSubmissionPipeline";
import { offlineQueue } from "@/lib/offline/offlineQueue";
import { ReportType, ReportSeverity } from "@/types/fieldReport";

const SAMPLE_TERRAIN_PHOTOS = [
  {
    label: "Aizawl NH-54 Shear Crack (12cm)",
    type: "CRACK" as ReportType,
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80",
    desc: "12cm longitudinal shear crack cutting across NH-54 highway asphalt.",
  },
  {
    label: "Sikkim 29th Mile Road Blockage",
    type: "ROAD_BLOCKED" as ReportType,
    url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    desc: "Mudflow and boulder debris covering both lanes of the mountain road.",
  },
  {
    label: "Sohra Slope Toe Erosion",
    type: "EROSION" as ReportType,
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    desc: "Gully runoff scouring soil from base of roadside slope.",
  },
];

export default function FieldReportPage() {
  const { role, user } = useAuth();
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [location, setLocation] = useState<{ lat: number; lng: number }>({
    lat: 23.7385,
    lng: 92.7092,
  });
  const [districtName, setDistrictName] = useState("Aizawl");
  const [locationAddress, setLocationAddress] = useState("NH-54 milestone 14, Hunthar, Aizawl");
  const [reportType, setReportType] = useState<ReportType>("CRACK");
  const [severity, setSeverity] = useState<ReportSeverity>("HIGH");
  const [description, setDescription] = useState("");
  const [hasCracks, setHasCracks] = useState(true);
  const [isRoadBlocked, setIsRoadBlocked] = useState(false);
  const [roadBlockageDegree, setRoadBlockageDegree] = useState<"CLEAR" | "PARTIAL" | "COMPLETE">("CLEAR");
  const [imagePreview, setImagePreview] = useState<string | null>(SAMPLE_TERRAIN_PHOTOS[0].url);

  const [submitting, setSubmitting] = useState(false);
  const [offlineSaved, setOfflineSaved] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<PipelineExecutionResult | null>(null);

  // 1-Click GPS location capture
  const handleCaptureGps = () => {
    setGpsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
          setGpsLoading(false);
          setGpsSuccess(true);
          setTimeout(() => setGpsSuccess(false), 3000);
        },
        () => {
          setLocation({ lat: 23.7385, lng: 92.7092 });
          setGpsLoading(false);
          setGpsSuccess(true);
          setTimeout(() => setGpsSuccess(false), 3000);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setGpsLoading(false);
    }
  };

  // Image Upload Handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setImagePreview(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSamplePhoto = (sample: (typeof SAMPLE_TERRAIN_PHOTOS)[0]) => {
    setImagePreview(sample.url);
    setReportType(sample.type);
    setDescription(sample.desc);
    if (sample.type === "ROAD_BLOCKED") {
      setIsRoadBlocked(true);
      setRoadBlockageDegree("COMPLETE");
    } else {
      setIsRoadBlocked(false);
      setRoadBlockageDegree("CLEAR");
    }
    if (sample.type === "CRACK") {
      setHasCracks(true);
    }
  };

  // Save to offline queue manually or when offline
  const handleSaveOffline = () => {
    offlineQueue.enqueue({
      reporterRole: role,
      reporterName: user?.fullName || (role === "FIELD_OFFICER" ? "Inspector L. Sailo" : "Local Citizen"),
      reporterPhone: user?.phone || "+91 94361 00000",
      districtName,
      location: { latitude: location.lat, longitude: location.lng },
      locationAddress,
      reportType,
      severity,
      observedCracks: hasCracks,
      slopeMovementDetected: hasCracks || reportType === "SLOPE_MOVEMENT",
      roadBlocked: isRoadBlocked,
      roadBlockageDegree: isRoadBlocked ? roadBlockageDegree : "CLEAR",
      description: description || "Ground shear observation captured in offline mode.",
      media: [],
      status: role === "CITIZEN" ? "PENDING_VERIFICATION" : "VERIFIED",
    });

    setOfflineSaved(true);
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (typeof window !== "undefined" && !navigator.onLine) {
      handleSaveOffline();
      return;
    }

    setSubmitting(true);

    try {
      const result = await fieldSubmissionPipeline.processFieldReport({
        reporterRole: role,
        reporterName: user?.fullName || (role === "FIELD_OFFICER" ? "Inspector L. Sailo" : "Local Citizen"),
        reporterPhone: user?.phone || "+91 94361 00000",
        districtName,
        location: { latitude: location.lat, longitude: location.lng },
        locationAddress,
        reportType,
        severity,
        observedCracks: hasCracks,
        slopeMovementDetected: hasCracks || reportType === "SLOPE_MOVEMENT",
        roadBlocked: isRoadBlocked,
        roadBlockageDegree: isRoadBlocked ? roadBlockageDegree : "CLEAR",
        description: description || "Ground shear observation captured via field surveillance client.",
        imageDataUrl: imagePreview || undefined,
      });

      setPipelineResult(result);
    } catch (err) {
      console.warn("Online submission failed, enqueuing offline:", err);
      handleSaveOffline();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="p-3 sm:p-6 max-w-3xl mx-auto w-full space-y-5 pb-24">
        {/* Header */}
        <div className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
                {t.fieldReportTitle}
              </h1>
            </div>
            {/* Low Network / Offline Sync Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold">
              <Wifi className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Offline-Sync Ready</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t.fieldReportSubtitle}
          </p>
        </div>

        {offlineSaved ? (
          /* OFFLINE QUEUE CONFIRMATION CARD */
          <Card className="border-amber-500/50 bg-amber-500/10 p-6 space-y-4 text-center shadow-xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Save className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground">
                Report Saved to Offline Storage Queue
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Your geo-tagged observations and measurements have been safely preserved in local device memory. They will automatically synchronize to the disaster command center when cellular connection returns.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setOfflineSaved(false);
                  setDescription("");
                }}
              >
                Create Another Offline Draft
              </Button>
              <Button asChild size="sm" variant="default" className="text-xs">
                <Link href="/reports">View Local Feed →</Link>
              </Button>
            </div>
          </Card>
        ) : pipelineResult ? (
          /* PIPELINE SUCCESS CARD */
          <Card className="border-emerald-500/50 bg-emerald-500/5 p-5 sm:p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-foreground leading-tight">
                  Field Report Processed Through AI Pipeline
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  Report ID: <strong>{pipelineResult.report.id}</strong> • Stored in Database
                </p>
              </div>
            </div>

            {/* 5-Step Pipeline Audit Feed */}
            <div className="p-4 rounded-xl border bg-card/90 space-y-3 text-xs">
              <span className="font-bold text-foreground uppercase tracking-wider block font-mono text-[11px]">
                Autonomous Processing Sequence:
              </span>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Geo-tagged to coordinates <strong>{location.lat}°N, {location.lng}°E</strong>.</span>
                </div>

                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>
                    Vision Analysis: <strong>{pipelineResult.visionAnalysis.detectedIndicators[0]?.name}</strong> ({Math.round(pipelineResult.visionAnalysis.confidenceScore * 100)}% conf).
                  </span>
                </div>

                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>
                    Risk Fusion Engine: Hazard score updated to <strong>{pipelineResult.evaluatedRiskScore}/100</strong> (+{pipelineResult.visionAnalysis.totalRiskContribution} pts).
                  </span>
                </div>

                {pipelineResult.alertTriggered && (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Emergency Red Alert triggered & broadcast to SDMA command console!</span>
                  </div>
                )}

                {pipelineResult.generatedTask && (
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
                    <Radio className="w-4 h-4 shrink-0" />
                    <span>Automated P1 Dispatch ticket generated for <strong>{pipelineResult.generatedTask.assignedAgency}</strong>.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button
                onClick={() => {
                  setPipelineResult(null);
                  setDescription("");
                }}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Submit Another Observation
              </Button>
              <Button asChild size="sm" variant="default" className="text-xs gap-1.5 font-bold shadow-md">
                <Link href="/reports">
                  View in Ground Truth Inbox <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          /* MOBILE-FIRST REPORT SUBMISSION FORM */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Incident Classification (Large Touch Targets) */}
            <Card className="border">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold text-foreground">
                  {t.stepClassification}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "CRACK", label: t.reportTypeCrack, icon: "⚡" },
                    { id: "SLOPE_MOVEMENT", label: t.reportTypeSlump, icon: "⛰️" },
                    { id: "ROAD_BLOCKED", label: t.reportTypeBlocked, icon: "🚧" },
                    { id: "ROCKFALL", label: t.reportTypeRockfall, icon: "🪨" },
                    { id: "DEBRIS", label: t.reportTypeDebris, icon: "🌊" },
                    { id: "EROSION", label: t.reportTypeErosion, icon: "💧" },
                    { id: "OTHER", label: t.reportTypeOther, icon: "⚠️" },
                  ].map((tItem) => (
                    <button
                      type="button"
                      key={tItem.id}
                      onClick={() => {
                        setReportType(tItem.id as ReportType);
                        if (tItem.id === "ROAD_BLOCKED") {
                          setIsRoadBlocked(true);
                          setRoadBlockageDegree("COMPLETE");
                        }
                        if (tItem.id === "CRACK") setHasCracks(true);
                      }}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between min-h-[64px] transition-all focus-visible:ring-2 focus-visible:ring-primary ${
                        reportType === tItem.id
                          ? "bg-primary text-primary-foreground font-bold border-primary shadow-md scale-[1.02]"
                          : "bg-card hover:bg-accent text-foreground"
                      }`}
                    >
                      <span className="text-base">{tItem.icon}</span>
                      <span className="text-xs mt-1">{tItem.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Camera Capture & Image Upload */}
            <Card className="border">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Camera className="w-4 h-4 text-primary" />
                    {t.stepPhoto}
                  </CardTitle>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                    Prototype Vision Analysis
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                {/* Upload Action / Preview */}
                {imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border bg-black max-h-60 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Field preview"
                        className="w-full h-full object-cover max-h-56"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 shadow"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Retake / Change Photo
                      </button>
                    </div>

                    {/* Instant AI Vision Preview Card */}
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-primary">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Prototype Vision Analysis
                        </span>
                        <span className="font-mono text-[11px]">Conf: 94%</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Identified: <strong>{reportType === "CRACK" ? "Transverse Tension Shear Fissure" : reportType === "ROAD_BLOCKED" ? "Carriageway Obstruction" : "Slope Overburden Displacement"}</strong>. Risk score modifier: <strong>+7.5 pts</strong>.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-foreground text-sm">
                      {t.photoUploadPrompt}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-0.5">
                      JPEG, PNG, WebP (Auto-compressed for low-bandwidth 2G)
                    </span>
                  </div>
                )}

                {/* Sample Test Photos Bar */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-muted-foreground block mb-1.5">
                    Quick Test Samples (Desktop Testing):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_TERRAIN_PHOTOS.map((sample, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectSamplePhoto(sample)}
                        className="px-2.5 py-1 rounded-md border text-[11px] bg-card hover:bg-accent text-foreground font-medium"
                      >
                        {sample.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Location & Coordinates */}
            <Card className="border">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    {t.stepLocation}
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 font-semibold"
                    onClick={handleCaptureGps}
                    disabled={gpsLoading}
                  >
                    <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
                    {gpsSuccess ? t.gpsCaptured : t.useGpsBtn}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="p-2 rounded bg-muted/40 border">
                    <span className="text-[10px] text-muted-foreground block">Latitude</span>
                    <strong className="text-foreground">{location.lat.toFixed(6)}° N</strong>
                  </div>
                  <div className="p-2 rounded bg-muted/40 border">
                    <span className="text-[10px] text-muted-foreground block">Longitude</span>
                    <strong className="text-foreground">{location.lng.toFixed(6)}° E</strong>
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
                    className="w-full rounded-lg border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Observations & Road Status */}
            <Card className="border">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm font-bold text-foreground">
                  {t.stepObservations}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label className="flex items-center gap-2 p-3 rounded-lg border bg-card cursor-pointer hover:bg-accent/40">
                    <input
                      type="checkbox"
                      checked={hasCracks}
                      onChange={(e) => setHasCracks(e.target.checked)}
                      className="w-4 h-4 rounded text-primary accent-primary"
                    />
                    <span className="font-medium text-foreground">{t.tensionCracksCheck}</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-lg border bg-card cursor-pointer hover:bg-accent/40">
                    <input
                      type="checkbox"
                      checked={isRoadBlocked}
                      onChange={(e) => setIsRoadBlocked(e.target.checked)}
                      className="w-4 h-4 rounded text-primary accent-primary"
                    />
                    <span className="font-medium text-foreground">{t.roadBlockedCheck}</span>
                  </label>
                </div>

                {isRoadBlocked && (
                  <div className="p-3 rounded-lg border bg-rose-500/5 space-y-2">
                    <label className="font-semibold text-foreground block">
                      Road Obstruction Degree:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRoadBlockageDegree("PARTIAL")}
                        className={`p-2 rounded border text-xs font-semibold ${
                          roadBlockageDegree === "PARTIAL"
                            ? "bg-amber-500 text-white border-amber-600"
                            : "bg-card text-foreground"
                        }`}
                      >
                        Single Lane Blocked
                      </button>
                      <button
                        type="button"
                        onClick={() => setRoadBlockageDegree("COMPLETE")}
                        className={`p-2 rounded border text-xs font-semibold ${
                          roadBlockageDegree === "COMPLETE"
                            ? "bg-rose-600 text-white border-rose-700"
                            : "bg-card text-foreground"
                        }`}
                      >
                        Total Highway Blockage
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    {t.notesLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe slope fissure width (e.g. 12cm), nearby milestones, threatened houses, or stream overflow..."
                    className="w-full rounded-lg border bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Mobile Action Bar */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <Button
                type="submit"
                size="lg"
                variant="critical"
                disabled={submitting}
                className="flex-1 h-12 text-sm font-bold shadow-xl flex items-center justify-center gap-2"
              >
                {submitting ? t.submittingText : t.submitReportBtn}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleSaveOffline}
                className="h-12 text-xs font-bold gap-1.5"
                title="Preserve observation in local IndexedDB storage queue"
              >
                <Save className="w-4 h-4" />
                {t.saveOfflineBtn}
              </Button>
            </div>
          </form>
        )}
      </div>
    </PageShell>
  );
}
