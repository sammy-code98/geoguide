import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Unmount React trees and reset persisted state between tests so each case
// starts from a clean slate (jsdom localStorage persists within a file).
afterEach(() => {
  cleanup();
});

beforeEach(() => {
  // Guard: some environments expose no working localStorage.
  try {
    localStorage?.clear();
  } catch {
    /* no localStorage available — nothing to reset */
  }
});
