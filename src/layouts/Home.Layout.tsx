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
      <div className="flex flex-col h-screen">
        <Header />
        <div className="pt-16 flex-grow">
          <Outlet />
        </div>
        <div className="flex justify-center items-center mt-auto py-4 dark:bg-bgDark">
          <p className="text-lg text-textGray">
            Made with ❤️ and 💡 by{" "}
            <span>
              <a
                href="https://github.com/sammy-code98"
                target="_blank"
                className="underline font-medium bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent"
              >
                sammy-code98
              </a>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default HomeLayout;
