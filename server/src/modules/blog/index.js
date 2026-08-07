import { Router } from "express";
import blogRoutes from "./routes/blog.routes.js";
const router = Router();
router.use("/", blogRoutes);
export default router;
