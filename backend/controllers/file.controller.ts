import { Request, Response } from "express";
import { fileService } from "../services/file.service.js";

export const fileController = {
  async create(req: Request, res: Response) {
    try {
      const { projectId, path, name, content, isDirectory } = req.body;

      if (!projectId || !path || !name) {
        res.status(400).json({ error: "projectId, path, and name are required" });
        return;
      }

      const file = await fileService.create({
        projectId,
        path,
        name,
        content,
        isDirectory,
      });

      res.status(201).json(file);
    } catch (error: any) {
      if (error.code === "P2002") {
        res.status(409).json({ error: "File already exists at this path" });
        return;
      }
      res.status(500).json({ error: error.message });
    }
  },

  async getByProject(req: Request, res: Response) {
    try {
      const files = await fileService.getByProject(req.params.projectId);
      res.json(files);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const { content, name, path } = req.body;
      const file = await fileService.update(req.params.id, { content, name, path });
      res.json(file);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await fileService.delete(req.params.id);
      res.json({ message: "File deleted" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
