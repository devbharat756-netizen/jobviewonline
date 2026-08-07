import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import FreelanceJobs from './pages/FreelanceJobs';
import JobDetails from './pages/JobDetails';
import Companies from './pages/Companies';
import CareerTips from './pages/CareerTips';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import Dmca from './pages/Dmca';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import SavedJobs from './pages/SavedJobs';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobs from './pages/admin/AdminJobs';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSkills from './pages/admin/AdminSkills';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminApplications from './pages/admin/AdminApplications';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import ScrollToTop from './components/common/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import TopAdBar from './components/common/TopAdBar';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminBlog from './pages/admin/AdminBlog';
import AdminBlogCategories from './pages/admin/AdminBlogCategories';

const PublicLayout = ({ children }) => {
  useEffect(() => {
    const popunderSrc = "https://pl30738727.effectivecpmnetwork.com/88/75/c4/8875c47c2cfc87b126cca195feb558de.js";
    const socialBarSrc = "https://pl30738729.effectivecpmnetwork.com/ae/d5/77/aed577b53e7f651c7ff08feb83c10bf4.js";

    let popunderScript = document.querySelector(`script[src="${popunderSrc}"]`);
    if (!popunderScript) {
      popunderScript = document.createElement("script");
      popunderScript.src = popunderSrc;
      popunderScript.async = true;
      document.head.appendChild(popunderScript);
    }

    let socialBarScript = document.querySelector(`script[src="${socialBarSrc}"]`);
    if (!socialBarScript) {
      socialBarScript = document.createElement("script");
      socialBarScript.src = socialBarSrc;
      socialBarScript.async = true;
      document.head.appendChild(socialBarScript);
    }

    return () => {
      if (popunderScript && popunderScript.parentNode) {
        popunderScript.parentNode.removeChild(popunderScript);
      }
      if (socialBarScript && socialBarScript.parentNode) {
        socialBarScript.parentNode.removeChild(socialBarScript);
      }
    };
  }, []);

  return (
    <>
      <TopAdBar />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/jobs" element={<PublicLayout><Jobs /></PublicLayout>} />
        <Route path="/jobs/:id" element={<PublicLayout><JobDetails /></PublicLayout>} />
        <Route path="/freelance" element={<PublicLayout><FreelanceJobs /></PublicLayout>} />
        <Route path="/freelance/:id" element={<PublicLayout><JobDetails isFreelance={true} /></PublicLayout>} />
        <Route path="/companies" element={<PublicLayout><Companies /></PublicLayout>} />
        <Route path="/career-tips" element={<PublicLayout><CareerTips /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
        <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
        <Route path="/disclaimer" element={<PublicLayout><Disclaimer /></PublicLayout>} />
        <Route path="/dmca" element={<PublicLayout><Dmca /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><Blog /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout><BlogPost /></PublicLayout>} />

        {/* Guest Auth Routes */}
        <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
        <Route path="/signup" element={<><Navbar /><Signup /><Footer /></>} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<><Navbar /><Dashboard /><Footer /></>} />
          <Route path="/dashboard/profile" element={<><Navbar /><Profile /><Footer /></>} />
          <Route path="/dashboard/applications" element={<><Navbar /><Applications /><Footer /></>} />
          <Route path="/dashboard/saved-jobs" element={<><Navbar /><SavedJobs /><Footer /></>} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
           <Route path="applications" element={<AdminApplications />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="blog-categories" element={<AdminBlogCategories />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </AuthProvider>
  );
}