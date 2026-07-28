import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler";
import { validate } from "../middleware/validate";
import { aiCountryService } from "../services/AiCountryService";
import { geminiService, type GeminiChatMessage } from "../services/GeminiService";
import { aiItineraryService } from "../services/AiItineraryService";
import { aiRecommendationsService } from "../services/AiRecommendationsService";
import { chatRequestSchema } from "../ai/schemas/chat.schema";
import { itineraryRequestSchema } from "../ai/schemas/itineraryRequest.schema";
import { recommendationsRequestSchema } from "../ai/schemas/recommendationsRequest.schema";
import { buildChatSystemPrompt } from "../ai/prompts/chat.prompt";
import { integrations } from "../config/env";
import { ApiError } from "../lib/ApiError";

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
      const message = err instanceof Error ? err.message : "The chat stream failed.";
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
