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

interface RawWeatherResponse {
  name?: string;
  main?: { temp?: number; feels_like?: number; humidity?: number };
  weather?: { description?: string; icon?: string }[];
  wind?: { speed?: number };
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

export const weatherService = new WeatherService();
