import client from "./client";

export const aiApi = {
  chat: (message: string, projectId?: string) =>
    client
      .post("/ai/chat", { message, projectId })
      .then((r) => r.data),

  getSessions: (projectId: string) =>
    client.get(`/ai/sessions/${projectId}`).then((r) => r.data),
};
