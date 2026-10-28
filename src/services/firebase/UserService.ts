import type { AppUser, UserProfile } from "../../types/user";
import { getDb } from "./firebase";

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

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const db = await getDb();
  const { doc, getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}
