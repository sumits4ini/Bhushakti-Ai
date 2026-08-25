"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mountain, Menu, X, ShieldAlert, Camera, Globe2 } from "lucide-react";
import { APP_CONFIG } from "@/lib/config/site";
import { ThemeToggle } from "./ThemeToggle";
import { RoleSwitcher } from "./RoleSwitcher";
import { LiveStatusIndicator } from "./LiveStatusIndicator";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export function Header({ onToggleSidebar, sidebarOpen }: HeaderProps) {
  const [lang, setLang] = useState<"en" | "hi">("en");

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "hi" : "en"));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Branding & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={onToggleSidebar}
              aria-label="Toggle navigation menu"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary via-blue-700 to-amber-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all">
              <Mountain className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-foreground">
                  {APP_CONFIG.name}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold hidden sm:inline">
                  NER
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium hidden sm:block truncate max-w-[280px]">
                {APP_CONFIG.ministry}
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Live Telemetry Status */}
        <div className="hidden md:flex items-center justify-center">
          <LiveStatusIndicator />
        </div>

        {/* Right: Actions, Language, Role & Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Citizen / Officer Reporting CTA */}
          <Button asChild size="sm" variant="critical" className="gap-1.5 text-xs shadow-sm">
            <Link href="/field-report">
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Field Report</span>
            </Link>
          </Button>

          {/* Role Switcher */}
          <div className="hidden md:block">
            <RoleSwitcher />
          </div>

          {/* Language Toggle (EN / HI) */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="h-8 px-2.5 text-xs gap-1 text-muted-foreground hover:text-foreground font-mono"
            title="Toggle Language (English / Hindi)"
          >
            <Globe2 className="w-3.5 h-3.5 text-primary" />
            <span>{lang.toUpperCase()}</span>
          </Button>

          {/* Dark / Light Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
