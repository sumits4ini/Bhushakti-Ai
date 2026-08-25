"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  MapPin,
  CheckCircle,
  Clock,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  AlertTriangle,
  UserCheck,
  Check,
  Filter,
  Wifi,
  ChevronRight,
  ListFilter,
  CheckSquare,
} from "lucide-react";
import { reportRepository } from "@/services/reportRepository";
import { responseRepository } from "@/services/responseRepository";
import { alertRepository } from "@/services/alertRepository";
import { FieldReport, ReportStatus } from "@/types/fieldReport";
import { ResponseTask } from "@/types/responseTask";
import { Alert } from "@/types/alert";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthContext";

export default function ReportsDashboardPage() {
  const { role, user } = useAuth();
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [tasks, setTasks] = useState<ResponseTask[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "VERIFIED" | "MY_REPORTS" | "TASKS">("ALL");

  const loadData = async () => {
    setLoading(true);
    try {
      const [allReports, allTasks, allAlerts] = await Promise.all([
        reportRepository.getAll(),
        responseRepository.getAll(),
        alertRepository.getActive(),
      ]);
      setReports(allReports);
      setTasks(allTasks);
      setAlerts(allAlerts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerifyReport = async (reportId: string) => {
    const verifiedBy = user?.fullName || (role === "ADMIN" ? "Director SDMA" : "SDRF Inspector L. Sailo");
    await reportRepository.updateStatus(reportId, "VERIFIED", verifiedBy);
    await loadData();
  };

  const filteredReports = reports.filter((rep) => {
    if (activeTab === "PENDING") return rep.status === "PENDING_VERIFICATION";
    if (activeTab === "VERIFIED") return rep.status === "VERIFIED" || rep.status === "ACTIONED";
    if (activeTab === "MY_REPORTS") return rep.reporterRole === role || rep.reporterName.includes(user?.fullName || "");
    return true;
  });

  const pendingCount = reports.filter((r) => r.status === "PENDING_VERIFICATION").length;
  const verifiedCount = reports.filter((r) => r.status === "VERIFIED" || r.status === "ACTIONED").length;

  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black tracking-tight text-foreground">
                Field Intelligence & Ground Truth Console
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-mono font-bold">
                {role} VIEW
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Surveillance stream of geo-tagged ground reports, AI Vision crack measurements, and SDRF task dispatches
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="outline" onClick={loadData} className="gap-1.5 text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Feed
            </Button>
            <Button asChild size="sm" variant="critical" className="gap-1.5 text-xs font-bold shadow-md">
              <Link href="/field-report">
                <Camera className="w-3.5 h-3.5" />
                Submit Observation
              </Link>
            </Button>
          </div>
        </div>

        {/* 4 KPI Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="border">
            <CardContent className="p-3.5 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                Total Submissions
              </span>
              <div className="text-2xl font-black text-foreground font-mono">
                {reports.length}
              </div>
              <div className="text-[10px] text-muted-foreground">All NER Corridors</div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-3.5 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-600 dark:text-amber-400">
                Pending Verification
              </span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {pendingCount}
              </div>
              <div className="text-[10px] text-muted-foreground">Citizen Reports</div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-3.5 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400">
                Verified Ground Truth
              </span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {verifiedCount}
              </div>
              <div className="text-[10px] text-muted-foreground">Fused to Hazard Index</div>
            </CardContent>
          </Card>

          <Card className="border">
            <CardContent className="p-3.5 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-blue-600 dark:text-blue-400">
                Offline Sync Engine
              </span>
              <div className="text-lg font-bold text-foreground font-mono flex items-center gap-1.5 mt-1">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>ONLINE / SYNCED</span>
              </div>
              <div className="text-[10px] text-muted-foreground">IndexedDB Mirror Active</div>
            </CardContent>
          </Card>
        </div>

        {/* View Tabs Selector */}
        <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto text-xs">
          <Button
            variant={activeTab === "ALL" ? "default" : "ghost"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={() => setActiveTab("ALL")}
          >
            All Reports ({reports.length})
          </Button>
          <Button
            variant={activeTab === "PENDING" ? "default" : "ghost"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={() => setActiveTab("PENDING")}
          >
            Pending Verification ({pendingCount})
          </Button>
          <Button
            variant={activeTab === "VERIFIED" ? "default" : "ghost"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={() => setActiveTab("VERIFIED")}
          >
            Verified ({verifiedCount})
          </Button>
          <Button
            variant={activeTab === "TASKS" ? "default" : "ghost"}
            size="sm"
            className="h-8 text-xs font-semibold"
            onClick={() => setActiveTab("TASKS")}
          >
            Assigned Response Tasks ({tasks.length})
          </Button>
        </div>

        {/* TAB 1: REPORTS LIST */}
        {activeTab !== "TASKS" ? (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="border hover:border-primary/40 transition-colors shadow-xs">
                <CardHeader className="p-4 pb-2 border-b bg-muted/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-bold text-foreground">
                            {report.reportType.replace(/_/g, " ")}: {report.districtName}
                          </CardTitle>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {report.reporterRole}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <MapPin className="w-3 h-3 text-primary" />
                          <span>{report.locationAddress || `${report.location.latitude}, ${report.location.longitude}`}</span>
                          <span>•</span>
                          <span className="font-mono">{formatDate(report.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                          report.status === "VERIFIED"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                            : report.status === "ACTIONED"
                            ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {report.status.replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3.5 text-xs">
                  <p className="text-foreground leading-relaxed">
                    {report.description}
                  </p>

                  {/* AI Vision Analysis Preview */}
                  {report.media[0]?.visionAnalysis && (
                    <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-primary">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          {report.media[0].visionAnalysis.source}
                        </span>
                        <span className="font-mono text-[11px]">
                          Confidence: {Math.round(report.media[0].visionAnalysis.confidenceScore * 100)}%
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {report.media[0].visionAnalysis.detectedIndicators.map((ind, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-card border text-[11px] font-semibold text-foreground flex items-center gap-1"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            {ind.name} ({Math.round(ind.confidence * 100)}%)
                          </span>
                        ))}
                      </div>

                      <p className="text-[11px] text-muted-foreground pt-1 border-t border-primary/10">
                        <strong>AI Directive:</strong> {report.media[0].visionAnalysis.recommendedImmediateAction}
                      </p>
                    </div>
                  )}

                  {/* Footer & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-[11px] text-muted-foreground">
                    <div>
                      Reported by: <strong>{report.reporterName}</strong> {report.reporterPhone && `(${report.reporterPhone})`}
                      {report.verifiedBy && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold ml-1">
                          • Verified by {report.verifiedBy}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" className="h-7 text-xs gap-1">
                        <Link href="/map">
                          <MapPin className="w-3 h-3" />
                          Inspect Map
                        </Link>
                      </Button>

                      {report.status === "PENDING_VERIFICATION" && (role === "ADMIN" || role === "FIELD_OFFICER") && (
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 text-xs font-bold gap-1 shadow-sm"
                          onClick={() => handleVerifyReport(report.id)}
                        >
                          <Check className="w-3 h-3" />
                          Verify Observation
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* TAB 2: ASSIGNED RESPONSE TASKS */
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className="border hover:border-primary/40 transition-colors shadow-xs">
                <CardHeader className="p-4 pb-2 border-b bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold text-foreground">
                        {task.title}
                      </CardTitle>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Agency: <strong>{task.assignedAgency}</strong> • Priority: <strong>{task.priority}</strong>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {task.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2.5 text-xs">
                  <p className="text-foreground leading-relaxed">{task.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t text-[11px] text-muted-foreground font-mono">
                    <span>Personnel: {task.allocatedPersonnel} deployed</span>
                    <span>Equipment: {task.equipmentRequired.join(", ")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
