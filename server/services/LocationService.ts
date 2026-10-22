import type { AxiosInstance } from "axios";
import { env } from "../config/env.js";
import { createHttpClient } from "../lib/httpClient.js";
import { TtlCache } from "../lib/cache.js";

/** A place suggestion for location autocomplete. */
export interface LocationSuggestion {
  id: string;
  name: string;
  /** State / province / district, when known. */
  region: string | null;
  country: string | null;
  countryCode: string | null;
  latitude: number;
  longitude: number;
}

interface RawGeocodingResult {
  id?: number;
  name?: string;
  latitude?: number;
  longitude?: number;
  feature_code?: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  population?: number;
}

interface RawGeocodingResponse {
  results?: RawGeocodingResult[];
}

/** Lower-case and strip accents, so "sao" matches "São Paulo". */
const fold = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

/** Below this, a place only shows when there aren't enough better matches. */
const MIN_POPULATION = 5_000;
const isKnown = (r: RawGeocodingResult) => (r.population ?? 0) >= MIN_POPULATION;

/** Population, with capitals and regional seats lifted above similar-sized towns. */
function importance(r: RawGeocodingResult): number {
  const boost = r.feature_code === "PPLC" ? 10 : r.feature_code?.startsWith("PPLA") ? 2 : 1;
  return (r.population ?? 0) * boost;
}

/** Open-Meteo geocoding, trimmed to populated places travellers search for. */
export class LocationService {
  private readonly http: AxiosInstance;
  // Place names barely change; a day keeps repeat keystrokes off the upstream.
  private readonly cache = new TtlCache(60 * 60 * 24);

  constructor() {
    this.http = createHttpClient({
      serviceName: "Open-Meteo geocoding",
      label: "Location search",
      baseURL: env.geocoding.baseUrl,
      timeout: 6_000,
    });
  }

  async search(query: string, limit = 6): Promise<LocationSuggestion[]> {
    const q = fold(query.trim());
    return this.cache.remember(`search:${q}:${limit}`, 60 * 60 * 24, async () => {
      const { data } = await this.http.get<RawGeocodingResponse>("/search", {
        // Over-fetch, then drop non-places (rivers, regions, airports…).
        params: { name: q, count: Math.max(limit * 3, 15), language: "en", format: "json" },
      });
      const seen = new Set<string>();
      return (data.results ?? [])
        .filter((r) => r.name && r.latitude !== undefined && r.longitude !== undefined)
        .filter((r) => !r.feature_code || r.feature_code.startsWith("PPL"))
        // The upstream also matches alternate names ("par" → Belém); keep only
        // places whose own name starts with what was typed.
        .filter((r) => fold(r.name!).split(/[\s-]+/).some((_, i, words) => words.slice(i).join(" ").startsWith(q)))
        // Places travellers mean: capitals and sizeable towns before hamlets.
        .sort((a, b) => importance(b) - importance(a))
        .filter((r, _, all) => (r.population ?? 0) >= MIN_POPULATION || all.filter(isKnown).length < limit)
        .map<LocationSuggestion>((r) => ({
          id: String(r.id ?? `${r.name}-${r.latitude}-${r.longitude}`),
          name: r.name!,
          region: r.admin1 && r.admin1 !== r.name ? r.admin1 : null,
          country: r.country ?? null,
          countryCode: r.country_code ?? null,
          latitude: r.latitude!,
          longitude: r.longitude!,
        }))
        .filter((r) => {
          // The same town can appear twice (city + municipality); keep one.
          const key = `${r.name}|${r.region}|${r.country}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .slice(0, limit);
    });
  }
}

export const locationService = new LocationService();
