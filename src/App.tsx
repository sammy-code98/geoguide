import { createBrowserRouter } from "react-router-dom"
import MainLayout from "./layouts/Main.layout"
import HomeLayout from "./layouts/Home.Layout"

import { AppRoutes } from "./types/routes"


import GetStartedPage from "./pages/GetStarted"
import HomePage from "./pages/Home"
import DetailPage from "./pages/Detail"

export const router = createBrowserRouter([
  {
    path: AppRoutes.getStarted,
    element: <MainLayout />,
    children: [
      {
        path: AppRoutes.getStarted,
        element: <GetStartedPage />
      }
    ]
  },
  {
    element: <HomeLayout />,
    children: [
      {
        path: AppRoutes.home,
        element: <HomePage />
      },
      {
        path: AppRoutes.detail,
        element: <DetailPage />
      }
    ]
  }
])

