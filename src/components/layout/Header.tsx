"use client";

import React from "react";
import Link from "next/link";
import { Mountain, Menu, X, Camera, Globe2, LogIn, LogOut, User } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { RoleSwitcher } from "./RoleSwitcher";
import { LiveStatusIndicator } from "./LiveStatusIndicator";
import { NotificationBell } from "@/components/common/NotificationBell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthContext";
import { useI18n } from "@/components/i18n/I18nContext";

interface HeaderProps {
  onToggleSidebar?: () => void;
  sidebarOpen?: boolean;
}

export function Header({ onToggleSidebar, sidebarOpen }: HeaderProps) {
  const { user, role, logout } = useAuth();
  const { language, toggleLanguage, t } = useI18n();

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
                  {t.appName}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold hidden sm:inline font-mono">
                  NER
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium hidden sm:block truncate max-w-[280px]">
                {t.ministryName}
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Live Telemetry Status */}
        <div className="hidden md:flex items-center justify-center">
          <LiveStatusIndicator />
        </div>

        {/* Right: Actions, Language, Notifications, Role & Theme */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Quick Citizen / Officer Reporting CTA */}
          <Button asChild size="sm" variant="critical" className="gap-1.5 text-xs shadow-sm">
            <Link href="/field-report">
              <Camera className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t.navFieldReport}</span>
            </Link>
          </Button>

          {/* In-App Notifications Bell */}
          <NotificationBell />

          {/* Role Switcher */}
          <div className="hidden md:block">
            <RoleSwitcher />
          </div>

          {/* User Profile / Login Action */}
          <div className="hidden sm:flex items-center">
            {user && role !== "CITIZEN" ? (
              <div className="flex items-center gap-1.5 pl-2 border-l">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="h-8 px-2 text-xs gap-1 text-muted-foreground hover:text-rose-500"
                  title={`Signed in as ${user.fullName} (${role}) — Click to Logout`}
                >
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden xl:inline truncate max-w-[140px]">{user.fullName.split(" ")[0]}</span>
                  <LogOut className="w-3 h-3 ml-0.5 opacity-60 hover:opacity-100" />
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" size="sm" className="h-8 text-xs gap-1">
                <Link href="/login">
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Language Toggle (EN / हिन्दी) */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="h-8 px-2.5 text-xs gap-1 text-muted-foreground hover:text-foreground font-semibold"
            title="Toggle Language (English / हिन्दी)"
            aria-label="Toggle Language"
          >
            <Globe2 className="w-3.5 h-3.5 text-primary" />
            <span>{language === "en" ? "हिन्दी" : "EN"}</span>
          </Button>

          {/* Dark / Light Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
