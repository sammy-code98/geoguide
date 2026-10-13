import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { MdOutlineDarkMode } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { HiOutlineChatBubbleLeftRight, HiOutlineGlobeAlt } from "react-icons/hi2";
import { HiOutlineCalculator, HiOutlineMap, HiOutlineLightBulb, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { PiGlobeHemisphereWestDuotone } from "react-icons/pi";
import type { IconType } from "react-icons";
import { AppRoutes } from "../../types/routes";
import { useAuth } from "../../auth/useAuth";
import UserMenu from "../Auth/UserMenu";
import SignInButton from "../Auth/SignInButton";
import { TONES, type Tone } from "../ui/postcard";
import { cn } from "../../lib/cn";

// Each destination wears the colour of its page's postcard.
const NAV: { to: string; label: string; Icon: IconType; tone: Tone }[] = [
  { to: AppRoutes.countries, label: "Explore", Icon: HiOutlineGlobeAlt, tone: "sea" },
  { to: AppRoutes.recommendations, label: "For You", Icon: HiOutlineLightBulb, tone: "sand" },
  { to: AppRoutes.itinerary, label: "Itinerary", Icon: HiOutlineMap, tone: "olive" },
  { to: AppRoutes.costEstimator, label: "Trip Cost", Icon: HiOutlineCalculator, tone: "terracotta" },
  { to: AppRoutes.chat, label: "Assistant", Icon: HiOutlineChatBubbleLeftRight, tone: "sea" },
];

const iconButton =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl text-muted transition-colors hover:bg-surface-2 hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export default function Header() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // The menu closes itself on navigation, Escape, or a tap outside the header.
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);
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
    <header ref={headerRef} className="fixed top-0 left-0 w-full z-20">
      <div className="px-4 sm:px-6 lg:px-8 pt-3">
        <nav aria-label="Primary" className="relative mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface py-2.5 pl-4 pr-2.5 sm:pl-5">
            {/* Brand: a little stamp and the wordmark */}
            <Link
              to={AppRoutes.getStarted}
              className="flex items-center gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                aria-hidden="true"
                className="rotate-3 p-[3px]"
                style={{
                  background:
                    "radial-gradient(circle, rgb(var(--surface)) 1.6px, rgb(var(--sea-soft)) 2px) -3px -3px / 6px 6px",
                }}
              >
                <span className="flex h-7 w-6 items-center justify-center bg-sea-soft text-lg text-sea">
                  <PiGlobeHemisphereWestDuotone />
                </span>
              </span>
              <span className="font-serif text-2xl font-semibold tracking-tight text-primary">GeoGuide</span>
            </Link>

            {/* Destinations (large screens) */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV.map(({ to, label, Icon, tone }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive ? cn(TONES[tone].block, TONES[tone].ink) : "text-muted hover:bg-surface-2 hover:text-fg"
                    )
                  }
                >
                  <Icon className="text-base" aria-hidden="true" />
                  {label}
                </NavLink>
              ))}
            </div>

            <div className="flex items-center gap-1">
              <a
                href="https://github.com/sammy-code98/geoguide"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GeoGuide on GitHub (opens in a new tab)"
                className={cn(iconButton, "hidden sm:flex")}
              >
                <FaGithub aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className={iconButton}
              >
                {isDark ? <FiSun aria-hidden="true" /> : <MdOutlineDarkMode aria-hidden="true" />}
              </button>
              {/* Auth: guests get a Sign In CTA, users get an avatar menu. */}
              {loading ? null : user ? (
                <span className="ml-1 flex">
                  <UserMenu />
                </span>
              ) : (
                <span className="ml-1 hidden sm:flex">
                  <SignInButton />
                </span>
              )}
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="primary-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className={cn(iconButton, "lg:hidden")}
              >
                {menuOpen ? <HiOutlineX aria-hidden="true" /> : <HiOutlineMenu aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Destinations (small screens): a postcard of ruled lines */}
          {menuOpen && (
            <div
              id="primary-menu"
              className="absolute inset-x-0 top-full mt-2 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-border bg-surface p-3 lg:hidden"
            >
              <ul>
                {NAV.map(({ to, label, Icon, tone }) => (
                  <li key={to} className="border-b border-border last:border-b-0">
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 rounded-xl px-2 py-2.5 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActive ? "text-fg" : "text-muted hover:text-fg"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-full text-lg",
                              isActive ? cn(TONES[tone].block, TONES[tone].ink) : "bg-surface-2"
                            )}
                          >
                            <Icon aria-hidden="true" />
                          </span>
                          {label}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-dashed border-border px-2 pt-3 sm:hidden">
                <a
                  href="https://github.com/sammy-code98/geoguide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm text-sm text-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <FaGithub className="text-lg" aria-hidden="true" />
                  GitHub
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                {!loading && !user && <SignInButton />}
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
