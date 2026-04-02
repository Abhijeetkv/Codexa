import {
  Files,
  Search,
  GitBranch,
  MessageSquare,
  Terminal,
  Settings,
} from "lucide-react";
import { useUIStore } from "../../stores/uiStore";

const sidebarItems = [
  { id: "explorer" as const, icon: Files, label: "Explorer" },
  { id: "search" as const, icon: Search, label: "Search" },
  { id: "git" as const, icon: GitBranch, label: "Source Control" },
  { id: "ai" as const, icon: MessageSquare, label: "AI Chat" },
];

export default function Sidebar() {
  const { sidePanel, toggleSidePanel, toggleTerminal, showTerminal } = useUIStore();

  return (
    <aside
      id="sidebar"
      className="flex flex-col items-center justify-between py-1 w-[46px] border-r select-none"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        borderColor: "var(--color-border-default)",
      }}
    >
      <div className="flex flex-col items-center gap-0.5">
        {sidebarItems.map((item) => {
          const isActive = sidePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => toggleSidePanel(item.id)}
              className="relative w-[36px] h-[36px] flex items-center justify-center rounded transition-colors"
              style={{
                color: isActive
                  ? "var(--color-text-primary)"
                  : "var(--color-text-tertiary)",
                backgroundColor: isActive
                  ? "var(--color-bg-hover)"
                  : "transparent",
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                  e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = "var(--color-text-tertiary)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
              title={item.label}
            >
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[20px] rounded-r"
                  style={{ backgroundColor: "var(--color-accent-blue)" }}
                />
              )}
              <item.icon size={18} strokeWidth={1.5} />
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-0.5 mb-1">
        <button
          onClick={toggleTerminal}
          className="w-[36px] h-[36px] flex items-center justify-center rounded transition-colors"
          style={{
            color: showTerminal
              ? "var(--color-text-primary)"
              : "var(--color-text-tertiary)",
            backgroundColor: showTerminal
              ? "var(--color-bg-hover)"
              : "transparent",
          }}
          onMouseOver={(e) => {
            if (!showTerminal) {
              e.currentTarget.style.color = "var(--color-text-secondary)";
              e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
            }
          }}
          onMouseOut={(e) => {
            if (!showTerminal) {
              e.currentTarget.style.color = "var(--color-text-tertiary)";
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
          title="Terminal"
        >
          <Terminal size={18} strokeWidth={1.5} />
        </button>
        <button
          className="w-[36px] h-[36px] flex items-center justify-center rounded transition-colors"
          style={{ color: "var(--color-text-tertiary)" }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "var(--color-text-secondary)";
            e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "var(--color-text-tertiary)";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Settings"
        >
          <Settings size={18} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
