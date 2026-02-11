import { Request, Response } from "express";
import { githubOAuth } from "../services/auth.service.js";

export const githubLogin = (_req: Request, res: Response) => {
  githubOAuth.redirect(res);
};

export const githubCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ message: "Missing code" });
  }

  const result = await githubOAuth.handleCallback(code as string);

  res.json({
    success: true,
    token: result.token,
    user: result.user,
  });
};
