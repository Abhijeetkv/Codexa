import { Router } from "express";
import { optionalAuth } from "../middleware/auth.middleware.js";
import { aiController } from "../controllers/ai.controller.js";

const router = Router();

router.use(optionalAuth);

router.post("/chat", aiController.chat);
router.get("/sessions/:projectId", aiController.getSessions);

export default router;
