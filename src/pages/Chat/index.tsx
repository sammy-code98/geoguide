import { useEffect, useRef } from "react";
import { HiSparkles } from "react-icons/hi2";
import { MdOutlineDeleteSweep } from "react-icons/md";
import { useChat } from "../../hooks/useChat";
import ChatMessage from "../../components/Chat/ChatMessage";
import ChatInput from "../../components/Chat/ChatInput";

const SUGGESTIONS = [
  "Can I travel to Switzerland with $2000?",
  "Which is cheaper: Japan or South Korea?",
  "Suggest warm countries to visit in December.",
  "Do I need a visa to visit Portugal?",
];

export default function ChatPage(): JSX.Element {
  const { messages, isStreaming, error, send, stop, clear } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-6 flex flex-col h-screen">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-textWhite flex items-center gap-2">
              <HiSparkles className="text-primary" />
              AI Travel Assistant
            </h1>
            <p className="text-textGray dark:text-grayish text-sm mt-1">
              Ask anything about destinations, budgets, safety, or visas. Powered by Gemini.
            </p>
          </div>
          {!isEmpty && (
            <button
              onClick={clear}
              className="flex items-center gap-1 text-sm font-semibold text-textGray dark:text-grayish hover:text-secondary"
            >
              <MdOutlineDeleteSweep className="text-lg" />
              Clear
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-3xl">
                <HiSparkles />
              </div>
              <p className="text-textGray dark:text-grayish max-w-md">
                Your personal travel companion. Try one of these to get started:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-left p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-600 text-black dark:text-textWhite hover:border-primary/40 hover:shadow-md transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <ChatMessage
                key={m.id}
                message={m}
                isStreaming={isStreaming && i === messages.length - 1}
              />
            ))
          )}

          {error && (
            <p className="text-center text-secondary text-sm" role="alert">
              {error}
            </p>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="pt-2">
          <ChatInput onSend={send} onStop={stop} isStreaming={isStreaming} />
        </div>
      </div>
    </div>
  );
}
