import "dotenv/config";



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

  restCountries: {
    baseUrl: withDefault("REST_COUNTRIES_BASE_URL", "https://countries.dev"),
  },

  gemini: {
    apiKey: optional("GEMINI_API_KEY"),
    baseUrl: withDefault(
      "GEMINI_BASE_URL",
      "https://generativelanguage.googleapis.com/v1beta",
    ),

    flashModel: withDefault("GEMINI_MODEL", "gemini-3.6-flash"),
    proModel: withDefault("GEMINI_MODEL_PRO", "gemini-3.1-pro-preview"),
  },

  serpstack: {
    apiKey: optional("SERPSTACK_API_KEY"),
    baseUrl: withDefault("SERPSTACK_BASE_URL", "https://api.serpstack.com"),
  },

  geocoding: {
    baseUrl: withDefault(
      "GEOCODING_BASE_URL",
      "https://geocoding-api.open-meteo.com/v1",
    ),
  },

  openWeather: {
    apiKey: optional("OPENWEATHER_API_KEY"),
    baseUrl: withDefault(
      "OPENWEATHER_BASE_URL",
      "https://api.openweathermap.org/data/2.5",
    ),
  },

  exchangeRate: {
    apiKey: optional("EXCHANGERATE_API_KEY"),
    baseUrl: withDefault(
      "EXCHANGERATE_BASE_URL",
      "https://v6.exchangerate-api.com/v6",
    ),
  },
} as const;

export const isProduction = env.nodeEnv === "production";


export const integrations = {
  gemini: Boolean(env.gemini.apiKey),
  serpstack: Boolean(env.serpstack.apiKey),
  openWeather: Boolean(env.openWeather.apiKey),
  exchangeRate: Boolean(env.exchangeRate.apiKey),
  restCountries: true, // keyless public API
  geocoding: true, // keyless public API
} as const;

export type IntegrationName = keyof typeof integrations;
