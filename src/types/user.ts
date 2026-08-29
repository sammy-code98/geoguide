/** App-level user shape. UI depends on this — never on the raw Firebase `User`. */
export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  /** Account creation time (ms epoch) from Firebase metadata, if available. */
  createdAt: number | null;
}

/** Persisted profile document stored at `users/{uid}`. */
export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}
