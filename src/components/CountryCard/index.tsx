import { memo } from "react"
import { Link } from "react-router-dom"
import { AppRoutes } from "../../types/routes"
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
    <Link
      to={detailLink}
      className="group block h-full bg-surface border border-border rounded-lg overflow-hidden transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <img
        className="h-40 w-full object-cover border-b border-border"
        src={img}
        alt={alt}
        loading="lazy"
      />
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-fg group-hover:text-primary transition-colors">
          {name}
        </h3>
        <dl className="space-y-1.5 text-sm">
          <div className="flex gap-1.5">
            <dt className="text-muted">Population</dt>
            <dd className="text-fg font-medium">{population}</dd>
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
