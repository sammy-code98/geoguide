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

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Surface a clean message; UI layers render error/retry states themselves.
    const message =
      error?.response?.data?.error?.message ||
      error?.message ||
      "Request failed";
    return Promise.reject(new Error(message));
  }
);

export default api;
