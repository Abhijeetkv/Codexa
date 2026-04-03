import { create } from "zustand";

type SidePanel = "explorer" | "search" | "git" | "ai" | null;

interface UIState {
  sidePanel: SidePanel;
  showTerminal: boolean;
  showLoginModal: boolean;
  showNewProjectModal: boolean;
  showNewFileModal: boolean;
  loginModalMessage: string;
  newFileIsDirectory: boolean;
  sidePanelWidth: number;
  terminalHeight: number;

  setSidePanel: (panel: SidePanel) => void;
  toggleSidePanel: (panel: SidePanel) => void;
  toggleTerminal: () => void;
  setShowLoginModal: (show: boolean, message?: string) => void;
  setShowNewProjectModal: (show: boolean) => void;
  setShowNewFileModal: (show: boolean, isDirectory?: boolean) => void;
  setSidePanelWidth: (width: number) => void;
  setTerminalHeight: (height: number) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  sidePanel: "explorer",
  showTerminal: false,
  showLoginModal: false,
  showNewProjectModal: false,
  showNewFileModal: false,
  loginModalMessage: "",
  newFileIsDirectory: false,
  sidePanelWidth: 260,
  terminalHeight: 200,

  setSidePanel: (panel) => set({ sidePanel: panel }),

  toggleSidePanel: (panel) => {
    const current = get().sidePanel;
    set({ sidePanel: current === panel ? null : panel });
  },

  toggleTerminal: () =>
    set((state) => ({ showTerminal: !state.showTerminal })),

  setShowLoginModal: (show, message) =>
    set({
      showLoginModal: show,
      loginModalMessage: message || "Login with GitHub to continue",
    }),

  setShowNewProjectModal: (show) => set({ showNewProjectModal: show }),

  setShowNewFileModal: (show, isDirectory) =>
    set({ showNewFileModal: show, newFileIsDirectory: isDirectory || false }),

  setSidePanelWidth: (width) => set({ sidePanelWidth: width }),
  setTerminalHeight: (height) => set({ terminalHeight: height }),
}));
