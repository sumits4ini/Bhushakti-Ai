"use client";

import React, { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { RoleProvider } from "./RoleSwitcher";
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
    <RoleProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
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
    </RoleProvider>
  );
}
