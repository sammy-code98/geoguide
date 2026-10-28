import type { AppUser } from "../types/user";
import { useAuth } from "./useAuth";


export function useCurrentUser(): AppUser {
  const { user } = useAuth();
  if (!user) throw new Error("useCurrentUser called without an authenticated user");
  return user;
}
