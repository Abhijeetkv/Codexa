import axios from "axios";
import prisma from "../lib/prisma.js";

export const githubService = {
  async getUserRepos(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const { data } = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
      params: {
        sort: "updated",
        per_page: 50,
      },
    });

    return data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      owner: repo.owner.login,
      description: repo.description,
      isPrivate: repo.private,
      defaultBranch: repo.default_branch,
      url: repo.html_url,
      language: repo.language,
      updatedAt: repo.updated_at,
    }));
  },

  async createRepo(userId: string, name: string, isPrivate: boolean = true) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const { data } = await axios.post(
      "https://api.github.com/user/repos",
      { name, private: isPrivate, auto_init: true },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    return data;
  },

  async pushFiles(
    userId: string,
    repoOwner: string,
    repoName: string,
    files: { path: string; content: string }[],
    message: string = "Update from Codexa IDE"
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
      Accept: "application/vnd.github.v3+json",
    };

    // Get the default branch ref
    const { data: refData } = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/main`,
      { headers }
    ).catch(() =>
      axios.get(
        `https://api.github.com/repos/${repoOwner}/${repoName}/git/ref/heads/master`,
        { headers }
      )
    );

    const latestCommitSha = refData.object.sha;

    // Get the tree of the latest commit
    const { data: commitData } = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/git/commits/${latestCommitSha}`,
      { headers }
    );

    // Create blobs for each file
    const tree = await Promise.all(
      files.map(async (file) => {
        const { data: blob } = await axios.post(
          `https://api.github.com/repos/${repoOwner}/${repoName}/git/blobs`,
          { content: file.content, encoding: "utf-8" },
          { headers }
        );
        return {
          path: file.path,
          mode: "100644" as const,
          type: "blob" as const,
          sha: blob.sha,
        };
      })
    );

    // Create a new tree
    const { data: newTree } = await axios.post(
      `https://api.github.com/repos/${repoOwner}/${repoName}/git/trees`,
      { base_tree: commitData.tree.sha, tree },
      { headers }
    );

    // Create a new commit
    const { data: newCommit } = await axios.post(
      `https://api.github.com/repos/${repoOwner}/${repoName}/git/commits`,
      {
        message,
        tree: newTree.sha,
        parents: [latestCommitSha],
      },
      { headers }
    );

    // Update the reference
    const branch = refData.ref.split("/").pop();
    await axios.patch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/git/refs/heads/${branch}`,
      { sha: newCommit.sha },
      { headers }
    );

    return { sha: newCommit.sha, message };
  },

  async getRepoContents(
    userId: string,
    repoOwner: string,
    repoName: string,
    path: string = ""
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const { data } = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    return data;
  },

  async importRepo(
    userId: string,
    repoOwner: string,
    repoName: string
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
      Accept: "application/vnd.github.v3+json",
    };

    // Get repo info
    const { data: repoInfo } = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}`,
      { headers }
    );

    // Create project
    const project = await prisma.project.create({
      data: {
        name: repoName,
        description: repoInfo.description,
        userId,
        isGuest: false,
      },
    });

    // Create repository link
    await prisma.repository.create({
      data: {
        githubRepoId: repoInfo.id.toString(),
        name: repoName,
        owner: repoOwner,
        defaultBranch: repoInfo.default_branch,
        projectId: project.id,
      },
    });

    // Recursively fetch and create files
    await this.importFiles(userId, repoOwner, repoName, "", project.id, headers);

    return prisma.project.findUnique({
      where: { id: project.id },
      include: { files: true, repository: true },
    });
  },

  async importFiles(
    userId: string,
    repoOwner: string,
    repoName: string,
    path: string,
    projectId: string,
    headers: any
  ) {
    const { data: contents } = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`,
      { headers }
    );

    for (const item of Array.isArray(contents) ? contents : [contents]) {
      if (item.type === "dir") {
        await prisma.file.create({
          data: {
            projectId,
            path: item.path,
            name: item.name,
            isDirectory: true,
          },
        });
        await this.importFiles(userId, repoOwner, repoName, item.path, projectId, headers);
      } else if (item.type === "file" && item.size < 500000) {
        // Skip files larger than 500KB
        let content = "";
        try {
          const { data: fileData } = await axios.get(item.download_url);
          content = typeof fileData === "string" ? fileData : JSON.stringify(fileData, null, 2);
        } catch {
          content = "// Failed to fetch file content";
        }

        const ext = item.name.includes(".") ? item.name.split(".").pop() : null;

        await prisma.file.create({
          data: {
            projectId,
            path: item.path,
            name: item.name,
            content,
            extension: ext || null,
            isDirectory: false,
          },
        });
      }
    }
  },
};
