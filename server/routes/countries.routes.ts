import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler";
import { validate } from "../middleware/validate";
import { restCountriesService } from "../services/RestCountriesService";

const router = Router();

/**
 * GET /api/countries
 * List all countries, normalized.
 */
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const data = await restCountriesService.getAll();
    res.json(data);
  })
);

/**
 * GET /api/countries/:code
 * A single country by ISO alpha-2 or alpha-3 code, normalized.
 */
router.get(
  "/:code",
  validate({
    params: z.object({
      code: z
        .string()
        .regex(/^[A-Za-z]{2,3}$/, "Country code must be 2 or 3 letters"),
    }),
  }),
  asyncHandler(async (req, res) => {
    const data = await restCountriesService.getByCode(String(req.params.code));
    res.json(data);
  })
);

export default router;
