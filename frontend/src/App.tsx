import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import IDEPage from "./pages/IDEPage";
import AuthCallback from "./pages/AuthCallback";
import { useAuthStore } from "./stores/authStore";
import { useUIStore } from "./stores/uiStore";

export default function App() {
  const [ready, setReady] = useState(false);
  const { checkAuth } = useAuthStore();
  const { setShowLoginModal } = useUIStore();

  useEffect(() => {
    checkAuth().finally(() => setReady(true));

    const handleAuthRequired = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setShowLoginModal(true, detail?.message || "Login with GitHub to continue");
    };

    window.addEventListener("codexa:auth-required", handleAuthRequired);
    return () => window.removeEventListener("codexa:auth-required", handleAuthRequired);
  }, [checkAuth, setShowLoginModal]);

  if (!ready) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#0d1117",
        color: "#8b949e",
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
      }}>
        Loading Codexa...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#21262d",
            color: "#e6edf3",
            border: "1px solid #30363d",
            fontSize: "12px",
            fontFamily: "'Inter', sans-serif",
            borderRadius: "10px",
            padding: "10px 14px",
          },
          success: {
            iconTheme: { primary: "#3fb950", secondary: "#0d1117" },
          },
          error: {
            iconTheme: { primary: "#f85149", secondary: "#0d1117" },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<IDEPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </BrowserRouter>
  );
}