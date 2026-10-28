export interface AppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: number | null;
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}
