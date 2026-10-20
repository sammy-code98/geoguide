import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler.js";
import { validate } from "../middleware/validate.js";
import { aiCountryService } from "../services/AiCountryService.js";
import { geminiService, type GeminiChatMessage } from "../services/GeminiService.js";
import { aiItineraryService } from "../services/AiItineraryService.js";
import { aiRecommendationsService } from "../services/AiRecommendationsService.js";
import { chatRequestSchema } from "../ai/schemas/chat.schema.js";
import { itineraryRequestSchema } from "../ai/schemas/itineraryRequest.schema.js";
import { recommendationsRequestSchema } from "../ai/schemas/recommendationsRequest.schema.js";
import { buildChatSystemPrompt } from "../ai/prompts/chat.prompt.js";
import { integrations } from "../config/env.js";
import { ApiError } from "../lib/ApiError.js";

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

/**
 * POST /api/ai/chat
 * Streams a conversational travel-assistant reply as Server-Sent Events.
 * Body: { messages: [{ role: "user" | "assistant", content: string }] }.
 * Events: `data: {"text": "..."}` deltas, then `data: [DONE]`.
 */
router.post(
  "/chat",
  validate({ body: chatRequestSchema }),
  asyncHandler(async (req, res) => {
    // Fail fast with a clean JSON error before switching to the SSE stream.
    if (!integrations.gemini) throw ApiError.notConfigured("Gemini");

    const messages: GeminiChatMessage[] = req.body.messages.map(
      (m: { role: "user" | "assistant"; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content,
      })
    );

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    try {
      for await (const delta of geminiService.streamChat(messages, {
        system: buildChatSystemPrompt(),
        temperature: 0.7,
      })) {
        res.write(`data: ${JSON.stringify({ text: delta })}\n\n`);
      }
      res.write("data: [DONE]\n\n");
    } catch (err) {
      // ApiError messages are written for visitors; anything else stays in the log.
      if (!(err instanceof ApiError)) console.error("[chat]", err);
      const message =
        err instanceof ApiError ? err.message : "The travel assistant hit a problem. Please try again.";
      res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    } finally {
      res.end();
    }
  })
);

/**
 * POST /api/ai/itinerary
 * Generates a day-by-day travel itinerary.
 */
router.post(
  "/itinerary",
  validate({ body: itineraryRequestSchema }),
  asyncHandler(async (req, res) => {
    if (!integrations.gemini) throw ApiError.notConfigured("Gemini");
    const itinerary = await aiItineraryService.generate(req.body);
    res.json(itinerary);
  })
);

/**
 * POST /api/ai/recommendations
 * Personalized destination recommendations.
 */
router.post(
  "/recommendations",
  validate({ body: recommendationsRequestSchema }),
  asyncHandler(async (req, res) => {
    if (!integrations.gemini) throw ApiError.notConfigured("Gemini");
    const recommendations = await aiRecommendationsService.generate(req.body);
    res.json(recommendations);
  })
);

export default router;
