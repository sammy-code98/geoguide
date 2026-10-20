import { Router } from "express";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { integrations } from "../config/env.js";
import { ApiError } from "../lib/ApiError.js";
import { costEstimateService } from "../services/CostEstimateService.js";
import { travelCostRequestSchema } from "../ai/schemas/travelCost.schema.js";

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
