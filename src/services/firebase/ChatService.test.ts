import { describe, it, expect } from "vitest";
import { deriveTitle } from "./ChatService";

describe("deriveTitle", () => {
  it("uses the message text as the title", () => {
    expect(deriveTitle("Plan a trip to Japan")).toBe("Plan a trip to Japan");
  });

  it("collapses whitespace", () => {
    expect(deriveTitle("  hello   world  ")).toBe("hello world");
  });

  it("falls back for empty input", () => {
    expect(deriveTitle("   ")).toBe("New chat");
  });

  it("truncates long text with an ellipsis", () => {
    const long = "a".repeat(60);
    const title = deriveTitle(long);
    expect(title).toHaveLength(49); // 48 chars + ellipsis
    expect(title.endsWith("…")).toBe(true);
  });
});
