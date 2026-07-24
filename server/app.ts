import express, { type Express } from "express";
import cors from "cors";
import { env } from "./config/env";
import api from "./routes";
import { apiRateLimiter } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

/**
 * Builds the Express application with the full middleware pipeline.
 * Exported separately from the server bootstrap so it can be imported in tests.
 */
export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));

  // All API traffic is rate limited and mounted under /api.
  app.use("/api", apiRateLimiter, api);

  // 404 + centralized error handling (must be last).
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
