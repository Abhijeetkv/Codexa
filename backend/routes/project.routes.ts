import { Router } from "express";
import { optionalAuth } from "../middleware/auth.middleware.js";
import { projectController } from "../controllers/project.controller.js";

const router = Router();

router.use(optionalAuth);

router.post("/", projectController.create);
router.get("/", projectController.list);
router.get("/:id", projectController.getById);
router.put("/:id", projectController.update);
router.delete("/:id", projectController.delete);
router.post("/:id/migrate", projectController.migrate);

export default router;
