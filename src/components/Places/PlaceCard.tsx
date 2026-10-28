import { IoStar } from "react-icons/io5";
import { HiOutlineLocationMarker, HiOutlineMap } from "react-icons/hi";
import type { Place } from "../../types/place";
import SaveButton from "../Saved/SaveButton";
import { SafeImage } from "../ui/safe-image";

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps): JSX.Element {
  return (
    <div className="group relative flex flex-col bg-surface border border-border rounded-lg overflow-hidden transition-[transform,border-color] duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-sea/50">
      <div className="absolute top-2 right-2 z-[1]">
        <SaveButton
          compact
          item={{
            id: `place:${place.id}`,
            type: "place",
            title: place.title,
            subtitle: place.address ?? undefined,
            href: place.mapsUrl ?? undefined,
            data: place,
          }}
        />
      </div>
      <SafeImage
        src={place.thumbnail ?? undefined}
        alt={place.title}
        className="h-40 w-full object-cover"
        loading="lazy"
        fallback={
          <div className="h-40 w-full bg-surface-2 flex items-center justify-center" aria-hidden="true">
            <span className="font-serif text-4xl text-muted">
              {place.title.charAt(0).toUpperCase()}
            </span>
          </div>
        }
      />

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h4 className="font-medium text-fg leading-snug line-clamp-2">
          {place.title}
        </h4>

        {place.rating !== null && (
          <div className="flex items-center gap-1 text-sm">
            <IoStar className="text-amber-500" aria-hidden="true" />
            <span className="font-medium text-fg">{place.rating.toFixed(1)}</span>
            {place.reviews !== null && (
              <span className="text-muted">
                ({place.reviews} review{place.reviews === 1 ? "" : "s"})
              </span>
            )}
          </div>
        )}

        {place.address && (
          <p className="flex items-start gap-1.5 text-sm text-muted">
            <HiOutlineLocationMarker className="mt-0.5 shrink-0" aria-hidden="true" />
            <span className="line-clamp-2">{place.address}</span>
          </p>
        )}

        {place.mapsUrl && (
          <a
            href={place.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            <HiOutlineMap aria-hidden="true" />
            View on map
          </a>
        )}
      </div>
    </div>
  );
}
