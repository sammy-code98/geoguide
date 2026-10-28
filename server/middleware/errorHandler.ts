import { inspect } from "node:util";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../lib/ApiError.js";
import { isProduction } from "../config/env.js";

interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}


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

    const showDetails = !(isProduction && err.code.startsWith("upstream_"));
    body = { error: { code: err.code, message: err.message } };
    if (showDetails && err.details !== undefined)
      body.error.details = err.details;
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
    console.error("[error]", inspect(err, { depth: 6 }));
  }

  res.status(statusCode).json(body);
}
