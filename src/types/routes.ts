export const AppRoutes = {
  getStarted: "/",
  home: "/home",
  detail: "/detail/:code",
} as const;

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];
