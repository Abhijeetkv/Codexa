import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import fileRoutes from "./routes/file.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import githubRoutes from "./routes/github.routes.js";

const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/github", githubRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Codexa API is running", version: "1.0.0" });
});

// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(env.PORT, () => {
  console.log(`🚀 Codexa API running on http://localhost:${env.PORT}`);
});
