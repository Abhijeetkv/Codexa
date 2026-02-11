import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
  
app.get("/", (_req, res) => {
  res.send("Hello, world!");
});


app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
