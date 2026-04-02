import { useState } from "react";
import { X, FilePlus, FolderPlus, Loader2 } from "lucide-react";
import { useUIStore } from "../../stores/uiStore";
import { useProjectStore } from "../../stores/projectStore";
import toast from "react-hot-toast";

export default function NewFileModal() {
  const { showNewFileModal, newFileIsDirectory, setShowNewFileModal } = useUIStore();
  const { currentProject, createFile } = useProjectStore();
  const [name, setName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!showNewFileModal) return null;

  const handleCreate = async () => {
    if (!name.trim() || !currentProject) {
      toast.error("File name is required");
      return;
    }

    setIsCreating(true);
    try {
      await createFile({
        projectId: currentProject.id,
        path: name.trim(),
        name: name.trim().split("/").pop() || name.trim(),
        content: newFileIsDirectory ? undefined : "",
        isDirectory: newFileIsDirectory,
      });
      setName("");
      setShowNewFileModal(false);
      toast.success(
        `${newFileIsDirectory ? "Folder" : "File"} created!`
      );
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create");
    } finally {
      setIsCreating(false);
    }
  };

  const Icon = newFileIsDirectory ? FolderPlus : FilePlus;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={() => setShowNewFileModal(false)}
    >
      <div
        className="glass-strong rounded-2xl p-6 w-full max-w-sm mx-4 animate-fade-in-up"
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowNewFileModal(false)}
          className="absolute top-4 right-4 p-1 rounded transition-colors"
          style={{ color: "var(--color-text-tertiary)" }}
          onMouseOver={(e) =>
            (e.currentTarget.style.color = "var(--color-text-primary)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.color = "var(--color-text-tertiary)")
          }
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "var(--color-accent-green-muted)",
              border: "1px solid var(--color-border-default)",
            }}
          >
            <Icon size={16} style={{ color: "var(--color-accent-green)" }} />
          </div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            New {newFileIsDirectory ? "Folder" : "File"}
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label
              className="block text-[11px] font-medium mb-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {newFileIsDirectory ? "Folder" : "File"} Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                newFileIsDirectory ? "components" : "index.ts"
              }
              autoFocus
              className="w-full px-3 py-2 rounded-lg text-xs outline-none transition-colors"
              style={{
                backgroundColor: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border-default)",
                fontFamily: "var(--font-mono)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-accent-blue)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--color-border-default)")
              }
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <p
              className="text-[10px] mt-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              Use "/" for nested paths (e.g. src/components/App.tsx)
            </p>
          </div>

          <button
            onClick={handleCreate}
            disabled={isCreating || !name.trim()}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium transition-all"
            style={{
              backgroundColor: name.trim()
                ? "var(--color-accent-green)"
                : "var(--color-bg-elevated)",
              color: name.trim() ? "#fff" : "var(--color-text-muted)",
              opacity: isCreating ? 0.7 : 1,
            }}
          >
            {isCreating ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Icon size={13} />
            )}
            Create {newFileIsDirectory ? "Folder" : "File"}
          </button>
        </div>
      </div>
    </div>
  );
}
