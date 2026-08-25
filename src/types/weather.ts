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

export interface WeatherForecastDay {
  date: string;
  dayLabel: string;
  expectedRainfallMm: number;
  condition: 'HEAVY_MONSOON_DELUGE' | 'MODERATE_RAIN' | 'LIGHT_SHOWERS' | 'OVERCAST' | 'CLEAR';
  maxTempC: number;
  minTempC: number;
  soilMoistureSaturationRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
}
