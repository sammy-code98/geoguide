import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler";
import { validate } from "../middleware/validate";
import { aiCountryService } from "../services/AiCountryService";

const router = Router();

/**
 * GET /api/ai/country/:code
 * AI-generated travel insights for a country (by ISO alpha-2/alpha-3 code).
 */
router.get(
  "/country/:code",
  validate({
    params: z.object({
      code: z
        .string()
        .regex(/^[A-Za-z]{2,3}$/, "Country code must be 2 or 3 letters"),
    }),
  }),
  asyncHandler(async (req, res) => {
    const data = await aiCountryService.getInsights(String(req.params.code));
    res.json(data);
  })
);

export default router;
