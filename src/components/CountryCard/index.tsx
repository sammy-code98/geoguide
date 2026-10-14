import { memo } from "react"
import { Link } from "react-router-dom"
import { PiFlagDuotone } from "react-icons/pi"
import { AppRoutes } from "../../types/routes"
import { SafeImage } from "../ui/safe-image"
interface CountryCardI {
  code: string;
  name: string;
  population: number | string;
  region: string;
  capital: string;
  img: string;
  alt: string;
}

const CountryCard = memo(function CountryCard({ code, name, population, region, capital, img, alt }: CountryCardI) {
  const detailLink = AppRoutes.detail.replace(':code', code)
  return (
    // A postcard print: the flag sits inside a white frame, caption below.
    <Link
      to={detailLink}
      className="group block h-full bg-surface border border-border rounded-lg p-3 transition-[transform,border-color] duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-sea/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <SafeImage
        className="h-40 w-full object-cover border border-border"
        src={img}
        alt={alt}
        loading="lazy"
        fallbackIcon={<PiFlagDuotone />}
      />
      <div className="px-2 pt-4 pb-1 space-y-3">
        <h3 className="text-lg font-semibold text-fg group-hover:text-primary transition-colors">
          {name}
        </h3>
        <dl className="space-y-1.5 text-sm">
          <div className="flex gap-1.5">
            <dt className="text-muted">Population</dt>
            <dd className="text-fg font-medium tabular-nums">{population}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-muted">Region</dt>
            <dd className="text-fg font-medium">{region}</dd>
          </div>
          <div className="flex gap-1.5">
            <dt className="text-muted">Capital</dt>
            <dd className="text-fg font-medium">{capital}</dd>
          </div>
        </dl>
      </div>
    </Link>
  )
})

export default CountryCard
