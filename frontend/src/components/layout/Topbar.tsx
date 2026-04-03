import {
  LogOut,
  User,
  ChevronDown,
  Zap,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useUIStore } from "../../stores/uiStore";
import { useProjectStore } from "../../stores/projectStore";

export default function Topbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { setShowLoginModal, setShowNewProjectModal } = useUIStore();
  const { currentProject } = useProjectStore();

  return (
    <header
      id="topbar"
      className="flex items-center justify-between h-[40px] px-3 border-b select-none"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        borderColor: "var(--color-border-default)",
      }}
    >
      {/* Left - Logo + Project */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #58a6ff, #bc8cff)",
            }}
          >
            <Zap size={12} color="#fff" strokeWidth={2.5} />
          </div>
          <span
            className="font-semibold text-sm tracking-tight"
            style={{ color: "var(--color-text-primary)" }}
          >
            Codexa
          </span>
        </div>

        {currentProject && (
          <>
            <span style={{ color: "var(--color-text-muted)" }}>/</span>
            <button
              className="text-sm px-2 py-0.5 rounded transition-colors flex items-center gap-1"
              style={{ color: "var(--color-text-secondary)" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--color-bg-hover)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
              onClick={() => setShowNewProjectModal(true)}
            >
              {currentProject.name}
              <ChevronDown size={12} />
            </button>
          </>
        )}

        {!isAuthenticated && (
          <span
            className="text-[10px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider"
            style={{
              backgroundColor: "var(--color-accent-purple-muted)",
              color: "var(--color-accent-purple)",
              border: "1px solid var(--color-accent-purple)",
              opacity: 0.8,
            }}
          >
            Guest
          </span>
        )}
      </div>

      {/* Right - Auth */}
      <div className="flex items-center gap-2">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-2 py-1 rounded">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-5 h-5 rounded-full"
                />
              ) : (
                <User size={14} style={{ color: "var(--color-text-secondary)" }} />
              )}
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {user?.username}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded transition-colors"
              style={{ color: "var(--color-text-tertiary)" }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
                e.currentTarget.style.color = "var(--color-accent-red)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-text-tertiary)";
              }}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true, "Login to sync your projects with GitHub")}
            className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all"
            style={{
              backgroundColor: "var(--color-bg-elevated)",
              color: "var(--color-text-secondary)",
              border: "1px solid var(--color-border-default)",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
              e.currentTarget.style.color = "var(--color-text-primary)";
              e.currentTarget.style.borderColor = "var(--color-border-accent)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-bg-elevated)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
              e.currentTarget.style.borderColor = "var(--color-border-default)";
            }}
          >
            {/* <Github size={13} /> */}
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
