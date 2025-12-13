export const AppRoutes = {
  getStarted: "/",
  countries: "/countries",
  detail: "/detail/:code",
} as const;

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];
