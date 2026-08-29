import { describe, it, expect } from "vitest";
import { NumComma, shortenString, formatCurrency } from "./custom";

describe("NumComma", () => {
  it("groups thousands with commas", () => {
    expect(NumComma(1000)).toBe("1,000");
    expect(NumComma(1234567)).toBe("1,234,567");
  });

  it("leaves small numbers unchanged", () => {
    expect(NumComma(0)).toBe("0");
    expect(NumComma(42)).toBe("42");
  });
});

describe("shortenString", () => {
  it("returns short strings as-is", () => {
    expect(shortenString("Nigeria")).toBe("Nigeria");
  });

  it("keeps strings of exactly 22 chars untouched", () => {
    const s = "a".repeat(22);
    expect(shortenString(s)).toBe(s);
  });

  it("truncates long strings to 20 chars plus an ellipsis", () => {
    const long = "The United Kingdom of Great Britain";
    const result = shortenString(long);
    expect(result).toBe(long.slice(0, 20) + "...");
    expect(result.endsWith("...")).toBe(true);
  });
});

describe("formatCurrency", () => {
  it("formats USD with a symbol and no decimals", () => {
    expect(formatCurrency(1500, "USD")).toBe("$1,500");
  });

  it("defaults to USD when no currency is given", () => {
    expect(formatCurrency(1000)).toBe("$1,000");
  });

  it("falls back to a plain string for an invalid currency code", () => {
    expect(formatCurrency(1000, "NOTACODE")).toBe("NOTACODE 1,000");
  });
});
