"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mountain, Shield, UserCheck, Users, ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageShell } from "@/components/layout/PageShell";
import { useAuth } from "@/components/auth/AuthContext";
import { APP_CONFIG } from "@/lib/config/site";
import { UserRole } from "@/types/fieldReport";

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();
  const [email, setEmail] = useState("admin@bhushakti.gov.in");
  const [password, setPassword] = useState("Bhushakti@2026");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDemoSignIn = async (role: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      await switchRole(role);
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell showSidebar={false}>
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary via-blue-700 to-amber-600 flex items-center justify-center text-white mx-auto shadow-lg">
              <Mountain className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              {APP_CONFIG.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              {APP_CONFIG.fullTitle} • {APP_CONFIG.ministry}
            </p>
          </div>

          <Card className="border shadow-lg">
            <CardHeader className="pb-3 text-center">
              <CardTitle className="text-base font-bold text-foreground">
                Secure Authority & Officer Portal
              </CardTitle>
              <CardDescription className="text-xs">
                Select a verified operational persona or sign in with government credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quick Demo Sign-in for SIH Judges */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center">
                  Quick Demo Access (1-Click)
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoSignIn("ADMIN")}
                    className="flex items-center justify-between p-3 rounded-lg border bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-blue-900 dark:text-blue-200">
                          State Disaster Authority (SDMA)
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Full Command, Alerts & Response Matrix
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoSignIn("FIELD_OFFICER")}
                    className="flex items-center justify-between p-3 rounded-lg border bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                          Field Response Officer (SDRF)
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Geo-tagged Reports, Task Updates & Verification
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoSignIn("CITIZEN")}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/60 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded bg-muted text-muted-foreground">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-foreground">
                          Citizen Observer Mode
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Public Warnings & Ground Observation Submission
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t"></div>
                <span className="flex-shrink mx-4 text-[10px] font-mono text-muted-foreground uppercase">
                  or sign in with password
                </span>
                <div className="flex-grow border-t"></div>
              </div>

              {error && (
                <div className="p-2.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Standard Email & Password Form */}
              <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Official Email ID:
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="officer@bhushakti.gov.in"
                      className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-medium text-foreground block mb-1">
                    Password:
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-md border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  size="default"
                  className="w-full font-bold shadow-md"
                  disabled={loading}
                >
                  {loading ? "Authenticating..." : "Sign In to Command Portal"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-[11px] text-muted-foreground">
            <Link href="/" className="hover:underline">
              ← Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
