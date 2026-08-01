import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";
import {
  loginCandidate,
  signupCandidate,
  getMe,
  getSavedJobs,
  updateProfile as updateProfileApi,
  registerLogoutHandler,
} from "../services/jobService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Decoupled logout logic
  const logout = () => {
    localStorage.removeItem("candidateToken");
    localStorage.removeItem("savedJobs");
    setUser(null);
    addToast("Logged out successfully.", "success");
    navigate("/login");
  };

  // Register the Axios 401 response interceptor handler
  useEffect(() => {
    registerLogoutHandler(() => {
      localStorage.removeItem("candidateToken");
      localStorage.removeItem("savedJobs");
      setUser(null);
      addToast("Session expired. Please login again.", "error");
      navigate("/login");
    });

    return () => registerLogoutHandler(null);
  }, [navigate, addToast]);

  // Restore session on app startup
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("candidateToken");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMe();
        if (res.data.success) {
          setUser(res.data.user);
          // Sync saved jobs list from DB
          try {
            const savedRes = await getSavedJobs();
            if (savedRes.data.success) {
              const savedList = (savedRes.data.data || []).map(j => ({ id: j.id || j._id, savedAt: new Date().toISOString() }));
              localStorage.setItem("savedJobs", JSON.stringify(savedList));
            }
          } catch (err) {
            console.warn("Could not sync saved jobs list to localStorage:", err.message);
          }
        }
      } catch (err) {
        console.error("Failed to restore session:", err.message);
        localStorage.removeItem("candidateToken");
        localStorage.removeItem("savedJobs");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password, role) => {
    try {
      const res = await loginCandidate({ email, password, role });
      if (res.data.success) {
        localStorage.setItem("candidateToken", res.data.token);
        setUser(res.data.user);
        // Sync saved jobs list from DB
        try {
          const savedRes = await getSavedJobs();
          if (savedRes.data.success) {
            const savedList = (savedRes.data.data || []).map(j => ({ id: j.id || j._id, savedAt: new Date().toISOString() }));
            localStorage.setItem("savedJobs", JSON.stringify(savedList));
          }
        } catch (err) {
          console.warn("Could not sync saved jobs list on login:", err.message);
        }
        addToast("Logged in successfully!", "success");
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get("redirect") || "/dashboard";
        navigate(redirect);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials.";
      addToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  const signup = async (name, email, phone, password, role) => {
    try {
      const res = await signupCandidate({ name, email, phone, password, role });
      if (res.data.success) {
        localStorage.setItem("candidateToken", res.data.token);
        setUser(res.data.user);
        localStorage.setItem("savedJobs", JSON.stringify([])); // Empty for new signups
        addToast("Account created successfully!", "success");
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get("redirect") || "/dashboard";
        navigate(redirect);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create account.";
      addToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  const updateProfile = async (formData) => {
    try {
      const res = await updateProfileApi(formData);
      if (res.data.success) {
        setUser(res.data.user);
        addToast("Profile updated successfully!", "success");
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile.";
      addToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
