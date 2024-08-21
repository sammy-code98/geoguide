import { Link } from "react-router-dom"
import { AppRoutes } from "../../types/routes"
import { CountryCardI } from './card.interface';


export default function Index({ name, population, region, capital, img, alt, code }: CountryCardI): JSX.Element {
  const detailLink = `${AppRoutes.detail.replace(':code', code)}`
  return (
    <>
      <Link to={detailLink} >
        <div className="w-80 bg-white dark:bg-bgDark rounded-lg shadow cursor-pointer">
          <div>
            <img className="h-40 w-full object-cover rounded-t-lg" src={img} alt={alt} />
        </div>
          <hr />
          <div className="p-5 space-y-4 ">
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
