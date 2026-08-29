import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler";
import { validate } from "../middleware/validate";
import { weatherService } from "../services/WeatherService";

const router = Router();

/**
 * GET /api/weather?city=Tokyo&units=metric
 * Current conditions + 5-day forecast + a travel tip.
 */
router.get(
  "/",
  validate({
    query: z.object({
      city: z.string().min(1, "city is required"),
      units: z.enum(["metric", "imperial"]).optional().default("metric"),
    }),
  }),
  asyncHandler(async (req, res) => {
    const city = String(req.query.city);
    const units = typeof req.query.units === "string" ? req.query.units : "metric";
    const report = await weatherService.getReportByCity(city, units);
    res.json(report);
  })
);

export default router;
