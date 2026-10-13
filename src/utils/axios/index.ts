import axios from "axios";

/**
 * HTTP client for the internal backend API. The frontend talks only to our
 * Express server (which holds all third-party keys). In dev, Vite proxies
 * `/api` to the server; `VITE_API_URL` can override for non-proxied deploys.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

/** An API failure with a message fit to show a person, plus the HTTP status. */
export class ApiRequestError extends Error {
  /** HTTP status, or undefined when the request never got a response. */
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

/** True when the server answered "no such thing" rather than failing. */
export const isNotFound = (error: unknown): boolean =>
  error instanceof ApiRequestError && error.status === 404;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Turn transport-level failures into plain language; UI layers render the
    // error/retry states themselves and can show this message as-is.
    const status: number | undefined = error?.response?.status;
    let message: string;
    if (!error?.response) {
      message =
        error?.code === "ECONNABORTED"
          ? "The server took too long to respond. Please try again."
          : "We couldn't reach the server. Check your connection and try again.";
    } else {
      message =
        error.response.data?.error?.message ||
        (status && status >= 500
          ? "Something went wrong on our side. Please try again in a moment."
          : "That request didn't go through. Please try again.");
    }
    return Promise.reject(new ApiRequestError(message, status));
  }
);

export default api;
