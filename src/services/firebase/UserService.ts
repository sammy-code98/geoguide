/**
 * User profile persistence at `users/{uid}`. Called on sign-in to keep the
 * stored profile in sync with the Google account. UI never touches Firestore
 * directly — it goes through this service.
 */
import type { AppUser, UserProfile } from "../../types/user";
import { getDb } from "./firebase";

/** Create the user doc on first sign-in, or refresh its mutable fields. */
export async function ensureUserDoc(user: AppUser): Promise<void> {
  const db = await getDb();
  const { doc, getDoc, setDoc } = await import("firebase/firestore");
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  const now = Date.now();
  const mutable = {
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    updatedAt: now,
  };

  if (snap.exists()) {
    await setDoc(ref, mutable, { merge: true });
  } else {
    await setDoc(ref, {
      uid: user.uid,
      createdAt: user.createdAt ?? now,
      ...mutable,
    });
  }
}

/** Read the stored profile, or `null` if it doesn't exist yet. */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = await getDb();
  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}
