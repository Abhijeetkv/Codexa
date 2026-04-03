import client from "./client";

export const authApi = {
  getMe: () => client.get("/auth/me").then((r) => r.data),

  getGitHubLoginUrl: () => {
    return `/api/auth/github`;
  },
};
