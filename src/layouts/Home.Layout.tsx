import { Outlet } from "react-router-dom";
import HelmentHeader from "../components/Helment";
import Header from "../components/Header";

function HomeLayout() {
  return (
    <>
      <HelmentHeader
        title="GeoGuide"
        description="GeoGuide"
      />
      <div className="min-h-screen bg-gradient-to-br from-light-99 via-white to-light-95 dark:from-grey-bg dark:via-grey-20 dark:to-grey-10">
        <Header />
        <main className="flex-1">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[length:20px_20px] pointer-events-none"></div>
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
