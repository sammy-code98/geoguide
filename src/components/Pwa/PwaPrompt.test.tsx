import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import PwaPrompt from "./PwaPrompt";

const sw = vi.hoisted(() => ({
  needRefresh: false,
  offlineReady: false,
  setNeedRefresh: vi.fn(),
  setOfflineReady: vi.fn(),
  updateServiceWorker: vi.fn(),
}));

vi.mock("virtual:pwa-register/react", () => ({
  useRegisterSW: () => ({
    needRefresh: [sw.needRefresh, sw.setNeedRefresh],
    offlineReady: [sw.offlineReady, sw.setOfflineReady],
    updateServiceWorker: sw.updateServiceWorker,
  }),
}));

const setOnline = (value: boolean) => {
  Object.defineProperty(navigator, "onLine", { configurable: true, get: () => value });
  act(() => {
    window.dispatchEvent(new Event(value ? "online" : "offline"));
  });
};

describe("PwaPrompt", () => {
  beforeEach(() => {
    sw.needRefresh = false;
    sw.offlineReady = false;
    vi.clearAllMocks();
  });
  afterEach(() => setOnline(true));

  it("stays silent when online and up to date", () => {
    render(<PwaPrompt />);
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("offers the new version and reloads into it on request", () => {
    sw.needRefresh = true;
    render(<PwaPrompt />);
    expect(screen.getByText("A new version is ready")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reload" }));
    expect(sw.updateServiceWorker).toHaveBeenCalledWith(true);
    fireEvent.click(screen.getByRole("button", { name: "Later" }));
    expect(sw.setNeedRefresh).toHaveBeenCalledWith(false);
  });

  it("says when the connection drops and can be dismissed", () => {
    render(<PwaPrompt />);
    setOnline(false);
    expect(screen.getByText("You're offline")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Got it" }));
    expect(screen.queryByText("You're offline")).toBeNull();
  });
});
