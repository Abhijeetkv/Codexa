import { useEditorStore } from "../../stores/editorStore";
import { useProjectStore } from "../../stores/projectStore";
import { getLanguageFromFilename } from "../../utils/languages";

export default function StatusBar() {
  const { tabs, activeTabId } = useEditorStore();
  const { currentProject } = useProjectStore();
  const activeTab = tabs.find((t) => t.file.id === activeTabId);
  const language = activeTab
    ? getLanguageFromFilename(activeTab.file.name)
    : "";

  return (
    <footer
      id="statusbar"
      className="flex items-center justify-between h-[22px] px-3 border-t text-[11px] select-none"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        borderColor: "var(--color-border-default)",
        color: "var(--color-text-tertiary)",
      }}
    >
      <div className="flex items-center gap-3">
        {currentProject && (
          <span className="flex items-center gap-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "var(--color-accent-green)" }}
            />
            {currentProject.name}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {activeTab && (
          <>
            <span>UTF-8</span>
            <span className="capitalize">{language}</span>
          </>
        )}
        <span>Codexa v1.0</span>
      </div>
    </footer>
  );
}
