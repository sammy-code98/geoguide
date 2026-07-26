export const AppRoutes = {
  getStarted: "/",
  countries: "/countries",
  detail: "/detail/:code",
  chat: "/chat",
  costEstimator: "/cost-estimator",
  itinerary: "/itinerary",
} as const;

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];
