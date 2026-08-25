"use client";

import React from "react";
import { useAuth } from "./AuthContext";
import { UserRole } from "@/types/fieldReport";
import { ShieldAlert, LogIn, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export function AuthGuard({
  children,
  allowedRoles,
  fallbackTitle = "Authorized Personnel Access Only",
  fallbackDescription = "This decision-support matrix or command operation requires disaster authority or field officer credentials.",
}: AuthGuardProps) {
  const { role, switchRole } = useAuth();

  const isAllowed = allowedRoles.includes(role);

  if (isAllowed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-amber-500/40 bg-amber-50/30 dark:bg-amber-950/10 shadow-lg text-center">
        <CardHeader className="pb-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <CardTitle className="text-base font-bold text-foreground">
            {fallbackTitle}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1">
            {fallbackDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded bg-muted/60 text-xs text-muted-foreground">
            Current session role: <strong className="text-foreground uppercase">{role}</strong>
            <br />
            Required role: <strong className="text-foreground font-mono">{allowedRoles.join(" or ")}</strong>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Demo Elevation:
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {allowedRoles.includes("ADMIN") && (
                <Button
                  size="sm"
                  variant="default"
                  className="text-xs"
                  onClick={() => switchRole("ADMIN")}
                >
                  Switch to Authority (Admin)
                </Button>
              )}
              {allowedRoles.includes("FIELD_OFFICER") && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => switchRole("FIELD_OFFICER")}
                >
                  Switch to Field Officer
                </Button>
              )}
            </div>
          </div>

          <div className="pt-2 border-t flex justify-center">
            <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
              <Link href="/dashboard">
                <ArrowLeft className="w-3 h-3" /> Back to Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
