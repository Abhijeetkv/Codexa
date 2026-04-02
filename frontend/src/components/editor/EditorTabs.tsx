import { X, Circle } from "lucide-react";
import { useEditorStore } from "../../stores/editorStore";
import { getFileIcon, getFileIconColor } from "../../utils/fileIcons";

export default function EditorTabs() {
  const { tabs, activeTabId, setActiveTab, closeTab } = useEditorStore();

  if (tabs.length === 0) return null;

  return (
    <div
      className="flex items-center overflow-x-auto border-b"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        borderColor: "var(--color-border-default)",
        minHeight: "34px",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.file.id === activeTabId;
        const Icon = getFileIcon(tab.file.name, false);
        const iconColor = getFileIconColor(tab.file.name, false);

        return (
          <div
            key={tab.file.id}
            className="group flex items-center gap-1.5 px-3 h-[34px] cursor-pointer border-r text-xs transition-colors shrink-0"
            style={{
              backgroundColor: isActive
                ? "var(--color-bg-primary)"
                : "var(--color-bg-secondary)",
              borderColor: "var(--color-border-muted)",
              color: isActive
                ? "var(--color-text-primary)"
                : "var(--color-text-secondary)",
              borderBottom: isActive
                ? "1px solid var(--color-bg-primary)"
                : "1px solid transparent",
              borderTop: isActive
                ? "1px solid var(--color-accent-blue)"
                : "1px solid transparent",
              marginBottom: "-1px",
            }}
            onClick={() => setActiveTab(tab.file.id)}
          >
            <Icon size={13} style={{ color: iconColor }} strokeWidth={1.5} />
            <span className="max-w-[120px] truncate">{tab.file.name}</span>
            <button
              className="ml-1 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              style={{
                color: "var(--color-text-tertiary)",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-bg-hover)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.file.id);
              }}
            >
              {tab.isDirty ? (
                <Circle size={8} fill="currentColor" />
              ) : (
                <X size={12} />
              )}
            </button>
            {tab.isDirty && (
              <span
                className="group-hover:hidden"
                style={{ color: "var(--color-text-muted)" }}
              >
                <Circle size={8} fill="currentColor" />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
