import api from "../utils/axios";
import type { Country } from "../types/country";

/** All countries (normalized) from the internal backend. */
export const getCountries = async (): Promise<Country[]> => {
  const { data } = await api.get<Country[]>("/countries");
  return data;
};

/** A single country by ISO alpha-2/alpha-3 code (normalized). */
export const getCountryByCode = async (code: string): Promise<Country> => {
  const { data } = await api.get<Country>(`/countries/${code}`);
  return data;
};
