/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense, type ReactNode } from "react"
import { createBrowserRouter } from "react-router-dom"
import HomeLayout from "./layouts/Home.Layout"
import { AppRoutes } from "./types/routes"
import RequireAuth from "./auth/RequireAuth"

import ErrorPage from "./modules/ErrorPage"

// Entry routes are eager; feature pages are code-split so they don't weigh down
// the initial load (Detail also pulls in Leaflet; Chat pulls in the markdown stack).
import GetStartedPage from "./pages/Home"
import CountriesPage from "./pages/Countries"

const DetailPage = lazy(() => import("./pages/Detail"))
const ChatPage = lazy(() => import("./pages/Chat"))
const CostEstimatorPage = lazy(() => import("./pages/CostEstimator"))
const ItineraryPage = lazy(() => import("./pages/Itinerary"))
const RecommendationsPage = lazy(() => import("./pages/Recommendations"))
const SavedTripsPage = lazy(() => import("./pages/SavedTrips"))
const LoginPage = lazy(() => import("./pages/Login"))
const ProfilePage = lazy(() => import("./pages/Profile"))

const routeFallback = (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800" />
)

const lazyRoute = (node: ReactNode) => <Suspense fallback={routeFallback}>{node}</Suspense>

export const router = createBrowserRouter([
  {
    path: AppRoutes.getStarted,
    element: <HomeLayout />,
    errorElement: <ErrorPage />,
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
        element: lazyRoute(<DetailPage />)
      },
      {
        path: AppRoutes.chat,
        element: lazyRoute(<ChatPage />)
      },
      {
        path: AppRoutes.costEstimator,
        element: lazyRoute(<CostEstimatorPage />)
      },
      {
        path: AppRoutes.itinerary,
        element: lazyRoute(<ItineraryPage />)
      },
      {
        path: AppRoutes.recommendations,
        element: lazyRoute(<RecommendationsPage />)
      },
      {
        path: AppRoutes.savedTrips,
        element: <RequireAuth>{lazyRoute(<SavedTripsPage />)}</RequireAuth>
      },
      {
        path: AppRoutes.login,
        element: lazyRoute(<LoginPage />)
      },
      {
        path: AppRoutes.profile,
        element: <RequireAuth>{lazyRoute(<ProfilePage />)}</RequireAuth>
      }
    ]
  }
])
