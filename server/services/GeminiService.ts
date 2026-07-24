import type { AxiosInstance } from "axios";
import { env } from "../config/env";
import { createHttpClient } from "../lib/httpClient";
import { ApiError } from "../lib/ApiError";

export type GeminiModelTier = "flash" | "pro";

export interface GeminiGenerateOptions {
  /** Which model tier to use — "flash" (cheap/fast) or "pro" (reasoning). */
  tier?: GeminiModelTier;
  /** Optional system instruction to steer tone/format. */
  system?: string;
  /** 0..1 — lower is more deterministic. */
  temperature?: number;
  /** Ask the model to return strict JSON (response_mime_type). */
  json?: boolean;
}

interface GeminiCandidate {
  content?: { parts?: { text?: string }[] };
}
interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

/**
 * Reusable Gemini client. Feature phases (country explorer, chat, itinerary,
 * recommendations) build prompts and call these methods — they never talk to
 * Google directly and never see the API key.
 */
export class GeminiService {
  private readonly http: AxiosInstance;

  constructor() {
    this.http = createHttpClient({
      serviceName: "Gemini",
      baseURL: env.gemini.baseUrl,
      timeout: 30_000,
    });
  }

  private assertConfigured(): string {
    if (!env.gemini.apiKey) throw ApiError.notConfigured("Gemini");
    return env.gemini.apiKey;
  }

  private modelFor(tier: GeminiModelTier | undefined): string {
    return tier === "pro" ? env.gemini.proModel : env.gemini.flashModel;
  }

  private buildRequestBody(prompt: string, options: GeminiGenerateOptions) {
    return {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      ...(options.system
        ? { systemInstruction: { parts: [{ text: options.system }] } }
        : {}),
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        ...(options.json ? { responseMimeType: "application/json" } : {}),
      },
    };
  }

  private extractText(data: GeminiResponse): string {
    const text = data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim();
    if (!text) throw ApiError.upstream("Gemini returned an empty response.");
    return text;
  }

  /** Generate plain text from a prompt. Retries transient upstream failures. */
  async generateText(prompt: string, options: GeminiGenerateOptions = {}): Promise<string> {
    const apiKey = this.assertConfigured();
    const model = this.modelFor(options.tier);
    const body = this.buildRequestBody(prompt, options);

    const maxAttempts = 3;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const { data } = await this.http.post<GeminiResponse>(
          `/models/${model}:generateContent`,
          body,
          { params: { key: apiKey } }
        );
        return this.extractText(data);
      } catch (err) {
        lastError = err;
        // The Gemini endpoint intermittently returns transient errors; back off
        // and retry. A genuinely bad request/model surfaces after the retries.
        if (attempt < maxAttempts) {
          await delay(300 * attempt);
        }
      }
    }
    throw lastError;
  }

  /** Generate and parse strict JSON of shape T. */
  async generateJson<T>(prompt: string, options: GeminiGenerateOptions = {}): Promise<T> {
    const raw = await this.generateText(prompt, { ...options, json: true });
    try {
      return JSON.parse(stripCodeFences(raw)) as T;
    } catch {
      throw ApiError.upstream("Gemini returned malformed JSON.");
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Gemini occasionally wraps JSON in ```json fences despite the mime hint. */
function stripCodeFences(text: string): string {
  return text
    .replace(/^\s*```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();
}

export const geminiService = new GeminiService();
