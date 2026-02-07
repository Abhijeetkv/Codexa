import express from "express";
import prisma from "./lib/prisma.js";

const app = express();

app.get("/", (_req, res) => {
  res.send("Hello, world!");
});

app.get("/test-db", async (_req, res) => {
  const result = await prisma.$queryRaw`SELECT 1`;
  res.json({ ok: true, result });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
