import { EnvironmentalFeatures, RiskPredictionResult, IRiskModel } from "@/types/riskEngine";
import { riskEngine } from "./riskEngine";

export interface ScenarioPreset {
  id: string;
  name: string;
  location: string;
  description: string;
  features: EnvironmentalFeatures;
}

export const SCENARIO_PRESETS: ScenarioPreset[] = [
  {
    id: "aizawl-deluge",
    name: "Extreme Monsoon Deluge (Aizawl NH-54)",
    location: "Aizawl, Mizoram (Hunthar Corridor)",
    description: "Continuous 118mm deluge combined with 84% soil moisture and active 12cm road fissure.",
    features: {
      rainfall_1h: 24.5,
      rainfall_6h: 68.0,
      rainfall_24h: 118.5,
      rainfall_72h: 242.0,
      soil_moisture: 84.5,
      slope: 38.5,
      elevation: 1132,
      land_cover: "ROAD_CUT",
      historical_event_density: 8,
      distance_to_road: 20,
      satellite_change_score: 0.75,
      field_report_score: 15,
    },
  },
  {
    id: "sikkim-cloudburst",
    name: "Severe Cloudburst & Schist Overburden (Gangtok NH-10)",
    location: "Likhuphir 29th Mile, East Sikkim",
    description: "146mm torrential cloudburst over saturated steep schist cut slope causing total highway severance.",
    features: {
      rainfall_1h: 32.0,
      rainfall_6h: 88.0,
      rainfall_24h: 146.0,
      rainfall_72h: 310.0,
      soil_moisture: 91.0,
      slope: 44.0,
      elevation: 920,
      land_cover: "ROAD_CUT",
      historical_event_density: 14,
      distance_to_road: 10,
      satellite_change_score: 0.88,
      field_report_score: 15,
    },
  },
  {
    id: "shillong-runoff",
    name: "Pre-Monsoon Squall on Karstic Escarpment (Shillong-Cherra)",
    location: "Sohra-Shella Rim, East Khasi Hills",
    description: "Moderate 76mm squall on steep 35° limestone terrain with moderate topsoil saturation.",
    features: {
      rainfall_1h: 12.0,
      rainfall_6h: 42.0,
      rainfall_24h: 76.0,
      rainfall_72h: 160.0,
      soil_moisture: 72.0,
      slope: 35.0,
      elevation: 1480,
      land_cover: "DEGRADED_SCRUB",
      historical_event_density: 11,
      distance_to_road: 120,
      satellite_change_score: 0.45,
      field_report_score: 6,
    },
  },
  {
    id: "dry-stable",
    name: "Dry Season Baseline (Tripura Baramura Range)",
    location: "West Tripura (NH-8 Highway)",
    description: "Clear weather, dry soil conditions, gentle slope gradient below friction threshold.",
    features: {
      rainfall_1h: 0.0,
      rainfall_6h: 0.0,
      rainfall_24h: 4.0,
      rainfall_72h: 12.0,
      soil_moisture: 32.0,
      slope: 22.0,
      elevation: 260,
      land_cover: "FOREST_CANOPY",
      historical_event_density: 2,
      distance_to_road: 250,
      satellite_change_score: 0.10,
      field_report_score: 0,
    },
  },
];

export class MLModelService {
  private activeEngine: IRiskModel = riskEngine;

  /**
   * Evaluate risk for any set of environmental features
   */
  public evaluateFeatures(features: EnvironmentalFeatures): RiskPredictionResult {
    return this.activeEngine.predict(features);
  }

  /**
   * Get model metadata
   */
  public getMetadata() {
    return this.activeEngine.getModelMetadata();
  }
}

export const mlModelService = new MLModelService();
