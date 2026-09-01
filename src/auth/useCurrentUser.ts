import type { AppUser } from "../types/user";
import { useAuth } from "./useAuth";

/**
 * The authenticated user, guaranteed non-null. Intended for use inside
 * <RequireAuth>-protected subtrees; throws if called while signed out.
 */
export function useCurrentUser(): AppUser {
  const { user } = useAuth();
  if (!user) throw new Error("useCurrentUser called without an authenticated user");
  return user;
}
