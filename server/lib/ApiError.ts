/**
 * Application-level error carrying an HTTP status code and an optional machine
 * readable `code`. Thrown by services/routes and normalized by the central
 * error handler into a consistent JSON envelope.
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(statusCode: number, message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code ?? httpCodeToSlug(statusCode);
    this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(message: string, details?: unknown) {
    return new ApiError(400, message, "bad_request", details);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message, "not_found");
  }

  static unprocessable(message: string, details?: unknown) {
    return new ApiError(422, message, "unprocessable_entity", details);
  }

  /** Integration/key not configured on the server. */
  static notConfigured(integration: string) {
    return new ApiError(
      503,
      `The ${integration} integration is not configured on the server.`,
      "integration_not_configured"
    );
  }

  static upstream(message: string, statusCode = 502, details?: unknown) {
    return new ApiError(statusCode, message, "upstream_error", details);
  }
}

function httpCodeToSlug(statusCode: number): string {
  if (statusCode >= 500) return "internal_error";
  if (statusCode === 404) return "not_found";
  if (statusCode === 400) return "bad_request";
  return "error";
}
