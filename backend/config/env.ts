import "dotenv/config";

const required = ["DATABASE_URL", "JWT_SECRET"];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
});

export const env = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
  GITHUB_CALLBACK_URL:
    process.env.GITHUB_CALLBACK_URL ||
    "http://localhost:3000/api/auth/github/callback",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};
