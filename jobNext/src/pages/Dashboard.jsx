import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiDocumentText, HiBookmark, HiUserCircle, HiArrowRight } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import DashboardSidebar from '@components/layout/DashboardSidebar';
import StatisticsCard from '@components/common/StatisticsCard';
import ProfileCard from '@components/common/ProfileCard';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useJobs } from '@hooks/useJobs';

export default function Dashboard() {
  const [profile] = useLocalStorage('userProfile', {});
  const [savedJobs] = useLocalStorage('savedJobs', []);
  const [appliedJobs] = useLocalStorage('appliedJobs', []);
  const { jobs } = useJobs();

  const recentApplied = appliedJobs.slice(-3).reverse();

  return (
    <>
      <SEO path="/dashboard" title="Dashboard" description="Your jobView dashboard - manage your profile, applications, and saved jobs." />
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Dashboard</h1>
          <div className="flex flex-col lg:flex-row gap-8">
            <DashboardSidebar />
            <div className="flex-1 min-w-0 space-y-6">
              <ProfileCard profile={profile} onEdit={() => window.location.href = '/dashboard/profile'} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatisticsCard icon={HiDocumentText} label="Applied Jobs" value={appliedJobs.length} color="primary" index={0} />
                <StatisticsCard icon={HiBookmark} label="Saved Jobs" value={savedJobs.length} color="amber" index={1} />
                <StatisticsCard icon={HiUserCircle} label="Profile Complete" value={profile?.name ? 'Yes' : 'No'} color="emerald" index={2} />
              </div>

              {/* Recent Applications */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Recent Applications</h2>
                  {appliedJobs.length > 0 && (
                    <Link to="/dashboard/applications" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">View all <HiArrowRight className="w-4 h-4" /></Link>
                  )}
                </div>
                {recentApplied.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No applications yet. <Link to="/jobs" className="text-primary-600 font-medium">Browse jobs</Link> to get started.</p>
                ) : (
                  <div className="space-y-3">
                    {recentApplied.map((app, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{app.jobTitle}</p>
                          <p className="text-xs text-gray-500">{app.company} • {new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${app.status === 'Applied' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{app.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/jobs" className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 text-white card-hover block">
                  <h3 className="font-bold text-lg mb-1">Find Jobs</h3>
                  <p className="text-primary-100 text-sm mb-4">Browse thousands of opportunities</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium">Start searching <HiArrowRight className="w-4 h-4" /></span>
                </Link>
                <Link to="/career-tips" className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white card-hover block">
                  <h3 className="font-bold text-lg mb-1">Career Tips</h3>
                  <p className="text-amber-100 text-sm mb-4">Expert advice for your career</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium">Read articles <HiArrowRight className="w-4 h-4" /></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}