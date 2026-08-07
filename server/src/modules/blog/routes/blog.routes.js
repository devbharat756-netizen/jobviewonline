import { Router } from "express";
import multer from "multer";
import { uploadToCloudinary } from "../../../utils/cloudinary.js";
import {
  createBlog,
  getBlogs,
  getBlogBySlug,
  getBlogById,
  updateBlog,
  deleteBlog,
  togglePublish,
  requireAdmin,
} from "../controllers/blog.controller.js";
import {
  getBlogCategories,
  createBlogCategory,
  deleteBlogCategory,
} from "../controllers/blogCategory.controller.js";

const storage = multer.memoryStorage();
const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images (JPEG, PNG, WebP) are allowed."), false);
    }
  }
}).single("image");

const router = Router();

// Public routes
router.get("/categories", getBlogCategories);
router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

// Admin routes (protected by x-admin-secret header)
router.post("/", requireAdmin, createBlog);
router.post("/upload-image", requireAdmin, uploadImage, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded." });
    }
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      "jobviewonline/blogs",
      "image"
    );
    return res.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error("Image upload error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/admin/:id", requireAdmin, getBlogById);
router.put("/:id", requireAdmin, updateBlog);
router.delete("/:id", requireAdmin, deleteBlog);
router.patch("/:id/publish", requireAdmin, togglePublish);

// Blog category admin routes
router.post("/categories", requireAdmin, createBlogCategory);
router.delete("/categories/:id", requireAdmin, deleteBlogCategory);

export default router;
