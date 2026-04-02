import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { githubController } from "../controllers/github.controller.js";

const router = Router();

// ALL GitHub routes require authentication
router.use(requireAuth);

router.get("/repos", githubController.listRepos);
router.post("/push", githubController.push);
router.post("/pull", githubController.pull);
router.post("/import", githubController.importRepo);

export default router;
