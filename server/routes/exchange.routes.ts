import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler";
import { validate } from "../middleware/validate";
import { integrations } from "../config/env";
import { ApiError } from "../lib/ApiError";
import { exchangeRateService } from "../services/ExchangeRateService";

const router = Router();

const currencyCode = z.string().regex(/^[A-Za-z]{3}$/, "Use a 3-letter currency code");

/**
 * GET /api/exchange/rates?base=USD
 * All conversion rates for a base currency.
 */
router.get(
  "/rates",
  validate({ query: z.object({ base: currencyCode.optional() }) }),
  asyncHandler(async (req, res) => {
    if (!integrations.exchangeRate) throw ApiError.notConfigured("ExchangeRate");
    const base = (typeof req.query.base === "string" ? req.query.base : "USD").toUpperCase();
    const rates = await exchangeRateService.getRates(base);
    res.json({ base, rates });
  })
);

/**
 * GET /api/exchange/convert?from=USD&to=EUR&amount=100
 * Convert an amount between two currencies.
 */
router.get(
  "/convert",
  validate({
    query: z.object({
      from: currencyCode,
      to: currencyCode,
      amount: z.coerce.number().positive().max(1_000_000_000),
    }),
  }),
  asyncHandler(async (req, res) => {
    if (!integrations.exchangeRate) throw ApiError.notConfigured("ExchangeRate");
    const result = await exchangeRateService.convert(
      String(req.query.from),
      String(req.query.to),
      Number(req.query.amount)
    );
    res.json(result);
  })
);

export default router;
