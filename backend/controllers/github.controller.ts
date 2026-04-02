import { Request, Response } from "express";
import { githubService } from "../services/github.service.js";
import prisma from "../lib/prisma.js";

export const githubController = {
  async listRepos(req: Request, res: Response) {
    try {
      const repos = await githubService.getUserRepos(req.user!.userId);
      res.json(repos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async push(req: Request, res: Response) {
    try {
      const { projectId, repoOwner, repoName, message } = req.body;

      if (!projectId) {
        res.status(400).json({ error: "projectId is required" });
        return;
      }

      // Get project files
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { files: true, repository: true },
      });

      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      const owner = repoOwner || project.repository?.owner;
      const name = repoName || project.repository?.name;

      if (!owner || !name) {
        // Create a new repo if no repo is linked
        const newRepo = await githubService.createRepo(
          req.user!.userId,
          project.name,
          project.isPrivate
        );

        // Link repo to project
        await prisma.repository.create({
          data: {
            githubRepoId: newRepo.id.toString(),
            name: newRepo.name,
            owner: newRepo.owner.login,
            defaultBranch: newRepo.default_branch,
            projectId: project.id,
          },
        });

        // Push files
        const filesToPush = project.files
          .filter((f) => !f.isDirectory && f.content)
          .map((f) => ({ path: f.path, content: f.content! }));

        if (filesToPush.length > 0) {
          const result = await githubService.pushFiles(
            req.user!.userId,
            newRepo.owner.login,
            newRepo.name,
            filesToPush,
            message || "Initial commit from Codexa IDE"
          );
          res.json({ success: true, ...result, repo: newRepo.html_url });
          return;
        }

        res.json({ success: true, repo: newRepo.html_url, message: "Repository created (no files to push)" });
        return;
      }

      // Push to existing repo
      const filesToPush = project.files
        .filter((f) => !f.isDirectory && f.content)
        .map((f) => ({ path: f.path, content: f.content! }));

      const result = await githubService.pushFiles(
        req.user!.userId,
        owner,
        name,
        filesToPush,
        message || "Update from Codexa IDE"
      );

      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async pull(req: Request, res: Response) {
    try {
      const { projectId } = req.body;

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { repository: true },
      });

      if (!project?.repository) {
        res.status(400).json({ error: "No repository linked to this project" });
        return;
      }

      // Fetch latest content
      const contents = await githubService.getRepoContents(
        req.user!.userId,
        project.repository.owner,
        project.repository.name
      );

      res.json({ success: true, contents });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async importRepo(req: Request, res: Response) {
    try {
      const { owner, name } = req.body;

      if (!owner || !name) {
        res.status(400).json({ error: "owner and name are required" });
        return;
      }

      const project = await githubService.importRepo(
        req.user!.userId,
        owner,
        name
      );

      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
