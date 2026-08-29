import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SaveButton from "./SaveButton";
import { useSavedStore, type SavedInput } from "../../store/savedStore";
import type { AppUser } from "../../types/user";

// Shared mutable mocks (hoisted so vi.mock factories can see them).
const h = vi.hoisted(() => ({
  user: null as AppUser | null,
  toggle: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../../auth/useAuth", () => ({ useAuth: () => ({ user: h.user }) }));
vi.mock("../../hooks/useSavedTrips", () => ({
  useSavedTripsActions: () => ({ toggle: h.toggle, remove: vi.fn(), clear: vi.fn(), isAuthed: !!h.user }),
}));
vi.mock("react-router-dom", () => ({ useNavigate: () => h.navigate }));

const user: AppUser = {
  uid: "u1",
  displayName: "Test",
  email: "t@e.com",
  photoURL: null,
  createdAt: null,
};

const item: SavedInput = { id: "country:NGA", type: "country", title: "Nigeria" };

beforeEach(() => {
  h.user = null;
  h.toggle.mockReset();
  h.navigate.mockReset();
  useSavedStore.setState({ items: [] });
});

describe("SaveButton", () => {
  it("guest click routes to sign-in instead of saving", async () => {
    const u = userEvent.setup();
    render(<SaveButton item={item} label />);
    const button = screen.getByRole("button", { name: "Sign in to save" });
    await u.click(button);
    expect(h.navigate).toHaveBeenCalledWith("/login");
    expect(h.toggle).not.toHaveBeenCalled();
  });

  it("authed click toggles the trip", async () => {
    h.user = user;
    const u = userEvent.setup();
    render(<SaveButton item={item} label />);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await u.click(button);
    expect(h.toggle).toHaveBeenCalledWith(item);
    expect(h.navigate).not.toHaveBeenCalled();
  });

  it("reflects an already-saved item for an authed user", () => {
    h.user = user;
    useSavedStore.setState({ items: [{ ...item, savedAt: Date.now() }] });
    render(<SaveButton item={item} label />);
    const button = screen.getByRole("button", { name: "Remove from saved" });
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveTextContent("Saved");
  });
});
