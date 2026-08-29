import { Outlet } from "react-router-dom";
import HelmentHeader from "../components/Helment";
import Header from "../components/Header";
import Footer from "../components/Footer"
import MigrationPrompt from "../components/Saved/MigrationPrompt";
import { useSavedTripsSync } from "../hooks/useSavedTrips";

function HomeLayout() {
  // Single owner of the saved-trips Firestore→store sync for the whole app.
  useSavedTripsSync();
  return (
    <>
      <HelmentHeader
        title="GeoGuide"
        description="GeoGuide"
      />
      <div className="min-h-screen bg-bg">
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
    </>
  );
}

export default HomeLayout;
