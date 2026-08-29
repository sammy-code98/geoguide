import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { AppRoutes } from "../types/routes";
import { useAuth } from "./useAuth";
import AuthLoading from "./AuthLoading";

/**
 * Gate for authenticated-only routes. Guests are redirected to /login with the
 * attempted location preserved in `state.from` so they can be returned after
 * signing in.
 */
export default function RequireAuth({ children }: { children: ReactNode }): JSX.Element {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoading />;
  if (!user) {
    return <Navigate to={AppRoutes.login} state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
