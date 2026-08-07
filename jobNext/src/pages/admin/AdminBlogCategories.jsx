import { useState, useEffect } from "react";
import { HiPlus, HiTrash } from "react-icons/hi2";
import { useToast } from "@context/ToastContext";
import Modal from "@components/common/Modal";
import { getBlogCategories, createBlogCategory, deleteBlogCategory } from "../../services/blogService";

export default function AdminBlogCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameInput, setNameInput] = useState("");
  const [adding, setAdding] = useState(false);
  const { addToast } = useToast();

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getBlogCategories();
      if (res.data.success) {
        setCategories(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to fetch blog categories.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setAdding(true);
    try {
      const res = await createBlogCategory(nameInput.trim());
      if (res.data.success) {
        addToast("Category created successfully!", "success");
        setCategories((prev) => [...prev, res.data.data].sort((a, b) => a.name.localeCompare(b.name)));
        setNameInput("");
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to create category.", "error");
    } finally {
      setAdding(false);
    }
  };

  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await deleteBlogCategory(deleteTargetId);
      if (res.data.success) {
        addToast("Category deleted successfully.", "success");
        setCategories((prev) => prev.filter((c) => c._id !== deleteTargetId));
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to delete category.", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100">Blog Categories</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage categories used for grouping blog posts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-white">Add New Category</h2>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Category Name</label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Remote Work"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-sm bg-white dark:bg-slate-955 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <button
              type="submit"
              disabled={adding || !nameInput.trim()}
              className="w-full gradient-btn text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <HiPlus className="w-4 h-4" />
              {adding ? "Adding..." : "Add Category"}
            </button>
          </form>
        </div>

        {/* Right Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/80 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm text-gray-500 dark:text-slate-400">No blog categories found. Create one on the left.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-800 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase bg-gray-50 dark:bg-slate-900/50">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-850">
                  {categories.map((c) => (
                    <tr key={c._id} className="text-gray-700 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{c.name}</td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-slate-400">{c.slug}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => requestDelete(c._id)}
                          className="p-2 text-gray-500 hover:text-red-650 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                          title="Delete Category"
                        >
                          <HiTrash className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Delete Category"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-550 dark:text-slate-400">
            Are you sure you want to delete this blog category? This action cannot be undone.
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