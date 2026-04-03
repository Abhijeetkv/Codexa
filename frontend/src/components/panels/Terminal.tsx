import { Terminal as TerminalIcon } from "lucide-react";

export default function TerminalPanel() {
  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 h-[30px] border-b text-[11px] font-medium uppercase tracking-wider shrink-0"
        style={{
          borderColor: "var(--color-border-default)",
          color: "var(--color-text-tertiary)",
          backgroundColor: "var(--color-bg-secondary)",
        }}
      >
        <TerminalIcon size={12} />
        Terminal
      </div>

      {/* Terminal Content */}
      <div
        className="flex-1 overflow-y-auto p-3"
        style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}
      >
        <div style={{ color: "var(--color-accent-green)" }}>
          $ codexa &gt; ready
        </div>
        <div
          className="mt-2 text-xs"
          style={{ color: "var(--color-text-tertiary)" }}
        >
          Terminal will be connected to WebContainer for live code execution.
        </div>
        <div className="mt-3 flex items-center gap-1">
          <span style={{ color: "var(--color-accent-cyan)" }}>❯</span>
          <span
            className="animate-pulse"
            style={{ color: "var(--color-text-muted)" }}
          >
            _
          </span>
        </div>
      </div>
    </div>
  );
}
