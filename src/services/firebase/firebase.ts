/**
 * Lazy Firebase bootstrap.
 *
 * The Firebase SDK is heavy, so every module here is loaded via dynamic
 * `import()` — nothing Firebase-related is pulled into the initial bundle until
 * something actually needs auth or Firestore. Each resource is initialized once
 * and memoized as a promise.
 *
 * NOTE: the `VITE_FIREBASE_*` values are the Firebase *web config*. They are
 * public by design (they identify the project, they are not secrets); access is
 * enforced by Firestore security rules, not by hiding these values.
 */
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

/** True when the minimum config needed to initialize Firebase is present. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

/** Thrown (and surfaced in the UI) when Firebase env vars are missing. */
export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Firebase is not configured. Add the VITE_FIREBASE_* variables to your .env — see docs/FIREBASE.md."
    );
    this.name = "FirebaseNotConfiguredError";
  }
}

let appPromise: Promise<FirebaseApp> | null = null;
let authPromise: Promise<Auth> | null = null;
let dbPromise: Promise<Firestore> | null = null;

async function getApp(): Promise<FirebaseApp> {
  if (!isFirebaseConfigured) throw new FirebaseNotConfiguredError();
  if (!appPromise) {
    appPromise = (async () => {
      const { initializeApp, getApps, getApp: getExisting } = await import("firebase/app");
      return getApps().length ? getExisting() : initializeApp(firebaseConfig);
    })();
  }
  return appPromise;
}

/** Memoized Firebase Auth instance. */
export async function getFirebaseAuth(): Promise<Auth> {
  if (!authPromise) {
    authPromise = (async () => {
      const app = await getApp();
      const { getAuth } = await import("firebase/auth");
      return getAuth(app);
    })();
  }
  return authPromise;
}

/**
 * Memoized Firestore instance with IndexedDB offline persistence enabled.
 * `persistentLocalCache` gives offline reads/writes, an automatic write queue,
 * and reconnect sync for free — no custom queue needed.
 */
export async function getDb(): Promise<Firestore> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const app = await getApp();
      const { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } =
        await import("firebase/firestore");
      return initializeFirestore(app, {
        localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
      });
    })();
  }
  return dbPromise;
}
