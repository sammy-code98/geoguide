export const AppRoutes = {
  getStarted: "/",
  countries: "/countries",
  detail: "/detail/:code",
  chat: "/chat",
} as const;

export type AppRoutes = (typeof AppRoutes)[keyof typeof AppRoutes];
