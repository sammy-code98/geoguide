/**
 * Google-only authentication, isolated behind this service. UI/components call
 * these functions — never the Firebase auth SDK directly. All heavy imports are
 * dynamic so Firebase stays out of the initial bundle.
 */
import type { User } from "firebase/auth";
import type { AppUser } from "../../types/user";
import { getFirebaseAuth, FirebaseNotConfiguredError } from "./firebase";

/** Friendly, user-facing auth error with the original Firebase code attached. */
export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "AuthError";
  }
}

function toAppUser(user: User): AppUser {
  const created = user.metadata?.creationTime;
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: created ? Date.parse(created) : null,
  };
}

/** Map raw Firebase auth errors to friendly, recoverable messages. */
function mapAuthError(err: unknown): AuthError {
  if (err instanceof FirebaseNotConfiguredError) {
    return new AuthError(err.message, "auth/not-configured");
  }
  const code = (err as { code?: string })?.code ?? "auth/unknown";
  switch (code) {
    case "auth/popup-blocked":
      return new AuthError(
        "Your browser blocked the sign-in popup. Allow popups for this site and try again.",
        code
      );
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return new AuthError("Sign-in was cancelled.", code);
    case "auth/network-request-failed":
      return new AuthError("Network error — check your connection and try again.", code);
    case "auth/unauthorized-domain":
      return new AuthError(
        "This domain isn't authorized for sign-in. Add it in the Firebase console.",
        code
      );
    default:
      return new AuthError("Couldn't sign in. Please try again.", code);
  }
}

/** Open the Google sign-in popup and resolve with the signed-in user. */
export async function signInWithGoogle(): Promise<AppUser> {
  try {
    const auth = await getFirebaseAuth();
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const cred = await signInWithPopup(auth, provider);
    return toAppUser(cred.user);
  } catch (err) {
    throw mapAuthError(err);
  }
}

/** Sign the current user out. */
export async function signOutUser(): Promise<void> {
  const auth = await getFirebaseAuth();
  const { signOut } = await import("firebase/auth");
  await signOut(auth);
}

/**
 * Subscribe to auth-state changes (handles silent session restoration on load).
 * Resolves with an unsubscribe function.
 */
export async function onAuthChange(
  cb: (user: AppUser | null) => void
): Promise<() => void> {
  const auth = await getFirebaseAuth();
  const { onAuthStateChanged } = await import("firebase/auth");
  return onAuthStateChanged(auth, (user) => cb(user ? toAppUser(user) : null));
}
