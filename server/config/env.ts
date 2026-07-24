import "dotenv/config";

/**
 * Centralized, typed environment configuration for the backend.
 *
 * Secrets live here and NEVER reach the client bundle — the frontend only ever
 * talks to this Express server, which holds the API keys.
 */

function optional(key: string): string | undefined {
  const value = process.env[key];
  return value && value.trim() !== "" ? value.trim() : undefined;
}

function withDefault(key: string, fallback: string): string {
  return optional(key) ?? fallback;
}

function toInt(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  nodeEnv: withDefault("NODE_ENV", "development"),
  port: toInt(optional("PORT"), 5001),
  corsOrigin: withDefault("CORS_ORIGIN", "http://localhost:5173"),

  // Country data source (countries.dev — REST Countries v3.1/v5 were deprecated).
  restCountries: {
    baseUrl: withDefault("REST_COUNTRIES_BASE_URL", "https://countries.dev"),
  },

  gemini: {
    apiKey: optional("GEMINI_API_KEY"),
    baseUrl: withDefault(
      "GEMINI_BASE_URL",
      "https://generativelanguage.googleapis.com/v1beta"
    ),
    // Flash for lightweight requests, Pro for reasoning-heavy ones (per PRD).
    flashModel: withDefault("GEMINI_MODEL", "gemini-1.5-flash"),
    proModel: withDefault("GEMINI_MODEL_PRO", "gemini-1.5-pro"),
  },

  serpstack: {
    apiKey: optional("SERPSTACK_API_KEY"),
    baseUrl: withDefault("SERPSTACK_BASE_URL", "https://api.serpstack.com"),
  },

  openWeather: {
    apiKey: optional("OPENWEATHER_API_KEY"),
    baseUrl: withDefault("OPENWEATHER_BASE_URL", "https://api.openweathermap.org/data/2.5"),
  },

  exchangeRate: {
    apiKey: optional("EXCHANGERATE_API_KEY"),
    baseUrl: withDefault("EXCHANGERATE_BASE_URL", "https://v6.exchangerate-api.com/v6"),
  },
} as const;

export const isProduction = env.nodeEnv === "production";

/**
 * Reports which integrations are configured (used by the health endpoint and
 * by route handlers to fail fast with a clear message when a key is missing).
 */
export const integrations = {
  gemini: Boolean(env.gemini.apiKey),
  serpstack: Boolean(env.serpstack.apiKey),
  openWeather: Boolean(env.openWeather.apiKey),
  exchangeRate: Boolean(env.exchangeRate.apiKey),
  restCountries: true, // keyless public API
} as const;

export type IntegrationName = keyof typeof integrations;
