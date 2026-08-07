import Blog from "../models/blog.model.js";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "viewjob_admin_2024";

// Middleware: verify admin secret header
export const requireAdmin = (req, res, next) => {
  const secret = req.headers["x-admin-secret"];
  if (secret !== ADMIN_SECRET) {
    return res.status(403).json({ success: false, message: "Admin access denied." });
  }
  next();
};

// Calc read time from word count (~200 wpm)
const calcReadTime = (content = "") => {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

// Generate a unique slug
const makeSlug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100);

// POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, category, tags, author, published, createdAt } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title is required." });

    let slug = makeSlug(title);
    // Ensure uniqueness
    const exists = await Blog.findOne({ slug });
    if (exists) slug = `${slug}-${Date.now()}`;

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map((t) => t.trim()) : []),
      author: author || "Admin",
      published: published !== undefined ? published : false,
      readTime: calcReadTime(content),
      ...(createdAt && { createdAt }),
    });

    return res.status(201).json({ success: true, data: blog });
  } catch (err) {
    console.error("createBlog error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/blogs
export const getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 6, category, tag, search, all } = req.query;
    const filter = {};

    // Admin listing (all=true) skips published filter
    if (all !== "true") filter.published = true;
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };
    if (search) filter.title = { $regex: search, $options: "i" };

    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .select("-content"); // exclude full content for listing

    return res.json({
      success: true,
      data: blogs,
      pagination: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/blogs/:slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) return res.status(404).json({ success: false, message: "Blog post not found." });

    // Increment views (fire-and-forget)
    Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } }).catch(() => {});

    return res.json({ success: true, data: blog });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/blogs/admin/:id  (admin — returns unpublished too)
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog post not found." });
    return res.json({ success: true, data: blog });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, category, tags, author, published, createdAt } = req.body;
    const update = {
      excerpt, content, coverImage, category, author,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map((t) => t.trim()) : []),
      readTime: calcReadTime(content),
      ...(createdAt && { createdAt }),
    };
    if (title) {
      update.title = title;
    }
    if (published !== undefined) update.published = published;

    const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!blog) return res.status(404).json({ success: false, message: "Blog post not found." });

    return res.json({ success: true, data: blog });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog post not found." });
    return res.json({ success: true, message: "Blog post deleted." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/blogs/:id/publish
export const togglePublish = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog post not found." });
    blog.published = !blog.published;
    await blog.save();
    return res.json({ success: true, data: blog });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
