import { useLayoutEffect, useRef } from "react";
import { MdOutlineTravelExplore } from "react-icons/md";
import { HiOutlinePlus } from "react-icons/hi";
import { useChat } from "../../hooks/useChat";
import { useChats } from "../../hooks/useChats";
import ChatMessage from "../../components/Chat/ChatMessage";
import ChatInput from "../../components/Chat/ChatInput";
import ConversationList from "../../components/Chat/ConversationList";
import { Scene, Stamp } from "../../components/ui/postcard";
import { ErrorPostcard } from "../../components/ui/error-postcard";

const SUGGESTIONS = [
  "Plan a weekend in Lagos.",
  "Best places to visit in Japan.",
  "Budget for 7 days in Thailand.",
  "Do I need a visa to visit Portugal?",
];

export default function ChatPage(): JSX.Element {
  const {
    activeChatId,
    messages,
    isStreaming,
    error,
    loadingHistory,
    send,
    stop,
    selectChat,
    newChat,
  } = useChat();
  const { chats, isLoading, deleteChat } = useChats();
  const logRef = useRef<HTMLDivElement>(null);
  // Follow new text only while the reader is at (or near) the bottom, so
  // scrolling up to re-read an answer isn't yanked back down mid-stream.
  const followRef = useRef(true);
  const lastCountRef = useRef(0);

  const isEmpty = messages.length === 0;

  // Scroll the message list itself (never the window) and do it before paint,
  // with no smooth animation to restart on every streamed chunk.
  useLayoutEffect(() => {
    const log = logRef.current;
    if (!log) return;
    // A newly sent message always brings the conversation back into view.
    if (messages.length > lastCountRef.current) followRef.current = true;
    lastCountRef.current = messages.length;
    if (followRef.current) log.scrollTop = log.scrollHeight;
  }, [messages, error, loadingHistory]);

  const handleLogScroll = () => {
    const log = logRef.current;
    if (!log) return;
    followRef.current = log.scrollHeight - log.scrollTop - log.clientHeight < 80;
  };

  const handleDelete = (id: string) => {
    deleteChat(id);
    if (id === activeChatId) newChat();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-6 flex gap-6 h-[100dvh]">
        {/* Sidebar (md+) */}
        <aside className="hidden md:flex w-72 shrink-0 flex-col border-r border-border pr-4">
          <ConversationList
            chats={chats}
            activeId={activeChatId}
            loading={isLoading}
            onSelect={selectChat}
            onNew={newChat}
            onDelete={handleDelete}
          />
        </aside>

        {/* Chat pane */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center justify-between gap-3 pb-4 border-b border-border">
            <div className="min-w-0">
              <h1 className="font-serif text-2xl md:text-3xl font-semibold text-fg flex items-center gap-2">
                <MdOutlineTravelExplore className="text-primary" aria-hidden="true" />
                Travel assistant
              </h1>
              <p className="text-muted text-sm mt-1">
                Ask anything about destinations, budgets, safety, or visas.
              </p>
            </div>
            {/* Mobile conversation controls */}
            <div className="flex md:hidden items-center gap-2 shrink-0">
              {chats.length > 0 && (
                <select
                  aria-label="Switch conversation"
                  value={activeChatId ?? ""}
                  onChange={(e) => e.target.value && selectChat(e.target.value)}
                  className="max-w-[8rem] text-sm rounded-md bg-surface text-fg border border-border px-2 py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">New chat</option>
                  {chats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              )}
              <button
                type="button"
                onClick={newChat}
                aria-label="New chat"
                className="w-9 h-9 rounded-md bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <HiOutlinePlus aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={logRef}
            onScroll={handleLogScroll}
            className="flex-1 overflow-y-auto overscroll-contain py-6 space-y-6"
            role="log"
            aria-live="polite"
            // Screen readers wait for the finished reply instead of every chunk.
            aria-busy={isStreaming}
            aria-label="Conversation with the travel assistant"
          >
            {loadingHistory ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted" role="status">Loading conversation…</p>
              </div>
            ) : isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center gap-4">
                {/* A postcard to open the conversation */}
                <div className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-sea-soft px-6 py-8">
                  <Scene
                    tone="sea"
                    className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-1/2 sm:block"
                  />
                  <Stamp
                    tone="sea"
                    icon={<MdOutlineTravelExplore />}
                    label="Ask"
                    className="absolute right-5 top-5"
                  />
                  <p className="relative pr-24 font-serif text-2xl font-semibold text-fg">
                    Where are you dreaming of?
                  </p>
                  <p className="relative mt-2 max-w-xs text-fg/75">
                    Ask about destinations, budgets, visas, or safety. Try one of these:
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left p-4 rounded-lg bg-surface border border-border text-fg hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
              <ErrorPostcard
                size="compact"
                title="That message didn't go through"
                message={error}
                className="mx-auto max-w-xl"
              />
            )}
          </div>

          {/* Input */}
          <div className="pt-2">
            <ChatInput onSend={send} onStop={stop} isStreaming={isStreaming} />
          </div>
        </div>
      </div>
    </div>
  );
}
