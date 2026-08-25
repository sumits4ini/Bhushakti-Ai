"use client";

import React, { useEffect, useState } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  ShieldAlert,
  Radio,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Wrench,
  AlertTriangle,
  Play,
  Check,
  RefreshCw,
  Zap,
  Truck,
  Plus,
} from "lucide-react";
import { responseRepository } from "@/services/responseRepository";
import { alertRepository } from "@/services/alertRepository";
import { notificationService } from "@/services/notificationService";
import { ResponseTask, TaskStatus, ResponsePriority } from "@/types/responseTask";
import { formatDate } from "@/lib/utils";

const SPECIALIZED_TEAMS = [
  { name: "SDRF Quick Response 1st Battalion", base: "Aizawl Base Camp", strength: "32 Personnel", equipment: "Hydraulic Loaders, Extensometers", status: "DEPLOYED" },
  { name: "Border Roads Organisation (BRO) 42nd Task Force", base: "NH-10 / Teesta Sector", strength: "45 Engineers", equipment: "Rock Breakers, Bulldozers", status: "DEPLOYED" },
  { name: "Disaster Medical Assistance Team (DMAT)", base: "Shillong Civil Hospital", strength: "12 Medics", equipment: "Mobile Trauma Units", status: "STANDBY" },
  { name: "UAV Airborne LiDAR & Drone Survey Unit", base: "Guwahati SDMA Hub", strength: "4 Specialists", equipment: "Thermal & Multispectral Drones", status: "ACTIVE" },
];

export default function ResponseCenterPage() {
  const [tasks, setTasks] = useState<ResponseTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "PENDING_DISPATCH" | "DEPLOYED" | "IN_PROGRESS" | "COMPLETED">("ALL");
  const [scenarioNotice, setScenarioNotice] = useState<string | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await responseRepository.getAll();
      setTasks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleUpdateStatus = async (taskId: string, newStatus: TaskStatus) => {
    await responseRepository.updateStatus(taskId, newStatus);
    await loadTasks();
  };

  // 1-Click Trigger Critical Scenario
  const handleTriggerCriticalScenario = async () => {
    const newTask = await responseRepository.create({
      riskZoneName: "Hunthar Veng / NH-54 Milestone 14",
      districtName: "Aizawl (Mizoram)",
      title: "P1 Emergency Dispatch: Secure Severed NH-54 Highway Corridor",
      priority: "P1",
      status: "DEPLOYED",
      actionType: "ROAD_CLEARANCE",
      assignedAgency: "SDRF Quick Response 1st Bn & BRO Highway Wing",
      targetLocation: { latitude: 23.7385, longitude: 92.7092 },
      locationDescription: "NH-54 milestone 14, Hunthar, Aizawl",
      description: "Severe 12cm tension fissure and mudflow blocking both highway lanes. Immediate excavator deployment required.",
      allocatedPersonnel: 16,
      equipmentRequired: ["Hydraulic Excavator", "Tension Crackmeter", "LED Warning Lights", "Radio Relay"],
    });

    await notificationService.dispatchAlert({
      id: `alt-sim-${Date.now()}`,
      title: "P1 Emergency Dispatch: NH-54 Highway Severance",
      severity: "CRITICAL",
      status: "ACTIVE",
      riskScore: 94,
      riskLevel: "CRITICAL",
      districtId: "dist-aizawl",
      districtName: "Aizawl",
      locationPoint: { latitude: 23.7385, longitude: 92.7092 },
      triggerReason: "Autonomous P1 Task Allocation following active slope failure.",
      affectedPopulationEstimate: 2850,
      affectedRoads: ["NH-54 Silchar-Aizawl Highway"],
      recommendedActions: ["Halt commercial transit", "Mobilize earthmovers"],
      responsePriority: "P1",
      issuedAt: new Date().toISOString(),
    });

    setScenarioNotice(
      "⚡ Critical Disaster Scenario Triggered: New P1 Emergency Task created & assigned to SDRF 1st Bn."
    );
    await loadTasks();
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === "ALL") return true;
    return t.status === activeFilter;
  });

  const pendingCount = tasks.filter((t) => t.status === "PENDING_DISPATCH").length;
  const deployedCount = tasks.filter((t) => t.status === "DEPLOYED" || t.status === "IN_PROGRESS").length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <AuthGuard allowedRoles={["ADMIN", "FIELD_OFFICER"]}>
      <PageShell>
        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                  Emergency Response & Dispatch Center
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono font-bold">
                  SDRF / BRO DISPATCH ACTIVE
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tactical disaster response coordination, resource allocation, and real-time field task tracking
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button size="sm" variant="outline" onClick={loadTasks} className="gap-1.5 text-xs">
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh Tasks
              </Button>
              <Button
                size="sm"
                variant="critical"
                onClick={handleTriggerCriticalScenario}
                className="gap-1.5 text-xs font-bold shadow-md"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Trigger Critical Scenario
              </Button>
            </div>
          </div>

          {/* Scenario Banner */}
          {scenarioNotice && (
            <div className="p-3.5 rounded-xl border border-rose-500/50 bg-rose-500/10 shadow-lg flex items-center justify-between gap-3 text-xs animate-in fade-in duration-300">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-rose-500 shrink-0 animate-bounce" />
                <span className="font-semibold text-foreground">{scenarioNotice}</span>
              </div>
            </div>
          )}

          {/* Top Status Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="border">
              <CardContent className="p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-muted-foreground">
                  Total Response Tickets
                </span>
                <div className="text-2xl font-black text-foreground font-mono">
                  {tasks.length}
                </div>
                <div className="text-[10px] text-muted-foreground">All NER Corridors</div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-600 dark:text-amber-400">
                  Pending Dispatch
                </span>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                  {pendingCount}
                </div>
                <div className="text-[10px] text-muted-foreground">Awaiting Orders</div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-blue-600 dark:text-blue-400">
                  Deployed / In-Progress
                </span>
                <div className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  {deployedCount}
                </div>
                <div className="text-[10px] text-muted-foreground">Active in Field</div>
              </CardContent>
            </Card>

            <Card className="border">
              <CardContent className="p-3.5 space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-600 dark:text-emerald-400">
                  Resolved Incidents
                </span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {completedCount}
                </div>
                <div className="text-[10px] text-muted-foreground">Highway Restored</div>
              </CardContent>
            </Card>
          </div>

          {/* MAIN RESPONSE WORKSPACE: Tasks Feed (8 Cols) + Assigned Teams Fleet (4 Cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Response Tasks (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Filter Tabs */}
              <div className="flex items-center gap-2 border-b pb-2 overflow-x-auto text-xs">
                <Button
                  variant={activeFilter === "ALL" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 text-xs font-semibold"
                  onClick={() => setActiveFilter("ALL")}
                >
                  All Tasks ({tasks.length})
                </Button>
                <Button
                  variant={activeFilter === "PENDING_DISPATCH" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 text-xs font-semibold"
                  onClick={() => setActiveFilter("PENDING_DISPATCH")}
                >
                  Pending ({pendingCount})
                </Button>
                <Button
                  variant={activeFilter === "DEPLOYED" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 text-xs font-semibold"
                  onClick={() => setActiveFilter("DEPLOYED")}
                >
                  Deployed ({deployedCount})
                </Button>
                <Button
                  variant={activeFilter === "COMPLETED" ? "default" : "ghost"}
                  size="sm"
                  className="h-8 text-xs font-semibold"
                  onClick={() => setActiveFilter("COMPLETED")}
                >
                  Completed ({completedCount})
                </Button>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <Card
                    key={task.id}
                    className={`border transition-all shadow-xs ${
                      task.priority === "P1" ? "border-rose-500/40 bg-rose-500/5" : "bg-card"
                    }`}
                  >
                    <CardHeader className="p-4 pb-2 border-b bg-muted/20">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-bold text-foreground">
                              {task.title}
                            </CardTitle>
                            <span
                              className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                task.priority === "P1"
                                  ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                                  : "bg-orange-500/20 text-orange-700 dark:text-orange-300"
                              }`}
                            >
                              Priority: {task.priority}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 font-mono">
                            <MapPin className="w-3 h-3 text-primary" />
                            <span>{task.locationDescription}</span>
                            <span>•</span>
                            <span>{formatDate(task.createdAt)}</span>
                          </div>
                        </div>

                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                            task.status === "COMPLETED"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                              : task.status === "IN_PROGRESS" || task.status === "DEPLOYED"
                              ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                          }`}
                        >
                          {task.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 space-y-3 text-xs">
                      <p className="text-foreground leading-relaxed">
                        {task.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border font-mono text-[11px]">
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Assigned Agency:</span>
                          <strong className="text-foreground">{task.assignedAgency}</strong>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Allocated Force:</span>
                          <strong className="text-foreground">{task.allocatedPersonnel} Specialists</strong>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-muted-foreground block text-[10px]">Heavy Equipment:</span>
                          <strong className="text-foreground">{task.equipmentRequired.join(", ")}</strong>
                        </div>
                      </div>

                      {/* Tactical Status Transition Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-[11px]">
                        <span className="text-muted-foreground font-mono">
                          Action: {task.actionType.replace(/_/g, " ")}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {task.status === "PENDING_DISPATCH" && (
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 text-xs font-bold gap-1 shadow-sm"
                              onClick={() => handleUpdateStatus(task.id, "DEPLOYED")}
                            >
                              <Play className="w-3 h-3" />
                              Deploy Unit
                            </Button>
                          )}

                          {task.status === "DEPLOYED" && (
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 text-xs font-bold gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                              onClick={() => handleUpdateStatus(task.id, "IN_PROGRESS")}
                            >
                              <Radio className="w-3 h-3" />
                              Start Operations
                            </Button>
                          )}

                          {task.status === "IN_PROGRESS" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs font-bold text-emerald-600 border-emerald-500/40 hover:bg-emerald-500/10"
                              onClick={() => handleUpdateStatus(task.id, "COMPLETED")}
                            >
                              <Check className="w-3 h-3" />
                              Mark Resolved
                            </Button>
                          )}

                          {task.status === "COMPLETED" && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Mission Accomplished
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Column: Assigned Specialized Response Fleet (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="border bg-card shadow-md">
                <CardHeader className="p-4 border-b bg-muted/40">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" />
                    <CardTitle className="text-sm font-bold text-foreground">
                      Active Emergency Response Units
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    SDRF, BRO, and District Quick Reaction Teams
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-3 space-y-3 text-xs">
                  {SPECIALIZED_TEAMS.map((team, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border bg-card/80 space-y-1.5 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <strong className="text-foreground leading-tight text-xs">
                          {team.name}
                        </strong>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                            team.status === "DEPLOYED"
                              ? "bg-rose-500/20 text-rose-700 dark:text-rose-300"
                              : team.status === "ACTIVE"
                              ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                              : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          {team.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-muted-foreground font-mono space-y-0.5">
                        <div>Base: {team.base}</div>
                        <div>Strength: {team.strength}</div>
                        <div>Kit: {team.equipment}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageShell>
    </AuthGuard>
  );
}
