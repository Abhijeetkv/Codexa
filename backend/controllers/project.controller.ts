import { Request, Response } from "express";
import { projectService } from "../services/project.service.js";

export const projectController = {
  async create(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      if (!name) {
        res.status(400).json({ error: "Project name is required" });
        return;
      }

      const userId = req.user?.userId;
      const guestSessionId = (req.headers["x-guest-session-id"] as string) || undefined;

      if (!userId && !guestSessionId) {
        res.status(400).json({ error: "Either login or provide a guest session ID" });
        return;
      }

      const project = await projectService.create({
        name,
        description,
        userId,
        guestSessionId,
      });

      res.status(201).json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async list(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const guestSessionId = req.headers["x-guest-session-id"] as string;

      const projects = await projectService.list(userId, guestSessionId);
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const project = await projectService.getById(req.params.id);

      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { name, description } = req.body;
      const project = await projectService.update(req.params.id, { name, description });
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await projectService.delete(req.params.id);
      res.json({ message: "Project deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async migrate(req: Request, res: Response) {
    try {
      if (!req.user?.userId) {
        res.status(401).json({ error: "Login required to migrate project" });
        return;
      }

      const project = await projectService.migrateToUser(
        req.params.id,
        req.user.userId
      );
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
