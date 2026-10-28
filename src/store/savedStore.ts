import { create } from "zustand";

export type SavedType = "country" | "place" | "itinerary" | "costEstimate";

export interface SavedItem {
  id: string;
  type: SavedType;
  title: string;
  subtitle?: string;
  href?: string;
  data?: unknown;
  savedAt: number;
}

export type SavedInput = Omit<SavedItem, "savedAt">;

interface SavedState {
  items: SavedItem[];
  setItems: (items: SavedItem[]) => void;
}


export const useSavedStore = create<SavedState>((set, get) => ({
  items: [],
  setItems: (items) => {
    if (items !== get().items) set({ items });
  },
}));

export const useIsSaved = (id: string) =>
  useSavedStore((s) => s.items.some((i) => i.id === id));
