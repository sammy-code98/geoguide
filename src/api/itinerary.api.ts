import api, { AI_TIMEOUT_MS } from "../utils/axios";
import type { Itinerary, ItineraryInput } from "../types/itinerary";

/** Generate a day-by-day itinerary from the backend. */
export const generateItinerary = async (input: ItineraryInput): Promise<Itinerary> => {
  const { data } = await api.post<Itinerary>("/ai/itinerary", input, { timeout: AI_TIMEOUT_MS });
  return data;
};
