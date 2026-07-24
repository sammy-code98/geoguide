import { Router } from "express";
import { env, integrations } from "../config/env";

const router = Router();

/**
 * GET /api/health
 * Liveness + integration-readiness report. Lets the frontend (and ops) see
 * which upstream integrations have server-side keys configured.
 */
router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    env: env.nodeEnv,
    timestamp: new Date().toISOString(),
    integrations,
  });
});

export default router;
