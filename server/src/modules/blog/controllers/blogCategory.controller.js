import BlogCategory from "../models/blogCategory.model.js";

// GET /api/blogs/categories
export const getBlogCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find().sort({ name: 1 });
    return res.json({ success: true, data: categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/blogs/categories (admin requireAdmin)
export const createBlogCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required." });
    }

    const exists = await BlogCategory.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (exists) {
      return res.status(400).json({ success: false, message: "Category already exists." });
    }

    const category = await BlogCategory.create({ name });
    return res.status(201).json({ success: true, data: category });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/blogs/categories/:id (admin requireAdmin)
export const deleteBlogCategory = async (req, res) => {
  try {
    const category = await BlogCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }
    return res.json({ success: true, message: "Category deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
