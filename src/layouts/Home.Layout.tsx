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
          <div className="flex justify-center items-center pb-6 dark:bg-bgDark">
            <p className="text-lg text-textGray">
              Made with ❤️ and 💡 by{" "}
              <span>
                <a
                  href="https://github.com/sammy-code98"
                  target="_blank"
                  className="underline font-medium text-primary"
                >
                  sammy-code98
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeLayout;
