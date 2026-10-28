import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";


afterEach(() => {
  cleanup();
});

beforeEach(() => {
  try {
    localStorage?.clear();
  } catch {
    /* no localStorage available — nothing to reset */
  }
});
