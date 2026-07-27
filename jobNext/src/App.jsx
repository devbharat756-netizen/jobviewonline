import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Companies from './pages/Companies';
import CareerTips from './pages/CareerTips';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Applications from './pages/Applications';
import SavedJobs from './pages/SavedJobs';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobs from './pages/admin/AdminJobs';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminCategories from './pages/admin/AdminCategories';
import AdminSkills from './pages/admin/AdminSkills';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import ScrollToTop from './components/common/ScrollToTop';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/jobs" element={<><Navbar /><Jobs /><Footer /></>} />
        <Route path="/jobs/:id" element={<><Navbar /><JobDetails /><Footer /></>} />
        <Route path="/companies" element={<><Navbar /><Companies /><Footer /></>} />
        <Route path="/career-tips" element={<><Navbar /><CareerTips /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
        <Route path="/faq" element={<><Navbar /><FAQ /><Footer /></>} />
        <Route path="/privacy-policy" element={<><Navbar /><PrivacyPolicy /><Footer /></>} />
        <Route path="/terms" element={<><Navbar /><Terms /><Footer /></>} />
        <Route path="/disclaimer" element={<><Navbar /><Disclaimer /><Footer /></>} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<><Navbar /><Dashboard /><Footer /></>} />
        <Route path="/dashboard/profile" element={<><Navbar /><Profile /><Footer /></>} />
        <Route path="/dashboard/applications" element={<><Navbar /><Applications /><Footer /></>} />
        <Route path="/dashboard/saved-jobs" element={<><Navbar /><SavedJobs /><Footer /></>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<><Navbar /><NotFound /><Footer /></>} />
      </Routes>
    </>
  );
}