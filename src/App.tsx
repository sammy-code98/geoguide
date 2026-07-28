import { lazy, Suspense } from "react"
import { createBrowserRouter } from "react-router-dom"
import HomeLayout from "./layouts/Home.Layout"
import { AppRoutes } from "./types/routes"

import ErrorPage from "./modules/ErrorPage"

import GetStartedPage from "./pages/Home"
import CountriesPage from "./pages/Countries"
import DetailPage from "./pages/Detail"
import CostEstimatorPage from "./pages/CostEstimator"
import ItineraryPage from "./pages/Itinerary"
import RecommendationsPage from "./pages/Recommendations"
import SavedTripsPage from "./pages/SavedTrips"

// Chat pulls in the markdown pipeline — load it only when the route is visited.
// eslint-disable-next-line react-refresh/only-export-components
const ChatPage = lazy(() => import("./pages/Chat"))

const routeFallback = (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800" />
)

export const router = createBrowserRouter([
  {
    path: AppRoutes.getStarted,
    element: <HomeLayout />,
    errorElement:<ErrorPage/>,
    children: [
      {
        path: AppRoutes.getStarted,
        element: <GetStartedPage />
      },
      {
        path: AppRoutes.countries,
        element: <CountriesPage />
      },
      {
        path: AppRoutes.detail,
        element: <DetailPage />
      },
      {
        path: AppRoutes.chat,
        element: (
          <Suspense fallback={routeFallback}>
            <ChatPage />
          </Suspense>
        )
      },
      {
        path: AppRoutes.costEstimator,
        element: <CostEstimatorPage />
      },
      {
        path: AppRoutes.itinerary,
        element: <ItineraryPage />
      },
      {
        path: AppRoutes.recommendations,
        element: <RecommendationsPage />
      },
      {
        path: AppRoutes.savedTrips,
        element: <SavedTripsPage />
      }
    ]
  }
])

