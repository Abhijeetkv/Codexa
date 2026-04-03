import { Search, FileText } from "lucide-react";
import { useState } from "react";
import { useProjectStore } from "../../stores/projectStore";
import { useEditorStore } from "../../stores/editorStore";

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const { files } = useProjectStore();
  const { openFile } = useEditorStore();

  const results = query.trim()
    ? files.filter(
        (f) =>
          !f.isDirectory &&
          (f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.content?.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

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
        <Search size={12} />
        Search
      </div>

      {/* Search Input */}
      <div className="p-2">
        <div
          className="flex items-center gap-2 rounded px-2 py-1.5"
          style={{
            backgroundColor: "var(--color-bg-primary)",
            border: "1px solid var(--color-border-default)",
          }}
        >
          <Search size={12} style={{ color: "var(--color-text-muted)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files..."
            className="flex-1 bg-transparent outline-none text-xs"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-sans)",
            }}
          />
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {results.map((file) => (
          <button
            key={file.id}
            onClick={() => openFile(file)}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-xs transition-colors text-left"
            style={{ color: "var(--color-text-secondary)" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <FileText size={12} style={{ color: "var(--color-text-tertiary)" }} />
            <span className="truncate">{file.path}</span>
          </button>
        ))}
        {query.trim() && results.length === 0 && (
          <div
            className="px-3 py-4 text-xs text-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            No results found
          </div>
        )}
      </div>
    </div>
  );
}
