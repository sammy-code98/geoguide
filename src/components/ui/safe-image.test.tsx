import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SafeImage } from "./safe-image";

describe("SafeImage", () => {
  it("renders the image while it loads normally", () => {
    render(<SafeImage src="https://img.example/a.jpg" alt="Lagos" className="h-40 w-full" />);
    expect(screen.getByRole("img", { name: "Lagos" }).tagName).toBe("IMG");
  });

  it("swaps a failed image for a labelled placeholder in the same box", () => {
    render(<SafeImage src="https://img.example/missing.jpg" alt="Lagos" className="h-40 w-full rounded-lg" />);
    fireEvent.error(screen.getByRole("img", { name: "Lagos" }));

    const placeholder = screen.getByRole("img", { name: "Lagos" });
    expect(placeholder.tagName).toBe("DIV");
    expect(placeholder).toHaveClass("h-40", "w-full", "rounded-lg");
    expect(document.querySelector("img")).toBeNull();
  });

  it("gives a height-less box an aspect ratio so it keeps its space", () => {
    render(<SafeImage src="https://img.example/missing.jpg" alt="Map" className="w-full" />);
    fireEvent.error(screen.getByRole("img", { name: "Map" }));
    expect(screen.getByRole("img", { name: "Map" })).toHaveClass("aspect-[4/3]");
  });

  it("uses a custom fallback when one is given", () => {
    render(
      <SafeImage
        src="https://img.example/missing.jpg"
        alt=""
        fallback={<span>AB</span>}
      />
    );
    fireEvent.error(document.querySelector("img")!);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });

  it("shows the fallback straight away when there is no source", () => {
    render(<SafeImage src={undefined} alt="" fallback={<span>no photo</span>} />);
    expect(screen.getByText("no photo")).toBeInTheDocument();
    expect(document.querySelector("img")).toBeNull();
  });

  it("hides a decorative placeholder from assistive tech", () => {
    render(<SafeImage src="https://img.example/missing.jpg" alt="" className="h-10" />);
    fireEvent.error(document.querySelector("img")!);
    expect(document.querySelector('[aria-hidden="true"]')).toHaveClass("h-10");
  });
});
