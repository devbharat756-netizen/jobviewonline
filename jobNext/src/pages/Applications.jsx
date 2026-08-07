import { Link } from 'react-router-dom';
import { HiDocumentText, HiEye, HiTrash, HiArrowRight } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import DashboardSidebar from '@components/layout/DashboardSidebar';
import EmptyState from '@components/common/EmptyState';
import { useToast } from '@context/ToastContext';
import { getStatusColor } from '@utils/helpers';
import { useState, useEffect } from 'react';
import { getAppliedJobs } from '../services/jobService';
import LoadingSkeleton from '@components/common/LoadingSkeleton';

export default function Applications() {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchApplied = async () => {
      setLoading(true);
      try {
        const res = await getAppliedJobs();
        if (res.data.success) {
          setAppliedJobs(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
        addToast(err.response?.data?.message || 'Failed to load applied jobs.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchApplied();
  }, []);

  const withdraw = (idx) => {
    // Local withdrawal only for demo purposes in this phase
    setAppliedJobs(prev => prev.filter((_, i) => i !== idx));
    addToast('Application withdrawn successfully', 'info');
  };


  return (
    <>
      <SEO path="/dashboard/applications" title="My Applications" description="Track your job applications on viewjob." />
      <div className="pt-4 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <DashboardSidebar />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900">My Applications</h1>
                <span className="text-sm text-gray-500">{appliedJobs.length} total</span>
              </div>

              {loading ? (
                <LoadingSkeleton count={3} />
              ) : appliedJobs.length === 0 ? (
                <EmptyState icon={HiDocumentText} title="No applications yet" description="Start applying to jobs to track them here." action={<Link to="/jobs" className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2">Browse Jobs <HiArrowRight className="w-4 h-4" /></Link>} />
              ) : (
                <div className="space-y-3">
                  {[...appliedJobs].reverse().map((app, i) => {
                    const realIdx = appliedJobs.length - 1 - i;
                    return (
                      <div key={realIdx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">{app.jobTitle}</h3>
                          <p className="text-sm text-gray-500">{app.company} • Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold px-3 py-1.5 rounded-lg select-none ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                          <Link to={app.isFreelance ? `/freelance/${app.jobId}` : `/jobs/${app.jobId}`} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-primary-600 transition-colors" title={app.isFreelance ? "View Project" : "View Job"}><HiEye className="w-4 h-4" /></Link>
                          <button onClick={() => withdraw(realIdx)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors" title="Withdraw"><HiTrash className="w-4 h-4" /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}