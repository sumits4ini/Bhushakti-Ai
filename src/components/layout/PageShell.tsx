"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { AuthProvider } from "@/components/auth/AuthContext";
import { I18nProvider } from "@/components/i18n/I18nContext";
import { OfflineSyncBanner } from "@/components/common/OfflineSyncBanner";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  className?: string;
}

export function PageShell({
  children,
  showSidebar = true,
  className,
}: PageShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <I18nProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
          {/* Offline / Auto-Sync Banner */}
          <OfflineSyncBanner />

          {/* Top Sticky Header */}
          <Header
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            sidebarOpen={sidebarOpen}
          />

          <div className="flex-1 flex">
            {showSidebar && (
              <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
              />
            )}

            <main
              className={cn(
                "flex-1 flex flex-col transition-all duration-300 w-full overflow-x-hidden",
                showSidebar ? "lg:pl-64" : "",
                className
              )}
            >
              {children}
            </main>
          </div>
        </div>
      </AuthProvider>
    </I18nProvider>
  );
}
