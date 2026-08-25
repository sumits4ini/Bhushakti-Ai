import React from "react";
import { PageShell } from "@/components/layout/PageShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Users, Truck, CheckCircle2, Clock, MapPin, ArrowRight } from "lucide-react";
import { MOCK_RESPONSE_TASKS } from "@/lib/demo";

export default function ResponseMatrixPage() {
  return (
    <PageShell>
      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Emergency Response Prioritization & Dispatch
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400 font-mono font-semibold">
                P1 to P4 Matrix
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Automated task allocation ranking urgency by population density, lifeline highway status, and hazard slope score
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="critical" className="gap-1.5 text-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              Dispatch New Task
            </Button>
          </div>
        </div>

        {/* Priority Legend & Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-lg border bg-rose-500/10 border-rose-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-rose-700 dark:text-rose-300 font-mono">PRIORITY 1</span>
              <span className="text-xs font-bold font-mono">2 Tasks</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Immediate hazard: National Highway blockage or inhabited hamlet surge.</p>
          </div>

          <div className="p-3.5 rounded-lg border bg-orange-500/10 border-orange-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-orange-700 dark:text-orange-300 font-mono">PRIORITY 2</span>
              <span className="text-xs font-bold font-mono">1 Task</span>
            </div>
            <p className="text-[11px] text-muted-foreground">High hazard: State Highway runoff or potential culvert surcharge.</p>
          </div>

          <div className="p-3.5 rounded-lg border bg-amber-500/10 border-amber-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-700 dark:text-amber-300 font-mono">PRIORITY 3</span>
              <span className="text-xs font-bold font-mono">0 Tasks</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Moderate hazard: Rural link road inspection or minor debris clear.</p>
          </div>

          <div className="p-3.5 rounded-lg border bg-emerald-500/10 border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-700 dark:text-emerald-300 font-mono">PRIORITY 4</span>
              <span className="text-xs font-bold font-mono">0 Tasks</span>
            </div>
            <p className="text-[11px] text-muted-foreground">Routine preventive maintenance: Silt removal and drone mapping.</p>
          </div>
        </div>

        {/* Response Tasks List */}
        <div className="space-y-4">
          {MOCK_RESPONSE_TASKS.map((task) => (
            <Card key={task.id} className="border shadow-xs hover:border-primary/40 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg ${
                        task.priority === "P1"
                          ? "bg-rose-500/20 text-rose-600 dark:text-rose-400"
                          : "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                      }`}
                    >
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base font-bold text-foreground">
                          {task.title}
                        </CardTitle>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40">
                          {task.priority}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{task.locationDescription}</span>
                        <span>•</span>
                        <span>{task.districtName}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                        task.status === "IN_PROGRESS"
                          ? "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30"
                          : task.status === "DEPLOYED"
                          ? "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {task.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  {task.description}
                </p>

                {/* Logistics details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg bg-muted/40 border">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Assigned Agency:</span>
                    <strong className="text-foreground">{task.assignedAgency}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Mobilized Personnel:</span>
                    <strong className="text-foreground">{task.allocatedPersonnel} Officers / Crew</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Equipment Deployed:</span>
                    <strong className="text-foreground truncate block">{task.equipmentRequired.join(", ")}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t text-[11px] text-muted-foreground">
                  <div>
                    Estimated Duration: <strong>{task.estimatedCompletionTime || "Under ongoing evaluation"}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                      Update Log
                    </Button>
                    <Button size="sm" variant="default" className="h-7 text-xs">
                      Mark Completed
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
