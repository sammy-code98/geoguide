import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../lib/ApiError";
import { isProduction } from "../config/env";

interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

/**
 * Central error handler. Converts thrown errors into a consistent JSON envelope
 * so the frontend can render error/retry/empty states reliably.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let body: ErrorEnvelope = {
    error: { code: "internal_error", message: "Something went wrong." },
  };

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    body = { error: { code: err.code, message: err.message, details: err.details } };
  } else if (err instanceof ZodError) {
    statusCode = 422;
    body = {
      error: {
        code: "validation_error",
        message: "Request validation failed.",
        details: err.issues,
      },
    };
  } else if (err instanceof Error && !isProduction) {
    body.error.message = err.message;
  }

  if (statusCode >= 500) {
    console.error("[error]", err);
  }

  res.status(statusCode).json(body);
}
