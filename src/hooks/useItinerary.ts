import { useMutation } from "@tanstack/react-query";
import { generateItinerary } from "../api/itinerary.api";

export function useItinerary() {
  return useMutation({ mutationFn: generateItinerary });
}
