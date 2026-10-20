import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import HelmentHeader from "../components/Helment";
import Header from "../components/Header";
import Footer from "../components/Footer"
import MigrationPrompt from "../components/Saved/MigrationPrompt";
import { useSavedTripsSync } from "../hooks/useSavedTrips";
import { TravelBackdrop } from "../components/ui/travel-backdrop";

// Content column width (px) per route — the `max-w-*` each page renders in —
// so the travel backdrop can keep its doodles in the side margins.
const CONTENT_WIDTH: [prefix: string, px: number][] = [
  ["/detail", 1152], // max-w-6xl
  ["/chat", 1152],
  ["/itinerary", 1024], // max-w-5xl
  ["/cost-estimator", 1024],
  ["/recommendations", 1024],
  ["/profile", 768], // max-w-3xl
  ["/login", 448], // max-w-md
];
const contentWidthFor = (path: string) =>
  CONTENT_WIDTH.find(([prefix]) => path.startsWith(prefix))?.[1] ?? 1280; // max-w-7xl

function HomeLayout() {
  // Single owner of the saved-trips Firestore→store sync for the whole app.
  useSavedTripsSync();
  const { pathname } = useLocation();
  return (
    <>
      <HelmentHeader
        title="GeoGuide"
        description="GeoGuide"
      />
      {/* `isolate` gives the layout its own stacking context, so the backdrop's
          negative z-index lands above this background but below all content. */}
      <div className="relative isolate min-h-screen bg-bg">
        <TravelBackdrop contentWidth={contentWidthFor(pathname)} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <Header />
        <MigrationPrompt />
        <main id="main-content" tabIndex={-1} className="flex-1">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[length:20px_20px] pointer-events-none"></div>
            <div className="relative z-10">
              <Outlet />
            </div>
          </div>
        </main>
        <Footer />
      </div>
      {/* New pages open at the top; back/forward restores the previous offset. */}
      <ScrollRestoration />
    </>
  );
}

export default HomeLayout;
