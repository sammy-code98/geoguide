import axios, { AxiosInstance, AxiosRequestConfig, isAxiosError } from "axios";
import { ApiError } from "./ApiError.js";

interface HttpClientConfig extends AxiosRequestConfig {
  serviceName: string;
  label: string;
}


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
    return new ApiError(
      503,
      `${label} is busy right now. Please try again in a little while.`,
      "upstream_busy",
      details,
    );
  }
  if (!error.response) {
    const timedOut =
      error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
    return timedOut
      ? new ApiError(
          504,
          `${label} took too long to respond. Please try again.`,
          "upstream_timeout",
          details,
        )
      : ApiError.upstream(
          `${label} is unreachable right now. Please try again shortly.`,
          502,
          details,
        );
  }
  return ApiError.upstream(`${label} isn't available right now. Please try again shortly.`, 502, details);
}


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


export function isRetryable(error: unknown): boolean {
  if (!(error instanceof ApiError)) return false;
  if (error.code === "upstream_timeout") return true;
  if (error.code !== "upstream_error") return false;
  const status = (error.details as { status?: number } | undefined)?.status;
  return status === undefined || status >= 500; // unreachable, or a provider 5xx
}
