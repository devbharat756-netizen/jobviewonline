import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: BASE_URL,
});

// Centralized Request Interceptor: Attaches JWT Authorization token automatically
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("candidateToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Centralized Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("candidateToken");
    }
    return Promise.reject(error);
  }
);

// Freelance APIs
export const getFreelanceProjects = () => API.get("/freelance");
export const createFreelanceProject = (data) => API.post("/freelance", data);
export const updateFreelanceProject = (id, data) => API.put(`/freelance/${id}`, data);
export const deleteFreelanceProject = (id) => API.delete(`/freelance/${id}`);
export const togglePublishFreelance = (id) => API.patch(`/freelance/${id}/publish`);
export const approveFreelanceProject = (id) => API.patch(`/freelance/${id}/approve`);
export const rejectFreelanceProject = (id) => API.patch(`/freelance/${id}/reject`);


// Freelance Details, Apply APIs
export const getFreelanceProjectDetails = (id) => API.get(`/freelance/${id}`);
export const applyFreelance = (id, formData) => API.post(`/freelance/${id}/apply`, formData);

// Admin Freelance Applications APIs
export const getAdminFreelanceApplications = () => API.get("/freelance/admin/applications");
export const updateFreelanceApplicationStatus = (id, status) => API.put(`/freelance/admin/applications/${id}/status`, { status });
