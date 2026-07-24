import type { AxiosInstance } from "axios";
import type { Readable } from "node:stream";
import { env } from "../config/env";
import { createHttpClient } from "../lib/httpClient";
import { ApiError } from "../lib/ApiError";

export type GeminiModelTier = "flash" | "pro";

/** A single turn in a conversation. `model` is Gemini's term for the assistant. */
export interface GeminiChatMessage {
  role: "user" | "model";
  content: string;
}

export interface GeminiChatOptions {
  tier?: GeminiModelTier;
  system?: string;
  temperature?: number;
}

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

  /**
   * Streams a chat completion for a multi-turn conversation. Yields text deltas
   * as they arrive so the route handler can forward them to the client (SSE).
   */
  async *streamChat(
    messages: GeminiChatMessage[],
    options: GeminiChatOptions = {}
  ): AsyncGenerator<string> {
    const apiKey = this.assertConfigured();
    const model = this.modelFor(options.tier);
    const body = {
      contents: messages.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
      ...(options.system
        ? { systemInstruction: { parts: [{ text: options.system }] } }
        : {}),
      generationConfig: { temperature: options.temperature ?? 0.7 },
    };

    const stream = await this.openStream(model, body, apiKey);

    let buffer = "";
    for await (const chunk of stream) {
      buffer += (chunk as Buffer).toString("utf-8");
      let newlineIndex: number;
      while ((newlineIndex = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newlineIndex).trim();
        buffer = buffer.slice(newlineIndex + 1);
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (payload === "[DONE]") return;
        try {
          const json = JSON.parse(payload) as GeminiResponse;
          const text = json.candidates?.[0]?.content?.parts
            ?.map((p) => p.text ?? "")
            .join("");
          if (text) yield text;
        } catch {
          // Ignore partial/non-JSON keep-alive lines.
        }
      }
    }
  }

  /** Opens the SSE stream, retrying transient connection failures. */
  private async openStream(
    model: string,
    body: unknown,
    apiKey: string
  ): Promise<Readable> {
    const maxAttempts = 3;
    let lastError: unknown;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.http.post(
          `/models/${model}:streamGenerateContent`,
          body,
          { params: { key: apiKey, alt: "sse" }, responseType: "stream" }
        );
        return response.data as Readable;
      } catch (err) {
        lastError = err;
        if (attempt < maxAttempts) await delay(300 * attempt);
      }
    }
    throw lastError;
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
