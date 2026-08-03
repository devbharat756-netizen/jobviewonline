import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: BASE_URL,
});

// Callback for automatic 401 redirection and global state cleanup
let logoutHandler = null;
export const registerLogoutHandler = (callback) => {
  logoutHandler = callback;
};

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

// Centralized Response Interceptor: Intercepts 401 and triggers global auth cleanup
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("candidateToken");
      if (logoutHandler) {
        logoutHandler();
      }
    }
    return Promise.reject(error);
  }
);

// General Jobs APIs
export const getJobs = () => API.get("/jobs");
export const createJob = (data) => API.post("/jobs", data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const togglePublish = (id) => API.patch(`/jobs/${id}/publish`);
export const approveJob = (id) => API.patch(`/jobs/${id}/approve`);
export const rejectJob = (id) => API.patch(`/jobs/${id}/reject`);


// Job Details, Apply and Save APIs
export const getJobDetails = (id) => API.get(`/jobs/${id}`);
export const applyJob = (id, formData) => API.post(`/jobs/${id}/apply`, formData);
export const toggleSaveJob = (id) => API.post(`/jobs/${id}/save`);

// Candidate saved and applied list APIs
export const getSavedJobs = () => API.get("/jobs/saved");
export const getAppliedJobs = () => API.get("/jobs/applied");

// Admin Applications APIs
export const getAdminApplications = () => API.get("/jobs/admin/applications");
export const updateApplicationStatus = (id, status) => API.put(`/jobs/admin/applications/${id}/status`, { status });

// Recruiter APIs
export const getRecruiterListings = () => API.get("/jobs/recruiter/listings");
export const getRecruiterApplications = () => API.get("/jobs/recruiter/applications");
export const updateApplicationStatusByRecruiter = (id, status) => API.put(`/jobs/recruiter/applications/${id}/status`, { status });
export const getResumeProxyUrl = (cloudinaryUrl, publicId) => {
  if (!cloudinaryUrl) return "";
  if (cloudinaryUrl.includes("/resume-proxy")) {
    return cloudinaryUrl;
  }
  let base = `${BASE_URL}/jobs/resume-proxy?url=${encodeURIComponent(cloudinaryUrl)}`;
  if (publicId) {
    base += `&publicId=${encodeURIComponent(publicId)}`;
  }
  return base;
};

// Newsletter subscription
export const subscribeNewsletter = (email) => API.post("/auth/newsletter/subscribe", { email });
export const getNewsletterSubscribers = () => API.get("/auth/newsletter/subscribers");
export const deleteNewsletterSubscriber = (id) => API.delete(`/auth/newsletter/subscribers/${id}`);

// Authentication & Profile APIs
export const signupCandidate = (data) => API.post("/auth/candidate/signup", data);
export const loginCandidate = (data) => API.post("/auth/candidate/login", data);
export const getMe = () => API.get("/auth/me");
export const updateProfile = (formData) => API.put("/auth/profile", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Backward compatibility helper
// export const authenticateCandidate = (data) => {
//   return API.post("/auth/candidate/login-or-register", data);
// };