import { Link } from "react-router-dom"
import { AppRoutes } from "../../types/routes"
import { CountryCardI } from './card.interface';


export default function Index({ name, population, region, capital, img, alt, code }: CountryCardI): JSX.Element {
  const detailLink = `${AppRoutes.detail.replace(':code', code)}`
  return (
    <>
      <Link to={detailLink} >
        <div className="w-80 py-4 bg-white  rounded-lg shadow cursor-pointer">
          <div>
            <img className="h-40 w-full object-cover rounded-t-lg" src={img} alt={alt} />
        </div>
          <hr />
          <div className="p-5 space-y-4 ">
            <h5 className="text-lg font-bold tracking-light text-black">{name}</h5>
            <p className="font-normal text-black">Population :
              <span className="text-primary ml-1">{population}</span>
          </p>
            <p className="font-normal text-black">Region :
              <span className="text-primary ml-1">{region}</span>
          </p>
            <p className="font-normal text-black">Capital :
              <span className="text-primary ml-1">{capital}</span>
          </p>
        </div>
      </div>
      </Link>
    </>
  )
}
