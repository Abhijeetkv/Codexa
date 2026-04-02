import client from "./client";
import type { FileItem } from "./projects";

export const filesApi = {
  create: (data: {
    projectId: string;
    path: string;
    name: string;
    content?: string;
    isDirectory?: boolean;
  }) => client.post<FileItem>("/files", data).then((r) => r.data),

  getByProject: (projectId: string) =>
    client.get<FileItem[]>(`/files/project/${projectId}`).then((r) => r.data),

  update: (id: string, data: { content?: string; name?: string; path?: string }) =>
    client.put<FileItem>(`/files/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    client.delete(`/files/${id}`).then((r) => r.data),
};
