import { Link } from "react-router-dom"
import { AppRoutes } from "../../types/routes"
interface CountryCardI {
  name: string;
  population: number | string;
  region: string;
  capital: string;
  img: string;
  alt: string;
}

export default function CountryCard({ name, population, region, capital, img, alt }: CountryCardI) {
  const detailLink = `${AppRoutes.detail.replace(':name', name)}`
  return (
    <>
      <Link to={detailLink} >
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl  h-full transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:scale-105 hover:border-primary/30">
          <div>
            <img className="h-40 w-full object-cover rounded-t-lg" src={img} alt={alt} />
        </div>
          <hr />
          <div className="p-5 space-y-4">
            <h5 className="text-lg font-bold tracking-light text-black dark:text-textWhite">{name}</h5>
            <p className="font-normal text-black dark:text-textWhite">Population :
              <span className="text-primary ml-1 font-medium">{population}</span>
          </p>
            <p className="font-normal text-black dark:text-textWhite">Region :
              <span className="text-primary ml-1 font-medium">{region}</span>
          </p>
            <p className="font-normal text-black dark:text-textWhite">Capital :
              <span className="text-primary ml-1 font-medium">{capital}</span>
          </p>
        </div>
      </div>
      </Link>
    </>
  )
}
