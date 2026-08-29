/** A conversation summary stored at `users/{uid}/chats/{chatId}`. */
export interface ChatSummary {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  /** Short snippet of the latest message, for the conversation list. */
  lastPreview: string;
}

/** A message stored at `users/{uid}/chats/{chatId}/messages/{messageId}`. */
export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}
