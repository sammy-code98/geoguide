import { FormEvent, KeyboardEvent, useLayoutEffect, useRef, useState } from "react";
import { IoSend, IoStop } from "react-icons/io5";
import { useMediaQuery } from "../../hooks/useMediaQuery";

/** Tallest the box grows before it scrolls (matches `max-h-40`). */
const MAX_HEIGHT_PX = 160;

interface ChatInputProps {
  onSend: (text: string) => void;
  onStop: () => void;
  isStreaming: boolean;
}

export default function ChatInput({ onSend, onStop, isStreaming }: ChatInputProps): JSX.Element {
  const [value, setValue] = useState("");
  const boxRef = useRef<HTMLTextAreaElement>(null);
  // The full hint wraps to two lines on a phone and gets clipped; keep it to one.
  const roomy = useMediaQuery("(min-width: 640px)");

  // Grow with the message (up to MAX_HEIGHT_PX), and shrink back once it's sent.
  useLayoutEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    box.style.height = "auto";
    const border = box.offsetHeight - box.clientHeight; // scrollHeight excludes it
    box.style.height = `${Math.min(box.scrollHeight + border, MAX_HEIGHT_PX)}px`;
  }, [value]);

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
        ref={boxRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder={roomy ? "Ask about destinations, budgets, visas, safety…" : "Ask about any trip…"}
        aria-label="Message the travel assistant"
        className="flex-1 resize-none max-h-40 overflow-y-auto px-4 py-2.5 rounded-xl bg-surface text-fg placeholder:text-muted border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary"
      />
      {isStreaming ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop generating"
          className="shrink-0 w-12 h-12 rounded-xl bg-surface-2 text-fg flex items-center justify-center hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <IoStop />
        </button>
      ) : (
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Send message"
          className="shrink-0 w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <IoSend />
        </button>
      )}
    </form>
  );
}
