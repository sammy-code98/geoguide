import { Outlet } from "react-router-dom";
import HelmentHeader from "../components/Helment";
import Header from "../components/Header"


function HomeLayout(): JSX.Element {
  return (
    <>
      <HelmentHeader title="Home" description="GeoGuide Home Page" />
      <div>
        <Header />
        <div className="py-16">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default HomeLayout