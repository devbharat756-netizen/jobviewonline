import express from "express";
import cors from "cors";
import morgan from "morgan";

import jobRoutes from "./modules/job/index.js";
import freelanceRoutes from "./modules/job/routes/freelance.routes.js";
import userRoutes from "./modules/user/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "JobView Backend Running 🚀",
  });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/freelance", freelanceRoutes);
app.use("/api/auth", userRoutes);

export default app;