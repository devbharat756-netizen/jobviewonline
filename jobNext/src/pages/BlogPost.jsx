import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { HiClock, HiEye, HiCalendar, HiArrowLeft, HiChevronRight, HiDocumentText } from "react-icons/hi2";
import SEO from "@components/common/SEO";
import Banner300x250 from "@components/common/Banner300x250";
import { getBlogBySlug, getBlogs } from "../services/blogService";

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBlogBySlug(slug);
        setBlog(res.data.data);
        
        // Fetch recent blogs for the sidebar
        const recentRes = await getBlogs({ page: 1, limit: 3 });
        // Filter out current post
        const filtered = (recentRes.data.data || []).filter(b => b.slug !== slug);
        setRecentBlogs(filtered);
      } catch (err) {
        console.error(err);
        setError("Article not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-12 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-slate-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-12 pb-16">
        <div className="max-w-3xl mx-auto px-4 text-center py-20">
          <HiDocumentText className="w-16 h-16 text-gray-300 dark:text-slate-700 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{error || "Article not found"}</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6">The article you are looking for might have been removed or renamed.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary-600 dark:text-sky-400 font-semibold hover:underline">
            <HiArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        path={`/blog/${blog.slug}`} 
        title={`${blog.title} | viewjob Blog`} 
        description={blog.excerpt || "Read the latest article on viewjob."}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-4 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 mb-6">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-sky-400">Home</Link>
            <HiChevronRight className="w-3.5 h-3.5" />
            <Link to="/blog" className="hover:text-primary-600 dark:hover:text-sky-400">Blog</Link>
            <HiChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 dark:text-white truncate max-w-xs">{blog.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Article Content */}
            <article className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800/60 p-6 sm:p-8 lg:p-10 shadow-sm min-w-0">
              
              {/* Category */}
              <span className="inline-block text-xs font-bold text-primary-600 dark:text-sky-400 bg-primary-50 dark:bg-sky-900/20 px-3 py-1.5 rounded-full mb-4">
                {blog.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                {blog.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-slate-400 pb-8 border-b border-gray-100 dark:border-slate-800/80 mb-8">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">{blog.author || "Admin"}</span>
                </div>
                <span className="text-gray-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1.5"><HiCalendar className="w-4 h-4" />{new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span className="text-gray-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1.5"><HiClock className="w-4 h-4" />{blog.readTime} min read</span>
                <span className="text-gray-300 dark:text-slate-700">•</span>
                <span className="flex items-center gap-1.5"><HiEye className="w-4 h-4" />{blog.views || 0} views</span>
              </div>

              {/* Cover Image */}
              {blog.coverImage && (
                <div className="rounded-2xl overflow-hidden mb-8 aspect-[21/9] bg-gray-150 dark:bg-slate-800">
                  <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Body Content */}
              <div 
                className="prose prose-slate dark:prose-invert max-w-none text-gray-700 dark:text-slate-300 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mr-2">Tags:</span>
                  {blog.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium text-gray-600 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Back to Blog */}
              <div className="mt-12 pt-6 border-t border-gray-100 dark:border-slate-800">
                <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-sky-400 font-bold hover:underline">
                  <HiArrowLeft className="w-4 h-4" /> Back to all articles
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0 space-y-6">
              {/* Sidebar Ad */}
              <Banner300x250 />

              {/* Recent Articles */}
              {recentBlogs.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-gray-100 dark:border-slate-800/60 shadow-sm">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Articles</h3>
                  <div className="space-y-4">
                    {recentBlogs.map((b) => (
                      <div key={b._id} className="group">
                        <Link to={`/blog/${b.slug}`} className="block">
                          <p className="text-xs text-primary-600 dark:text-sky-400 font-semibold uppercase tracking-wider mb-1">{b.category}</p>
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                            {b.title}
                          </h4>
                          <span className="text-[11px] text-gray-400 dark:text-slate-500 block mt-1">
                            {new Date(b.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

        </div>
      </div>
    </>
  );
}
