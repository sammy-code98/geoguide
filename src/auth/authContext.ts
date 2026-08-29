import { createContext } from "react";
import type { AppUser } from "../types/user";

export interface AuthContextValue {
  /** Current user, or null when signed out. */
  user: AppUser | null;
  /** True until the initial auth state has been resolved. */
  loading: boolean;
  /** Last auth error message, if any. */
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

/** Undefined until wrapped in <AuthProvider> — hooks assert this. */
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
