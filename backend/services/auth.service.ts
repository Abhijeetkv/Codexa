import axios from "axios";
import prisma from "../lib/prisma.js";
import { signJwt } from "../utils/jwt.js";
import { Response } from "express";

export const githubOAuth = {
  // Controller-level helper (OK to keep here for now)
  redirect(res: Response) {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      scope: "read:user user:email",
    });

    res.redirect(
      `https://github.com/login/oauth/authorize?${params.toString()}`
    );
  },

  async handleCallback(code: string) {
    // 1️⃣ Exchange code → access token
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken: string = tokenRes.data.access_token;

    // 2️⃣ Fetch GitHub user
    const { data: githubUser } = await axios.get(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Normalize GitHub response
    const githubId = githubUser.id.toString(); // ✅ MUST be string
    const username = githubUser.login;
    const avatarUrl = githubUser.avatar_url;
    const email = githubUser.email ?? null;

    // 3️⃣ Find or create user
    const user = await prisma.user.upsert({
      where: { githubId },
      update: {
        avatarUrl,
        accessToken, // optional but useful
      },
      create: {
        githubId,
        username,
        email,
        avatarUrl,
        accessToken,
      },
    });

    // 4️⃣ Create JWT
    const token = signJwt({
      userId: user.id,
      githubId: user.githubId,
    });

    return {
      token,
      user,
    };
  },
};
