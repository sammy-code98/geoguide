import type { AxiosInstance } from "axios";
import { env } from "../config/env";
import { createHttpClient } from "../lib/httpClient";
import { TtlCache } from "../lib/cache";
import { ApiError } from "../lib/ApiError";

export interface ConversionResult {
  base: string;
  target: string;
  rate: number;
  amount: number;
  result: number;
}

interface RawRatesResponse {
  result?: string;
  base_code?: string;
  conversion_rates?: Record<string, number>;
  "error-type"?: string;
}

/** Wraps ExchangeRate-API. Rates are cached (they change slowly). */
export class ExchangeRateService {
  private readonly http: AxiosInstance;
  private readonly cache = new TtlCache(60 * 60); // 1 hour

  constructor() {
    this.http = createHttpClient({
      serviceName: "ExchangeRate",
      baseURL: env.exchangeRate.baseUrl,
    });
  }

  private assertConfigured(): string {
    if (!env.exchangeRate.apiKey) throw ApiError.notConfigured("ExchangeRate");
    return env.exchangeRate.apiKey;
  }

  /** All conversion rates for a base currency (e.g. "USD"). */
  async getRates(base: string): Promise<Record<string, number>> {
    const apiKey = this.assertConfigured();
    const baseCode = base.toUpperCase();
    return this.cache.remember(`rates:${baseCode}`, 60 * 60, async () => {
      const { data } = await this.http.get<RawRatesResponse>(`/${apiKey}/latest/${baseCode}`);
      if (data.result !== "success" || !data.conversion_rates) {
        throw ApiError.upstream(data["error-type"] ?? "ExchangeRate request failed.");
      }
      return data.conversion_rates;
    });
  }

  /** Convert an amount between two currencies. */
  async convert(base: string, target: string, amount: number): Promise<ConversionResult> {
    const rates = await this.getRates(base);
    const targetCode = target.toUpperCase();
    const rate = rates[targetCode];
    if (rate === undefined) {
      throw ApiError.badRequest(`Unsupported target currency: ${target}`);
    }
    return {
      base: base.toUpperCase(),
      target: targetCode,
      rate,
      amount,
      result: Number((amount * rate).toFixed(2)),
    };
  }
}

export const exchangeRateService = new ExchangeRateService();
