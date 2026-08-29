import api from "../utils/axios";
import type { CountryInsights } from "../types/insights";

/** AI-generated travel insights for a country (by ISO alpha-2/alpha-3 code). */
export const getCountryInsights = async (code: string): Promise<CountryInsights> => {
  const { data } = await api.get<CountryInsights>(`/ai/country/${code}`);
  return data;
};
