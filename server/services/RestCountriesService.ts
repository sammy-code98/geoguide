import type { AxiosInstance } from "axios";
import { env } from "../config/env";
import { createHttpClient } from "../lib/httpClient";
import { TtlCache } from "../lib/cache";
import { ApiError } from "../lib/ApiError";
import type { Country, Currency } from "../types/country";

/**
 * Raw shape returned by countries.dev (kept internal to this module — the rest
 * of the app only ever sees the normalized {@link Country}).
 */
interface RawCountry {
  name?: string;
  nativeName?: string;
  alpha2Code?: string;
  alpha3Code?: string;
  capital?: string;
  region?: string;
  subregion?: string;
  population?: number;
  area?: number;
  populationDensity?: number;
  independent?: boolean;
  flag?: string;
  flags?: { png?: string; svg?: string };
  languages?: { name?: string }[];
  currencies?: { code?: string; name?: string; symbol?: string }[];
  timezones?: string[];
  callingCodes?: string[];
  topLevelDomain?: string[];
  altSpellings?: string[];
  latlng?: number[];
  borders?: string[];
}

/**
 * Wraps the countries.dev API and normalizes its responses. Proxied through the
 * backend so the frontend has a single API surface with server-side caching.
 */
export class RestCountriesService {
  private readonly http: AxiosInstance;
  private readonly cache = new TtlCache(60 * 60); // 1 hour

  constructor() {
    this.http = createHttpClient({
      serviceName: "Countries",
      baseURL: env.restCountries.baseUrl,
      headers: { Accept: "application/json" },
    });
  }

  /** All countries, normalized. */
  async getAll(): Promise<Country[]> {
    return this.cache.remember("all", 60 * 60, async () => {
      const { data } = await this.http.get<RawCountry[]>(`/countries`);
      if (!Array.isArray(data)) {
        throw ApiError.upstream("Countries upstream returned an unexpected response.");
      }
      return data.map(normalizeCountry);
    });
  }

  /** A single country by ISO alpha-2 or alpha-3 code, normalized. */
  async getByCode(code: string): Promise<Country> {
    const key = `code:${code.toUpperCase()}`;
    return this.cache.remember(key, 60 * 60, async () => {
      const { data } = await this.http.get<RawCountry>(`/alpha/${encodeURIComponent(code)}`);
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw ApiError.notFound(`Country not found: ${code}`);
      }
      return normalizeCountry(data);
    });
  }
}

function normalizeCurrencies(raw: RawCountry["currencies"]): Currency[] {
  return (raw ?? [])
    .filter((c) => c && (c.code || c.name || c.symbol))
    .map((c) => ({
      code: c.code ?? "",
      name: c.name ?? "",
      symbol: c.symbol ?? "",
    }));
}

function normalizeCountry(raw: RawCountry): Country {
  const latlng =
    Array.isArray(raw.latlng) && raw.latlng.length >= 2
      ? ([raw.latlng[0], raw.latlng[1]] as [number, number])
      : null;

  return {
    name: raw.name ?? "Unknown",
    nativeName: raw.nativeName || null,
    cca2: raw.alpha2Code ?? "",
    cca3: raw.alpha3Code ?? "",
    capital: raw.capital || null,
    region: raw.region ?? "",
    subregion: raw.subregion || null,
    population: raw.population ?? 0,
    area: typeof raw.area === "number" ? raw.area : null,
    populationDensity:
      typeof raw.populationDensity === "number" ? raw.populationDensity : null,
    independent: typeof raw.independent === "boolean" ? raw.independent : null,
    flagPng: raw.flags?.png ?? "",
    flagSvg: raw.flags?.svg ?? null,
    flagEmoji: raw.flag || null,
    languages: (raw.languages ?? []).map((l) => l.name ?? "").filter(Boolean),
    currencies: normalizeCurrencies(raw.currencies),
    timezones: raw.timezones ?? [],
    callingCodes: (raw.callingCodes ?? []).filter(Boolean),
    topLevelDomains: raw.topLevelDomain ?? [],
    altSpellings: raw.altSpellings ?? [],
    latlng,
    borders: raw.borders ?? [],
  };
}

export const restCountriesService = new RestCountriesService();
