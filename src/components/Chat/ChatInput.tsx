import { FormEvent, KeyboardEvent, useState } from "react";
import { IoSend, IoStop } from "react-icons/io5";

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

export default function ChatInput({ onSend, onStop, isStreaming }: ChatInputProps): JSX.Element {
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isStreaming) return;
    onSend(value);
    setValue("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(e);
    }
  };

  return (
    <form onSubmit={submit} className="flex items-end gap-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder="Ask about destinations, budgets, visas, safety…"
        aria-label="Message the travel assistant"
        className="flex-1 resize-none max-h-40 px-4 py-3 rounded-2xl bg-white dark:bg-bgDark text-black dark:text-textWhite shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
      {isStreaming ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop generating"
          className="shrink-0 w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center hover:opacity-90"
        >
          <IoStop />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Send message"
          className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40"
        >
          <IoSend />
        </button>
      )}
    </form>
  );
}
