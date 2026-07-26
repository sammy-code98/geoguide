import { useMutation } from "@tanstack/react-query";
import { generateItinerary } from "../api/itinerary.api";

/** Mutation for generating a day-by-day itinerary. */
export function useItinerary() {
  return useMutation({ mutationFn: generateItinerary });
}
