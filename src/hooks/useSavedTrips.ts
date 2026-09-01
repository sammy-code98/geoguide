import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import { useSavedStore, type SavedInput, type SavedItem } from "../store/savedStore";
import {
  clearTrips,
  listTrips,
  removeTrip,
  saveTrip,
} from "../services/firebase/TripService";

const key = (uid: string | undefined) => ["savedTrips", uid ?? "anon"] as const;

/**
 * Loads the current user's saved trips (Firestore → React Query) and mirrors
 * them into the Zustand UI store. Mount ONCE near the app root; every other
 * component reads the store synchronously via `useSavedStore` / `useIsSaved`.
 */
export function useSavedTripsSync(): void {
  const { user } = useAuth();
  const uid = user?.uid;
  const setItems = useSavedStore((s) => s.setItems);

  const { data } = useQuery({
    queryKey: key(uid),
    queryFn: () => listTrips(uid as string),
    enabled: !!uid,
  });

  useEffect(() => {
    if (!uid) {
      setItems([]); // signed out — clear the mirror
      return;
    }
    if (data) setItems(data);
  }, [uid, data, setItems]);
}

interface MutationContext {
  prev: SavedItem[];
}

/**
 * Optimistic add/remove/clear for saved trips. Lightweight (no query
 * subscription) so it's cheap to call in every SaveButton. Writes go to
 * Firestore; the React Query cache is updated optimistically and the sync hook
 * reflects it into the UI store. Offline writes queue via Firestore and sync on
 * reconnect.
 */
export function useSavedTripsActions() {
  const { user } = useAuth();
  const uid = user?.uid;
  const qc = useQueryClient();

  const rollback = (_e: unknown, _v: unknown, ctx: MutationContext | undefined) => {
    if (ctx) qc.setQueryData(key(uid), ctx.prev);
  };
  const settle = () => qc.invalidateQueries({ queryKey: key(uid) });

  const saveMut = useMutation({
    mutationFn: (item: SavedInput) => saveTrip(uid as string, item),
    onMutate: async (item): Promise<MutationContext> => {
      await qc.cancelQueries({ queryKey: key(uid) });
      const prev = qc.getQueryData<SavedItem[]>(key(uid)) ?? [];
      const optimistic: SavedItem = { ...item, savedAt: Date.now() };
      qc.setQueryData<SavedItem[]>(key(uid), [
        optimistic,
        ...prev.filter((i) => i.id !== item.id),
      ]);
      return { prev };
    },
    onError: rollback,
    onSettled: settle,
  });

  const removeMut = useMutation({
    mutationFn: (id: string) => removeTrip(uid as string, id),
    onMutate: async (id): Promise<MutationContext> => {
      await qc.cancelQueries({ queryKey: key(uid) });
      const prev = qc.getQueryData<SavedItem[]>(key(uid)) ?? [];
      qc.setQueryData<SavedItem[]>(key(uid), prev.filter((i) => i.id !== id));
      return { prev };
    },
    onError: rollback,
    onSettled: settle,
  });

  const clearMut = useMutation({
    mutationFn: () => clearTrips(uid as string),
    onMutate: async (): Promise<MutationContext> => {
      await qc.cancelQueries({ queryKey: key(uid) });
      const prev = qc.getQueryData<SavedItem[]>(key(uid)) ?? [];
      qc.setQueryData<SavedItem[]>(key(uid), []);
      return { prev };
    },
    onError: rollback,
    onSettled: settle,
  });

  /** Save if not already saved, otherwise remove. No-op when signed out. */
  const toggle = (item: SavedInput) => {
    if (!uid) return;
    const current = qc.getQueryData<SavedItem[]>(key(uid)) ?? [];
    if (current.some((i) => i.id === item.id)) removeMut.mutate(item.id);
    else saveMut.mutate(item);
  };

  return {
    isAuthed: !!uid,
    toggle,
    remove: (id: string) => removeMut.mutate(id),
    clear: () => clearMut.mutate(undefined),
  };
}
