import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SaveButton from "./SaveButton";
import { useSavedStore, type SavedInput } from "../../store/savedStore";

const item: SavedInput = {
  id: "country:NGA",
  type: "country",
  title: "Nigeria",
};

beforeEach(() => {
  useSavedStore.setState({ items: [] });
});

describe("SaveButton", () => {
  it("toggles saved state and reflects it via aria-pressed and label", async () => {
    const user = userEvent.setup();
    render(<SaveButton item={item} label />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveTextContent("Save");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveTextContent("Saved");
    expect(useSavedStore.getState().items).toHaveLength(1);

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(useSavedStore.getState().items).toHaveLength(0);
  });

  it("exposes an accessible name in the compact variant", () => {
    render(<SaveButton item={item} compact />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("reflects an already-saved item on mount", () => {
    useSavedStore.setState({ items: [{ ...item, savedAt: Date.now() }] });
    render(<SaveButton item={item} label />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveTextContent("Saved");
  });
});
