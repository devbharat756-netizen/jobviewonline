import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { HiClock, HiEye, HiTag, HiMagnifyingGlass, HiArrowRight, HiDocumentText } from "react-icons/hi2";
import SEO from "@components/common/SEO";
import Banner300x250 from "@components/common/Banner300x250";
import { getBlogs, getBlogCategories } from "../services/blogService";

function BlogCard({ blog }) {
  return (
    <article className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800/60 overflow-hidden hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/30 transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <Link to={`/blog/${blog.slug}`} className="block overflow-hidden aspect-[16/9] bg-gray-100 dark:bg-slate-800">
        {blog.coverImage ? (
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HiDocumentText className="w-16 h-16 text-gray-300 dark:text-slate-700" />
          </div>
        )}
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-primary-600 dark:text-sky-400 bg-primary-50 dark:bg-sky-900/20 px-2.5 py-1 rounded-full">
            {blog.category}
          </span>
        </div>
        <Link to={`/blog/${blog.slug}`}>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
            {blog.title}
          </h2>
        </Link>
        <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3 flex-1">
          {blog.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-800 mt-auto">
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-slate-500">
            <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" />{blog.readTime} min read</span>
            <span className="flex items-center gap-1"><HiEye className="w-3.5 h-3.5" />{blog.views || 0}</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-slate-500">
            {new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

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
      const params = { page, limit: 6 };
      if (activeCategory !== "All") params.category = activeCategory;
      if (search.trim()) params.search = search.trim();
      const res = await getBlogs(params);
      setBlogs(res.data.data || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error(err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory, search]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchBlogs(); };

  return (
    <>
      <SEO path="/blog" description="viewjob Blog — Career tips, industry news, job search advice and more." />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-955 pt-4 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center py-6">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              Our Blog
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-xl mx-auto">
              Latest career tips, industry insights, and updates from the viewjob team.
            </p>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6 flex gap-2">
            <div className="relative flex-1">
              <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm placeholder-gray-450 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button type="submit" className="gradient-btn text-white px-5 py-2 rounded-xl font-semibold text-sm">Search</button>
          </form>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {["All", ...categories.map(c => c.name)].map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-primary-600 text-white shadow-md shadow-primary-500/20"
                    : "bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-400 border border-gray-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-sky-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-col xl:flex-row gap-8">
            {/* Blog grid */}
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 animate-pulse">
                      <div className="aspect-[16/9] bg-gray-200 dark:bg-slate-800" />
                      <div className="p-6 space-y-3">
                        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
                        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
                        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-4/6" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center py-24">
                  <HiDocumentText className="w-16 h-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No posts found</h3>
                  <p className="text-gray-500 dark:text-slate-400">Try a different search or category.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-slate-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        Previous
                      </button>
                      <span className="text-sm text-gray-500 dark:text-slate-400 px-3">Page {page} of {pagination.pages}</span>
                      <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}
                        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-medium text-gray-600 dark:text-slate-400 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden xl:block w-[300px] flex-shrink-0">
              <div className="sticky top-6 space-y-6">
                <Banner300x250 />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}