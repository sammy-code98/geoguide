/**
 * Saved-trips persistence at `users/{uid}/savedTrips/{tripId}`. The item's own
 * `id` is used as the document id, so re-saving the same thing is idempotent
 * (natural dedupe). UI goes through the useSavedTrips hook, never here directly.
 */
import type { SavedItem, SavedInput } from "../../store/savedStore";
import { getDb } from "./firebase";

/** Firestore doc ids can't contain "/" (and a few others) — sanitize. */
const docId = (id: string) => id.replace(/[/#?[\]*]/g, "_");

/** Merge two saved lists by id, keeping the most recently saved copy. */
export function mergeSavedById(a: SavedItem[], b: SavedItem[]): SavedItem[] {
  const map = new Map<string, SavedItem>();
  for (const item of [...a, ...b]) {
    const existing = map.get(item.id);
    if (!existing || (item.savedAt ?? 0) > (existing.savedAt ?? 0)) {
      map.set(item.id, item);
    }
  }
  return Array.from(map.values()).sort((x, y) => (y.savedAt ?? 0) - (x.savedAt ?? 0));
}

/** All saved trips for a user, newest first. */
export async function listTrips(uid: string): Promise<SavedItem[]> {
  const db = await getDb();
  const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
  const snap = await getDocs(
    query(collection(db, "users", uid, "savedTrips"), orderBy("savedAt", "desc"))
  );
  return snap.docs.map((d) => d.data() as SavedItem);
}

/** Save (or overwrite) one trip. Returns the stored item with its timestamp. */
export async function saveTrip(uid: string, item: SavedInput): Promise<SavedItem> {
  const db = await getDb();
  const { doc, setDoc } = await import("firebase/firestore");
  const saved: SavedItem = { ...item, savedAt: Date.now() };
  await setDoc(doc(db, "users", uid, "savedTrips", docId(item.id)), saved);
  return saved;
}

/** Remove one trip by its id. */
export async function removeTrip(uid: string, id: string): Promise<void> {
  const db = await getDb();
  const { doc, deleteDoc } = await import("firebase/firestore");
  await deleteDoc(doc(db, "users", uid, "savedTrips", docId(id)));
}

/** Delete every saved trip for a user. */
export async function clearTrips(uid: string): Promise<void> {
  const db = await getDb();
  const { collection, getDocs, writeBatch } = await import("firebase/firestore");
  const snap = await getDocs(collection(db, "users", uid, "savedTrips"));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

/** Batch-import items (used for the one-time localStorage migration). */
export async function importTrips(uid: string, items: SavedItem[]): Promise<void> {
  if (items.length === 0) return;
  const db = await getDb();
  const { doc, writeBatch } = await import("firebase/firestore");
  const batch = writeBatch(db);
  items.forEach((it) =>
    batch.set(doc(db, "users", uid, "savedTrips", docId(it.id)), it, { merge: true })
  );
  await batch.commit();
}
