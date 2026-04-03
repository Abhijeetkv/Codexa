import client from "./client";

export const githubApi = {
  getRepos: () => client.get("/github/repos").then((r) => r.data),

  push: (data: {
    projectId: string;
    repoOwner?: string;
    repoName?: string;
    message?: string;
  }) => client.post("/github/push", data).then((r) => r.data),

  pull: (projectId: string) =>
    client.post("/github/pull", { projectId }).then((r) => r.data),

  importRepo: (owner: string, name: string) =>
    client.post("/github/import", { owner, name }).then((r) => r.data),
};
