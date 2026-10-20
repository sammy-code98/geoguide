import { Link } from "react-router-dom";
import { PiAirplaneTiltDuotone, PiDownloadSimpleDuotone, PiGithubLogoDuotone } from "react-icons/pi";
import { AppRoutes } from "../../types/routes";
import { Postmark, Stamp } from "../ui/postcard";
import { useInstallPrompt } from "../../lib/install-prompt";

const sections: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Countries", to: AppRoutes.countries },
      { label: "For you", to: AppRoutes.recommendations },
      { label: "Saved trips", to: AppRoutes.savedTrips },
    ],
  },
  {
    heading: "Plan",
    links: [
      { label: "Itinerary", to: AppRoutes.itinerary },
      { label: "Trip cost", to: AppRoutes.costEstimator },
      { label: "Travel assistant", to: AppRoutes.chat },
    ],
  },
];

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

/**
 * The footer is the back of a postcard: the message on the left, a dividing
 * line down the middle, and the links as ruled address lines on the right,
 * finished with a stamp and postmark.
 */
export default function Footer(): JSX.Element {
  const year = new Date().getFullYear();
  const { canInstall, install } = useInstallPrompt();

  return (
    <footer className="px-4 sm:px-6 lg:px-8 pt-8 pb-8">
      <div className="relative max-w-7xl mx-auto bg-surface border border-border rounded-2xl px-6 py-9 sm:px-10 sm:py-11">
        <Postmark className="absolute right-[92px] top-9 w-16 text-fg/30 sm:right-[104px] sm:top-11" />
        <Stamp
          tone="terracotta"
          icon={<PiAirplaneTiltDuotone />}
          label="Air mail"
          paper="--terracotta-soft"
          backing="--surface"
          className="absolute right-5 top-5 sm:right-8 sm:top-7"
        />

        <div className="grid md:grid-cols-2 gap-10 md:gap-0">
          {/* The message */}
          <div className="md:pr-12">
            <Link
              to={AppRoutes.getStarted}
              className={`font-serif text-3xl font-semibold tracking-tight text-primary ${focusRing}`}
            >
              GeoGuide
            </Link>
            <p className="mt-14 md:mt-4 max-w-sm font-serif text-lg text-fg/80 leading-relaxed">
              Your calm companion for exploring the world; plan itineraries,
              estimate costs, and discover places worth the trip.
            </p>
            <p className="mt-6 text-sm text-muted">
              Made by{" "}
              <a
                href="https://github.com/sammy-code98"
                target="_blank"
                rel="noreferrer"
                className={`font-medium text-fg underline underline-offset-4 decoration-border hover:text-primary hover:decoration-primary transition-colors ${focusRing}`}
              >
                sammy-code98
              </a>
            </p>
          </div>

          {/* The address side: links on ruled lines */}
          <div className="grid grid-cols-2 gap-8 md:border-l md:border-border md:pl-12 md:pr-28">
            {sections.map((section) => (
              <nav key={section.heading} aria-label={section.heading}>
                <h2 className="font-serif text-lg font-semibold text-fg">{section.heading}</h2>
                <ul className="mt-2">
                  {section.links.map((link) => (
                    <li key={link.label} className="border-b border-border">
                      <Link
                        to={link.to}
                        className={`block py-2.5 text-sm text-muted hover:text-primary transition-colors ${focusRing}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-dashed border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-muted">© {year} GeoGuide. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {/* Only where the browser offers installation (Chromium, Android). */}
            {canInstall && (
              <button
                type="button"
                onClick={() => void install()}
                className={`inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors ${focusRing}`}
              >
                <PiDownloadSimpleDuotone className="text-xl" aria-hidden="true" />
                Install the app
              </button>
            )}
            <a
              href="https://github.com/sammy-code98/geoguide"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg transition-colors ${focusRing}`}
            >
              <PiGithubLogoDuotone className="text-xl" aria-hidden="true" />
              GeoGuide on GitHub
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
