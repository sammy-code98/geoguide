import { Link } from "react-router-dom"
import { AppRoutes } from "../../types/routes"


export default function index(): JSX.Element {
  return (
    <>
      <Link to={AppRoutes.detail}>
        <div className="max-w-sm bg-white border border-textGray rounded-lg shadow cursor-pointer">
        <div >
          <img className="rounded-t-lg" src="https://nextui.org/images/hero-card-complete.jpeg" />
        </div>
          <div className="p-5 space-y-4">
            <h5 className="text-2xl font-bold tracking-light text-black">Counrty</h5>
            <p className="font-normal text-black">Population :
            <span className="text-textGray ml-1">loeleoe</span>
          </p>
            <p className="font-normal text-black">Region :
            <span className="text-textGray ml-1">loeleoe</span>
          </p>
            <p className="font-normal text-black">Capital :
            <span className="text-textGray ml-1">loeleoe</span>
          </p>
        </div>
      </div>
      </Link>
    </>
  )
}
