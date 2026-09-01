import { lazy, Suspense, useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import DetailLoader from "./detailLoader";
import { MdArrowBackIos, MdOutlineTravelExplore } from "react-icons/md";
import { HiOutlineCalculator, HiOutlineMap, HiOutlineCurrencyDollar, HiOutlineLocationMarker } from "react-icons/hi";
import { getCountryByCode } from "../../api/index.api";
import { AppRoutes } from "../../types/routes";
import { NumComma } from "../../utils/custom";
import { QueryKey } from "../../utils/queryKeys";
import CountryInsights from "../../components/CountryInsights";
import WeatherWidget from "../../components/Weather/WeatherWidget";
import CurrencyConverter from "../../components/Currency/CurrencyConverter";
import PlaceDiscovery from "../../components/Places/PlaceDiscovery";
import SaveButton from "../../components/Saved/SaveButton";
import { Button, button } from "../../components/ui/button";
import { EmptyState } from "../../components/ui/empty-state";
import { useCountryInsights } from "../../hooks/useCountryInsights";

// Leaflet is heavy — load the map only when a Detail page actually renders it.
const CountryMap = lazy(() => import("../../components/Map/CountryMap"));

/** One label/value pair in the country fact grid. */
function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="py-2.5 border-b border-border">
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-fg font-medium">{children}</dd>
    </div>
  );
}

/** An editorial section with a serif heading and a divider. */
function Section({ icon, title, subtitle, action, children }: {
  icon: ReactNode; title: string; subtitle?: string; action?: ReactNode; children: ReactNode;
}) {
  return (
    <section className="pt-10 mt-10 border-t border-border">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-fg flex items-center gap-2">
            <span className="text-primary" aria-hidden="true">{icon}</span>
            {title}
          </h2>
          {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function DetailsPage() {
  const { code } = useParams();
  const [showInsights, setShowInsights] = useState<boolean>(false);

  const { isLoading, isError, data: country } = useQuery({
    queryKey: [QueryKey.getACountry, code],
    queryFn: () => getCountryByCode(code as string),
    enabled: Boolean(code),
  });

  // AI insights are fetched lazily — only once the traveler asks for them.
  const insights = useCountryInsights(code, showInsights);

  if (isLoading)
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <DetailLoader />
        </div>
      </div>
    );

  if (isError || !country) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <EmptyState
          icon={<HiOutlineLocationMarker />}
          title="Country not found"
          description="We couldn't find details for this country."
          action={
            <Link to={AppRoutes.countries} className={button({ variant: "outline", size: "sm" })}>
              <MdArrowBackIos className="text-xs" /> Back to countries
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link to={AppRoutes.countries} className={button({ variant: "ghost", size: "sm" })}>
            <MdArrowBackIos className="text-xs" /> Back
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              to={`${AppRoutes.itinerary}?destination=${encodeURIComponent(country.name)}`}
              className={button({ variant: "outline", size: "sm" })}
            >
              <HiOutlineMap /> Plan an itinerary
            </Link>
            <Link
              to={`${AppRoutes.costEstimator}?destination=${encodeURIComponent(country.name)}`}
              className={button({ variant: "outline", size: "sm" })}
            >
              <HiOutlineCalculator /> Estimate trip cost
            </Link>
            <SaveButton
              label
              item={{
                id: `country:${country.cca3}`,
                type: "country",
                title: country.name,
                subtitle: country.region,
                href: AppRoutes.detail.replace(":code", country.cca3),
                data: {
                  code: country.cca3,
                  name: country.name,
                  population: country.population,
                  region: country.region,
                  capital: country.capital,
                  flagPng: country.flagPng,
                },
              }}
            />
          </div>
        </div>

        {/* Destination hero */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <img
            alt={`${country.name}'s flag`}
            src={country.flagPng}
            className="w-full h-[280px] lg:h-[360px] object-cover rounded-xl border border-border"
          />
          <div>
            <p className="text-sm text-muted">{country.region}{country.subregion ? ` · ${country.subregion}` : ""}</p>
            <h1 className="font-serif text-4xl md:text-5xl font-semibold text-fg mt-1">
              {country.name}
            </h1>
            {country.nativeName && (
              <p className="text-muted mt-1">{country.nativeName}</p>
            )}

            <dl className="mt-6 grid grid-cols-2 gap-x-8">
              <Fact label="Capital">{country.capital ?? "—"}</Fact>
              <Fact label="Population">{NumComma(country.population)}</Fact>
              <Fact label="Currency">
                {country.currencies.map((c) => `${c.name}${c.symbol ? ` (${c.symbol})` : ""}`).join(", ") || "—"}
              </Fact>
              <Fact label="Languages">{country.languages.join(", ") || "—"}</Fact>
              <Fact label="Calling code">
                {country.callingCodes.map((c) => `+${c}`).join(", ") || "—"}
              </Fact>
              <Fact label="Independent">{country.independent ? "Yes" : "No"}</Fact>
            </dl>

            {country.timezones.length > 0 && (
              <div className="mt-5">
                <p className="text-xs uppercase tracking-wide text-muted mb-2">Time zones</p>
                <div className="flex flex-wrap gap-1.5">
                  {country.timezones.map((tz) => (
                    <span key={tz} className="text-xs text-fg bg-surface-2 border border-border rounded-md px-2 py-1">
                      {tz}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Map (Leaflet + OpenStreetMap) */}
        {country.latlng && (
          <Section icon={<HiOutlineLocationMarker />} title="Map">
            <Suspense fallback={<div className="h-[400px] rounded-xl bg-surface-2 animate-pulse" />}>
              <CountryMap
                lat={country.latlng[0]}
                lng={country.latlng[1]}
                name={country.name}
                capital={country.capital}
              />
            </Suspense>
          </Section>
        )}

        {/* Current weather (OpenWeather) */}
        {country.capital && <WeatherWidget city={country.capital} />}

        {/* Currency (ExchangeRate) */}
        <Section
          icon={<HiOutlineCurrencyDollar />}
          title="Currency"
          subtitle={
            country.currencies.length > 0
              ? `Local currency: ${country.currencies[0].name} (${country.currencies[0].code}).`
              : "Convert between world currencies."
          }
        >
          <CurrencyConverter defaultTo={country.currencies[0]?.code ?? "EUR"} />
        </Section>

        {/* Travel insights (Gemini) */}
        <Section
          icon={<MdOutlineTravelExplore />}
          title="Travel insights"
          subtitle={`A practical guide to visiting ${country.name}.`}
          action={
            showInsights ? (
              <Button variant="outline" size="sm" onClick={() => insights.refetch()} disabled={insights.isFetching}>
                {insights.isFetching ? "Regenerating…" : "Regenerate"}
              </Button>
            ) : (
              <Button onClick={() => setShowInsights(true)}>
                Show travel guide
              </Button>
            )
          }
        >
          {showInsights ? (
            <CountryInsights
              data={insights.data}
              isLoading={insights.isLoading}
              isError={insights.isError}
              error={insights.error as Error | null}
              onRetry={() => insights.refetch()}
            />
          ) : (
            <p className="text-muted">
              Get a practical overview of culture, cuisine, getting around, safety, and the
              best time to visit.
            </p>
          )}
        </Section>

        {/* Place discovery (Serpstack) */}
        <PlaceDiscovery
          country={{ name: country.name, capital: country.capital, cca2: country.cca2 }}
        />
      </div>
    </div>
  );
}
