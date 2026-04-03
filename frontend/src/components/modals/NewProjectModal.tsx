import { useState } from "react";
import { X, FolderPlus, Loader2 } from "lucide-react";
import { useUIStore } from "../../stores/uiStore";
import { useProjectStore } from "../../stores/projectStore";
import toast from "react-hot-toast";

export default function NewProjectModal() {
  const { showNewProjectModal, setShowNewProjectModal } = useUIStore();
  const { createProject, loadProject } = useProjectStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  if (!showNewProjectModal) return null;

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Project name is required");
      return;
    }

    setIsCreating(true);
    try {
      const project = await createProject(name.trim(), description.trim());
      await loadProject(project.id);
      setName("");
      setDescription("");
      setShowNewProjectModal(false);
      toast.success(`Project "${project.name}" created!`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={() => setShowNewProjectModal(false)}
    >
      <div
        className="glass-strong rounded-2xl p-6 w-full max-w-sm mx-4 animate-fade-in-up"
        style={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowNewProjectModal(false)}
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
              background: "var(--color-accent-blue-muted)",
              border: "1px solid var(--color-border-default)",
            }}
          >
            <FolderPlus size={16} style={{ color: "var(--color-accent-blue)" }} />
          </div>
          <h3
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            New Project
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label
              className="block text-[11px] font-medium mb-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="my-project"
              autoFocus
              className="w-full px-3 py-2 rounded-lg text-xs outline-none transition-colors"
              style={{
                backgroundColor: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border-default)",
                fontFamily: "var(--font-sans)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-accent-blue)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--color-border-default)")
              }
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>

          <div>
            <label
              className="block text-[11px] font-medium mb-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description..."
              className="w-full px-3 py-2 rounded-lg text-xs outline-none transition-colors"
              style={{
                backgroundColor: "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border-default)",
                fontFamily: "var(--font-sans)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--color-accent-blue)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--color-border-default)")
              }
            />
          </div>

          <button
            onClick={handleCreate}
            disabled={isCreating || !name.trim()}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-medium transition-all mt-1"
            style={{
              backgroundColor: name.trim()
                ? "var(--color-accent-blue)"
                : "var(--color-bg-elevated)",
              color: name.trim() ? "#fff" : "var(--color-text-muted)",
              opacity: isCreating ? 0.7 : 1,
            }}
          >
            {isCreating ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <FolderPlus size={13} />
            )}
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
