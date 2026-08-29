import { useQuery } from "@tanstack/react-query";
import { getWeather } from "../api/weather.api";
import { QueryKey } from "../utils/queryKeys";
import type { WeatherUnits } from "../types/weather";

/** Fetches the weather report for a city. Disabled until a city is provided. */
export function useWeather(city: string | null, units: WeatherUnits) {
  return useQuery({
    queryKey: [QueryKey.weather, city, units],
    queryFn: () => getWeather({ city: city as string, units }),
    enabled: Boolean(city),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}
