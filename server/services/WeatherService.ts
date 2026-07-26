import type { AxiosInstance } from "axios";
import { env } from "../config/env";
import { createHttpClient } from "../lib/httpClient";
import { TtlCache } from "../lib/cache";
import { ApiError } from "../lib/ApiError";

export interface NormalizedWeather {
  location: string;
  temperature: number;
  feelsLike: number;
  description: string;
  icon: string | null;
  humidity: number;
  windSpeed: number;
}

export interface ForecastDay {
  date: string; // YYYY-MM-DD
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string | null;
}

export interface WeatherReport {
  units: string;
  current: NormalizedWeather;
  forecast: ForecastDay[];
  tip: string;
}

interface RawWeatherResponse {
  name?: string;
  main?: { temp?: number; feels_like?: number; humidity?: number };
  weather?: { description?: string; icon?: string }[];
  wind?: { speed?: number };
}

interface RawForecastItem {
  dt_txt?: string;
  main?: { temp?: number; temp_min?: number; temp_max?: number };
  weather?: { description?: string; icon?: string }[];
}
interface RawForecastResponse {
  list?: RawForecastItem[];
}

/** Wraps OpenWeather. Normalizes to a frontend-safe shape and caches briefly. */
export class WeatherService {
  private readonly http: AxiosInstance;
  private readonly cache = new TtlCache(60 * 10); // 10 minutes

  constructor() {
    this.http = createHttpClient({
      serviceName: "OpenWeather",
      baseURL: env.openWeather.baseUrl,
    });
  }

  private assertConfigured(): string {
    if (!env.openWeather.apiKey) throw ApiError.notConfigured("OpenWeather");
    return env.openWeather.apiKey;
  }

  async getCurrentByCity(city: string, units = "metric"): Promise<NormalizedWeather> {
    const apiKey = this.assertConfigured();
    return this.cache.remember(`current:${city}:${units}`, 60 * 10, async () => {
      const { data } = await this.http.get<RawWeatherResponse>(`/weather`, {
        params: { q: city, units, appid: apiKey },
      });
      return this.normalize(data);
    });
  }

  /** 5-day forecast for a city, aggregated from 3-hourly data into daily entries. */
  async getForecastByCity(city: string, units = "metric"): Promise<ForecastDay[]> {
    const apiKey = this.assertConfigured();
    return this.cache.remember(`forecast:${city}:${units}`, 60 * 30, async () => {
      const { data } = await this.http.get<RawForecastResponse>(`/forecast`, {
        params: { q: city, units, appid: apiKey },
      });
      return this.aggregateForecast(data.list ?? []);
    });
  }

  /** Current weather + forecast + a derived travel tip. */
  async getReportByCity(city: string, units = "metric"): Promise<WeatherReport> {
    const [current, forecast] = await Promise.all([
      this.getCurrentByCity(city, units),
      this.getForecastByCity(city, units),
    ]);
    return { units, current, forecast, tip: buildTravelTip(current, units) };
  }

  private aggregateForecast(list: RawForecastItem[]): ForecastDay[] {
    const byDate = new Map<string, RawForecastItem[]>();
    for (const item of list) {
      const date = item.dt_txt?.slice(0, 10);
      if (!date) continue;
      const bucket = byDate.get(date) ?? [];
      bucket.push(item);
      byDate.set(date, bucket);
    }

    const days: ForecastDay[] = [];
    for (const [date, items] of byDate) {
      const temps = items
        .map((i) => i.main?.temp)
        .filter((t): t is number => typeof t === "number");
      if (temps.length === 0) continue;

      // Representative condition: the entry closest to midday.
      const midday =
        items.find((i) => i.dt_txt?.includes("12:00:00")) ?? items[Math.floor(items.length / 2)];
      const w = midday.weather?.[0];

      days.push({
        date,
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        description: w?.description ?? "",
        icon: w?.icon ?? null,
      });
    }
    return days.slice(0, 5);
  }

  private normalize(data: RawWeatherResponse): NormalizedWeather {
    const w = data.weather?.[0];
    if (data.main?.temp === undefined) {
      throw ApiError.upstream("OpenWeather returned an unexpected response.");
    }
    return {
      location: data.name ?? "Unknown",
      temperature: data.main.temp,
      feelsLike: data.main.feels_like ?? data.main.temp,
      description: w?.description ?? "",
      icon: w?.icon ?? null,
      humidity: data.main.humidity ?? 0,
      windSpeed: data.wind?.speed ?? 0,
    };
  }
}

/** Derives a short, unit-aware travel recommendation from current conditions. */
function buildTravelTip(current: NormalizedWeather, units: string): string {
  const desc = current.description.toLowerCase();
  if (/(rain|drizzle|thunder|storm)/.test(desc)) {
    return "Rain is likely — pack an umbrella or a waterproof jacket.";
  }
  if (/snow/.test(desc)) return "Snowy conditions — bring warm, waterproof layers.";

  // Normalize to Celsius for the temperature thresholds.
  const tempC = units === "imperial" ? ((current.temperature - 32) * 5) / 9 : current.temperature;
  if (tempC >= 32) return "Very hot — stay hydrated and plan indoor activities around midday.";
  if (tempC >= 22) return "Pleasant and warm — great weather for sightseeing.";
  if (tempC >= 12) return "Mild — a light jacket should be enough.";
  if (tempC >= 2) return "Cold — pack warm layers.";
  return "Freezing conditions — dress very warmly.";
}

export const weatherService = new WeatherService();
