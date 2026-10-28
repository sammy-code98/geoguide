import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { streamChat, type ChatTurn } from "../api/chat.api";
import { useAuth } from "../auth/useAuth";
import { appendMessage, createChat, deriveTitle, getMessages } from "../services/firebase/ChatService";

export interface ChatMessage extends ChatTurn {
  id: string;
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const chatsKey = (uid: string) => ["chats", uid] as const;


export function useChat() {
  const { user } = useAuth();
  const uid = user?.uid;
  const qc = useQueryClient();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const justCreatedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!uid || !activeChatId) {
      setMessages([]);
      return;
    }
    if (justCreatedRef.current === activeChatId) {
      justCreatedRef.current = null;
      return;
    }
    let active = true;
    setLoadingHistory(true);
    setError(null);
    getMessages(uid, activeChatId)
      .then((msgs) => {
        if (active) setMessages(msgs.map(({ id, role, content }) => ({ id, role, content })));
      })
      .catch(() => {
        if (active) setError("Couldn't load this conversation.");
      })
      .finally(() => {
        if (active) setLoadingHistory(false);
      });
    return () => {
      active = false;
    };
  }, [uid, activeChatId]);

  const selectChat = useCallback((id: string) => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setError(null);
    setActiveChatId(id);
  }, []);

  const newChat = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setError(null);
    justCreatedRef.current = null;
    setActiveChatId(null);
    setMessages([]);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;
      setError(null);

      let chatId = activeChatId;
      if (uid && !chatId) {
        try {
          chatId = await createChat(uid, deriveTitle(trimmed));
        } catch {
          setError("Couldn't start a conversation.");
          return;
        }
        justCreatedRef.current = chatId;
        setActiveChatId(chatId);
        qc.invalidateQueries({ queryKey: chatsKey(uid) });
      }

      const userMessage: ChatMessage = { id: newId(), role: "user", content: trimmed };
      const assistantId = newId();
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

      if (uid && chatId) appendMessage(uid, chatId, "user", trimmed).catch(() => {});

      const controller = new AbortController();
      abortRef.current = controller;
      let assistantText = "";
      
      let frame = 0;
      const flush = () => {
        frame = 0;
        const text = assistantText;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: text } : m)),
        );
      };
      try {
        await streamChat(history, {
          signal: controller.signal,
          onDelta: (delta) => {
            assistantText += delta;
            if (!frame) frame = requestAnimationFrame(flush);
          },
        });
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          setError((err as Error)?.message || "Something went wrong.");
        }
      } finally {
        if (frame) cancelAnimationFrame(frame);
        if (assistantText) flush();
        setIsStreaming(false);
        abortRef.current = null;
        if (assistantText) {
          if (uid && chatId)
            appendMessage(uid, chatId, "assistant", assistantText).catch(
              () => {},
            );
        } else {
          setMessages((prev) =>
            prev.filter((m) => !(m.id === assistantId && m.content === "")),
          );
        }
        if (uid) qc.invalidateQueries({ queryKey: chatsKey(uid) });
      }
    },
    [activeChatId, messages, isStreaming, uid, qc]
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  return {
    activeChatId,
    messages,
    isStreaming,
    error,
    loadingHistory,
    isAuthed: !!uid,
    send,
    stop,
    selectChat,
    newChat,
  };
}
