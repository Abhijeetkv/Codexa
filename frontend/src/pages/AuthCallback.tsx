import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useProjectStore } from "../stores/projectStore";
import { projectsApi } from "../api/projects";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login, executePendingAction } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token).then(async () => {
        toast.success("Successfully logged in with GitHub!");

        // Migrate guest projects
        const guestSessionId = localStorage.getItem("codexa_guest_session_id");
        if (guestSessionId) {
          try {
            // Get current project and migrate it
            const { currentProject } = useProjectStore.getState();
            if (currentProject?.isGuest) {
              await projectsApi.migrate(currentProject.id);
              toast.success("Guest project linked to your account");
            }
          } catch {
            // Migration is best-effort
          }
        }

        // Execute any pending action
        setTimeout(() => {
          executePendingAction();
        }, 500);

        navigate("/", { replace: true });
      });
    } else {
      toast.error("Login failed — no token received");
      navigate("/", { replace: true });
    }
  }, [login, navigate, executePendingAction]);

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2
          size={24}
          className="animate-spin"
          style={{ color: "var(--color-accent-blue)" }}
        />
        <p
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Authenticating...
        </p>
      </div>
    </div>
  );
}
