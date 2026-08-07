import { useState, useEffect, useCallback, useRef } from "react";
import { 
  HiPlus, HiPencilSquare, HiTrash, HiEye, HiEyeSlash, 
  HiXMark, HiMagnifyingGlass, HiDocumentText, HiCalendar,
  HiArrowUpTray
} from "react-icons/hi2";
import { useToast } from "@context/ToastContext";
import Modal from "@components/common/Modal";
import EmptyState from "@components/common/EmptyState";
import { 
  getAllBlogsAdmin, createBlog, updateBlog, 
  deleteBlog, togglePublishBlog, uploadBlogImage,
  getBlogCategories
} from "../../services/blogService";

const getEmptyBlog = () => {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(now - tzOffset)).toISOString().slice(0, 16);
  return {
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "General",
    tags: "",
    author: "Admin",
    published: false,
    createdAt: localISOTime,
  };
};

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(getEmptyBlog());
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getBlogCategories();
      if (res.data.success) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch blog categories:", err);
    }
  }, []);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (categoryFilter !== "All") params.category = categoryFilter;
      if (search.trim()) params.search = search.trim();
      const res = await getAllBlogsAdmin(params);
      if (res.data.success) {
        setBlogs(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch blog posts.", "error");
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, search, addToast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleOpenCreate = () => {
    setForm(getEmptyBlog());
    if (categories.length > 0) {
      setForm(prev => ({ ...prev, category: categories[0].name }));
    }
    setEditingId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (blog) => {
    const date = blog.createdAt ? new Date(blog.createdAt) : new Date();
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(date - tzOffset)).toISOString().slice(0, 16);

    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      coverImage: blog.coverImage || "",
      category: blog.category || "General",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : (blog.tags || ""),
      author: blog.author || "Admin",
      published: blog.published || false,
      createdAt: localISOTime,
    });
    setEditingId(blog._id);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      addToast("Title is required", "warning");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : []
      };

      if (editingId) {
        const res = await updateBlog(editingId, payload);
        if (res.data.success) {
          addToast("Blog post updated successfully!", "success");
          setBlogs(prev => prev.map(b => b._id === editingId ? res.data.data : b));
          setModalOpen(false);
        }
      } else {
        const res = await createBlog(payload);
        if (res.data.success) {
          addToast("Blog post created successfully!", "success");
          setBlogs(prev => [res.data.data, ...prev]);
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to save blog post.", "error");
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await deleteBlog(deleteTargetId);
      if (res.data.success) {
        addToast("Blog post deleted successfully.", "success");
        setBlogs(prev => prev.filter(b => b._id !== deleteTargetId));
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to delete blog post.", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const res = await togglePublishBlog(id);
      if (res.data.success) {
        addToast(
          `Post ${res.data.data.published ? "published" : "unpublished"} successfully.`, 
          "success"
        );
        setBlogs(prev => prev.map(b => b._id === id ? { ...b, published: res.data.data.published } : b));
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to update publish status.", "error");
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      addToast("Please select a valid image file.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const res = await uploadBlogImage(formData);
      if (res.data.success) {
        setForm(prev => ({ ...prev, coverImage: res.data.url }));
        addToast("Image uploaded to Cloudinary successfully!", "success");
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to upload image to Cloudinary.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100">Blog Posts</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Create, edit, and publish blog articles</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <HiPlus className="w-4 h-4" />
          Create Post
        </button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm">
        <div className="relative flex-1">
          <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts by title..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-955 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-955 text-gray-705 dark:text-slate-355 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
          </select>
          <button onClick={fetchBlogs} className="gradient-btn-outline text-primary-600 dark:text-sky-400 px-4 py-2 rounded-xl text-sm font-semibold">
            Refresh
          </button>
        </div>
      </div>

      {/* Blogs List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Loading blog posts...</p>
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState
            title="No blog posts found"
            description="Get started by creating your very first article."
            icon={HiDocumentText}
            action={handleOpenCreate}
            actionText="Create Post"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-slate-800 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase bg-gray-50 dark:bg-slate-900/50">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Views</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-855">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="text-sm text-gray-700 dark:text-slate-355 hover:bg-gray-50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white max-w-xs truncate">
                      <div className="flex items-center gap-3">
                        {blog.coverImage && (
                          <img src={blog.coverImage} alt="" className="w-10 h-6 object-cover rounded bg-gray-100 dark:bg-slate-800" />
                        )}
                        <span className="truncate">{blog.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold">{blog.author}</td>
                    <td className="px-6 py-4 text-xs font-semibold">{blog.views || 0}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(blog._id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                          blog.published 
                            ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400" 
                            : "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {blog.published ? (
                          <><HiEye className="w-3.5 h-3.5" /> Published</>
                        ) : (
                          <><HiEyeSlash className="w-3.5 h-3.5" /> Draft</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 dark:text-slate-500">
                      <span className="flex items-center gap-1"><HiCalendar className="w-3.5 h-3.5" />{new Date(blog.createdAt).toLocaleDateString("en-IN")}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(blog)}
                          className="p-2 text-gray-500 hover:text-primary-600 dark:hover:text-sky-400 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                          title="Edit Post"
                        >
                          <HiPencilSquare className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => requestDelete(blog._id)}
                          className="p-2 text-gray-500 hover:text-red-650 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800"
                          title="Delete Post"
                        >
                          <HiTrash className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Blog Post" : "Create New Blog Post"}
        size="xl"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-955 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Post title..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-955 text-gray-750 dark:text-slate-350 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                {categories.map(cat => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Cover Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.coverImage}
                  onChange={e => setForm(prev => ({ ...prev, coverImage: e.target.value }))}
                  className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-955 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  placeholder="Paste URL or upload a file..."
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
                <button
                  type="button"
                  onClick={handleImageUploadClick}
                  disabled={uploading}
                  className="px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-gray-50 dark:bg-slate-955 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <HiArrowUpTray className="w-4.5 h-4.5" />
                  {uploading ? "Uploading..." : "Upload File"}
                </button>
              </div>
              {form.coverImage && (
                <div className="mt-3 relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-slate-800">
                  <img src={form.coverImage} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, coverImage: "" }))}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
                  >
                    <HiXMark className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={e => setForm(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-955 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="Author name..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-955 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                placeholder="interview, tips, tech"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Publish Date &amp; Time</label>
              <input
                type="datetime-local"
                value={form.createdAt}
                onChange={e => setForm(prev => ({ ...prev, createdAt: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-955 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Excerpt (Short Summary) *</label>
            <textarea
              required
              rows="2"
              value={form.excerpt}
              onChange={e => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-955 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="Brief summary showing on listing card..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Full Content (HTML support) *</label>
            <textarea
              required
              rows="8"
              value={form.content}
              onChange={e => setForm(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-955 text-gray-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              placeholder="<p>Full article body...</p>"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={form.published}
              onChange={e => setForm(prev => ({ ...prev, published: e.target.checked }))}
              className="w-4.5 h-4.5 rounded border-gray-300 dark:border-slate-700 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="published" className="text-sm font-semibold text-gray-705 dark:text-slate-355 select-none">
              Publish immediately (visible on public site)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-850">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-400 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Post"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Post"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-550 dark:text-slate-400">
            Are you sure you want to delete this blog post? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="px-4 py-2 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-450 rounded-xl text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}