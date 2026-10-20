import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorPostcard } from "./error-postcard";
import { ApiRequestError, isNotFound } from "../../utils/axios";

describe("ErrorPostcard", () => {
  it("announces the failure with its title, message, and recovery action", () => {
    const retry = vi.fn();
    render(
      <ErrorPostcard
        title="We couldn't load places"
        message="Check your connection and try again."
        action={<button onClick={retry}>Try again</button>}
      />
    );
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("We couldn't load places");
    expect(alert).toHaveTextContent("Check your connection and try again.");
    fireEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(retry).toHaveBeenCalledOnce();
  });

  it("uses the requested heading level for page-level failures", () => {
    render(<ErrorPostcard as="h1" title="This page isn't on the map" />);
    expect(screen.getByRole("heading", { level: 1, name: "This page isn't on the map" })).toBeInTheDocument();
  });

  it("renders a compact alert without a heading for tight spots", () => {
    render(<ErrorPostcard size="compact" title="Exchange rates didn't load" message="Rates are unavailable." />);
    expect(screen.getByRole("alert")).toHaveTextContent("Exchange rates didn't load");
    expect(screen.queryByRole("heading")).toBeNull();
  });
});

describe("isNotFound", () => {
  it("is true only for a 404 from the API", () => {
    expect(isNotFound(new ApiRequestError("No such country", 404))).toBe(true);
    expect(isNotFound(new ApiRequestError("Server error", 500))).toBe(false);
    expect(isNotFound(new ApiRequestError("We couldn't reach the server."))).toBe(false);
    expect(isNotFound(new Error("plain"))).toBe(false);
  });
});
