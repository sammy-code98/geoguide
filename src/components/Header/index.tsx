import { useCallback, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { HiOutlineCalculator, HiOutlineMap, HiOutlineLightBulb } from "react-icons/hi";
import { AppRoutes } from "../../types/routes";
import { useAuth } from "../../auth/useAuth";
import UserMenu from "../Auth/UserMenu";
import SignInButton from "../Auth/SignInButton";

export default function Header() {
  const { user, loading } = useAuth();
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

  // Follow the OS theme while the user hasn't picked one explicitly.
  // Registered once with proper teardown so listeners don't accumulate.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme:dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!("theme" in localStorage)) {
        document.documentElement.classList.toggle("dark", e.matches);
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
          <div className="flex items-center justify-between mx-auto px-6 py-3 max-w-screen-xl rounded-xl border border-border bg-surface/80 backdrop-blur-md">
            <div>
              <Link
                to={AppRoutes.getStarted}
                className="font-serif text-2xl font-semibold tracking-tight text-primary"
              >
                GeoGuide
              </Link>
            </div>
            <div className="flex justify-between items-center gap-6 md:gap-8">
              <NavLink
                to={AppRoutes.recommendations}
                aria-label="For You"
                className={({ isActive }) =>
                  `flex items-center gap-1 font-medium ${
                    isActive ? "text-primary" : "text-muted hover:text-fg"
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
                  `flex items-center gap-1 font-medium ${
                    isActive ? "text-primary" : "text-muted hover:text-fg"
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
                  `flex items-center gap-1 font-medium ${
                    isActive ? "text-primary" : "text-muted hover:text-fg"
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
                  `flex items-center gap-1 font-medium ${
                    isActive ? "text-primary" : "text-muted hover:text-fg"
                  }`
                }
              >
                <HiOutlineChatBubbleLeftRight aria-hidden="true" />
                <span className="hidden lg:inline">AI Assistant</span>
              </NavLink>
              <div>
                <a
                  href="https://github.com/sammy-code98/geoguide"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GeoGuide on GitHub (opens in a new tab)"
                  className="w-8 h-8 leading-9 text-2xl rounded-xl text-muted hover:text-fg transition-colors"
                >
                  <FaGithub aria-hidden="true" />
                </a>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="w-8 h-8 text-2xl rounded-xl text-muted hover:text-fg transition-colors"
              >
                {isDark ? <FiSun aria-hidden="true" /> : <MdOutlineDarkMode aria-hidden="true" />}
              </button>
              {/* Auth: guests get a Sign In CTA, users get an avatar menu. */}
              {loading ? null : user ? <UserMenu /> : <SignInButton />}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
