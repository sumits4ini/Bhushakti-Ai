import React from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, CheckCircle, Clock, Eye, Sparkles, Filter } from "lucide-react";
import { MOCK_FIELD_REPORTS } from "@/lib/demo";
import { formatDate } from "@/lib/utils";

export default function ReportsPage() {
  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Field Reports & Ground Truth Inbox
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-700 dark:text-blue-400 font-mono font-semibold">
                {MOCK_FIELD_REPORTS.length} SUBMISSIONS
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Geo-tagged ground observations from field officers and local citizens with AI Vision crack analysis
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="critical" className="gap-1.5 text-xs">
              <Link href="/field-report">
                <Camera className="w-3.5 h-3.5" />
                Submit New Report
              </Link>
            </Button>
          </div>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {MOCK_FIELD_REPORTS.map((report) => (
            <Card key={report.id} className="border hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-muted text-foreground">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-foreground">
                          {report.reportType.replace("_", " ")}: {report.districtName}
                        </CardTitle>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {report.reporterRole}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{report.locationAddress || `${report.location.latitude}, ${report.location.longitude}`}</span>
                        <span>•</span>
                        <span className="font-mono">{formatDate(report.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                        report.status === "VERIFIED"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                          : report.status === "ACTIONED"
                          ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {report.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  {report.description}
                </p>

                {/* AI Vision Analysis Results if present */}
                {report.media[0]?.visionAnalysis && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-primary">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {report.media[0].visionAnalysis.source}
                      </span>
                      <span className="font-mono">
                        Confidence: {Math.round(report.media[0].visionAnalysis.confidenceScore * 100)}%
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {report.media[0].visionAnalysis.detectedIndicators.map((ind, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-card border text-[11px] font-medium text-foreground flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          {ind.name} ({Math.round(ind.confidence * 100)}%)
                        </span>
                      ))}
                    </div>

                    <p className="text-[11px] text-muted-foreground pt-1 border-t border-primary/10">
                      <strong>AI Recommendation:</strong> {report.media[0].visionAnalysis.recommendedImmediateAction}
                    </p>
                  </div>
                )}

                {/* Footer details */}
                <div className="flex items-center justify-between pt-2 border-t text-[11px] text-muted-foreground">
                  <div>
                    Submitted by: <strong>{report.reporterName}</strong> {report.reporterPhone && `(${report.reporterPhone})`}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Inspect On Map
                    </Button>
                    <Button size="sm" variant="default" className="h-7 text-xs">
                      Verify Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
