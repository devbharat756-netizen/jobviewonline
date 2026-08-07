import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const ADMIN_SECRET = import.meta.env.VITE_ADMIN_SECRET || "viewjob_admin_2024";

const API = axios.create({ baseURL: BASE_URL });

const adminHeaders = () => ({ headers: { "x-admin-secret": ADMIN_SECRET } });

// Public
export const getBlogs = (params = {}) => API.get("/blogs", { params });
export const getBlogBySlug = (slug) => API.get(`/blogs/${slug}`);

// Admin
export const getAllBlogsAdmin = (params = {}) =>
  API.get("/blogs", { params: { ...params, all: "true" }, ...adminHeaders() });
export const getBlogByIdAdmin = (id) =>
  API.get(`/blogs/admin/${id}`, adminHeaders());
export const createBlog = (data) => API.post("/blogs", data, adminHeaders());
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data, adminHeaders());
export const deleteBlog = (id) => API.delete(`/blogs/${id}`, adminHeaders());
export const togglePublishBlog = (id) => API.patch(`/blogs/${id}/publish`, {}, adminHeaders());
export const uploadBlogImage = (formData) =>
  API.post("/blogs/upload-image", formData, {
    headers: {
      ...adminHeaders().headers,
      "Content-Type": "multipart/form-data",
    },
  });

export const getBlogCategories = () => API.get("/blogs/categories");
export const createBlogCategory = (name) => API.post("/blogs/categories", { name }, adminHeaders());
export const deleteBlogCategory = (id) => API.delete(`/blogs/categories/${id}`, adminHeaders());
