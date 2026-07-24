import { useState } from "react";
import {
  MdOutlineRestaurant,
  MdOutlineLocalCafe,
  MdOutlineHotel,
  MdOutlineMuseum,
  MdOutlinePark,
  MdOutlineBeachAccess,
  MdOutlineShoppingBag,
  MdOutlineAttractions,
  MdOutlineFlight,
} from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import type { PlaceCategory } from "../../types/place";
import { usePlaces } from "../../hooks/usePlaces";
import PlaceCard from "./PlaceCard";

interface PlaceDiscoveryProps {
  country: { name: string; capital: string | null; cca2: string };
}

const CATEGORIES: {
  key: PlaceCategory;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: "restaurants", label: "Restaurants", Icon: MdOutlineRestaurant },
  { key: "coffee-shops", label: "Coffee", Icon: MdOutlineLocalCafe },
  { key: "hotels", label: "Hotels", Icon: MdOutlineHotel },
  { key: "attractions", label: "Attractions", Icon: MdOutlineAttractions },
  { key: "museums", label: "Museums", Icon: MdOutlineMuseum },
  { key: "parks", label: "Parks", Icon: MdOutlinePark },
  { key: "beaches", label: "Beaches", Icon: MdOutlineBeachAccess },
  { key: "shopping", label: "Shopping", Icon: MdOutlineShoppingBag },
  { key: "airports", label: "Airports", Icon: MdOutlineFlight },
];

export default function PlaceDiscovery({ country }: PlaceDiscoveryProps): JSX.Element {
  const [category, setCategory] = useState<PlaceCategory | null>(null);

  const location = country.capital
    ? `${country.capital}, ${country.name}`
    : country.name;
  const gl = country.cca2 ? country.cca2.toLowerCase() : undefined;

  const { data, isLoading, isError, error, refetch } = usePlaces({
    category,
    location,
    gl,
  });

  return (
    <section className="pt-8">
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-textWhite flex items-center gap-2">
          <HiOutlineLocationMarker className="text-primary" />
          Discover Places
        </h2>
        <p className="text-textGray dark:text-grayish mt-1">
          Explore popular spots near {location}. Pick a category to begin.
        </p>

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mt-4">
          {CATEGORIES.map(({ key, label, Icon }) => {
            const active = key === category;
            return (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`inline-flex items-center gap-1.5 py-2 px-4 rounded-full text-sm font-semibold border transition-colors ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-white/80 dark:bg-gray-800/80 text-black dark:text-textWhite border-gray-200 dark:border-gray-600 hover:border-primary/50"
                }`}
              >
                <Icon className="text-base" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Results */}
        <div className="mt-6">
          {!category && (
            <p className="text-center text-textGray dark:text-grayish py-10">
              Select a category above to discover places.
            </p>
          )}

          {category && isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {new Array(8).fill(null).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden animate-pulse"
                >
                  <div className="h-36 w-full bg-gray-200 dark:bg-gray-700" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {category && isError && (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <p className="text-textGray dark:text-textWhite">
                {error?.message || "Couldn't load places right now."}
              </p>
              <button
                onClick={() => refetch()}
                className="py-2 px-5 bg-primary text-white rounded-lg font-semibold hover:opacity-90"
              >
                Try again
              </button>
            </div>
          )}

          {category && !isLoading && !isError && data && data.length === 0 && (
            <p className="text-center text-textGray dark:text-grayish py-10">
              No places found for this category near {location}.
            </p>
          )}

          {category && !isLoading && !isError && data && data.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
