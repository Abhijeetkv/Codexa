import { create } from "zustand";
import type { FileItem } from "../api/projects";

interface Tab {
  file: FileItem;
  isDirty: boolean;
}

interface EditorState {
  tabs: Tab[];
  activeTabId: string | null;

  openFile: (file: FileItem) => void;
  closeTab: (fileId: string) => void;
  setActiveTab: (fileId: string) => void;
  markDirty: (fileId: string, isDirty: boolean) => void;
  updateTabContent: (fileId: string, content: string) => void;
  closeAllTabs: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  tabs: [],
  activeTabId: null,

  openFile: (file) => {
    const { tabs } = get();
    const existingTab = tabs.find((t) => t.file.id === file.id);

    if (existingTab) {
      set({ activeTabId: file.id });
      return;
    }

    set({
      tabs: [...tabs, { file, isDirty: false }],
      activeTabId: file.id,
    });
  },

  closeTab: (fileId) => {
    const { tabs, activeTabId } = get();
    const newTabs = tabs.filter((t) => t.file.id !== fileId);

    let newActiveId = activeTabId;
    if (activeTabId === fileId) {
      const closedIdx = tabs.findIndex((t) => t.file.id === fileId);
      if (newTabs.length > 0) {
        newActiveId = newTabs[Math.min(closedIdx, newTabs.length - 1)].file.id;
      } else {
        newActiveId = null;
      }
    }

    set({ tabs: newTabs, activeTabId: newActiveId });
  },

  setActiveTab: (fileId) => set({ activeTabId: fileId }),

  markDirty: (fileId, isDirty) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.file.id === fileId ? { ...t, isDirty } : t
      ),
    }));
  },

  updateTabContent: (fileId, content) => {
    set((state) => ({
      tabs: state.tabs.map((t) =>
        t.file.id === fileId
          ? { ...t, file: { ...t.file, content }, isDirty: true }
          : t
      ),
    }));
  },

  closeAllTabs: () => set({ tabs: [], activeTabId: null }),
}));
