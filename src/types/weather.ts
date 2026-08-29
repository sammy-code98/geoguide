export type WeatherUnits = "metric" | "imperial";

export interface CurrentWeather {
  location: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string | null;
  humidity: number;
  windSpeed: number;
}

export interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string | null;
}

/** Weather report from `GET /api/weather`. */
export interface WeatherReport {
  units: string;
  current: CurrentWeather;
  forecast: ForecastDay[];
  tip: string;
}
