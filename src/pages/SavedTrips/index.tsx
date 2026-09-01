import { Link } from "react-router-dom";
import { HiOutlineBookmark } from "react-icons/hi";
import { AppRoutes } from "../../types/routes";
import { useSavedStore, type SavedItem, type SavedInput } from "../../store/savedStore";
import { useSavedTripsActions } from "../../hooks/useSavedTrips";
import { NumComma, shortenString } from "../../utils/custom";
import CountryCard from "../../components/CountryCard";
import PlaceCard from "../../components/Places/PlaceCard";
import ItineraryResult from "../../components/Itinerary/ItineraryResult";
import CostResult from "../../components/Cost/CostResult";
import SaveButton from "../../components/Saved/SaveButton";
import { button } from "../../components/ui/button";
import { EmptyState } from "../../components/ui/empty-state";
import type { Place } from "../../types/place";
import type { Itinerary } from "../../types/itinerary";
import type { CostEstimate } from "../../types/cost";

interface SavedCountryData {
  code: string;
  name: string;
  population: number;
  region: string;
  capital: string | null;
  flagPng: string;
}

const toInput = (it: SavedItem): SavedInput => ({
  id: it.id,
  type: it.type,
  title: it.title,
  subtitle: it.subtitle,
  href: it.href,
  data: it.data,
});

export default function SavedTripsPage(): JSX.Element {
  const items = useSavedStore((s) => s.items);
  const { clear } = useSavedTripsActions();

  const countries = items.filter((i) => i.type === "country");
  const places = items.filter((i) => i.type === "place");
  const itineraries = items.filter((i) => i.type === "itinerary");
  const costs = items.filter((i) => i.type === "costEstimate");

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-fg flex items-center gap-2">
            <HiOutlineBookmark className="text-primary" aria-hidden="true" />
            Saved trips
          </h1>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-sm font-medium text-muted hover:text-danger transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 && (
          <EmptyState
            icon={<HiOutlineBookmark />}
            title="Nothing saved yet"
            description="Save countries, places, itineraries, and cost estimates to find them here later."
            action={
              <Link to={AppRoutes.countries} className={button()}>
                Explore countries
              </Link>
            }
          />
        )}

        {countries.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-fg">Countries</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {countries.map((it) => {
                const d = it.data as SavedCountryData;
                return (
                  <div key={it.id} className="relative">
                    <div className="absolute top-2 right-2 z-[1]">
                      <SaveButton compact item={toInput(it)} />
                    </div>
                    <CountryCard
                      code={d.code}
                      name={shortenString(d.name)}
                      population={NumComma(d.population)}
                      region={d.region}
                      capital={d.capital ?? "—"}
                      img={d.flagPng}
                      alt={`${d.name}'s flag`}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {places.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-fg">Places</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {places.map((it) => (
                <PlaceCard key={it.id} place={it.data as Place} />
              ))}
            </div>
          </section>
        )}

        {itineraries.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-fg">Itineraries</h2>
            <div className="space-y-8">
              {itineraries.map((it) => (
                <ItineraryResult key={it.id} itinerary={it.data as Itinerary} />
              ))}
            </div>
          </section>
        )}

        {costs.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-fg">Travel Plans</h2>
            <div className="space-y-8">
              {costs.map((it) => (
                <div key={it.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-fg">{it.title}</p>
                    <SaveButton label item={toInput(it)} />
                  </div>
                  <CostResult estimate={it.data as CostEstimate} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
