import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.js";

interface JwtPayload {
  userId: string;
  githubId: string;
}

/**
 * requireAuth — Blocks unauthenticated requests (for GitHub operations)
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Authentication required",
      message: "Please login with GitHub to perform this action.",
      loginRequired: true,
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyJwt(token) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    res.status(401).json({
      error: "Invalid or expired token",
      message: "Please login again.",
      loginRequired: true,
    });
    return;
  }
}

/**
 * optionalAuth — Attaches user if token present, but does NOT block guests
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const payload = verifyJwt(token) as JwtPayload;
      req.user = payload;
    } catch {
      // Invalid token — continue as guest
      req.user = undefined;
    }
  }

  next();
}
