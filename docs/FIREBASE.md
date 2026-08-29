# Firebase Authentication & Cloud Persistence

GeoGuide uses **Firebase Authentication (Google only)** for sign-in and
**Cloud Firestore** as the source of truth for each user's saved trips and AI
chat history. The Express backend is **not** involved in auth — it stays a pure
proxy for Gemini/Serpstack/Weather/Exchange/Countries.

> **Security note:** the `VITE_FIREBASE_*` values are the Firebase *web config*.
> They are **public by design** — they identify the project and are safe to ship
> in the browser bundle. Access control is enforced entirely by the Firestore
> **security rules** (`firestore.rules`), never by hiding the config. The real
> secrets (Gemini, Serpstack, etc.) remain server-side on the Express app.

---

## 1. One-time setup (required before auth will work)

1. Create a project at <https://console.firebase.google.com>.
2. **Authentication → Get started → Sign-in method → Google → Enable.**
   Set a support email and save.
3. **Authentication → Settings → Authorized domains:** ensure `localhost` is
   listed (add your deploy domain later).
4. **Firestore Database → Create database → Production mode.** Pick a region.
5. **Project settings → General → Your apps → Web app (`</>`)** — register an app
   and copy the config values.
6. Paste them into `.env` (see below), then restart `yarn dev`.
7. Publish the security rules from `firestore.rules` (see §4).

## 2. Environment variables

Add to `.env` (template in `.env.example`):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=<project>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project>
VITE_FIREBASE_STORAGE_BUCKET=<project>.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=1:...:web:...
```

If these are missing, the app still runs — auth features surface a clear
"Firebase is not configured" state instead of crashing.

## 3. Firestore collections

```
users/{uid}                      # profile: displayName, email, photoURL, createdAt, updatedAt
  savedTrips/{tripId}            # SavedItem {id,type,title,subtitle,href,data,savedAt}   (sub-phase 19b)
  chats/{chatId}                 # {title, createdAt, updatedAt, lastPreview}             (sub-phase 19c)
    messages/{messageId}         # {role:'user'|'assistant', content, createdAt}          (sub-phase 19c)
  preferences/{doc}              # reserved for future use
```

Messages are a **subcollection** (not an array on the chat doc) so they paginate
and never hit the 1 MB document limit.

## 4. Security rules

`firestore.rules` restricts every user to their own tree:

```
match /users/{uid} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
  match /{document=**} {
    allow read, write: if request.auth != null && request.auth.uid == uid;
  }
}
```

Publish via the console (**Firestore → Rules → paste → Publish**) or, with the
Firebase CLI: `firebase deploy --only firestore:rules`.

## 5. Authentication flow

```
User clicks "Continue with Google"
        │
        ▼
AuthService.signInWithGoogle()  ── Google popup ──▶  Firebase Auth
        │                                               │
        │  on success                                   ▼
        ▼                                     onAuthStateChanged fires
UserService.ensureUserDoc(user)  ──▶  users/{uid} upserted
        │                                               │
        ▼                                               ▼
AuthProvider state updates  ──▶  useAuth() / useCurrentUser()  ──▶  UI
```

- **Session restoration** is automatic: `onAuthStateChanged` (subscribed once in
  `AuthProvider`) rehydrates the user on every load.
- **Route protection:** `RequireAuth` gates `/profile` and `/saved-trips`
  (guests → `/login`, original destination preserved in `state.from`).
  `GuestOnly` is available for guest-only routes.

## 6. Synchronization strategy (19b/19c)

```
Firestore (source of truth) → React Query (server cache) → Zustand (UI state) → UI
```

Firestore's built-in **`persistentLocalCache`** (IndexedDB) provides offline
reads/writes, an automatic write queue, and reconnect sync — no custom queue.
Mutations are optimistic via React Query; Zustand holds only UI/session state.

## 7. Migration strategy (19b)

On first authenticated load, if `localStorage["geoguide.saved"]` holds trips, the
user is prompted to import them. Items are merged by `id` (dedupe), batch-written
to Firestore, a `geoguide.migrated` flag is set, and the local copy is cleared.

## 8. Future extension points

- `preferences/` for synced theme/units and premium flags.
- Collaborative / shared itineraries (a top-level `trips/` collection with
  membership) — would need broader rules.
- Additional auth providers (currently Google-only by product decision).
