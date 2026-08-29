import axios, { AxiosInstance, AxiosRequestConfig, isAxiosError } from "axios";
import { ApiError } from "./ApiError";

/**
 * Factory for pre-configured axios instances used by services to call upstream
 * APIs. Normalizes upstream failures into {@link ApiError} so route handlers
 * and the central error handler treat them consistently.
 */
export function createHttpClient(config: AxiosRequestConfig & { serviceName: string }): AxiosInstance {
  const { serviceName, ...axiosConfig } = config;

  const client = axios.create({
    timeout: 10_000,
    headers: { Accept: "application/json" },
    ...axiosConfig,
  });

  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 404) {
          return Promise.reject(ApiError.notFound(`${serviceName}: resource not found`));
        }
        if (status && status >= 400 && status < 500) {
          return Promise.reject(
            ApiError.badRequest(`${serviceName}: upstream rejected the request`, error.response?.data)
          );
        }
        return Promise.reject(
          ApiError.upstream(`${serviceName}: upstream service error`, 502, error.response?.data)
        );
      }
      return Promise.reject(ApiError.upstream(`${serviceName}: unexpected error`));
    }
  );

  return client;
}
