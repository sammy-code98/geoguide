import { useState } from "react";
import { HiOutlineCloud } from "react-icons/hi";
import { WiHumidity, WiStrongWind } from "react-icons/wi";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { useWeather } from "../../hooks/useWeather";
import type { WeatherUnits } from "../../types/weather";
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";

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
    <section className="pt-10 mt-10 border-t border-border">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-fg flex items-center gap-2">
          <HiOutlineCloud className="text-primary" aria-hidden="true" />
          Weather in {city}
        </h2>
        <div
          role="group"
          aria-label="Temperature units"
          className="inline-flex rounded-md border border-border overflow-hidden text-sm font-medium"
        >
          {(["metric", "imperial"] as WeatherUnits[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnits(u)}
              aria-pressed={units === u}
              aria-label={u === "metric" ? "Celsius" : "Fahrenheit"}
              className={cn(
                "px-3 py-1.5 transition-colors",
                units === u ? "bg-primary text-primary-foreground" : "text-muted hover:text-fg"
              )}
            >
              {u === "metric" ? "°C" : "°F"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {isLoading && <div className="h-40 rounded-xl bg-surface-2 animate-pulse" />}

        {isError && !isLoading && (
          <div className="flex flex-col items-center gap-3 py-8 text-center bg-surface border border-border rounded-xl">
            <p className="text-muted">
              {(error as Error)?.message || "Weather data is currently unavailable."}
            </p>
            <Button onClick={() => refetch()}>Try again</Button>
          </div>
        )}

        {data && !isLoading && !isError && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Current conditions */}
              <div className="md:col-span-2 bg-surface border border-border rounded-xl p-5 flex items-center gap-4">
                {iconUrl(data.current.icon) && (
                  <img src={iconUrl(data.current.icon) as string} alt={data.current.description} className="w-20 h-20" />
                )}
                <div>
                  <p className="text-4xl font-semibold text-fg">
                    {round(data.current.temperature)}
                    {tempUnit}
                  </p>
                  <p className="capitalize text-muted">{data.current.description}</p>
                  <p className="text-sm text-muted">
                    Feels like {round(data.current.feelsLike)}
                    {tempUnit}
                  </p>
                </div>
                <div className="ml-auto text-sm space-y-2 text-muted">
                  <p className="flex items-center gap-1">
                    <WiHumidity className="text-2xl text-primary" />
                    {data.current.humidity}%
                  </p>
                  <p className="flex items-center gap-1">
                    <WiStrongWind className="text-2xl text-primary" />
                    {Math.round(data.current.windSpeed)} {windUnit}
                  </p>
                </div>
              </div>

              {/* Travel tip */}
              <div className="bg-surface-2 border border-border rounded-xl p-5 flex items-start gap-2">
                <MdOutlineTipsAndUpdates className="text-primary text-xl shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-fg">Travel tip</p>
                  <p className="text-muted leading-relaxed">{data.tip}</p>
                </div>
              </div>
            </div>

            {/* Forecast */}
            {data.forecast.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {data.forecast.map((day) => (
                  <div key={day.date} className="bg-surface border border-border rounded-lg p-3 text-center">
                    <p className="font-medium text-fg">{weekday(day.date)}</p>
                    {iconUrl(day.icon) && (
                      <img src={iconUrl(day.icon) as string} alt={day.description} className="w-14 h-14 mx-auto" />
                    )}
                    <p className="text-sm">
                      <span className="font-semibold text-fg">{day.tempMax}{tempUnit}</span>{" "}
                      <span className="text-muted">{day.tempMin}{tempUnit}</span>
                    </p>
                    <p className="text-xs text-muted capitalize line-clamp-1">{day.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
