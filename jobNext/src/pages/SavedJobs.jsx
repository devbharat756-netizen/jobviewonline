import { Link } from 'react-router-dom';
import { HiBookmark, HiArrowRight, HiTrash } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import DashboardSidebar from '@components/layout/DashboardSidebar';
import EmptyState from '@components/common/EmptyState';
import JobCard from '@components/common/JobCard';
import { useToast } from '@context/ToastContext';
import { useState, useEffect } from 'react';
import { getSavedJobs, toggleSaveJob } from '../services/jobService';
import LoadingSkeleton from '@components/common/LoadingSkeleton';

export default function SavedJobs() {
  const [savedJobList, setSavedJobList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      try {
        const res = await getSavedJobs();
        if (res.data.success) {
          setSavedJobList(res.data.data || []);
        }
      } catch (err) {
        console.error(err);
        addToast(err.response?.data?.message || 'Failed to load saved jobs.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const remove = async (jobId) => {
    try {
      const res = await toggleSaveJob(jobId);
      if (res.data.success) {
        setSavedJobList(prev => prev.filter(
          j => (j.id || j._id) !== jobId
        ));
        addToast('Job removed from saved', 'info');
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to remove job.', 'error');
    }
  };

  return (
    <>
      <SEO path="/dashboard/saved-jobs" title="Saved Jobs" description="View and manage your saved job listings on jobView." />
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <DashboardSidebar />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-extrabold text-gray-900">Saved Jobs</h1>
                <span className="text-sm text-gray-500">{savedJobList.length} saved</span>
              </div>

              {loading ? (
                <LoadingSkeleton count={3} />
              ) : savedJobList.length === 0 ? (
                <EmptyState icon={HiBookmark} title="No saved jobs" description="Bookmark jobs you're interested in to find them here later." action={<Link to="/jobs" className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-medium inline-flex items-center gap-2">Browse Jobs <HiArrowRight className="w-4 h-4" /></Link>} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedJobList.map((job, i) => (
                    <div key={job.id || job._id} className="relative">
                      <JobCard job={job} index={i} />
                      <button onClick={() => remove(job.id || job._id)} className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors" title="Remove"><HiTrash className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}