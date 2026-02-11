import { Router } from "express";
import { githubOAuth } from "../services/auth.service.js";

const router = Router();

router.get("/github", (req, res) => {
  githubOAuth.redirect(res);
});

router.get("/github/callback", async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  const result = await githubOAuth.handleCallback(code);

  res.json(result);
});

export default router;
