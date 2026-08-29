import { HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import type { ChatSummary } from "../../types/chat";

interface ConversationListProps {
  chats: ChatSummary[];
  activeId: string | null;
  loading?: boolean;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}

/** Sidebar list of saved conversations with new/select/delete. */
export default function ConversationList({
  chats,
  activeId,
  loading,
  onSelect,
  onNew,
  onDelete,
}: ConversationListProps): JSX.Element {
  return (
    <div className="flex flex-col h-full">
      <button
        type="button"
        onClick={onNew}
        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:opacity-90 mb-4"
      >
        <HiOutlinePlus aria-hidden="true" />
        New chat
      </button>

      <nav aria-label="Conversations" className="flex-1 overflow-y-auto space-y-1">
        {loading && chats.length === 0 && (
          <p className="text-sm text-textGray dark:text-grayish px-2">Loading…</p>
        )}
        {!loading && chats.length === 0 && (
          <p className="text-sm text-textGray dark:text-grayish px-2">
            No conversations yet.
          </p>
        )}
        {chats.map((chat) => {
          const active = chat.id === activeId;
          return (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer ${
                active
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
              }`}
              onClick={() => onSelect(chat.id)}
            >
              <HiOutlineChatBubbleLeftRight
                className="text-primary shrink-0"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-black dark:text-textWhite truncate">
                  {chat.title}
                </p>
                {chat.lastPreview && (
                  <p className="text-xs text-textGray dark:text-grayish truncate">
                    {chat.lastPreview}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(chat.id);
                }}
                aria-label={`Delete conversation: ${chat.title}`}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-textGray hover:text-secondary shrink-0"
              >
                <HiOutlineTrash aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
