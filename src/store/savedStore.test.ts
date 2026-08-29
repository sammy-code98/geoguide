import { describe, it, expect, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useSavedStore, useIsSaved, type SavedInput } from "./savedStore";

const country: SavedInput = {
  id: "country:NGA",
  type: "country",
  title: "Nigeria",
  href: "/detail/NGA",
};

const place: SavedInput = {
  id: "place:lagos",
  type: "place",
  title: "Lagos",
};

beforeEach(() => {
  // The store persists to localStorage (cleared in setup) — also reset the
  // in-memory copy so each test starts empty regardless of import order.
  useSavedStore.setState({ items: [] });
});

describe("savedStore", () => {
  it("toggling an item adds it, toggling again removes it", () => {
    const { toggle } = useSavedStore.getState();

    act(() => toggle(country));
    expect(useSavedStore.getState().items).toHaveLength(1);
    expect(useSavedStore.getState().items[0].id).toBe("country:NGA");

    act(() => toggle(country));
    expect(useSavedStore.getState().items).toHaveLength(0);
  });

  it("stamps savedAt when adding", () => {
    act(() => useSavedStore.getState().toggle(country));
    expect(typeof useSavedStore.getState().items[0].savedAt).toBe("number");
  });

  it("prepends newly saved items (most recent first)", () => {
    act(() => useSavedStore.getState().toggle(country));
    act(() => useSavedStore.getState().toggle(place));
    expect(useSavedStore.getState().items.map((i) => i.id)).toEqual([
      "place:lagos",
      "country:NGA",
    ]);
  });

  it("remove deletes only the matching id", () => {
    act(() => useSavedStore.getState().toggle(country));
    act(() => useSavedStore.getState().toggle(place));
    act(() => useSavedStore.getState().remove("country:NGA"));
    expect(useSavedStore.getState().items.map((i) => i.id)).toEqual(["place:lagos"]);
  });

  it("clear empties the store", () => {
    act(() => useSavedStore.getState().toggle(country));
    act(() => useSavedStore.getState().toggle(place));
    act(() => useSavedStore.getState().clear());
    expect(useSavedStore.getState().items).toHaveLength(0);
  });

  it("useIsSaved reacts to toggles", () => {
    const { result } = renderHook(() => useIsSaved("country:NGA"));
    expect(result.current).toBe(false);

    act(() => useSavedStore.getState().toggle(country));
    expect(result.current).toBe(true);

    act(() => useSavedStore.getState().toggle(country));
    expect(result.current).toBe(false);
  });
});
