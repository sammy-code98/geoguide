import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { HiOutlineExternalLink } from "react-icons/hi";

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

export default function CountryMap({ lat, lng, name, capital }: CountryMapProps): JSX.Element {
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=5/${lat}/${lng}`;
  const directionsUrl = `https://www.openstreetmap.org/directions?to=${lat}%2C${lng}`;

  return (
    <div className="space-y-3">
      <div className="h-[400px] rounded-xl overflow-hidden border border-border">
        <MapContainer
          center={[lat, lng]}
          zoom={5}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
