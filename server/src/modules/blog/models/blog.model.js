import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "", trim: true },
    content: { type: String, default: "" },
    coverImage: { type: String, default: "", trim: true },
    category: { type: String, default: "General", trim: true },
    tags: { type: [String], default: [] },
    author: { type: String, default: "Admin", trim: true },
    published: { type: Boolean, default: false },
    readTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug from title on create
blogSchema.pre("validate", function (next) {
  if (this.isNew && this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .substring(0, 100);
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
