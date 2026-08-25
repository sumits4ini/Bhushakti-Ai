import {
  CurrentWeather,
  WeatherForecast24h,
  RainfallHistory,
  HourlyForecastStep,
  IWeatherProvider,
} from "@/types/weather";
import { getRiskLevelFromScore } from "@/lib/risk/riskStatus";

export class DemoWeatherProvider implements IWeatherProvider {
  private baseLocations: Record<string, CurrentWeather> = {
    aizawl: {
      locationId: "aizawl",
      locationName: "Hunthar / NH-54 Corridor",
      districtName: "Aizawl",
      state: "Mizoram",
      temperatureC: 22.4,
      humidityPct: 88,
      windSpeedKmh: 18.5,
      windDirection: "SSW",
      rainfall1hMm: 14.5,
      rainfall6hMm: 48.0,
      rainfall24hMm: 86.5,
      rainfall72hMm: 178.0,
      soilMoisturePct: 76.5,
      condition: "HEAVY_MONSOON_DELUGE",
      observedAt: new Date().toISOString(),
      stationSource: "IMD AWS Aizawl (Station #42981)",
    },
    gangtok: {
      locationId: "gangtok",
      locationName: "29th Mile / Likhuphir",
      districtName: "East Sikkim",
      state: "Sikkim",
      temperatureC: 18.2,
      humidityPct: 92,
      windSpeedKmh: 24.0,
      windDirection: "NW",
      rainfall1hMm: 22.0,
      rainfall6hMm: 64.0,
      rainfall24hMm: 112.0,
      rainfall72hMm: 240.0,
      soilMoisturePct: 85.0,
      condition: "HEAVY_MONSOON_DELUGE",
      observedAt: new Date().toISOString(),
      stationSource: "IMD AWS Gangtok (Station #42295)",
    },
    shillong: {
      locationId: "shillong",
      locationName: "Sohra-Shella Escarpment",
      districtName: "East Khasi Hills",
      state: "Meghalaya",
      temperatureC: 19.5,
      humidityPct: 86,
      windSpeedKmh: 14.2,
      windDirection: "S",
      rainfall1hMm: 8.5,
      rainfall6hMm: 32.0,
      rainfall24hMm: 62.0,
      rainfall72hMm: 130.0,
      soilMoisturePct: 68.0,
      condition: "MODERATE_RAIN",
      observedAt: new Date().toISOString(),
      stationSource: "IMD AWS Cherrapunjee (Station #42515)",
    },
    kohima: {
      locationId: "kohima",
      locationName: "Phesama / Zubza Bypass",
      districtName: "Kohima",
      state: "Nagaland",
      temperatureC: 20.1,
      humidityPct: 82,
      windSpeedKmh: 11.0,
      windDirection: "NE",
      rainfall1hMm: 6.0,
      rainfall6hMm: 24.0,
      rainfall24hMm: 48.0,
      rainfall72hMm: 95.0,
      soilMoisturePct: 62.0,
      condition: "MODERATE_RAIN",
      observedAt: new Date().toISOString(),
      stationSource: "IMD AWS Kohima (Station #42623)",
    },
    itanagar: {
      locationId: "itanagar",
      locationName: "Banderdewa / Karsingsa",
      districtName: "Papum Pare",
      state: "Arunachal Pradesh",
      temperatureC: 24.0,
      humidityPct: 84,
      windSpeedKmh: 12.5,
      windDirection: "E",
      rainfall1hMm: 10.0,
      rainfall6hMm: 38.0,
      rainfall24hMm: 72.0,
      rainfall72hMm: 145.0,
      soilMoisturePct: 70.0,
      condition: "HEAVY_MONSOON_DELUGE",
      observedAt: new Date().toISOString(),
      stationSource: "IMD AWS Itanagar (Station #42308)",
    },
  };

  public async getCurrentWeather(locationId: string, isScenarioActive: boolean = false): Promise<CurrentWeather> {
    const base = this.baseLocations[locationId] || this.baseLocations.aizawl;

    if (!isScenarioActive) {
      return { ...base };
    }

    // Heavy Rainfall Monsoon Scenario: Simulated Extreme Cloudburst
    return {
      ...base,
      temperatureC: base.temperatureC - 2.5,
      humidityPct: 98,
      windSpeedKmh: base.windSpeedKmh + 16.0,
      windDirection: "SSW",
      rainfall1hMm: base.rainfall1hMm + 24.0,   // e.g. 38.5 mm/h torrential
      rainfall6hMm: base.rainfall6hMm + 48.0,   // e.g. 96.0 mm
      rainfall24hMm: base.rainfall24hMm + 78.0, // e.g. 164.5 mm
      rainfall72hMm: base.rainfall72hMm + 134.0,// e.g. 312.0 mm
      soilMoisturePct: Math.min(95, base.soilMoisturePct + 15), // e.g. 91.5%
      condition: "HEAVY_MONSOON_DELUGE",
      stationSource: `${base.stationSource} [SIMULATED SCENARIO ACTIVE]`,
    };
  }

  public async getForecast(locationId: string, isScenarioActive: boolean = false): Promise<WeatherForecast24h> {
    const current = await this.getCurrentWeather(locationId, isScenarioActive);

    const steps: HourlyForecastStep[] = isScenarioActive
      ? [
          {
            timeOffset: "Now",
            timestamp: "Current Hour",
            rainfallMm: current.rainfall1hMm,
            temperatureC: current.temperatureC,
            humidityPct: current.humidityPct,
            soilMoisturePct: current.soilMoisturePct,
            projectedRiskScore: 89,
            projectedRiskLevel: "CRITICAL",
            confidence: 0.94,
            summary: "Severe torrential cloudburst underway; run-off saturation active.",
          },
          {
            timeOffset: "+3h",
            timestamp: "+3 Hours",
            rainfallMm: Math.round(current.rainfall1hMm * 1.2),
            temperatureC: current.temperatureC - 0.5,
            humidityPct: 99,
            soilMoisturePct: Math.min(96, current.soilMoisturePct + 2),
            projectedRiskScore: 94,
            projectedRiskLevel: "CRITICAL",
            confidence: 0.92,
            summary: "Peak orographic deluge band passing over ridge crest.",
          },
          {
            timeOffset: "+6h",
            timestamp: "+6 Hours",
            rainfallMm: Math.round(current.rainfall1hMm * 1.35),
            temperatureC: current.temperatureC - 1.0,
            humidityPct: 99,
            soilMoisturePct: Math.min(98, current.soilMoisturePct + 4),
            projectedRiskScore: 97,
            projectedRiskLevel: "CRITICAL",
            confidence: 0.91,
            summary: "Critical failure window: Bedrock pore water pressure at threshold.",
          },
          {
            timeOffset: "+12h",
            timestamp: "+12 Hours",
            rainfallMm: Math.round(current.rainfall1hMm * 0.6),
            temperatureC: current.temperatureC + 0.5,
            humidityPct: 94,
            soilMoisturePct: Math.min(92, current.soilMoisturePct + 1),
            projectedRiskScore: 88,
            projectedRiskLevel: "CRITICAL",
            confidence: 0.88,
            summary: "Precipitation easing but residual groundwater drainage high.",
          },
          {
            timeOffset: "+24h",
            timestamp: "+24 Hours",
            rainfallMm: Math.round(current.rainfall1hMm * 0.25),
            temperatureC: current.temperatureC + 1.5,
            humidityPct: 86,
            soilMoisturePct: Math.max(65, current.soilMoisturePct - 12),
            projectedRiskScore: 72,
            projectedRiskLevel: "HIGH",
            confidence: 0.86,
            summary: "Monsoon squall dissipating; gradual slope stabilization.",
          },
        ]
      : [
          {
            timeOffset: "Now",
            timestamp: "Current Hour",
            rainfallMm: current.rainfall1hMm,
            temperatureC: current.temperatureC,
            humidityPct: current.humidityPct,
            soilMoisturePct: current.soilMoisturePct,
            projectedRiskScore: current.rainfall24hMm > 80 ? 76 : 58,
            projectedRiskLevel: current.rainfall24hMm > 80 ? "CRITICAL" : "HIGH",
            confidence: 0.91,
            summary: "Steady monsoon showers with moderate seepage.",
          },
          {
            timeOffset: "+3h",
            timestamp: "+3 Hours",
            rainfallMm: Math.round(current.rainfall1hMm * 1.1),
            temperatureC: current.temperatureC,
            humidityPct: current.humidityPct,
            soilMoisturePct: current.soilMoisturePct + 1,
            projectedRiskScore: current.rainfall24hMm > 80 ? 78 : 60,
            projectedRiskLevel: current.rainfall24hMm > 80 ? "CRITICAL" : "HIGH",
            confidence: 0.90,
            summary: "Intermittent rain bands crossing mountain pass.",
          },
          {
            timeOffset: "+6h",
            timestamp: "+6 Hours",
            rainfallMm: Math.round(current.rainfall1hMm * 0.9),
            temperatureC: current.temperatureC + 0.5,
            humidityPct: current.humidityPct - 2,
            soilMoisturePct: current.soilMoisturePct,
            projectedRiskScore: current.rainfall24hMm > 80 ? 74 : 55,
            projectedRiskLevel: current.rainfall24hMm > 80 ? "HIGH" : "HIGH",
            confidence: 0.89,
            summary: "Rainfall intensity diminishing gradually.",
          },
          {
            timeOffset: "+12h",
            timestamp: "+12 Hours",
            rainfallMm: Math.round(current.rainfall1hMm * 0.5),
            temperatureC: current.temperatureC + 1.0,
            humidityPct: current.humidityPct - 6,
            soilMoisturePct: current.soilMoisturePct - 4,
            projectedRiskScore: 48,
            projectedRiskLevel: "MODERATE",
            confidence: 0.87,
            summary: "Dry interval expected with decreasing runoff.",
          },
          {
            timeOffset: "+24h",
            timestamp: "+24 Hours",
            rainfallMm: Math.round(current.rainfall1hMm * 0.2),
            temperatureC: current.temperatureC + 2.0,
            humidityPct: current.humidityPct - 12,
            soilMoisturePct: current.soilMoisturePct - 10,
            projectedRiskScore: 32,
            projectedRiskLevel: "MODERATE",
            confidence: 0.85,
            summary: "Overcast with light mountain mist.",
          },
        ];

    return {
      locationId,
      locationName: current.locationName,
      generatedAt: new Date().toISOString(),
      steps,
      isScenarioActive,
    };
  }

  public async getRainfallHistory(locationId: string, isScenarioActive: boolean = false): Promise<RainfallHistory> {
    const current = await this.getCurrentWeather(locationId, isScenarioActive);

    const mult = isScenarioActive ? 1.6 : 1.0;

    return {
      locationId,
      points: [
        { hourOffset: "-24h", rainfallMm: Math.round(18 * mult), soilMoisturePct: Math.round(62 * mult > 95 ? 90 : 62 * mult), riskScore: Math.min(100, Math.round(45 * mult)) },
        { hourOffset: "-18h", rainfallMm: Math.round(24 * mult), soilMoisturePct: Math.round(68 * mult > 95 ? 91 : 68 * mult), riskScore: Math.min(100, Math.round(52 * mult)) },
        { hourOffset: "-12h", rainfallMm: Math.round(36 * mult), soilMoisturePct: Math.round(74 * mult > 95 ? 93 : 74 * mult), riskScore: Math.min(100, Math.round(64 * mult)) },
        { hourOffset: "-6h",  rainfallMm: Math.round(58 * mult), soilMoisturePct: Math.round(80 * mult > 95 ? 94 : 80 * mult), riskScore: Math.min(100, Math.round(78 * mult)) },
        { hourOffset: "-1h",  rainfallMm: Math.round(current.rainfall1hMm * 0.9), soilMoisturePct: current.soilMoisturePct - 1, riskScore: isScenarioActive ? 86 : 70 },
        { hourOffset: "Now",  rainfallMm: current.rainfall1hMm, soilMoisturePct: current.soilMoisturePct, riskScore: isScenarioActive ? 89 : 76 },
      ],
    };
  }
}

export const weatherProvider: IWeatherProvider = new DemoWeatherProvider();
