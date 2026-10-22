import { describe, it, expect, vi, beforeEach } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocationCombobox } from "./location-combobox";
import type { Country } from "../../types/country";

const country = (name: string, cca3: string, region: string, population: number) =>
  ({ name, cca3, region, population, flagEmoji: "🏳️" }) as Country;

vi.mock("../../api/index.api", () => ({
  getCountries: vi.fn(async () => [
    country("Portugal", "PRT", "Europe", 10_000_000),
    country("Japan", "JPN", "Asia", 125_000_000),
    country("United Kingdom", "GBR", "Europe", 67_000_000),
  ]),
}));

const searchLocations = vi.hoisted(() => vi.fn());
vi.mock("../../api/locations.api", () => ({ searchLocations }));

function Field({ kind }: { kind?: "place" | "country" }) {
  const [value, setValue] = useState("");
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="where">Where</label>
      <LocationCombobox id="where" kind={kind} value={value} onChange={setValue} />
    </form>
  );
}

const renderField = (kind?: "place" | "country") =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <Field kind={kind} />
    </QueryClientProvider>
  );

describe("LocationCombobox", () => {
  beforeEach(() => {
    searchLocations.mockReset();
    searchLocations.mockResolvedValue([
      { id: "1", name: "Lisbon", region: "Lisbon District", country: "Portugal", countryCode: "PT", latitude: 0, longitude: 0 },
    ]);
  });

  it("suggests countries and cities, and fills in the chosen city", async () => {
    renderField();
    const input = screen.getByRole("combobox", { name: "Where" });
    fireEvent.change(input, { target: { value: "lis" } });
    expect(await screen.findByRole("option", { name: /Lisbon/ })).toBeInTheDocument();
    expect(searchLocations).toHaveBeenCalledWith("lis", expect.anything());

    fireEvent.click(screen.getByRole("option", { name: /Lisbon/ }));
    expect(input).toHaveValue("Lisbon, Portugal");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("is keyboard operable: arrows move the highlight, Enter chooses, Escape closes", async () => {
    renderField();
    const input = screen.getByRole("combobox", { name: "Where" });
    fireEvent.change(input, { target: { value: "port" } });
    await screen.findByRole("option", { name: /Portugal/ });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getByRole("option", { name: /Portugal/ })).toHaveAttribute("aria-selected", "true");
    fireEvent.keyDown(input, { key: "Enter" });
    expect(input).toHaveValue("Portugal");

    fireEvent.change(input, { target: { value: "jap" } });
    await screen.findByRole("option", { name: /Japan/ });
    fireEvent.keyDown(input, { key: "Escape" });
    expect(input).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps free text: typing without choosing is a valid answer", async () => {
    searchLocations.mockResolvedValue([]);
    renderField();
    const input = screen.getByRole("combobox", { name: "Where" });
    fireEvent.change(input, { target: { value: "Somewhere Quiet" } });
    expect(await screen.findByText(/You can still use what you typed/)).toBeInTheDocument();
    expect(input).toHaveValue("Somewhere Quiet");
  });

  it("only suggests countries in country mode, without searching cities", async () => {
    renderField("country");
    const input = screen.getByRole("combobox", { name: "Where" });
    fireEvent.change(input, { target: { value: "united" } });
    expect(await screen.findByRole("option", { name: /United Kingdom/ })).toBeInTheDocument();
    expect(searchLocations).not.toHaveBeenCalled();
  });
});
