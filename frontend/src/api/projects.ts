import client from "./client";

export interface Project {
  id: string;
  name: string;
  description?: string;
  isGuest: boolean;
  userId?: string;
  guestSessionId?: string;
  createdAt: string;
  updatedAt: string;
  files?: FileItem[];
  repository?: any;
  _count?: { files: number };
}

export interface FileItem {
  id: string;
  projectId: string;
  path: string;
  name: string;
  extension?: string;
  content?: string;
  isDirectory: boolean;
  createdAt: string;
  updatedAt: string;
}

export const projectsApi = {
  create: (data: { name: string; description?: string }) =>
    client.post<Project>("/projects", data).then((r) => r.data),

  list: () => client.get<Project[]>("/projects").then((r) => r.data),

  getById: (id: string) =>
    client.get<Project>(`/projects/${id}`).then((r) => r.data),

  update: (id: string, data: { name?: string; description?: string }) =>
    client.put<Project>(`/projects/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    client.delete(`/projects/${id}`).then((r) => r.data),

  migrate: (id: string) =>
    client.post<Project>(`/projects/${id}/migrate`).then((r) => r.data),
};
