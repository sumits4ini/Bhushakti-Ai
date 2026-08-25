import { RiskLevel } from "@/types/risk";

export interface RiskLevelConfig {
  level: RiskLevel;
  label: string;
  minScore: number;
  maxScore: number;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  cardBg: string;
  accentColor: string;
  pulseClass: string;
  alertTitle: string;
  summary: string;
  recommendedAction: string;
}

export const RISK_LEVELS: Record<RiskLevel, RiskLevelConfig> = {
  LOW: {
    level: "LOW",
    label: "Low Risk",
    minScore: 0,
    maxScore: 25,
    badgeBg: "bg-emerald-500/15 dark:bg-emerald-500/20",
    badgeText: "text-emerald-700 dark:text-emerald-400",
    badgeBorder: "border-emerald-500/30",
    cardBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    accentColor: "#10b981",
    pulseClass: "",
    alertTitle: "Green Advisory: Stable Conditions",
    summary: "Environmental parameters within normal thresholds. Minimal immediate hazard.",
    recommendedAction: "Maintain standard monitoring and routine telemetry feeds.",
  },
  MODERATE: {
    level: "MODERATE",
    label: "Moderate Risk",
    minScore: 26,
    maxScore: 50,
    badgeBg: "bg-amber-500/15 dark:bg-amber-500/20",
    badgeText: "text-amber-700 dark:text-amber-400",
    badgeBorder: "border-amber-500/30",
    cardBg: "bg-amber-50/50 dark:bg-amber-950/20",
    accentColor: "#f59e0b",
    pulseClass: "",
    alertTitle: "Yellow Advisory: Increased Surveillance",
    summary: "Rainfall or soil moisture rising above seasonal averages on vulnerable slopes.",
    recommendedAction: "Notify local block officers; inspect drainage culverts and road slopes.",
  },
  HIGH: {
    level: "HIGH",
    label: "High Risk",
    minScore: 51,
    maxScore: 75,
    badgeBg: "bg-orange-500/15 dark:bg-orange-500/20",
    badgeText: "text-orange-700 dark:text-orange-400",
    badgeBorder: "border-orange-500/30",
    cardBg: "bg-orange-50/50 dark:bg-orange-950/20",
    accentColor: "#f97316",
    pulseClass: "animate-pulse-slow",
    alertTitle: "Orange Warning: High Landslide Susceptibility",
    summary: "Significant soil saturation combined with steep terrain gradient. High probability of localized slips.",
    recommendedAction: "Pre-position quick response teams, restrict heavy night transit, alert settlement elders.",
  },
  CRITICAL: {
    level: "CRITICAL",
    label: "Critical Risk",
    minScore: 76,
    maxScore: 100,
    badgeBg: "bg-rose-500/20 dark:bg-rose-500/30",
    badgeText: "text-rose-700 dark:text-rose-300 font-bold",
    badgeBorder: "border-rose-500/60 shadow-[0_0_12px_rgba(244,63,94,0.35)]",
    cardBg: "bg-rose-50/70 dark:bg-rose-950/40 border-rose-500/40",
    accentColor: "#f43f5e",
    pulseClass: "animate-pulse ring-2 ring-rose-500/50",
    alertTitle: "Red Alert: Immediate Landslide Danger",
    summary: "Cumulative deluge exceeded geotechnical shear thresholds. Structural fissures or toe failure probable.",
    recommendedAction: "Initiate emergency evacuation of high-slope hamlets; close vulnerable highway corridors immediately.",
  },
};

/**
 * Maps a numeric risk score (0-100) to its corresponding RiskLevel.
 */
export function getRiskLevelFromScore(score: number): RiskLevel {
  const clamped = Math.max(0, Math.min(100, score));
  if (clamped <= 25) return "LOW";
  if (clamped <= 50) return "MODERATE";
  if (clamped <= 75) return "HIGH";
  return "CRITICAL";
}

/**
 * Returns the full styling and metadata config for a given risk score or level.
 */
export function getRiskConfig(input: number | RiskLevel): RiskLevelConfig {
  const level = typeof input === "number" ? getRiskLevelFromScore(input) : input;
  return RISK_LEVELS[level] || RISK_LEVELS.LOW;
}

/**
 * Returns a hex color for map heatmaps / markers.
 */
export function getRiskHexColor(input: number | RiskLevel): string {
  return getRiskConfig(input).accentColor;
}
