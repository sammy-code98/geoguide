import { Outlet } from "react-router-dom";
import HelmentHeader from "../components/Helment";
import Header from "../components/Header";
// import { useEffect } from "react";

function HomeLayout(): JSX.Element {
  // const [showButton, setShowButton] = useState<boolean>(false);

  // const location = useLocation();
  // const pathname = location.pathname;

  // const handleScrollToTop = () => {
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 200) {
  //       setShowButton(true);
  //     } else {
  //       setShowButton(false);
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  return (
    <>
      <HelmentHeader
        title="GeoGuide"
        description="GeoGuide"
      />
      {/* <div className="flex flex-col h-screen-">
        <Header />
        <div className="pt-16- flex-grow-">
          <Outlet />
        </div> */}
      {/* <div className="flex justify-center items-center mt-auto py-4 dark:bg-bgDark">
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
        )} */}
      {/* </div> */}

      <div className="min-h-screen bg-gradient-to-br from-light-99 via-white to-light-95 dark:from-grey-bg dark:via-grey-20 dark:to-grey-10">
        <Header />
        <main className="flex-1">
          <div className="relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[length:20px_20px] pointer-events-none"></div>

            {/* Content wrapper with proper spacing */}
            <div className="relative z-10">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default HomeLayout;
