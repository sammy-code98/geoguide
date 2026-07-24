import api from "../utils/axios";
import type { Place, PlaceCategory } from "../types/place";

interface GetPlacesParams {
  category: PlaceCategory;
  location: string;
  gl?: string;
}

/** Discover places for a category near a location (normalized). */
export const getPlaces = async ({
  category,
  location,
  gl,
}: GetPlacesParams): Promise<Place[]> => {
  const { data } = await api.get<Place[]>("/places", {
    params: { category, location, gl },
  });
  return data;
};
