import { Link } from "react-router-dom";
import { FaGithub } from "react-icons/fa";
import { AppRoutes } from "../../types/routes";

const linkClass =
  "text-sm text-muted hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm";

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

export default function Footer(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 max-w-sm">
            <Link
              to={AppRoutes.getStarted}
              className="font-serif text-2xl font-semibold tracking-tight text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              GeoGuide
            </Link>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Your calm companion for exploring the world — plan itineraries,
              estimate costs, and discover places worth the trip.
            </p>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <nav key={section.heading} aria-label={section.heading}>
              <h2 className="text-xs font-medium uppercase tracking-wide text-fg">
                {section.heading}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            © {year} GeoGuide. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">
              Made by{" "}
              <a
                href="https://github.com/sammy-code98"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-fg hover:text-primary transition-colors"
              >
                sammy-code98
              </a>
            </span>
            <a
              href="https://github.com/sammy-code98/geoguide"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GeoGuide on GitHub (opens in a new tab)"
              className="text-muted hover:text-fg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              <FaGithub className="text-xl" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
