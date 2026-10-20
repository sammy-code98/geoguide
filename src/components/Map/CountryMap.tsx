import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HiOutlineExternalLink } from "react-icons/hi";
import { PiMapTrifoldDuotone, PiWifiSlashDuotone } from "react-icons/pi";
import { Button } from "../ui/button";
import { Scene } from "../ui/postcard";

// Vite bundles Leaflet's default marker images; wire them up explicitly.
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

interface CountryMapProps {
  lat: number;
  lng: number;
  name: string;
  capital: string | null;
}

type MapStatus = "loading" | "ready" | "offline" | "failed";

/** Tile errors with nothing loaded before we call the map unavailable. A few
 *  stray failures on a working map are normal, so one error isn't enough. */
const ERROR_THRESHOLD = 4;
/** If no tile has arrived by now, the network is too slow to be useful. */
const SLOW_TIMEOUT_MS = 12_000;

const formatCoords = (lat: number, lng: number) =>
  `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? "N" : "S"} · ${Math.abs(lng).toFixed(2)}° ${lng >= 0 ? "E" : "W"}`;

export default function CountryMap({ lat, lng, name, capital }: CountryMapProps): JSX.Element {
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=5/${lat}/${lng}`;
  const directionsUrl = `https://www.openstreetmap.org/directions?to=${lat}%2C${lng}`;

  const [status, setStatus] = useState<MapStatus>(() =>
    typeof navigator !== "undefined" && navigator.onLine === false ? "offline" : "loading"
  );
  // Bumping this remounts the tile layer, which re-requests every tile.
  const [attempt, setAttempt] = useState(0);
  const loaded = useRef(0);
  const errors = useRef(0);

  const retry = useCallback(() => {
    loaded.current = 0;
    errors.current = 0;
    setStatus(navigator.onLine === false ? "offline" : "loading");
    setAttempt((n) => n + 1);
  }, []);

  // Follow the browser's connection: drop to offline, recover when it returns.
  useEffect(() => {
    const goOffline = () => setStatus("offline");
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", retry);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", retry);
    };
  }, [retry]);

  // A connection that never errors but never delivers is still unusable.
  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => {
      if (loaded.current === 0) setStatus("failed");
    }, SLOW_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [status, attempt]);

  const tileEvents = useMemo(
    () => ({
      tileload: () => {
        loaded.current += 1;
        setStatus("ready");
      },
      tileerror: () => {
        errors.current += 1;
        if (loaded.current === 0 && errors.current >= ERROR_THRESHOLD) {
          setStatus(navigator.onLine === false ? "offline" : "failed");
        }
      },
    }),
    []
  );

  const unavailable = status === "offline" || status === "failed";

  return (
    <div className="space-y-3">
      <div className="relative h-[400px] rounded-xl overflow-hidden border border-border bg-surface-2">
        <MapContainer
          center={[lat, lng]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%", background: "rgb(var(--surface-2))" }}
        >
          <TileLayer
            key={attempt}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            eventHandlers={tileEvents}
          />
          <Marker position={[lat, lng]}>
            <Popup>
              <strong>{name}</strong>
              {capital ? (
                <>
                  <br />
                  Capital: {capital}
                </>
              ) : null}
            </Popup>
          </Marker>
        </MapContainer>

        {/* Offline state — a postcard in place of the map. Sits above Leaflet's
            panes and controls (z-index up to 1000). */}
        {unavailable && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-[1100] flex items-center justify-center overflow-hidden bg-sea-soft p-6"
          >
            <Scene tone="sea" className="pointer-events-none absolute bottom-0 right-0 h-full w-full max-w-[520px] opacity-70" />
            <div className="relative max-w-sm rounded-2xl border border-border bg-surface p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sea-soft text-2xl text-sea">
                {status === "offline" ? <PiWifiSlashDuotone aria-hidden="true" /> : <PiMapTrifoldDuotone aria-hidden="true" />}
              </div>
              <h3 className="font-serif text-xl font-semibold text-fg">
                {status === "offline" ? "You're offline" : "Map unavailable"}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {status === "offline"
                  ? "The map will come back as soon as your connection does."
                  : "We couldn't load the map tiles right now. Check your connection and try again."}
              </p>
              <p className="mt-3 text-sm text-fg">
                {name} sits at <span className="font-medium tabular-nums">{formatCoords(lat, lng)}</span>
              </p>
              <Button size="sm" variant="outline" className="mt-5" onClick={retry}>
                Try again
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <a
          href={osmUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          <HiOutlineExternalLink />
          Open in OpenStreetMap
        </a>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
        >
          <HiOutlineExternalLink />
          Directions
        </a>
      </div>
    </div>
  );
}
