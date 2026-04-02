import { Router } from "express";
import { githubOAuth } from "../services/auth.service.js";
import { env } from "../config/env.js";
import prisma from "../lib/prisma.js";
import { verifyJwt } from "../utils/jwt.js";

const router = Router();

// Redirect to GitHub OAuth
router.get("/github", (_req, res) => {
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    scope: "read:user user:email repo",
    redirect_uri: env.GITHUB_CALLBACK_URL,
  });

  res.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
});

// GitHub OAuth callback — redirects to frontend with token
router.get("/github/callback", async (req, res) => {
  const code = req.query.code as string;

  if (!code) {
    res.redirect(`${env.FRONTEND_URL}?error=missing_code`);
    return;
  }

  try {
    const result = await githubOAuth.handleCallback(code);

    // Redirect to frontend with token in URL
    res.redirect(
      `${env.FRONTEND_URL}/auth/callback?token=${result.token}&userId=${result.user.id}`
    );
  } catch (error: any) {
    res.redirect(`${env.FRONTEND_URL}?error=auth_failed`);
  }
});

// Get current user from JWT
router.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = verifyJwt(token) as { userId: string; githubId: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        githubId: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json(user);
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
