import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { AppRoutes } from "../types/routes";
import { useAuth } from "./useAuth";
import AuthLoading from "./AuthLoading";

/**
 * Gate for guest-only routes (e.g. /login). Authenticated users are bounced to
 * their profile.
 */
export default function GuestOnly({ children }: { children: ReactNode }): JSX.Element {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoading />;
  if (user) return <Navigate to={AppRoutes.profile} replace />;
  return <>{children}</>;
}
