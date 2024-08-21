import { Outlet, useLocation } from "react-router-dom";
import HelmentHeader from "../components/Helment";
import Header from "../components/Header";

function HomeLayout(): JSX.Element {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      <HelmentHeader
        title={pathname === "/home" ? "Home" : "Details"}
        description="GeoGuide Home Page"
      />
      <div>
        <Header />
        <div className="pt-16">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default HomeLayout;
