import { useState, useEffect } from "react";
import { HiEye, HiDocumentText, HiLink, HiEnvelope, HiPhone, HiCalendarDays } from "react-icons/hi2";
import Modal from "@components/common/Modal";
import EmptyState from "@components/common/EmptyState";
import LoadingSkeleton from "@components/common/LoadingSkeleton";
import { useToast } from "@context/ToastContext";
import { getStatusColor } from "@utils/helpers";
import { APPLICATION_STATUSES } from "@utils/constants";
import { getAdminApplications, updateApplicationStatus, getResumeProxyUrl } from "../../services/jobService";

export default function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { addToast } = useToast();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getAdminApplications();
      if (res.data.success) {
        setApplications(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to load applications.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await updateApplicationStatus(appId, newStatus);
      if (res.data.success) {
        setApplications(prev =>
          prev.map(app => (app._id === appId ? { ...app, status: newStatus } : app))
        );
        addToast(`Application status updated to ${newStatus}`, "success");
        if (selectedApp && selectedApp._id === appId) {
          setSelectedApp(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to update status.", "error");
    }
  };

  const openDetails = (app) => {
    setSelectedApp(app);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-slate-100">Job Applications</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track candidate profiles for your active listings</p>
        </div>
        <span className="text-sm font-semibold bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 px-3.5 py-1.5 rounded-full border border-primary-100 dark:border-primary-500/20">
          {applications.length} Total
        </span>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={HiDocumentText}
          title="No applications yet"
          description="Applications submitted by job seekers will appear here."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-150 dark:divide-slate-800">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Candidate</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Target Position</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Timeline & Salary</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 dark:text-slate-200">{app.fullName}</span>
                        <span className="text-xs text-gray-500 dark:text-slate-450 mt-0.5">{app.email}</span>
                        <span className="text-xs text-gray-400 mt-0.5">{app.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-primary-700 dark:text-primary-400">{app.job?.title || "Deleted Job"}</span>
                        <span className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{app.job?.company || "Unknown Company"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-700 dark:text-slate-300">Exp: {app.yearsOfExperience}</span>
                        <span className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Exp Salary: {app.expectedSalary}</span>
                        <span className="text-xs text-gray-400 mt-0.5">Notice: {app.noticePeriod}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border-0 cursor-pointer ${getStatusColor(app.status)}`}
                      >
                        {APPLICATION_STATUSES.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openDetails(app)}
                          className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center text-gray-500 hover:text-primary-650 transition-colors"
                          title="View Details"
                        >
                          <HiEye className="w-4.5 h-4.5" />
                        </button>
                        {app.resume?.url && (
                          <a
                            href={getResumeProxyUrl(app.resume.url, app.resume.publicId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 flex items-center justify-center text-emerald-600 hover:text-emerald-700 transition-colors"
                            title="View PDF Resume"
                          >
                            <HiDocumentText className="w-4.5 h-4.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Application Details" size="lg">
        {selectedApp && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="bg-gray-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/60">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{selectedApp.fullName}</h3>
                  <p className="text-sm text-primary-650 dark:text-primary-400 font-semibold mt-1">
                    Applied for: {selectedApp.job?.title || "Deleted Job"} ({selectedApp.job?.company})
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Submitted on {new Date(selectedApp.createdAt).toLocaleString()}</p>
                </div>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                  className={`text-xs font-semibold px-3 py-2 rounded-lg border-0 cursor-pointer ${getStatusColor(selectedApp.status)}`}
                >
                  {APPLICATION_STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Profile fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-900">
              {/* Contact info */}
              <div className="space-y-3.5">
                <h4 className="font-bold text-gray-900 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-1.5">Contact Details</h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2.5 text-gray-600 dark:text-slate-300">
                    <HiEnvelope className="w-4.5 h-4.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{selectedApp.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-gray-600 dark:text-slate-300">
                    <HiPhone className="w-4.5 h-4.5 text-gray-400 flex-shrink-0" />
                    <span>{selectedApp.phone}</span>
                  </div>
                  {selectedApp.linkedIn && (
                    <div className="flex items-center gap-2.5 text-gray-600 dark:text-slate-300">
                      <HiLink className="w-4.5 h-4.5 text-gray-400 flex-shrink-0" />
                      <a href={selectedApp.linkedIn.startsWith("http") ? selectedApp.linkedIn : `https://${selectedApp.linkedIn}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline truncate">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {selectedApp.portfolio && (
                    <div className="flex items-center gap-2.5 text-gray-600 dark:text-slate-300">
                      <HiLink className="w-4.5 h-4.5 text-gray-400 flex-shrink-0" />
                      <a href={selectedApp.portfolio.startsWith("http") ? selectedApp.portfolio : `https://${selectedApp.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline truncate">
                        Portfolio Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline & Parameters */}
              <div className="space-y-3.5">
                <h4 className="font-bold text-gray-900 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-1.5">Work Timeline & Parameters</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-gray-50/50 dark:bg-slate-800/10 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800/50">
                    <p className="text-gray-450 font-medium">Experience</p>
                    <p className="font-bold text-gray-800 dark:text-slate-200 mt-1">{selectedApp.yearsOfExperience}</p>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-slate-800/10 p-2.5 rounded-xl border border-gray-150 dark:border-slate-800/50">
                    <p className="text-gray-450 font-medium">Notice Period</p>
                    <p className="font-bold text-gray-800 dark:text-slate-200 mt-1">{selectedApp.noticePeriod}</p>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-slate-800/10 p-2.5 rounded-xl border border-gray-150 dark:border-slate-800/50">
                    <p className="text-gray-450 font-medium">Expected Salary</p>
                    <p className="font-bold text-gray-800 dark:text-slate-200 mt-1">{selectedApp.expectedSalary}</p>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-slate-800/10 p-2.5 rounded-xl border border-gray-150 dark:border-slate-800/50">
                    <p className="text-gray-450 font-medium">Current Salary</p>
                    <p className="font-bold text-gray-800 dark:text-slate-200 mt-1">{selectedApp.currentSalary || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-slate-800/10 p-2.5 rounded-xl border border-gray-150 dark:border-slate-800/50 col-span-2 flex items-center justify-between">
                    <div>
                      <p className="text-gray-450 font-medium">Availability</p>
                      <p className="font-bold text-gray-800 dark:text-slate-200 mt-0.5">{selectedApp.availability}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-450 font-medium">Open to Relocation</p>
                      <p className="font-bold text-gray-800 dark:text-slate-200 mt-0.5 uppercase">{selectedApp.relocation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover letter text */}
            {selectedApp.coverLetter && (
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-1.5">Cover Letter</h4>
                <div className="bg-gray-50/30 dark:bg-slate-800/10 p-4 rounded-xl border border-gray-150 dark:border-slate-800 text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedApp.coverLetter}
                </div>
              </div>
            )}

            {/* Resume button link */}
            {selectedApp.resume?.url && (
              <div className="border-t border-gray-100 dark:border-slate-800 pt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Applicant resume document is loaded successfully.</span>
                <a
                  href={getResumeProxyUrl(selectedApp.resume.url, selectedApp.resume.publicId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  <HiDocumentText className="w-5 h-5" />
                  Open PDF Resume
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
