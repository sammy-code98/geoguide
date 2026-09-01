import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import type { ChatSummary } from "../types/chat";
import { deleteChat, listChats, renameChat } from "../services/firebase/ChatService";

const key = (uid: string | undefined) => ["chats", uid ?? "anon"] as const;

/**
 * The current user's conversation list (Firestore → React Query) plus
 * delete/rename mutations. Empty for guests.
 */
export function useChats() {
  const { user } = useAuth();
  const uid = user?.uid;
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: key(uid),
    queryFn: () => listChats(uid as string),
    enabled: !!uid,
  });

  const removeMut = useMutation({
    mutationFn: (id: string) => deleteChat(uid as string, id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: key(uid) });
      const prev = qc.getQueryData<ChatSummary[]>(key(uid)) ?? [];
      qc.setQueryData<ChatSummary[]>(key(uid), prev.filter((c) => c.id !== id));
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx) qc.setQueryData(key(uid), ctx.prev);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: key(uid) }),
  });

  const renameMut = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      renameChat(uid as string, id, title),
    onSettled: () => qc.invalidateQueries({ queryKey: key(uid) }),
  });

  return {
    chats: data ?? [],
    isLoading,
    isAuthed: !!uid,
    deleteChat: (id: string) => removeMut.mutate(id),
    renameChat: (id: string, title: string) => renameMut.mutate({ id, title }),
  };
}
