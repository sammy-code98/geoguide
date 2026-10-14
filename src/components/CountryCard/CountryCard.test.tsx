import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import CountryCard from "./index";

const props = {
  code: "NGA",
  name: "Nigeria",
  population: "223,800,000",
  region: "Africa",
  capital: "Abuja",
  img: "https://flags.example/ng.png",
  alt: "Nigeria's flag",
};

// CountryCard uses view transitions, which require a data router (as the real
// app provides via createBrowserRouter).
const renderCard = () => {
  const router = createMemoryRouter(
    [{ path: "/", element: <CountryCard {...props} /> }],
    { initialEntries: ["/"] }
  );
  return render(<RouterProvider router={router} />);
};

describe("CountryCard", () => {
  it("renders the country's details", () => {
    renderCard();
    expect(screen.getByText("Nigeria")).toBeInTheDocument();
    expect(screen.getByText("Abuja")).toBeInTheDocument();
    expect(screen.getByText("Africa")).toBeInTheDocument();
    expect(screen.getByText("223,800,000")).toBeInTheDocument();
  });

  it("links to the detail route by country code", () => {
    renderCard();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/detail/NGA");
  });

  it("renders a lazy-loaded flag image with alt text", () => {
    renderCard();
    const img = screen.getByAltText("Nigeria's flag");
    expect(img).toHaveAttribute("src", props.img);
    expect(img).toHaveAttribute("loading", "lazy");
  });
});
