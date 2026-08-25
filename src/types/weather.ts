import { RiskLevel } from "./risk";

export interface WeatherObservation {
  id: string;
  riskZoneId: string;
  stationName: string;
  rainfall1hMm: number;
  rainfall6hMm: number;
  rainfall24hMm: number;
  rainfall72hMm: number;
  soilMoisturePct: number;
  temperatureC: number;
  humidityPct: number;
  windSpeedKmh: number;
  dataSource: 'IMD_AUTOMATED_WEATHER_STATION' | 'ISRO_MOSDAC' | 'SIMULATED_SENSOR_STREAM';
  observedAt: string;
}

export interface CurrentWeather {
  locationId: string;
  locationName: string;
  districtName: string;
  state: string;
  temperatureC: number;
  humidityPct: number;
  windSpeedKmh: number;
  windDirection: string;
  rainfall1hMm: number;
  rainfall6hMm: number;
  rainfall24hMm: number;
  rainfall72hMm: number;
  soilMoisturePct: number;
  condition: 'HEAVY_MONSOON_DELUGE' | 'MODERATE_RAIN' | 'LIGHT_SHOWERS' | 'OVERCAST' | 'CLEAR';
  observedAt: string;
  stationSource: string;
}

export interface HourlyForecastStep {
  timeOffset: 'Now' | '+3h' | '+6h' | '+12h' | '+24h';
  timestamp: string;
  rainfallMm: number;
  temperatureC: number;
  humidityPct: number;
  soilMoisturePct: number;
  projectedRiskScore: number;
  projectedRiskLevel: RiskLevel;
  confidence: number;
  summary: string;
}

export interface WeatherForecast24h {
  locationId: string;
  locationName: string;
  generatedAt: string;
  steps: HourlyForecastStep[];
  isScenarioActive?: boolean;
}

export interface RainfallHistoryPoint {
  hourOffset: string; // e.g. "-18h", "-12h", "-6h", "-1h", "Now"
  rainfallMm: number;
  soilMoisturePct: number;
  riskScore: number;
}

export interface RainfallHistory {
  locationId: string;
  points: RainfallHistoryPoint[];
}

export interface WeatherForecastDay {
  date: string;
  dayLabel: string;
  expectedRainfallMm: number;
  condition: 'HEAVY_MONSOON_DELUGE' | 'MODERATE_RAIN' | 'LIGHT_SHOWERS' | 'OVERCAST' | 'CLEAR';
  maxTempC: number;
  minTempC: number;
  soilMoistureSaturationRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}

export interface IWeatherProvider {
  getCurrentWeather(locationId: string, isScenarioActive?: boolean): Promise<CurrentWeather>;
  getForecast(locationId: string, isScenarioActive?: boolean): Promise<WeatherForecast24h>;
  getRainfallHistory(locationId: string, isScenarioActive?: boolean): Promise<RainfallHistory>;
}
