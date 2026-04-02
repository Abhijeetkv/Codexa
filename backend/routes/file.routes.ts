import { Router } from "express";
import { optionalAuth } from "../middleware/auth.middleware.js";
import { fileController } from "../controllers/file.controller.js";

const router = Router();

router.use(optionalAuth);

router.post("/", fileController.create);
router.get("/project/:projectId", fileController.getByProject);
router.put("/:id", fileController.update);
router.delete("/:id", fileController.delete);

export default router;
