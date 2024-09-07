import { Link } from "react-router-dom";
import { AppRoutes } from "../../types/routes";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import { FiSun } from "react-icons/fi";
import { FaDesktop } from "react-icons/fa6";

export default function Index(): JSX.Element {
  const [theme, setTheme] = useState<string | null>(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "system"
  );
  const element = document.documentElement;
  const darkQuery = window.matchMedia("(prefers-color-scheme:dark)");

  const iconSet = [
    {
      icon: <FiSun />,
      title: "light",
    },
    {
      icon: <MdOutlineDarkMode />,
      title: "dark",
    },
    {
      icon: <FaDesktop />,
      title: "system",
    },
  ];

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

  return (
    <header className="fixed bg-white top-0 left-0 h-16 shadow-sm  w-full z-20 dark:bg-bgDark">
      <div className="px-4 py-2 sm:px-12 pb-4">
        <nav>
          <div className="flex items-center justify-between mx-auto py-1">
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
                <button className="w-8 h-8 leading-9 text-2xl rounded-xl text-black dark:text-primary">
                  <FaGithub />
                </button>
              </div>
              <div className="bg-textWhite  rounded-md px-2">
                {iconSet.map((icon) => (
                  <button
                    className={`w-8 h-8 leading-9 text-2xl rounded-xl ${
                      theme === icon.title && "text-primary"
                    } m-1`}
                    onClick={() => setTheme(icon.title)}
                  >
                    <span key={icon.title}>{icon.icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="image-container">
            <picture className="flex justify-end items-center">
              <source srcSet="/src/assets/bgAvif.avif" type="image/avif" />
              <img
                src="/src/assets/lightBg.png"
                alt=""
                className="w-[71.75rem] flex-none max-w-none dark:hidden"
                decoding="async"
              />
            </picture>

            <picture className="flex justify-end items-center">
              <source srcSet="/src/assets/dark.avif" type="image/avif" />
              <img
                src="/src/assets/darkBg.png"
                alt=""
                className="w-[90rem] flex-none max-w-none z-50 hidden dark:block"
                decoding="async"
              />
            </picture>
          </div>
        </nav>
      </div>
    </header>
  );
}
