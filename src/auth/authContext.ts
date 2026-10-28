import { createContext } from "react";
import type { AppUser } from "../types/user";

export interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
