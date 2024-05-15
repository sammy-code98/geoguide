import { Outlet } from "react-router-dom";
import HelmentHeader from "../components/Helment";

HelmentHeader

function HomeLayout(): JSX.Element {
  return (
    <>
      <HelmentHeader title="Home" description="GeoGuide Home Page" />
      <div>
        header nav

        <div>
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default HomeLayout