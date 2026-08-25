import React from "react";
import { RiskLevel } from "@/types/risk";
import { getRiskConfig } from "@/lib/risk/riskStatus";
import { cn } from "@/lib/utils";
import { ShieldCheck, AlertCircle, AlertTriangle, Flame } from "lucide-react";

interface RiskBadgeProps {
  levelOrScore: RiskLevel | number;
  showScore?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RiskBadge({
  levelOrScore,
  showScore = true,
  showIcon = true,
  size = "md",
  className,
}: RiskBadgeProps) {
  const config = getRiskConfig(levelOrScore);
  const score = typeof levelOrScore === "number" ? Math.round(levelOrScore) : undefined;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5 font-medium",
    lg: "px-3.5 py-1.5 text-sm gap-2 font-semibold",
  };

  const getIcon = () => {
    switch (config.level) {
      case "LOW":
        return <ShieldCheck className="w-3.5 h-3.5" />;
      case "MODERATE":
        return <AlertCircle className="w-3.5 h-3.5" />;
      case "HIGH":
        return <AlertTriangle className="w-3.5 h-3.5" />;
      case "CRITICAL":
        return <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border transition-all select-none",
        config.badgeBg,
        config.badgeText,
        config.badgeBorder,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && getIcon()}
      <span>{config.level}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 opacity-85 font-mono text-[0.85em]">
          ({score}/100)
        </span>
      )}
    </span>
  );
}
