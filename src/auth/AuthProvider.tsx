import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AppUser } from "../types/user";
import { onAuthChange, signInWithGoogle, signOutUser } from "../services/firebase/AuthService";
import { ensureUserDoc } from "../services/firebase/UserService";
import { isFirebaseConfigured } from "../services/firebase/firebase";
import { AuthContext, type AuthContextValue } from "./authContext";

/**
 * Owns auth state for the whole app: subscribes to Firebase auth changes (which
 * also restores the session silently on load), and exposes sign-in/out actions.
 * The single auth listener lives here — nothing else subscribes.
 */
export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }
    let active = true;
    let unsubscribe = () => {};
    onAuthChange((u) => {
      setUser(u);
      setLoading(false);
    })
      .then((fn) => {
        if (active) unsubscribe = fn;
        else fn();
      })
      .catch(() => setLoading(false));
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signIn = useCallback(async () => {
    setError(null);
    try {
      const u = await signInWithGoogle();
      // Create/refresh the Firestore profile; the auth listener updates `user`.
      await ensureUserDoc(u);
    } catch (e) {
      setError((e as Error)?.message || "Sign-in failed.");
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      await signOutUser();
    } catch (e) {
      setError((e as Error)?.message || "Sign-out failed.");
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, error, signIn, signOut, clearError }),
    [user, loading, error, signIn, signOut, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
