import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  HiDocumentText,
  HiBriefcase,
  HiUserGroup,
  HiPlus,
  HiEye,
  HiEyeSlash,
  HiPencilSquare,
  HiTrash,
  HiChevronDown,
  HiArrowTopRightOnSquare,
} from "react-icons/hi2";
import SEO from "@components/common/SEO";
import EmptyState from "@components/common/EmptyState";
import LoadingSkeleton from "@components/common/LoadingSkeleton";
import StatisticsCard from "@components/common/StatisticsCard";
import ProfileCard from "@components/common/ProfileCard";
import RecruiterJobsModal from "@components/common/RecruiterJobsModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "@context/ToastContext";
import {
  getRecruiterListings,
  getRecruiterApplications,
  updateApplicationStatusByRecruiter,
  deleteJob,
  togglePublish,
  getResumeProxyUrl,
} from "../services/jobService";
import {
  deleteFreelanceProject,
  togglePublishFreelance,
} from "../services/freelanceService";

const TABS = [
  { id: "overview", label: "Overview", icon: HiBriefcase },
  { id: "listings", label: "My Listings", icon: HiDocumentText },
  { id: "applicants", label: "Applications", icon: HiUserGroup },
];

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState("overview");
  const [listings, setListings] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [listingsRes, applicantsRes] = await Promise.all([
        getRecruiterListings(),
        getRecruiterApplications(),
      ]);

      if (listingsRes.data.success) {
        setListings(listingsRes.data.data || []);
      }
      if (applicantsRes.data.success) {
        setApplicants(applicantsRes.data.data || []);
      }
    } catch (err) {
      console.error("Failed to load recruiter dashboard data:", err);
      addToast("Failed to load dashboard data.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteListing = async (listing) => {
    if (!confirm("Are you sure you want to permanently delete this listing? All applications will be lost.")) return;

    try {
      if (listing.isFreelance) {
        await deleteFreelanceProject(listing.id || listing._id);
      } else {
        await deleteJob(listing.id || listing._id);
      }
      addToast("Listing deleted successfully.", "success");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      addToast("Failed to delete listing.", "error");
    }
  };

  const handleTogglePublish = async (listing) => {
    try {
      const targetId = listing.id || listing._id;
      if (listing.isFreelance) {
        await togglePublishFreelance(targetId);
      } else {
        await togglePublish(targetId);
      }
      addToast("Publish status updated.", "success");
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      addToast("Failed to update status.", "error");
    }
  };

  const handleStatusChange = async (appId, status) => {
    try {
      const res = await updateApplicationStatusByRecruiter(appId, status);
      if (res.data.success) {
        addToast("Candidate status updated successfully.", "success");
        setApplicants(prev => prev.map(app => app._id === appId ? { ...app, status } : app));
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to update candidate status.", "error");
    }
  };

  const openEdit = (listing) => {
    setEditingListing(listing);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditingListing(null);
    setShowModal(true);
  };

  // Computations
  const totalListings = listings.length;
  const activeListings = listings.filter(l => l.published !== false).length;
  const totalApplicants = applicants.length;

  const recentListings = listings.slice(0, 3);
  const recentApplicants = applicants.slice(0, 3);

  return (
    <>
      <SEO path="/dashboard" title="Employer Dashboard" description="Manage your job postings and applicants on viewjob." />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Employer Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Manage listings and candidate applications for {user?.name}</p>
            </div>
            <button
              onClick={openCreate}
              className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 hover:shadow-lg transition-all w-fit cursor-pointer"
            >
              <HiPlus className="w-5 h-5" /> Post a Listing
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar Navigation */}
            <div className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-800/80 space-y-1">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.id
                          ? "bg-primary-50 dark:bg-primary-500/10 text-primary-650 dark:text-primary-400"
                          : "text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:text-gray-700"
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Panels */}
            <div className="flex-1 min-w-0 space-y-6">

              {/* Profile Overview Banner */}
              {activeTab === "overview" && (
                <ProfileCard profile={user} onEdit={() => window.location.href = "/dashboard/profile"} />
              )}

              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <StatisticsCard icon={HiDocumentText} label="Total Postings" value={loading ? "..." : totalListings} color="primary" index={0} />
                    <StatisticsCard icon={HiBriefcase} label="Active Listings" value={loading ? "..." : activeListings} color="emerald" index={1} />
                    <StatisticsCard icon={HiUserGroup} label="Total Applicants" value={loading ? "..." : totalApplicants} color="amber" index={2} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Listings */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800/80 p-6">
                      <div className="flex items-center justify-between mb-4 pb-1">
                        <h2 className="font-bold text-gray-900 dark:text-slate-200">Recent Postings</h2>
                        {listings.length > 0 && (
                          <button onClick={() => setActiveTab("listings")} className="text-xs text-primary-650 font-semibold hover:underline">View all</button>
                        )}
                      </div>
                      {loading ? (
                        <LoadingSkeleton count={2} />
                      ) : recentListings.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">You haven't posted any jobs yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {recentListings.map((l) => (
                            <div key={l._id} className="flex items-center justify-between p-3.5 bg-gray-50/30 dark:bg-slate-950/20 border border-gray-100 dark:border-slate-800/60 rounded-xl">
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 dark:text-slate-200 truncate">{l.title}</h4>
                                <p className="text-xs text-gray-500">{l.isFreelance ? "Freelance Project" : "Permanent Job"} • {l.location}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${l.published !== false
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                                    : "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
                                  }`}>
                                  {l.published !== false ? "Visible" : "Draft"}
                                </span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${l.status === 'approved'
                                    ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
                                    : l.status === 'rejected'
                                      ? 'bg-red-50/50 border-red-100 text-red-700'
                                      : 'bg-amber-50/50 border-amber-100 text-amber-700'
                                  }`}>
                                  {l.status ? l.status.toUpperCase() : 'PENDING'}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recent Applicants */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800/80 p-6">
                      <div className="flex items-center justify-between mb-4 pb-1">
                        <h2 className="font-bold text-gray-900 dark:text-slate-200">Recent Applications</h2>
                        {applicants.length > 0 && (
                          <button onClick={() => setActiveTab("applicants")} className="text-xs text-primary-650 font-semibold hover:underline">View all</button>
                        )}
                      </div>
                      {loading ? (
                        <LoadingSkeleton count={2} />
                      ) : recentApplicants.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No applications received yet.</p>
                      ) : (
                        <div className="space-y-4">
                          {recentApplicants.map((app) => (
                            <div key={app._id} className="flex items-center justify-between p-3.5 bg-gray-50/30 dark:bg-slate-950/20 border border-gray-100 dark:border-slate-800/60 rounded-xl">
                              <div className="min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 dark:text-slate-200 truncate">{app.fullName}</h4>
                                <p className="text-xs text-gray-500">Applied for {app.jobTitle} • {new Date(app.appliedAt).toLocaleDateString()}</p>
                              </div>
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${app.status === "Hired"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                                  : app.status === "Rejected"
                                    ? "bg-red-50 text-red-700 border-red-100 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
                                    : "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400"
                                }`}>
                                {app.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* My Listings Tab */}
              {activeTab === "listings" && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800/80 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-150 dark:border-slate-800/80 flex items-center justify-between">
                    <h2 className="font-bold text-gray-900 dark:text-slate-200">Your Job Listings ({listings.length})</h2>
                  </div>
                  {loading ? (
                    <div className="p-6"><LoadingSkeleton count={3} /></div>
                  ) : listings.length === 0 ? (
                    <div className="p-12">
                      <EmptyState
                        icon={HiBriefcase}
                        title="No listings yet"
                        description="You haven't posted any job or freelance projects yet. Post your first listing now!"
                        action={
                          <button onClick={openCreate} className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2 hover:shadow-lg transition-all cursor-pointer">
                            <HiPlus className="w-5 h-5" /> Post Listing
                          </button>
                        }
                      />
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/70 border-b border-gray-150 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-3.5">Listing Title</th>
                            <th className="px-6 py-3.5">Type</th>
                            <th className="px-6 py-3.5">Salary/Budget</th>
                            <th className="px-6 py-3.5">Status</th>
                            <th className="px-6 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                          {listings.map((l) => (
                            <tr key={l._id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900">{l.title}</div>
                                <div className="text-xs text-gray-500">{l.location}</div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg border ${l.isFreelance
                                    ? "bg-secondary-50 border-secondary-100 text-secondary-700 dark:bg-secondary-500/10 dark:border-secondary-500/20 dark:text-secondary-400"
                                    : "bg-primary-50 border-primary-100 text-primary-700 dark:bg-primary-500/10 dark:border-primary-500/20 dark:text-primary-400"
                                  }`}>
                                  {l.isFreelance ? "Freelance" : "Job"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-700">{l.salary || "Negotiable"}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1.5">
                                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border w-fit ${l.published !== false
                                      ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                                      : "bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400"
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${l.published !== false ? "bg-emerald-500" : "bg-amber-500"}`} />
                                    {l.published !== false ? "Visible" : "Draft"}
                                  </span>
                                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border w-fit ${l.status === 'approved'
                                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
                                      : l.status === 'rejected'
                                        ? 'bg-red-50/50 border-red-100 text-red-700'
                                        : 'bg-amber-50/50 border-amber-100 text-amber-700'
                                    }`}>
                                    {l.status ? l.status.toUpperCase() : 'PENDING'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleTogglePublish(l)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${l.published !== false
                                        ? "text-amber-600 hover:bg-amber-50 border-amber-100"
                                        : "text-emerald-600 hover:bg-emerald-50 border-emerald-100"
                                      }`}
                                    title={l.published !== false ? "Change to Draft" : "Publish listing"}
                                  >
                                    {l.published !== false ? <HiEyeSlash className="w-4.5 h-4.5" /> : <HiEye className="w-4.5 h-4.5" />}
                                  </button>
                                  <button onClick={() => openEdit(l)} className="w-8 h-8 rounded-lg border border-gray-150 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors" title="Edit"><HiPencilSquare className="w-4.5 h-4.5" /></button>
                                  <button onClick={() => handleDeleteListing(l)} className="w-8 h-8 rounded-lg border border-red-100 hover:bg-red-50 flex items-center justify-center text-red-500 transition-colors" title="Delete"><HiTrash className="w-4.5 h-4.5" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Applicants Tab */}
              {activeTab === "applicants" && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800/80 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-150 dark:border-slate-800/80">
                    <h2 className="font-bold text-gray-900 dark:text-slate-200">Candidate Applications ({applicants.length})</h2>
                  </div>
                  {loading ? (
                    <div className="p-6"><LoadingSkeleton count={3} /></div>
                  ) : applicants.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                      No candidate applications received yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {applicants.map((app) => (
                        <div key={app._id} className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-gray-50/30 transition-colors">
                          <div className="space-y-3 flex-1 min-w-0">
                            <div>
                              <h3 className="text-base font-bold text-gray-900">{app.fullName}</h3>
                              <p className="text-xs text-gray-500">Applied for: <span className="font-medium text-primary-650">{app.jobTitle}</span> ({app.isFreelance ? "Freelance" : "Job"}) • {new Date(app.appliedAt).toLocaleDateString()}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs text-gray-600">
                              <div><span className="font-medium text-gray-900">Email:</span> {app.email}</div>
                              <div><span className="font-medium text-gray-900">Phone:</span> {app.phone}</div>
                              <div><span className="font-medium text-gray-900">Experience:</span> {app.yearsOfExperience} years</div>
                              <div><span className="font-medium text-gray-900">Exp. Salary:</span> {app.expectedSalary || "N/A"}</div>
                              <div><span className="font-medium text-gray-900">Availability:</span> {app.availability || "N/A"}</div>
                              <div><span className="font-medium text-gray-900">Relocate:</span> {app.relocation || "no"}</div>
                            </div>

                            {app.coverLetter && (
                              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs text-gray-500 leading-relaxed max-w-2xl">
                                <span className="font-semibold text-gray-700 block mb-1 text-2xs uppercase tracking-wider">Cover Letter / Note:</span>
                                {app.coverLetter}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2 pt-1">
                              {app.linkedIn && typeof app.linkedIn === 'string' && app.linkedIn.trim() !== '' && (
                                <a href={app.linkedIn.startsWith("http") ? app.linkedIn : `https://${app.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-650 hover:underline inline-flex items-center gap-1">LinkedIn <HiArrowTopRightOnSquare className="w-3.5 h-3.5" /></a>
                              )}
                              {app.portfolio && typeof app.portfolio === 'string' && app.portfolio.trim() !== '' && (
                                <a href={app.portfolio.startsWith("http") ? app.portfolio : `https://${app.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-xs text-teal-650 hover:underline inline-flex items-center gap-1 ml-3">Portfolio <HiArrowTopRightOnSquare className="w-3.5 h-3.5" /></a>
                              )}
                              {app.resume && app.resume.url && (
                                <a
                                  href={getResumeProxyUrl(app.resume.url, app.resume.publicId)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-emerald-650 hover:underline inline-flex items-center gap-1 font-semibold ml-3"
                                >
                                  View Resume PDF <HiArrowTopRightOnSquare className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end md:self-start">
                            <label className="text-xs font-semibold text-gray-500">Status:</label>
                            <div className="relative">
                              <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                className={`text-xs font-bold px-3 py-1.5 pr-8 rounded-lg border-0 cursor-pointer appearance-none shadow-sm focus:ring-2 focus:ring-primary-500/20 ${app.status === "Applied"
                                    ? "bg-blue-50 text-blue-700"
                                    : app.status === "Shortlisted"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : app.status === "Interview"
                                        ? "bg-purple-50 text-purple-750"
                                        : app.status === "Rejected"
                                          ? "bg-red-50 text-red-700"
                                          : "bg-gray-100 text-gray-700"
                                  }`}
                              >
                                {["Applied", "Shortlisted", "Interview", "Rejected", "Hired"].map((status) => (
                                  <option key={status} value={status} className="bg-white text-gray-900 font-normal">{status}</option>
                                ))}
                              </select>
                              <HiChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2 pointer-events-none" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Job Modal */}
      <RecruiterJobsModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingListing(null);
        }}
        editingListing={editingListing}
        onSaveSuccess={fetchDashboardData}
        defaultCompany={user?.name || ""}
      />
    </>
  );
}
