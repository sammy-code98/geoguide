import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { locationService } from "../services/LocationService.js";

const router = Router();

/**
 * GET /api/locations?q=lis
 * City / town suggestions for location autocomplete.
 */
router.get(
  "/",
  validate({
    query: z.object({
      q: z.string().trim().min(2, "q must be at least 2 characters").max(80),
    }),
  }),
  asyncHandler(async (req, res) => {
    res.json(await locationService.search(String(req.query.q)));
  })
);

export default router;
