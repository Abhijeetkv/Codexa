import { create } from "zustand";
import { projectsApi, type Project, type FileItem } from "../api/projects";
import { filesApi } from "../api/files";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  files: FileItem[];
  isLoading: boolean;

  loadProjects: () => Promise<void>;
  createProject: (name: string, description?: string) => Promise<Project>;
  loadProject: (id: string) => Promise<void>;
  setCurrentProject: (project: Project | null) => void;
  deleteProject: (id: string) => Promise<void>;

  loadFiles: (projectId: string) => Promise<void>;
  createFile: (data: { projectId: string; path: string; name: string; content?: string; isDirectory?: boolean }) => Promise<FileItem>;
  updateFile: (id: string, content: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  files: [],
  isLoading: false,

  loadProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await projectsApi.list();
      set({ projects, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createProject: async (name, description) => {
    const project = await projectsApi.create({ name, description });
    set((state) => ({ projects: [project, ...state.projects] }));
    return project;
  },

  loadProject: async (id) => {
    set({ isLoading: true });
    try {
      const project = await projectsApi.getById(id);
      set({
        currentProject: project,
        files: project.files || [],
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  setCurrentProject: (project) => set({ currentProject: project }),

  deleteProject: async (id) => {
    await projectsApi.delete(id);
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  loadFiles: async (projectId) => {
    const files = await filesApi.getByProject(projectId);
    set({ files });
  },

  createFile: async (data) => {
    const file = await filesApi.create(data);
    set((state) => ({ files: [...state.files, file] }));
    return file;
  },

  updateFile: async (id, content) => {
    await filesApi.update(id, { content });
    set((state) => ({
      files: state.files.map((f) => (f.id === id ? { ...f, content } : f)),
    }));
  },

  deleteFile: async (id) => {
    await filesApi.delete(id);
    set((state) => ({ files: state.files.filter((f) => f.id !== id) }));
  },
}));
