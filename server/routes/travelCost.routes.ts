import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler";
import { validate } from "../middleware/validate";
import { integrations } from "../config/env";
import { ApiError } from "../lib/ApiError";
import { costEstimateService } from "../services/CostEstimateService";
import { travelCostRequestSchema } from "../ai/schemas/travelCost.schema";

const router = Router();

/**
 * POST /api/travel-cost
 * Estimates a trip budget (breakdown + AI advice + alternatives).
 */
router.post(
  "/",
  validate({ body: travelCostRequestSchema }),
  asyncHandler(async (req, res) => {
    if (!integrations.gemini) throw ApiError.notConfigured("Gemini");
    const estimate = await costEstimateService.estimate(req.body);
    res.json(estimate);
  })
);

export default router;
