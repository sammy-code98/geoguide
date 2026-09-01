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
import { cn } from "../../lib/cn";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { EmptyState } from "../ui/empty-state";
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
    <section className="pt-10 mt-10 border-t border-border">
      <h2 className="font-serif text-2xl md:text-3xl font-semibold text-fg flex items-center gap-2">
        <HiOutlineLocationMarker className="text-primary" aria-hidden="true" />
        Places to explore
      </h2>
      <p className="text-muted mt-1">
        Popular spots near {location}. Pick a category to begin.
      </p>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mt-5">
        {CATEGORIES.map(({ key, label, Icon }) => {
          const active = key === category;
          return (
            <button
              key={key}
              onClick={() => setCategory(key)}
              aria-pressed={active}
              className={cn(
                "inline-flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-surface text-fg border-border hover:border-primary/40"
              )}
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
          <EmptyState
            icon={<HiOutlineLocationMarker />}
            title="Choose a category"
            description="Select one of the options above to discover places to eat, stay, and visit."
          />
        )}

        {category && isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {new Array(8).fill(null).map((_, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-lg overflow-hidden"
              >
                <Skeleton className="h-40 w-full rounded-none" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {category && isError && (
          <EmptyState
            title="Couldn't load places"
            description={error?.message || "Something went wrong. Please try again."}
            action={<Button onClick={() => refetch()}>Try again</Button>}
          />
        )}

        {category && !isLoading && !isError && data && data.length === 0 && (
          <EmptyState
            icon={<HiOutlineLocationMarker />}
            title="No places found"
            description={`We couldn't find any ${category.replace("-", " ")} near ${location}.`}
          />
        )}

        {category && !isLoading && !isError && data && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
