import { useRef, useCallback } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { useEditorStore } from "../../stores/editorStore";
import { useProjectStore } from "../../stores/projectStore";
import { getLanguageFromFilename } from "../../utils/languages";
import { Zap, FileCode, ArrowRight } from "lucide-react";

export default function CodeEditor() {
  const { tabs, activeTabId, updateTabContent, markDirty } = useEditorStore();
  const { updateFile } = useProjectStore();
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const editorRef = useRef<any>(null);

  const activeTab = tabs.find((t) => t.file.id === activeTabId);

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (!activeTab || value === undefined) return;

      updateTabContent(activeTab.file.id, value);

      // Debounced auto-save
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(async () => {
        try {
          await updateFile(activeTab.file.id, value);
          markDirty(activeTab.file.id, false);
        } catch {
          // Save failed — keep dirty
        }
      }, 1000);
    },
    [activeTab, updateTabContent, updateFile, markDirty]
  );

  // Welcome screen when no file is open
  if (!activeTab) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center gap-6 animate-fade-in"
        style={{ backgroundColor: "var(--color-bg-primary)" }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #58a6ff20, #bc8cff20)",
            border: "1px solid var(--color-border-default)",
          }}
        >
          <Zap size={28} style={{ color: "var(--color-accent-blue)" }} />
        </div>

        <div className="text-center">
          <h2
            className="text-lg font-semibold mb-1"
            style={{ color: "var(--color-text-primary)" }}
          >
            Welcome to Codexa
          </h2>
          <p
            className="text-sm max-w-sm"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            Open a file from the explorer to start editing, or create a new file.
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {[
            { icon: FileCode, text: "Open a file from the Explorer", key: "Ctrl+P" },
            { icon: ArrowRight, text: "Create a new file", key: "Ctrl+N" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-3 px-4 py-2 rounded-lg"
              style={{
                backgroundColor: "var(--color-bg-secondary)",
                border: "1px solid var(--color-border-muted)",
              }}
            >
              <item.icon
                size={14}
                style={{ color: "var(--color-accent-blue)" }}
              />
              <span
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {item.text}
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded ml-auto"
                style={{
                  backgroundColor: "var(--color-bg-elevated)",
                  color: "var(--color-text-tertiary)",
                  border: "1px solid var(--color-border-default)",
                }}
              >
                {item.key}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const language = getLanguageFromFilename(activeTab.file.name);

  return (
    <div className="flex-1 overflow-hidden" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      <Editor
        key={activeTab.file.id}
        height="100%"
        language={language}
        value={activeTab.file.content || ""}
        onChange={handleChange}
        onMount={handleEditorMount}
        theme="vs-dark"
        options={{
          fontSize: 13,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          minimap: { enabled: true, scale: 1, showSlider: "mouseover" },
          lineNumbers: "on",
          renderLineHighlight: "line",
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          bracketPairColorization: { enabled: true },
          padding: { top: 8, bottom: 8 },
          wordWrap: "off",
          tabSize: 2,
          formatOnPaste: true,
          automaticLayout: true,
          suggest: { showMethods: true, showFunctions: true },
        }}
      />
    </div>
  );
}
