import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useSavedStore, useIsSaved, type SavedItem } from "./savedStore";
import { mergeSavedById } from "../services/firebase/TripService";

const item = (id: string, savedAt: number): SavedItem => ({
  id,
  type: "country",
  title: id,
  savedAt,
});

beforeEach(() => {
  useSavedStore.setState({ items: [] });
});

describe("savedStore (UI cache)", () => {
  it("setItems replaces the mirror and useIsSaved reflects it", () => {
    const { result } = renderHook(() => useIsSaved("country:NGA"));
    expect(result.current).toBe(false);

    act(() => useSavedStore.getState().setItems([item("country:NGA", 1)]));
    expect(result.current).toBe(true);

    act(() => useSavedStore.getState().setItems([]));
    expect(result.current).toBe(false);
  });

  it("setItems ignores a no-op replace with the same array reference", () => {
    const arr = [item("a", 1)];
    act(() => useSavedStore.getState().setItems(arr));
    const first = useSavedStore.getState().items;
    act(() => useSavedStore.getState().setItems(arr));
    expect(useSavedStore.getState().items).toBe(first); // unchanged reference
  });
});

describe("mergeSavedById", () => {
  it("unions two lists by id", () => {
    const merged = mergeSavedById([item("a", 1)], [item("b", 2)]);
    expect(merged.map((i) => i.id).sort()).toEqual(["a", "b"]);
  });

  it("keeps the most recently saved copy of a duplicate id", () => {
    const merged = mergeSavedById([item("a", 10)], [{ ...item("a", 20), title: "newer" }]);
    expect(merged).toHaveLength(1);
    expect(merged[0].savedAt).toBe(20);
    expect(merged[0].title).toBe("newer");
  });

  it("sorts results newest first", () => {
    const merged = mergeSavedById([item("old", 1)], [item("new", 5)]);
    expect(merged.map((i) => i.id)).toEqual(["new", "old"]);
  });
});
