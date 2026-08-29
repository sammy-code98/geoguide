import type { Request, Response } from "express";

/** Terminal handler for unmatched routes. */
export function notFound(req: Request, res: Response): void {
  res.status(404).json({
    error: {
      code: "not_found",
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}
