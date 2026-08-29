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
// Serpstack's local/related result. Several fields (image_url, url, price) come
// back as empty objects `{}` on lower plans, so treat them defensively.
interface RawLocalResult {
  position?: number;
  title?: string;
  rating?: number;
  reviews?: number;
  address?: string;
  type?: string;
  image_url?: unknown;
  url?: unknown;
}
interface RawSerpstackResponse {
  success?: boolean;
  error?: { info?: string };
  local_results?: RawLocalResult[];
  related_places?: RawLocalResult[];
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

  /** Single Serpstack search call. `gl` is omitted when not provided. */
  private async fetchSearch(
    apiKey: string,
    query: string,
    gl: string | undefined
  ): Promise<RawSerpstackResponse> {
    const { data } = await this.http.get<RawSerpstackResponse>(`/search`, {
      params: {
        access_key: apiKey,
        query,
        ...(gl ? { gl } : {}),
      },
    });
    return data;
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
      let data = await this.fetchSearch(apiKey, query, params.gl);

      // Serpstack's `gl` only accepts Google-recognized country codes; some
      // valid ISO alpha-2 codes (e.g. `ax` for Åland Islands) trigger a generic
      // "request_failed" (327) error. The location is already in the query text,
      // so retry once without geo-targeting rather than failing the request.
      if (data.success === false && params.gl) {
        data = await this.fetchSearch(apiKey, query, undefined);
      }

      if (data.success === false) {
        throw ApiError.upstream(data.error?.info ?? "Serpstack request failed.");
      }

      // Merge local results with related places for a fuller list, de-duped by title.
      const raw = [...(data.local_results ?? []), ...(data.related_places ?? [])];
      const seen = new Set<string>();
      const results: NormalizedPlace[] = [];
      raw.forEach((item, index) => {
        const place = this.normalize(item, index);
        const dedupeKey = place.title.toLowerCase();
        if (seen.has(dedupeKey)) return;
        seen.add(dedupeKey);
        results.push(place);
      });
      return results;
    });
  }

  private normalize(raw: RawLocalResult, index: number): NormalizedPlace {
    const title = raw.title ?? "Unknown place";
    const address = raw.address ?? null;
    return {
      id: `${title}-${raw.position ?? index}`.toLowerCase().replace(/\s+/g, "-"),
      title,
      rating: typeof raw.rating === "number" ? raw.rating : null,
      reviews: typeof raw.reviews === "number" ? raw.reviews : null,
      address,
      category: raw.type ?? null,
      thumbnail: asUrl(raw.image_url),
      phone: null,
      hours: null,
      // Prefer a provided link; otherwise build a Google Maps search link.
      mapsUrl: asUrl(raw.url) ?? buildMapsUrl(title, address),
    };
  }
}

/** Serpstack returns URL-ish fields as strings or (often empty) objects. */
function asUrl(value: unknown): string | null {
  if (typeof value === "string" && value.trim() !== "") return value;
  if (value && typeof value === "object") {
    const obj = value as { link?: unknown; url?: unknown };
    if (typeof obj.link === "string") return obj.link;
    if (typeof obj.url === "string") return obj.url;
  }
  return null;
}

function buildMapsUrl(title: string, address: string | null): string {
  const query = [title, address].filter(Boolean).join(" ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const serpstackService = new SerpstackService();
