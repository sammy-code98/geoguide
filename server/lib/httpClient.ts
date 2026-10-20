import axios, { AxiosInstance, AxiosRequestConfig, isAxiosError } from "axios";
import { ApiError } from "./ApiError.js";

interface HttpClientConfig extends AxiosRequestConfig {
  /** Vendor name, used in server logs (e.g. "Gemini"). */
  serviceName: string;
  /** What the feature is called to a visitor (e.g. "The AI travel planner"). */
  label: string;
}

/**
 * Turns a failed upstream call into an {@link ApiError} the visitor can act on.
 * Upstream problems are never the visitor's fault, so none of them become a 4xx
 * except "not found": the provider's raw reply rides along in `details` for the
 * server log (the error handler keeps it out of production responses).
 */
export function toUpstreamError(error: unknown, serviceName: string, label: string): ApiError {
  if (!isAxiosError(error)) {
    return ApiError.upstream(`${label} hit an unexpected problem. Please try again.`, 502, { serviceName });
  }
  const status = error.response?.status;
  const details = { serviceName, status, data: error.response?.data };

  if (status === 404) {
    return ApiError.notFound("We couldn't find what you were looking for.");
  }
  if (status === 429) {
    // Rate limit or exhausted quota on our account with the provider.
    return new ApiError(
      503,
      `${label} is busy right now. Please try again in a little while.`,
      "upstream_busy",
      details
    );
  }
  if (!error.response) {
    const timedOut = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
    return timedOut
      ? new ApiError(504, `${label} took too long to respond. Please try again.`, "upstream_timeout", details)
      : ApiError.upstream(`${label} is unreachable right now. Please try again shortly.`, 502, details);
  }
  // Other 4xx (bad key, rejected request) and 5xx: a fault on our side or theirs.
  return ApiError.upstream(`${label} isn't available right now. Please try again shortly.`, 502, details);
}

/**
 * Factory for pre-configured axios instances used by services to call upstream
 * APIs. Normalizes upstream failures into {@link ApiError} so route handlers
 * and the central error handler treat them consistently.
 */
export function createHttpClient(config: HttpClientConfig): AxiosInstance {
  const { serviceName, label, ...axiosConfig } = config;

  const client = axios.create({
    timeout: 10_000,
    headers: { Accept: "application/json" },
    ...axiosConfig,
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => Promise.reject(toUpstreamError(error, serviceName, label))
  );

  return client;
}

/**
 * Whether retrying an upstream call could help: transient 5xx failures and
 * timeouts can, while "busy"/quota, not-found and rejected requests cannot.
 */
export function isRetryable(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  if (error.code === "upstream_timeout") return true;
  if (error.code !== "upstream_error") return false;
  const status = (error.details as { status?: number } | undefined)?.status;
  return status === undefined || status >= 500; // unreachable, or a provider 5xx
}
