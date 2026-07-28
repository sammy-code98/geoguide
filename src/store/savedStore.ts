import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SavedType = "country" | "place" | "itinerary" | "costEstimate";

export interface SavedItem {
  /** Stable unique id, e.g. `country:NGA` — toggling the same id un-saves it. */
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
  items: SavedItem[];
  toggle: (item: SavedInput) => void;
  remove: (id: string) => void;
  clear: () => void;
}

/** Persisted store of the user's saved countries, places, itineraries, and plans. */
export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        set({
          items: exists
            ? get().items.filter((i) => i.id !== item.id)
            : [{ ...item, savedAt: Date.now() }, ...get().items],
        });
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: "geoguide.saved" }
  )
);

/** Reactive helper — true when an item with `id` is saved. */
export const useIsSaved = (id: string) =>
  useSavedStore((s) => s.items.some((i) => i.id === id));
