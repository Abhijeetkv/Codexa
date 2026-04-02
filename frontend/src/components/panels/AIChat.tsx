import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { aiApi } from "../../api/ai";
import { useProjectStore } from "../../stores/projectStore";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { currentProject } = useProjectStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await aiApi.chat(
        userMessage.content,
        currentProject?.id
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.content,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderContent = (content: string) => {
    // Simple code block rendering
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const lines = part.split("\n");
        const lang = lines[0].replace("```", "").trim();
        const code = lines.slice(1, -1).join("\n");
        return (
          <div
            key={i}
            className="my-2 rounded-lg overflow-hidden"
            style={{
              border: "1px solid var(--color-border-default)",
            }}
          >
            {lang && (
              <div
                className="px-3 py-1 text-[10px] uppercase tracking-wider"
                style={{
                  backgroundColor: "var(--color-bg-elevated)",
                  color: "var(--color-text-tertiary)",
                  borderBottom: "1px solid var(--color-border-default)",
                }}
              >
                {lang}
              </div>
            )}
            <pre
              className="p-3 text-xs overflow-x-auto"
              style={{
                backgroundColor: "var(--color-bg-primary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return (
        <span key={i} className="whitespace-pre-wrap">
          {part}
        </span>
      );
    });
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden animate-fade-in"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 h-[34px] border-b text-[11px] font-semibold uppercase tracking-wider shrink-0"
        style={{
          borderColor: "var(--color-border-default)",
          color: "var(--color-text-tertiary)",
        }}
      >
        <Sparkles size={12} style={{ color: "var(--color-accent-purple)" }} />
        AI Assistant
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--color-accent-purple-muted), var(--color-accent-blue-muted))",
                border: "1px solid var(--color-border-default)",
              }}
            >
              <Bot size={18} style={{ color: "var(--color-accent-purple)" }} />
            </div>
            <p
              className="text-xs text-center leading-5"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              Ask me anything about your code.
              <br />I can help with debugging, writing, and explaining.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5 p-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className="flex gap-2 p-2 rounded-lg animate-fade-in-up"
                style={{
                  backgroundColor:
                    msg.role === "assistant"
                      ? "var(--color-bg-tertiary)"
                      : "transparent",
                }}
              >
                <div
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor:
                      msg.role === "assistant"
                        ? "var(--color-accent-purple-muted)"
                        : "var(--color-accent-blue-muted)",
                  }}
                >
                  {msg.role === "assistant" ? (
                    <Bot
                      size={11}
                      style={{ color: "var(--color-accent-purple)" }}
                    />
                  ) : (
                    <User
                      size={11}
                      style={{ color: "var(--color-accent-blue)" }}
                    />
                  )}
                </div>
                <div
                  className="flex-1 text-xs leading-5 min-w-0"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 p-2 rounded-lg" style={{ backgroundColor: "var(--color-bg-tertiary)" }}>
                <div
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--color-accent-purple-muted)" }}
                >
                  <Loader2
                    size={11}
                    className="animate-spin"
                    style={{ color: "var(--color-accent-purple)" }}
                  />
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--color-text-tertiary)" }}
                >
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div
        className="p-2 border-t shrink-0"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        <div
          className="flex items-end gap-2 rounded-lg p-2"
          style={{
            backgroundColor: "var(--color-bg-primary)",
            border: "1px solid var(--color-border-default)",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Codexa AI..."
            className="flex-1 bg-transparent outline-none resize-none text-xs leading-5"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-sans)",
              maxHeight: "100px",
            }}
            rows={1}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="p-1.5 rounded transition-colors shrink-0"
            style={{
              backgroundColor: input.trim()
                ? "var(--color-accent-blue)"
                : "var(--color-bg-elevated)",
              color: input.trim() ? "#fff" : "var(--color-text-muted)",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
