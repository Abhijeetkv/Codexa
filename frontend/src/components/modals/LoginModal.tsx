import {  X, Shield } from "lucide-react";
import { useUIStore } from "../../stores/uiStore";

export default function LoginModal() {
  const { showLoginModal, loginModalMessage, setShowLoginModal } = useUIStore();

  if (!showLoginModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      onClick={() => setShowLoginModal(false)}
    >
      <div
        className="glass-strong rounded-2xl p-6 w-full max-w-sm mx-4 animate-fade-in-up"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={() => setShowLoginModal(false)}
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

        {/* Icon */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent-blue-muted), var(--color-accent-purple-muted))",
              border: "1px solid var(--color-border-default)",
            }}
          >
            {/* <Github size={24} style={{ color: "var(--color-text-primary)" }} /> */}
          </div>

          <div className="text-center">
            <h3
              className="text-base font-semibold mb-1"
              style={{ color: "var(--color-text-primary)" }}
            >
              Connect GitHub
            </h3>
            <p
              className="text-xs leading-5"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              {loginModalMessage}
            </p>
          </div>
        </div>

        {/* Login Button */}
        <a
          href="/api/auth/github"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            backgroundColor: "var(--color-text-primary)",
            color: "var(--color-bg-primary)",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {/* <Github size={16} /> */}
          Continue with GitHub
        </a>

        {/* Security note */}
        <div
          className="flex items-center gap-2 mt-4 text-[10px] justify-center"
          style={{ color: "var(--color-text-muted)" }}
        >
          <Shield size={10} />
          Your tokens are stored securely on the server
        </div>
      </div>
    </div>
  );
}
