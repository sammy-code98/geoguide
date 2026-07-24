export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

interface StreamChatOptions {
  signal?: AbortSignal;
  onDelta: (text: string) => void;
}

const API_BASE = import.meta.env.VITE_API_URL || "/api";

/**
 * Streams a chat completion from the backend, invoking `onDelta` for each text
 * chunk. Parses the Server-Sent Events emitted by `POST /api/ai/chat`.
 */
export async function streamChat(
  messages: ChatTurn[],
  { signal, onDelta }: StreamChatOptions
): Promise<void> {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });

  if (!res.ok || !res.body) {
    let message = "The assistant is unavailable right now.";
    try {
      const data = await res.json();
      message = data?.error?.message || message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let boundary: number;
    while ((boundary = buffer.indexOf("\n\n")) >= 0) {
      const rawEvent = buffer.slice(0, boundary).trim();
      buffer = buffer.slice(boundary + 2);
      if (!rawEvent.startsWith("data:")) continue;

      const payload = rawEvent.slice(5).trim();
      if (payload === "[DONE]") return;

      let data: { text?: string; error?: string };
      try {
        data = JSON.parse(payload);
      } catch {
        continue;
      }
      if (data.error) throw new Error(data.error);
      if (data.text) onDelta(data.text);
    }
  }
}
