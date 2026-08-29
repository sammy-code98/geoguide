import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "./authContext";
import type { AppUser } from "../types/user";
import RequireAuth from "./RequireAuth";
import GuestOnly from "./GuestOnly";

const user: AppUser = {
  uid: "u1",
  displayName: "Test Traveler",
  email: "test@example.com",
  photoURL: null,
  createdAt: null,
};

function ctx(partial: Partial<AuthContextValue>): AuthContextValue {
  return {
    user: null,
    loading: false,
    error: null,
    signIn: vi.fn(),
    signOut: vi.fn(),
    clearError: vi.fn(),
    ...partial,
  };
}

// The guarded tree lives at /guarded; /login and /profile are neutral landing
// pages so we can observe where a guard redirects.
function renderGuard(value: AuthContextValue, tree: ReactNode) {
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={["/guarded"]}>
        <Routes>
          <Route path="/guarded" element={tree} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/profile" element={<div>Profile Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("RequireAuth", () => {
  const tree = (
    <RequireAuth>
      <div>Protected Content</div>
    </RequireAuth>
  );

  it("renders children for an authenticated user", () => {
    renderGuard(ctx({ user }), tree);
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects a guest to /login", () => {
    renderGuard(ctx({ user: null }), tree);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("shows a loading state while auth resolves", () => {
    renderGuard(ctx({ loading: true }), tree);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});

describe("GuestOnly", () => {
  const tree = (
    <GuestOnly>
      <div>Guest Content</div>
    </GuestOnly>
  );

  it("renders children for a guest", () => {
    renderGuard(ctx({ user: null }), tree);
    expect(screen.getByText("Guest Content")).toBeInTheDocument();
  });

  it("redirects an authenticated user to /profile", () => {
    renderGuard(ctx({ user }), tree);
    expect(screen.getByText("Profile Page")).toBeInTheDocument();
    expect(screen.queryByText("Guest Content")).not.toBeInTheDocument();
  });
});
