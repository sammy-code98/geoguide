import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler";
import { validate } from "../middleware/validate";
import { serpstackService } from "../services/SerpstackService";

const router = Router();

// Allowed discovery categories → the search term used for Serpstack.
export const PLACE_CATEGORIES = {
  restaurants: "restaurants",
  "coffee-shops": "coffee shops",
  hotels: "hotels",
  museums: "museums",
  parks: "parks",
  beaches: "beaches",
  shopping: "shopping centers",
  attractions: "tourist attractions",
  airports: "airports",
} as const;

const categorySchema = z.enum(
  Object.keys(PLACE_CATEGORIES) as [keyof typeof PLACE_CATEGORIES]
);

/**
 * GET /api/places?category=restaurants&location=Lagos, Nigeria&gl=ng
 * Returns normalized places for a category near a location.
 */
router.get(
  "/",
  validate({
    query: z.object({
      category: categorySchema,
      location: z.string().min(1, "location is required"),
      gl: z.string().length(2).optional(),
    }),
  }),
  asyncHandler(async (req, res) => {
    const category = req.query.category as keyof typeof PLACE_CATEGORIES;
    const location = String(req.query.location);
    const gl = typeof req.query.gl === "string" ? req.query.gl.toLowerCase() : undefined;

    const places = await serpstackService.searchPlaces({
      query: PLACE_CATEGORIES[category],
      location,
      gl,
    });
    res.json(places);
  })
);

export default router;
