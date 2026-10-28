import api from "../utils/axios";

/** A city / town suggestion from the backend's location search. */
export interface LocationSuggestion {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  countryCode: string | null;
  latitude: number;
  longitude: number;
}

/** Places whose name starts with (or closely matches) `q`. */
export const searchLocations = async (q: string, signal?: AbortSignal): Promise<LocationSuggestion[]> => {
  const { data } = await api.get<LocationSuggestion[]>("/locations", { params: { q }, signal });
  return data;
};
