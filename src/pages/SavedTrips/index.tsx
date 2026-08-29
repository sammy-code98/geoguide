import { Link } from "react-router-dom";
import { HiOutlineBookmark } from "react-icons/hi";
import { AppRoutes } from "../../types/routes";
import { useSavedStore, type SavedItem, type SavedInput } from "../../store/savedStore";
import { NumComma, shortenString } from "../../utils/custom";
import CountryCard from "../../components/CountryCard";
import PlaceCard from "../../components/Places/PlaceCard";
import ItineraryResult from "../../components/Itinerary/ItineraryResult";
import CostResult from "../../components/Cost/CostResult";
import SaveButton from "../../components/Saved/SaveButton";
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
  const clear = useSavedStore((s) => s.clear);

  const countries = items.filter((i) => i.type === "country");
  const places = items.filter((i) => i.type === "place");
  const itineraries = items.filter((i) => i.type === "itinerary");
  const costs = items.filter((i) => i.type === "costEstimate");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 space-y-10">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-textWhite flex items-center gap-2">
            <HiOutlineBookmark className="text-primary" />
            Saved Trips
          </h1>
          {items.length > 0 && (
            <button
              onClick={clear}
              className="text-sm font-semibold text-textGray dark:text-grayish hover:text-secondary"
            >
              Clear all
            </button>
          )}
        </div>

        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <HiOutlineBookmark className="text-6xl text-primary/40" />
            <p className="text-textGray dark:text-grayish text-lg">
              You haven't saved anything yet.
            </p>
            <Link
              to={AppRoutes.countries}
              className="py-2.5 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:opacity-90"
            >
              Explore countries
            </Link>
          </div>
        )}

        {countries.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-black dark:text-textWhite">Countries</h2>
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
            <h2 className="text-xl font-bold text-black dark:text-textWhite">Places</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {places.map((it) => (
                <PlaceCard key={it.id} place={it.data as Place} />
              ))}
            </div>
          </section>
        )}

        {itineraries.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-black dark:text-textWhite">Itineraries</h2>
            <div className="space-y-8">
              {itineraries.map((it) => (
                <ItineraryResult key={it.id} itinerary={it.data as Itinerary} />
              ))}
            </div>
          </section>
        )}

        {costs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-black dark:text-textWhite">Travel Plans</h2>
            <div className="space-y-8">
              {costs.map((it) => (
                <div key={it.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-black dark:text-textWhite">{it.title}</p>
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
