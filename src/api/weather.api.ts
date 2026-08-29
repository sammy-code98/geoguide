import api from "../utils/axios";
import type { WeatherReport, WeatherUnits } from "../types/weather";

/** Current weather + forecast + travel tip for a city. */
export const getWeather = async ({
  city,
  units,
}: {
  city: string;
  units: WeatherUnits;
}): Promise<WeatherReport> => {
  const { data } = await api.get<WeatherReport>("/weather", {
    params: { city, units },
  });
  return data;
};
