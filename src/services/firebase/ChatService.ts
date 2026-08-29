/**
 * Chat persistence: conversations at `users/{uid}/chats/{chatId}` with a
 * `messages` subcollection. UI goes through the useChats / useChat hooks, never
 * here directly. Firebase imports are dynamic to stay out of the initial bundle.
 */
import type { ChatSummary, StoredMessage } from "../../types/chat";
import { getDb } from "./firebase";

/** Most recent messages to load per conversation (older ones paginate later). */
const MESSAGE_PAGE = 100;

/** Build a conversation title from the first user message. */
export function deriveTitle(text: string): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (!clean) return "New chat";
  return clean.length > 48 ? `${clean.slice(0, 48)}…` : clean;
}

/** All conversations for a user, most recently updated first. */
export async function listChats(uid: string): Promise<ChatSummary[]> {
  const db = await getDb();
  const { collection, getDocs, query, orderBy } = await import("firebase/firestore");
  const snap = await getDocs(
    query(collection(db, "users", uid, "chats"), orderBy("updatedAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ChatSummary, "id">) }));
}

/** Create a new conversation and return its id. */
export async function createChat(uid: string, title = "New chat"): Promise<string> {
  const db = await getDb();
  const { collection, addDoc } = await import("firebase/firestore");
  const now = Date.now();
  const ref = await addDoc(collection(db, "users", uid, "chats"), {
    title,
    createdAt: now,
    updatedAt: now,
    lastPreview: "",
  });
  return ref.id;
}

/** Load a conversation's most recent messages (oldest → newest). */
export async function getMessages(uid: string, chatId: string): Promise<StoredMessage[]> {
  const db = await getDb();
  const { collection, getDocs, query, orderBy, limit } = await import("firebase/firestore");
  const snap = await getDocs(
    query(
      collection(db, "users", uid, "chats", chatId, "messages"),
      orderBy("createdAt", "desc"),
      limit(MESSAGE_PAGE)
    )
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<StoredMessage, "id">) }))
    .reverse();
}

/** Append a message and bump the conversation's updatedAt/preview. */
export async function appendMessage(
  uid: string,
  chatId: string,
  role: StoredMessage["role"],
  content: string
): Promise<void> {
  const db = await getDb();
  const { collection, addDoc, doc, updateDoc } = await import("firebase/firestore");
  const now = Date.now();
  await addDoc(collection(db, "users", uid, "chats", chatId, "messages"), {
    role,
    content,
    createdAt: now,
  });
  await updateDoc(doc(db, "users", uid, "chats", chatId), {
    updatedAt: now,
    lastPreview: content.slice(0, 120),
  });
}

/** Rename a conversation. */
export async function renameChat(uid: string, chatId: string, title: string): Promise<void> {
  const db = await getDb();
  const { doc, updateDoc } = await import("firebase/firestore");
  await updateDoc(doc(db, "users", uid, "chats", chatId), { title });
}

/** Delete a conversation and all its messages. */
export async function deleteChat(uid: string, chatId: string): Promise<void> {
  const db = await getDb();
  const { collection, getDocs, doc, deleteDoc, writeBatch } = await import("firebase/firestore");
  const msgs = await getDocs(collection(db, "users", uid, "chats", chatId, "messages"));
  const batch = writeBatch(db);
  msgs.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
  await deleteDoc(doc(db, "users", uid, "chats", chatId));
}
