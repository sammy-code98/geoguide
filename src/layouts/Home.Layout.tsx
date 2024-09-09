import { Outlet, useLocation } from "react-router-dom";
import HelmentHeader from "../components/Helment";
import Header from "../components/Header";
import { useEffect, useState } from "react";

function HomeLayout(): JSX.Element {
  const [showButton, setShowButton] = useState<boolean>(false);

  const location = useLocation();
  const pathname = location.pathname;

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
        {pathname === "/home" && showButton && (
          <button
            className="fixed bottom-4 right-4 bg-textWhite py-2 px-4 rounded"
            onClick={handleScrollToTop}
          >
            <span className="text-base font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              Back to Top
            </span>
          </button>
        )}
      </div>
    </>
  );
}

export default HomeLayout;
