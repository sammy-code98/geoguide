import { useCallback, useEffect, useRef, useState } from "react";
import { streamChat, type ChatTurn } from "../api/chat.api";

export interface ChatMessage extends ChatTurn {
  id: string;
}

const STORAGE_KEY = "geoguide.chat.history";

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Manages the chat conversation: message state, streaming send, and history
 * persistence (localStorage). The assistant message fills in as tokens stream.
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage full or unavailable — non-fatal */
    }
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      setError(null);
      const userMessage: ChatMessage = { id: newId(), role: "user", content: trimmed };
      const assistantId = newId();

      // Build the history to send BEFORE adding the empty assistant placeholder.
      const history: ChatTurn[] = [...messages, userMessage].map(({ role, content }) => ({
        role,
        content,
      }));

      setMessages((prev) => [
        ...prev,
        userMessage,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await streamChat(history, {
          signal: controller.signal,
          onDelta: (delta) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: m.content + delta } : m
              )
            );
          },
        });
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          setError((err as Error)?.message || "Something went wrong.");
        }
        // Drop an empty assistant bubble if nothing streamed in.
        setMessages((prev) =>
          prev.filter((m) => !(m.id === assistantId && m.content === ""))
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isStreaming, error, send, stop, clear };
}
