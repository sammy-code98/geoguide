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
        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary-hover mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        <HiOutlinePlus aria-hidden="true" />
        New chat
      </button>

      <nav aria-label="Conversations" className="flex-1 overflow-y-auto space-y-1">
        {loading && chats.length === 0 && (
          <p className="text-sm text-muted px-2">Loading…</p>
        )}
        {!loading && chats.length === 0 && (
          <p className="text-sm text-muted px-2">No conversations yet.</p>
        )}
        {chats.map((chat) => {
          const active = chat.id === activeId;
          return (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer ${
                active
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-surface-2 border border-transparent"
              }`}
              onClick={() => onSelect(chat.id)}
            >
              <HiOutlineChatBubbleLeftRight
                className="text-muted shrink-0"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-fg truncate">{chat.title}</p>
                {chat.lastPreview && (
                  <p className="text-xs text-muted truncate">{chat.lastPreview}</p>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(chat.id);
                }}
                aria-label={`Delete conversation: ${chat.title}`}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted hover:text-danger shrink-0"
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
