import { useCallback, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { HiOutlineCalculator, HiOutlineMap, HiOutlineLightBulb, HiOutlineBookmark } from "react-icons/hi";
import { AppRoutes } from "../../types/routes";
import { useSavedStore } from "../../store/savedStore";

export default function Header() {
  const savedCount = useSavedStore((s) => s.items.length);
  const [theme, setTheme] = useState<string | null>(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "system"
  );
  const element = document.documentElement;
  const darkQuery = window.matchMedia("(prefers-color-scheme:dark)");


  const onWindowMatch = useCallback(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && darkQuery.matches)
    ) {
      element.classList.add("dark");
    } else {
      element.classList.remove("dark");
    }
  }, [darkQuery.matches, element.classList]);
  onWindowMatch();

  useEffect(() => {
    switch (theme) {
      case "dark":
        element.classList.add("dark");
        localStorage.setItem("theme", "dark");
        break;
      case "light":
        element.classList.remove("dark");
        localStorage.setItem("theme", "light");
        break;

      default:
        localStorage.removeItem("theme");
        onWindowMatch();
        break;
    }
  }, [element.classList, onWindowMatch, theme]);

  darkQuery.addEventListener("change", (e) => {
    if (!("theme" in localStorage)) {
      if (e.matches) {
        element.classList.add("dark");
      } else {
        element.classList.remove("dark");
      }
    }
  });

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const isDark =
    theme === "dark" ||
    (theme === "system" && darkQuery.matches);

  return (
    <header className="fixed bg-transparent top-0 left-0  w-full z-20">
      <div className="px-4 py-2 sm:px-12 pb-4">
        <nav aria-label="Primary">
          <div className="flex items-center justify-between mx-auto px-8 py-4 max-w-screen-xl rounded-full shadow-md bg-gradient-to-br from-slate-50 to-blue-50  dark:from-gray-900 dark:to-gray-800">
            <div>
              <Link
                to={AppRoutes.getStarted}
                className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-2xl font-bold italic"
              >
                GeoGuide
              </Link>
            </div>
            <div className="flex justify-between items-center gap-6 md:gap-8">
              <NavLink
                to={AppRoutes.recommendations}
                aria-label="For You"
                className={({ isActive }) =>
                  `flex items-center gap-1 font-semibold ${
                    isActive ? "text-primary" : "text-black dark:text-textWhite hover:text-primary"
                  }`
                }
              >
                <HiOutlineLightBulb aria-hidden="true" />
                <span className="hidden lg:inline">For You</span>
              </NavLink>
              <NavLink
                to={AppRoutes.itinerary}
                aria-label="Itinerary"
                className={({ isActive }) =>
                  `flex items-center gap-1 font-semibold ${
                    isActive ? "text-primary" : "text-black dark:text-textWhite hover:text-primary"
                  }`
                }
              >
                <HiOutlineMap aria-hidden="true" />
                <span className="hidden lg:inline">Itinerary</span>
              </NavLink>
              <NavLink
                to={AppRoutes.costEstimator}
                aria-label="Trip Cost"
                className={({ isActive }) =>
                  `flex items-center gap-1 font-semibold ${
                    isActive ? "text-primary" : "text-black dark:text-textWhite hover:text-primary"
                  }`
                }
              >
                <HiOutlineCalculator aria-hidden="true" />
                <span className="hidden lg:inline">Trip Cost</span>
              </NavLink>
              <NavLink
                to={AppRoutes.chat}
                aria-label="AI Assistant"
                className={({ isActive }) =>
                  `flex items-center gap-1 font-semibold ${
                    isActive ? "text-primary" : "text-black dark:text-textWhite hover:text-primary"
                  }`
                }
              >
                <HiSparkles aria-hidden="true" />
                <span className="hidden lg:inline">AI Assistant</span>
              </NavLink>
              <NavLink
                to={AppRoutes.savedTrips}
                aria-label={`Saved trips${savedCount > 0 ? ` (${savedCount} saved)` : ""}`}
                className={({ isActive }) =>
                  `relative text-2xl ${
                    isActive ? "text-primary" : "text-black dark:text-textWhite hover:text-primary"
                  }`
                }
              >
                <HiOutlineBookmark aria-hidden="true" />
                {savedCount > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center"
                  >
                    {savedCount}
                  </span>
                )}
              </NavLink>
              <div>
                <a
                  href="https://github.com/sammy-code98/geoguide"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GeoGuide on GitHub (opens in a new tab)"
                  className="w-8 h-8 leading-9 text-2xl rounded-xl text-black dark:text-primary"
                >
                  <FaGithub aria-hidden="true" />
                </a>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="w-8 h-8 text-2xl rounded-xl text-black dark:text-primary"
              >
                {isDark ? <FiSun aria-hidden="true" /> : <MdOutlineDarkMode aria-hidden="true" />}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
