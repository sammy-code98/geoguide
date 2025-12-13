export const AppRoutes = {
  getStarted: "/",
  countries: "/countries",
  detail: "/detail/:name",
} as const;

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];
