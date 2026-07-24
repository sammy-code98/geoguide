import { IoStar } from "react-icons/io5";
import { HiOutlineLocationMarker, HiOutlineMap } from "react-icons/hi";
import type { Place } from "../../types/place";

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps): JSX.Element {
  return (
    <div className="flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30">
      {/* Image (with graceful fallback when none is available) */}
      {place.thumbnail ? (
        <img
          src={place.thumbnail}
          alt={place.title}
          className="h-36 w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="h-36 w-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary/70">
            {place.title.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h4 className="font-bold text-black dark:text-textWhite leading-snug line-clamp-2">
          {place.title}
        </h4>

        {place.rating !== null && (
          <div className="flex items-center gap-1 text-sm">
            <IoStar className="text-yellow-400" />
            <span className="font-semibold text-black dark:text-textWhite">
              {place.rating.toFixed(1)}
            </span>
            {place.reviews !== null && (
              <span className="text-textGray dark:text-grayish">
                ({place.reviews} review{place.reviews === 1 ? "" : "s"})
              </span>
            )}
          </div>
        )}

        {place.address && (
          <p className="flex items-start gap-1 text-sm text-textGray dark:text-grayish">
            <HiOutlineLocationMarker className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{place.address}</span>
          </p>
        )}

        {place.mapsUrl && (
          <a
            href={place.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            <HiOutlineMap />
            View on map
          </a>
        )}
      </div>
    </div>
  );
}
