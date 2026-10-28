import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

export const AI_TIMEOUT_MS = 45_000;

export class ApiRequestError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

export const isNotFound = (error: unknown): boolean =>
  error instanceof ApiRequestError && error.status === 404;

api.interceptors.response.use(
  (response) => response,
  (error) => {
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
  },
);

export default api;
