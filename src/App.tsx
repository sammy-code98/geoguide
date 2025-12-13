import { createBrowserRouter } from "react-router-dom"
import HomeLayout from "./layouts/Home.Layout"
import { AppRoutes } from "./types/routes"

import ErrorPage from "./modules/ErrorPage"

import GetStartedPage from "./pages/Home"
import CountriesPage from "./pages/Countries"
import DetailPage from "./pages/Detail"

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
      }
    ]
  }
])

