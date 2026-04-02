import { Request, Response } from "express";
import { aiService } from "../services/ai.service.js";

export const aiController = {
  async chat(req: Request, res: Response) {
    try {
      const { message, projectId } = req.body;

      if (!message) {
        res.status(400).json({ error: "Message is required" });
        return;
      }

      // Get or create chat session if projectId is provided
      let chatSessionId: string | undefined;
      if (projectId) {
        const session = await aiService.getOrCreateSession(projectId);
        chatSessionId = session.id;

        // Save user message
        await aiService.saveChatMessage(chatSessionId, "USER", message);
      }

      // Get AI response
      const response = await aiService.chat(message, projectId);

      // Save assistant response
      if (chatSessionId) {
        await aiService.saveChatMessage(chatSessionId, "ASSISTANT", response.content);
      }

      res.json({
        ...response,
        chatSessionId,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSessions(req: Request, res: Response) {
    try {
      const { projectId } = req.params;
      const sessions = await aiService.getChatSessions(projectId);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};
