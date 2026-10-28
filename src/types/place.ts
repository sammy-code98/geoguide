export interface Place {
  id: string;
  title: string;
  rating: number | null;
  reviews: number | null;
  address: string | null;
  category: string | null;
  thumbnail: string | null;
  phone: string | null;
  hours: string | null;
  mapsUrl: string | null;
}

export type PlaceCategory =
  | "restaurants"
  | "coffee-shops"
  | "hotels"
  | "museums"
  | "parks"
  | "beaches"
  | "shopping"
  | "attractions"
  | "airports";
