import { useQuery } from "@tanstack/react-query";
import { getPlaces } from "../api/places.api";
import { QueryKey } from "../utils/queryKeys";
import type { PlaceCategory } from "../types/place";

/**
 * Fetches places for a category near a location. Disabled until a category is
 * selected, so no Serpstack quota is spent on page load.
 */
export function usePlaces(params: {
  category: PlaceCategory | null;
  location: string;
  gl?: string;
}) {
  return useQuery({
    queryKey: [QueryKey.places, params.category, params.location],
    queryFn: () =>
      getPlaces({
        category: params.category as PlaceCategory,
        location: params.location,
        gl: params.gl,
      }),
    enabled: Boolean(params.category) && Boolean(params.location),
    staleTime: 1000 * 60 * 30,
  });
}
