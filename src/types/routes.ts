export const AppRoutes = {
  getStarted: "/",
  home: "/home",
  detail: "/detail",
} as const;

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];
