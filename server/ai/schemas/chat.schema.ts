import { z } from "zod";

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(30),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
