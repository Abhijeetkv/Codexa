import {
  GitBranch,
  Upload,
  Download,
  Package,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useUIStore } from "../../stores/uiStore";
import { useProjectStore } from "../../stores/projectStore";
import { githubApi } from "../../api/github";
import toast from "react-hot-toast";

export default function GitPanel() {
  const { isAuthenticated } = useAuthStore();
  const { setShowLoginModal } = useUIStore();
  const { setPendingAction } = useAuthStore();
  const { currentProject } = useProjectStore();
  const [isPushing, setIsPushing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const handleAuthGuard = (action: string, callback: () => void) => {
    if (!isAuthenticated) {
      setPendingAction(callback);
      setShowLoginModal(true, `Login with GitHub to ${action}`);
      return;
    }
    callback();
  };

  const handlePush = async () => {
    if (!currentProject) {
      toast.error("No project selected");
      return;
    }

    setIsPushing(true);
    try {
      const result = await githubApi.push({ projectId: currentProject.id });
      toast.success(result.repo ? `Pushed to ${result.repo}` : "Push successful!");
    } catch (error: any) {
      if (error.response?.data?.loginRequired) return; // Handled by interceptor
      toast.error(error.response?.data?.error || "Push failed");
    } finally {
      setIsPushing(false);
    }
  };

  const handlePull = async () => {
    if (!currentProject) {
      toast.error("No project selected");
      return;
    }

    setIsPulling(true);
    try {
      await githubApi.pull(currentProject.id);
      toast.success("Pull successful!");
    } catch (error: any) {
      if (error.response?.data?.loginRequired) return;
      toast.error(error.response?.data?.error || "Pull failed");
    } finally {
      setIsPulling(false);
    }
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
        <GitBranch size={12} />
        Source Control
      </div>

      <div className="p-3 flex flex-col gap-3">
        {/* Auth Status */}
        <div
          className="flex items-center gap-2 p-2 rounded-lg text-xs"
          style={{
            backgroundColor: isAuthenticated
              ? "var(--color-accent-green-muted)"
              : "var(--color-bg-tertiary)",
            border: `1px solid ${
              isAuthenticated
                ? "var(--color-accent-green)"
                : "var(--color-border-default)"
            }`,
            color: isAuthenticated
              ? "var(--color-accent-green)"
              : "var(--color-text-tertiary)",
          }}
        >
          {isAuthenticated ? (
            <>
              <CheckCircle size={12} />
              Connected to GitHub
            </>
          ) : (
            <>
              <AlertCircle size={12} />
              Not connected — login to use Git
            </>
          )}
        </div>

        {/* Git Actions */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleAuthGuard("push code", handlePush)}
            disabled={isPushing}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full"
            style={{
              backgroundColor: "var(--color-bg-elevated)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border-default)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
              e.currentTarget.style.borderColor = "var(--color-accent-blue)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-bg-elevated)";
              e.currentTarget.style.borderColor = "var(--color-border-default)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            {isPushing ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Upload size={13} />
            )}
            Push to GitHub
          </button>

          <button
            onClick={() => handleAuthGuard("pull code", handlePull)}
            disabled={isPulling}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full"
            style={{
              backgroundColor: "var(--color-bg-elevated)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border-default)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
              e.currentTarget.style.borderColor = "var(--color-accent-blue)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-bg-elevated)";
              e.currentTarget.style.borderColor = "var(--color-border-default)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            {isPulling ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Download size={13} />
            )}
            Pull from GitHub
          </button>

          <button
            onClick={() =>
              handleAuthGuard("import a repository", () => {
                toast("Import feature coming soon!", { icon: "📦" });
              })
            }
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all w-full"
            style={{
              backgroundColor: "var(--color-bg-elevated)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border-default)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
              e.currentTarget.style.borderColor = "var(--color-accent-blue)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-bg-elevated)";
              e.currentTarget.style.borderColor = "var(--color-border-default)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            <Package size={13} />
            Import Repository
          </button>
        </div>
      </div>
    </div>
  );
}
