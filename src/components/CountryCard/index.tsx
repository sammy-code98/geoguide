import { Link } from "react-router-dom"
import { AppRoutes } from "../../types/routes"
import { CountryCardI } from './card.interface';


export default function index({ name, population, region, capital, img, alt }: CountryCardI): JSX.Element {
  return (
    <>
      <Link to={AppRoutes.detail}>
        <div className="max-w-sm bg-white  rounded-lg shadow cursor-pointer">
          <div>
            <img className="rounded-t-lg" src={img} alt={alt} />
        </div>
          <hr />
          <div className="p-5 space-y-4 ">
            <h5 className="text-2xl font-bold tracking-light text-black capitalize">{name}</h5>
            <p className="font-normal text-black">Population :
              <span className="text-primary ml-1">{population}</span>
          </p>
            <p className="font-normal text-black">Region :
              <span className="text-primary ml-1 capitalize">{region}</span>
          </p>
            <p className="font-normal text-black">Capital :
              <span className="text-primary ml-1 capitalize">{capital}</span>
          </p>
        </div>
      </div>
      </Link>
    </>
  )
}
