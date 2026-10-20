import api, { AI_TIMEOUT_MS } from "../utils/axios";
import type { CountryInsights } from "../types/insights";

/** AI-generated travel insights for a country (by ISO alpha-2/alpha-3 code). */
export const getCountryInsights = async (code: string): Promise<CountryInsights> => {
  const { data } = await api.get<CountryInsights>(`/ai/country/${code}`, { timeout: AI_TIMEOUT_MS });
  return data;
};
