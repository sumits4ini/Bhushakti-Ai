"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Map,
  BrainCircuit,
  AlertTriangle,
  FileText,
  ShieldAlert,
  CloudRain,
  Camera,
  Settings,
  Radio,
  Flame,
  ChevronRight,
} from "lucide-react";
import { useUserRole } from "./RoleSwitcher";
import { useI18n } from "@/components/i18n/I18nContext";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

interface NavItem {
  title: string;
  hindiTitle: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeVariant?: "default" | "critical" | "warning";
  highlight?: boolean;
  roles?: string[];
}

interface NavSection {
  title: string;
  hindiTitle: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Disaster Intelligence",
    hindiTitle: "आपदा विश्लेषण",
    items: [
      {
        title: "Command Center",
        hindiTitle: "आपदा नियंत्रण कक्ष",
        href: "/dashboard",
        icon: LayoutDashboard,
        badge: "Live",
      },
      {
        title: "GIS Spatial Map",
        hindiTitle: "जीआईएस मानचित्र",
        href: "/map",
        icon: Map,
        badge: "Vector",
      },
      {
        title: "Risk Intelligence",
        hindiTitle: "जोखिम विश्लेषण",
        href: "/risk",
        icon: BrainCircuit,
      },
      {
        title: "24h Hazard Forecast",
        hindiTitle: "24-घंटे पूर्वानुमान",
        href: "/forecast",
        icon: CloudRain,
      },
    ],
  },
  {
    title: "Field Intelligence",
    hindiTitle: "क्षेत्रीय आसूचना",
    items: [
      {
        title: "Field Ground Truth",
        hindiTitle: "क्षेत्रीय रिपोर्ट",
        href: "/reports",
        icon: FileText,
      },
      {
        title: "Submit Field Report",
        hindiTitle: "रिपोर्ट दर्ज करें",
        href: "/field-report",
        icon: Camera,
        highlight: true,
      },
    ],
  },
  {
    title: "Alerts & Response",
    hindiTitle: "चेतावनी एवं प्रतिक्रिया",
    items: [
      {
        title: "Emergency Alerts",
        hindiTitle: "आपातकालीन चेतावनी",
        href: "/alerts",
        icon: AlertTriangle,
        badge: "4 Active",
        badgeVariant: "critical",
      },
      {
        title: "Response Dispatch",
        hindiTitle: "प्रतिक्रिया केंद्र",
        href: "/response",
        icon: ShieldAlert,
        badge: "P1-P4",
      },
    ],
  },
  {
    title: "Live Simulation",
    hindiTitle: "लाइव सिमुलेशन",
    items: [
      {
        title: "Disaster Simulation",
        hindiTitle: "आपदा सिमुलेशन",
        href: "/simulation",
        icon: Flame,
        badge: "DEMO",
        badgeVariant: "critical",
        highlight: true,
      },
    ],
  },
  {
    title: "System",
    hindiTitle: "प्रणाली",
    items: [
      {
        title: "System Settings",
        hindiTitle: "सिस्टम सेटिंग्स",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { role } = useUserRole();
  const { language } = useI18n();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-30 w-64 border-r border-border/80 bg-card/95 backdrop-blur-md transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col justify-between shadow-lg",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="py-3 px-3 space-y-4 overflow-y-auto flex-1">
          {NAV_SECTIONS.map((section, idx) => {
            const visibleItems = section.items.filter(
              (item) => !item.roles || item.roles.includes(role)
            );

            if (visibleItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <div className="px-2.5 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/80">
                  {language === "hi" ? section.hindiTitle : section.title}
                </div>

                <nav className="space-y-0.5">
                  {visibleItems.map((item) => {
                    const isActive = pathname === item.href;
                    const IconComponent = item.icon;
                    const label = language === "hi" ? item.hindiTitle : item.title;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => {
                          if (onClose && window.innerWidth < 1024) {
                            onClose();
                          }
                        }}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group relative",
                          isActive
                            ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
                          item.highlight && !isActive
                            ? "bg-rose-500/10 border border-rose-500/25 text-rose-700 dark:text-rose-300 font-semibold"
                            : ""
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <IconComponent
                            className={cn(
                              "w-4 h-4 transition-transform group-hover:scale-110",
                              isActive
                                ? "text-primary-foreground"
                                : item.highlight
                                ? "text-rose-500"
                                : "text-muted-foreground"
                            )}
                          />
                          <span>{label}</span>
                        </div>

                        {item.badge && (
                          <span
                            className={cn(
                              "text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase",
                              isActive
                                ? "bg-primary-foreground/20 text-primary-foreground"
                                : item.badgeVariant === "critical"
                                ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        {/* Bottom Status Box */}
        <div className="p-3 border-t border-border/80 bg-muted/30 text-[11px] space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>Sensors Telemetry</span>
            </span>
            <span className="font-bold text-foreground">ONLINE (38)</span>
          </div>
          <div className="text-[10px] text-muted-foreground leading-tight">
            Decision Support System • MDoNER SIH26001
          </div>
        </div>
      </aside>
    </>
  );
}
