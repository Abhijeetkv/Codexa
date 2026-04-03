import { create } from "zustand";
import { authApi } from "../api/auth";

interface User {
  id: string;
  username: string;
  email?: string;
  avatarUrl?: string;
  githubId: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  guestSessionId: string;
  isLoading: boolean;
  pendingAction: (() => void) | null;

  checkAuth: () => Promise<void>;
  login: (token: string) => Promise<void>;
  logout: () => void;
  getGuestSessionId: () => string;
  setPendingAction: (action: (() => void) | null) => void;
  executePendingAction: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem("codexa_token"),
  guestSessionId: (() => {
    let id = localStorage.getItem("codexa_guest_session_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("codexa_guest_session_id", id);
    }
    return id;
  })(),
  isLoading: true,
  pendingAction: null,

  checkAuth: async () => {
    const token = localStorage.getItem("codexa_token");
    if (!token) {
      set({ isAuthenticated: false, user: null, isLoading: false });
      return;
    }

    try {
      const user = await authApi.getMe();
      set({ isAuthenticated: true, user, token, isLoading: false });
    } catch {
      localStorage.removeItem("codexa_token");
      set({ isAuthenticated: false, user: null, token: null, isLoading: false });
    }
  },

  login: async (token: string) => {
    localStorage.setItem("codexa_token", token);
    set({ token });

    try {
      const user = await authApi.getMe();
      set({ isAuthenticated: true, user, isLoading: false });
    } catch {
      localStorage.removeItem("codexa_token");
      set({ isAuthenticated: false, user: null, token: null, isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("codexa_token");
    set({ isAuthenticated: false, user: null, token: null });
  },

  getGuestSessionId: () => get().guestSessionId,

  setPendingAction: (action) => set({ pendingAction: action }),

  executePendingAction: () => {
    const { pendingAction } = get();
    if (pendingAction) {
      pendingAction();
      set({ pendingAction: null });
    }
  },
}));
