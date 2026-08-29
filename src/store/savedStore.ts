import { create } from "zustand";

export type SavedType = "country" | "place" | "itinerary" | "costEstimate";

export interface SavedItem {
  /** Stable unique id, e.g. `country:NGA` — also used as the Firestore doc id. */
  id: string;
  type: SavedType;
  title: string;
  subtitle?: string;
  href?: string;
  /** Full payload for rendering on the Saved Trips page. */
  data?: unknown;
  savedAt: number;
}

export type SavedInput = Omit<SavedItem, "savedAt">;

interface SavedState {
  /** UI cache mirror of the user's Firestore saved trips (session-only). */
  items: SavedItem[];
  /** Replace the cache — driven by the React Query → Firestore sync. */
  setItems: (items: SavedItem[]) => void;
}

/**
 * Client-side UI cache for saved trips. Firestore is the source of truth and
 * React Query is the fetch/cache layer; this store is the synchronous snapshot
 * the UI reads from (see `useSavedTrips`). It no longer persists to
 * localStorage — that role moved to Firestore's offline cache.
 */
export const useSavedStore = create<SavedState>((set, get) => ({
  items: [],
  setItems: (items) => {
    // Skip no-op replaces (React Query hands the same array ref to every
    // subscriber) so we don't churn renders across many SaveButtons.
    if (items !== get().items) set({ items });
  },
}));

/** Reactive helper — true when an item with `id` is currently saved. */
export const useIsSaved = (id: string) =>
  useSavedStore((s) => s.items.some((i) => i.id === id));
