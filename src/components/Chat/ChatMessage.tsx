import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { MdOutlineTravelExplore } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import type { ChatMessage as ChatMessageType } from "../../hooks/useChat";
import TypingDots from "./TypingDots";

interface ChatMessageProps {
  message: ChatMessageType;
  /** True while this assistant message is actively streaming. */
  isStreaming?: boolean;
}

// Tailwind-styled renderers so markdown matches the app without a prose plugin.
const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>,
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  h1: ({ children }) => <h1 className="text-xl font-semibold mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold mb-1">{children}</h3>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="text-primary underline">
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="px-1 py-0.5 rounded bg-surface-2 text-sm">{children}</code>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-2">
      <table className="min-w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border px-2 py-1 text-left font-medium">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-2 py-1">{children}</td>
  ),
};

export default function ChatMessage({ message, isStreaming }: ChatMessageProps): JSX.Element {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary"
        }`}
        aria-hidden="true"
      >
        {isUser ? <FiUser /> : <MdOutlineTravelExplore />}
      </div>

      <div
        className={`max-w-[80%] rounded-xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-surface text-fg border border-border rounded-tl-sm"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : message.content ? (
          <div className="text-sm md:text-base">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          isStreaming && <TypingDots />
        )}
      </div>
    </div>
  );
}
