export const AppRoutes = {
  getStarted: "/",
  home: "/home",
} as const;

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];
