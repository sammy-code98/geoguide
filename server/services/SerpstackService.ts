import type { AxiosInstance } from "axios";
import { env } from "../config/env";
import { createHttpClient } from "../lib/httpClient";
import { TtlCache } from "../lib/cache";
import { ApiError } from "../lib/ApiError";

/**
 * Normalized place shape returned to the frontend. Frontend components must
 * depend ONLY on this contract — never on raw Serpstack response fields.
 */
export interface NormalizedPlace {
  id: string;
  title: string;
  rating: number | null;
  reviews: number | null;
  address: string | null;
  category: string | null;
  thumbnail: string | null;
  phone: string | null;
  hours: string | null;
  mapsUrl: string | null;
}

export interface SerpstackSearchParams {
  /** Free-text query, e.g. "best restaurants in". */
  query: string;
  /** Category label used to build the query, e.g. "restaurants". */
  category?: string;
  /** Location string Serpstack understands, e.g. "Lagos, Nigeria". */
  location?: string;
  /** Country code for geo-targeting (Serpstack `gl`). */
  gl?: string;
}

// Raw Serpstack local-results shape (kept internal to this module).
interface RawLocalResult {
  position?: number;
  title?: string;
  rating?: number;
  reviews?: number;
  address?: string;
  type?: string;
  thumbnail?: string;
  phone?: string;
  hours?: string;
  links?: { directions?: string; website?: string };
}
interface RawSerpstackResponse {
  success?: boolean;
  error?: { info?: string };
  local_results?: RawLocalResult[];
}

/**
 * Wraps the Serpstack search API and normalizes its results. Includes caching
 * to conserve the request quota.
 */
export class SerpstackService {
  private readonly http: AxiosInstance;
  private readonly cache = new TtlCache(60 * 60 * 6); // 6 hours

  constructor() {
    this.http = createHttpClient({
      serviceName: "Serpstack",
      baseURL: env.serpstack.baseUrl,
      timeout: 15_000,
    });
  }

  private assertConfigured(): string {
    if (!env.serpstack.apiKey) throw ApiError.notConfigured("Serpstack");
    return env.serpstack.apiKey;
  }

  private buildQuery(params: SerpstackSearchParams): string {
    const parts = [params.category, params.query].filter(Boolean).join(" ").trim();
    return params.location ? `${parts} in ${params.location}` : parts || params.query;
  }

  /** Search places and return a normalized, frontend-safe list. */
  async searchPlaces(params: SerpstackSearchParams): Promise<NormalizedPlace[]> {
    const apiKey = this.assertConfigured();
    const query = this.buildQuery(params);
    const cacheKey = `places:${query}:${params.gl ?? ""}`;

    return this.cache.remember(cacheKey, 60 * 60 * 6, async () => {
      const { data } = await this.http.get<RawSerpstackResponse>(`/search`, {
        params: {
          access_key: apiKey,
          query,
          ...(params.gl ? { gl: params.gl } : {}),
        },
      });

      if (data.success === false) {
        throw ApiError.upstream(data.error?.info ?? "Serpstack request failed.");
      }

      return (data.local_results ?? []).map((r, index) => this.normalize(r, index));
    });
  }

  private normalize(raw: RawLocalResult, index: number): NormalizedPlace {
    return {
      id: `${raw.title ?? "place"}-${raw.position ?? index}`.toLowerCase().replace(/\s+/g, "-"),
      title: raw.title ?? "Unknown place",
      rating: typeof raw.rating === "number" ? raw.rating : null,
      reviews: typeof raw.reviews === "number" ? raw.reviews : null,
      address: raw.address ?? null,
      category: raw.type ?? null,
      thumbnail: raw.thumbnail ?? null,
      phone: raw.phone ?? null,
      hours: raw.hours ?? null,
      mapsUrl: raw.links?.directions ?? null,
    };
  }
}

export const serpstackService = new SerpstackService();
