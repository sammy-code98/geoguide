import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { AppRoutes } from "../../types/routes";

export default function Index() {
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
        <nav>
          <div className="flex items-center justify-between mx-auto px-8 py-4 max-w-screen-xl rounded-full shadow-md bg-gradient-to-br from-slate-50 to-blue-50  dark:from-gray-900 dark:to-gray-800">
            <div>
              <Link
                to={AppRoutes.home}
                className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent text-2xl font-bold italic"
              >
                GeoGuide
              </Link>
            </div>
            <div className="flex justify-between items-center gap-8">
              <div>
                <a href="https://github.com/sammy-code98/geoguide" target="_blank" className="w-8 h-8 leading-9 text-2xl rounded-xl text-black dark:text-primary">
                  <FaGithub />
                </a>
              </div>
              <button
                onClick={toggleTheme}
                className="w-8 h-8 text-2xl rounded-xl text-black dark:text-primary"
              >
                {isDark ? <FiSun /> : <MdOutlineDarkMode />}
              </button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
