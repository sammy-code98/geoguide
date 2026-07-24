import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

interface ValidationSchemas {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
}

/**
 * Request-validation middleware. Parses and replaces `body`/`query`/`params`
 * with the validated, typed result. Zod errors are caught by the central error
 * handler and returned as a 422 with per-field details.
 */
export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.params) req.params = schemas.params.parse(req.params) as typeof req.params;
      if (schemas.query) {
        // req.query is a getter-only in Express 5; assign parsed values onto it.
        Object.assign(req.query, schemas.query.parse(req.query));
      }
      if (schemas.body) req.body = schemas.body.parse(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };
}
