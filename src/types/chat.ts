export interface ChatSummary {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  lastPreview: string;
}

export interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}
