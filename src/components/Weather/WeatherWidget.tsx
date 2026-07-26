import { useState } from "react";
import { HiOutlineCloud } from "react-icons/hi";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { useWeather } from "../../hooks/useWeather";
import type { WeatherUnits } from "../../types/weather";

interface WeatherWidgetProps {
  /** City to fetch weather for (e.g. the country's capital). */
  city: string;
}

const iconUrl = (icon: string | null) =>
  icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;

const weekday = (date: string) =>
  new Date(date).toLocaleDateString(undefined, { weekday: "short" });

export default function WeatherWidget({ city }: WeatherWidgetProps): JSX.Element {
  const [units, setUnits] = useState<WeatherUnits>("metric");
  const { data, isLoading, isError, error, refetch } = useWeather(city, units);

  const tempUnit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "m/s" : "mph";
  const round = (n: number) => Math.round(n);

  return (
    <section className="pt-8">
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-textWhite flex items-center gap-2">
            <HiOutlineCloud className="text-primary" />
            Weather in {city}
          </h2>
          <div className="inline-flex rounded-full border border-gray-300 dark:border-gray-600 overflow-hidden text-sm font-semibold">
            {(["metric", "imperial"] as WeatherUnits[]).map((u) => (
              <button
                key={u}
                onClick={() => setUnits(u)}
                className={`px-3 py-1.5 ${
                  units === u
                    ? "bg-primary text-white"
                    : "text-black dark:text-textWhite hover:bg-primary/10"
                }`}
              >
                {u === "metric" ? "°C" : "°F"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          {isLoading && (
            <div className="h-40 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
          )}

          {isError && !isLoading && (
            <div className="flex flex-col items-center gap-3 py-8 text-center bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-2xl">
              <p className="text-textGray dark:text-textWhite">
                {(error as Error)?.message || "Weather data is currently unavailable."}
              </p>
              <button
                onClick={() => refetch()}
                className="py-2 px-5 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
              >
                Try again
              </button>
            </div>
          )}

          {data && !isLoading && !isError && (
            <div className="space-y-4">
              {/* Current + tip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 bg-gradient-to-br from-cyan-500 to-blue-500 text-white rounded-2xl p-5 flex items-center gap-4">
                  {iconUrl(data.current.icon) && (
                    <img
                      src={iconUrl(data.current.icon) as string}
                      alt={data.current.description}
                      className="w-20 h-20"
                    />
                  )}
                  <div>
                    <p className="text-4xl font-bold">
                      {round(data.current.temperature)}
                      {tempUnit}
                    </p>
                    <p className="capitalize">{data.current.description}</p>
                    <p className="text-sm opacity-90">
                      Feels like {round(data.current.feelsLike)}
                      {tempUnit}
                    </p>
                  </div>
                  <div className="ml-auto text-sm space-y-2">
                    <p className="flex items-center gap-1">
                      <WiHumidity className="text-2xl" />
                      {data.current.humidity}%
                    </p>
                    <p className="flex items-center gap-1">
                      <WiStrongWind className="text-2xl" />
                      {Math.round(data.current.windSpeed)} {windUnit}
                    </p>
                  </div>
                </div>

                <div className="bg-white/70 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-600 rounded-2xl p-5 flex items-start gap-2">
                  <MdOutlineTipsAndUpdates className="text-primary text-xl shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-black dark:text-textWhite">Travel tip</p>
                    <p className="text-textGray dark:text-textWhite leading-relaxed">
                      {data.tip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Forecast */}
              {data.forecast.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {data.forecast.map((day) => (
                    <div
                      key={day.date}
                      className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-2xl p-3 text-center"
                    >
                      <p className="font-semibold text-black dark:text-textWhite">
                        {weekday(day.date)}
                      </p>
                      {iconUrl(day.icon) && (
                        <img
                          src={iconUrl(day.icon) as string}
                          alt={day.description}
                          className="w-14 h-14 mx-auto"
                        />
                      )}
                      <p className="text-sm text-black dark:text-textWhite">
                        <span className="font-bold">{day.tempMax}{tempUnit}</span>{" "}
                        <span className="text-textGray dark:text-grayish">
                          {day.tempMin}{tempUnit}
                        </span>
                      </p>
                      <p className="text-xs text-textGray dark:text-grayish capitalize line-clamp-1">
                        {day.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
