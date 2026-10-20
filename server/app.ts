import express, { type Express } from "express";
import cors from "cors";
import { env } from "./config/env.js";
import api from "./routes/index.js";
import { apiRateLimiter } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

/**
 * Builds the Express application with the full middleware pipeline.
 * Exported separately from the server bootstrap so it can be imported in tests.
 */
export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  // Behind Vercel's (or any) reverse proxy, take the client IP from the first
  // X-Forwarded-For hop so rate limits apply per visitor, not per proxy.
  app.set("trust proxy", 1);
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json({ limit: "1mb" }));

  // All API traffic is rate limited and mounted under /api.
  app.use("/api", apiRateLimiter, api);

  // 404 + centralized error handling (must be last).
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
