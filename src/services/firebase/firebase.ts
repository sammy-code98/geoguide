import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as
    | string
    | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as
    | string
    | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

export class FirebaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Firebase is not configured. Add the VITE_FIREBASE_* variables to your .env — see docs/FIREBASE.md.",
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
      const {
        initializeApp,
        getApps,
        getApp: getExisting,
      } = await import("firebase/app");
      return getApps().length ? getExisting() : initializeApp(firebaseConfig);
    })();
  }
  return appPromise;
}

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

export async function getDb(): Promise<Firestore> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const app = await getApp();
      const {
        initializeFirestore,
        persistentLocalCache,
        persistentMultipleTabManager,
      } = await import("firebase/firestore");
      return initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),

        ignoreUndefinedProperties: true,
      });
    })();
  }
  return dbPromise;
}
