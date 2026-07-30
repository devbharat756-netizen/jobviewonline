import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastContext";
import {
  loginCandidate,
  signupCandidate,
  getMe,
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
    setUser(null);
    addToast("Logged out successfully.", "success");
    navigate("/login");
  };

  // Register the Axios 401 response interceptor handler
  useEffect(() => {
    registerLogoutHandler(() => {
      localStorage.removeItem("candidateToken");
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
        }
      } catch (err) {
        console.error("Failed to restore session:", err.message);
        localStorage.removeItem("candidateToken");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await loginCandidate({ email, password });
      if (res.data.success) {
        localStorage.setItem("candidateToken", res.data.token);
        setUser(res.data.user);
        addToast("Logged in successfully!", "success");
        navigate("/dashboard");
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials.";
      addToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  const signup = async (name, email, phone, password) => {
    try {
      const res = await signupCandidate({ name, email, phone, password });
      if (res.data.success) {
        localStorage.setItem("candidateToken", res.data.token);
        setUser(res.data.user);
        addToast("Account created successfully!", "success");
        navigate("/dashboard");
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
