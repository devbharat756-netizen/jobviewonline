import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HiFunnel, HiXMark } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import JobCard from '@components/common/JobCard';
import FilterSidebar from '@components/common/FilterSidebar';
import Pagination from '@components/common/Pagination';
import LoadingSkeleton from '@components/common/LoadingSkeleton';
import EmptyState from '@components/common/EmptyState';
import AdPlaceholder from '@components/common/AdPlaceholder';
import SearchBar from '@components/common/SearchBar';
import { useJobs } from '@hooks/useJobs';

export default function Jobs() {
  const [searchParams] = useSearchParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const jobHooks = useJobs();

  useEffect(() => {
    fetch('/data/categories.json')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to load categories:', err));
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    const loc = searchParams.get('location');
    const mode = searchParams.get('mode');
    const cat = searchParams.get('category');
    const sort = searchParams.get('sort');
    if (q) jobHooks.setSearchTerm(q);
    if (loc) jobHooks.setLocationFilter(loc);
    if (mode) jobHooks.setModeFilter(mode);
    if (cat) jobHooks.setCategoryFilter(cat);
    if (sort) jobHooks.setSortBy(sort);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleFilterChange = (key, value) => {
    switch (key) {
      case 'locationFilter': jobHooks.setLocationFilter(value); break;
      case 'companyFilter': jobHooks.setCompanyFilter(value); break;
      case 'categoryFilter': jobHooks.setCategoryFilter(value); break;
      case 'salaryFilter': jobHooks.setSalaryFilter(value); break;
      case 'experienceFilter': jobHooks.setExperienceFilter(value); break;
      case 'modeFilter': jobHooks.setModeFilter(value); break;
    }
  };

  const clearFilters = () => {
    jobHooks.setSearchTerm('');
    jobHooks.setLocationFilter('');
    jobHooks.setCompanyFilter('');
    jobHooks.setCategoryFilter('');
    jobHooks.setSalaryFilter('');
    jobHooks.setExperienceFilter('');
    jobHooks.setModeFilter('');
  };

  return (
    <>
      <SEO path="/jobs" title="Browse Jobs" description="Search and filter thousands of job listings. Find opportunities by location, salary, skills, and work mode." />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Browse Jobs</h1>
            <p className="text-gray-500">Showing {jobHooks.totalJobs} {jobHooks.totalJobs === 1 ? 'job' : 'jobs'}</p>
          </div>

          {/* Search */}
          <div className="mb-8">
            <SearchBar onSearch={({ query }) => jobHooks.setSearchTerm(query)} />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setFilterOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
              <HiFunnel className="w-4 h-4" /> Filters
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
              {['newest', 'highest', 'lowest'].map(s => (
                <button key={s} onClick={() => jobHooks.setSortBy(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${jobHooks.sortBy === s ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {s === 'newest' ? 'Newest' : s === 'highest' ? 'Highest Salary' : 'Lowest Salary'}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(jobHooks.searchTerm || jobHooks.locationFilter || jobHooks.companyFilter || jobHooks.modeFilter || jobHooks.categoryFilter) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {jobHooks.searchTerm && <span className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg">"{jobHooks.searchTerm}" <button onClick={() => jobHooks.setSearchTerm('')}><HiXMark className="w-3.5 h-3.5" /></button></span>}
              {jobHooks.locationFilter && <span className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg">{jobHooks.locationFilter} <button onClick={() => jobHooks.setLocationFilter('')}><HiXMark className="w-3.5 h-3.5" /></button></span>}
              {jobHooks.companyFilter && <span className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg">{jobHooks.companyFilter} <button onClick={() => jobHooks.setCompanyFilter('')}><HiXMark className="w-3.5 h-3.5" /></button></span>}
              {jobHooks.modeFilter && <span className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg">{jobHooks.modeFilter} <button onClick={() => jobHooks.setModeFilter('')}><HiXMark className="w-3.5 h-3.5" /></button></span>}
              {jobHooks.categoryFilter && <span className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-3 py-1.5 rounded-lg">{jobHooks.categoryFilter} <button onClick={() => jobHooks.setCategoryFilter('')}><HiXMark className="w-3.5 h-3.5" /></button></span>}
              <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium">Clear all</button>
            </div>
          )}

          {/* Content */}
          <div className="flex gap-8">
            <FilterSidebar
              isOpen={filterOpen}
              onClose={() => setFilterOpen(false)}
              filters={{
                locationFilter: jobHooks.locationFilter,
                companyFilter: jobHooks.companyFilter,
                salaryFilter: jobHooks.salaryFilter,
                experienceFilter: jobHooks.experienceFilter,
                modeFilter: jobHooks.modeFilter,
                categoryFilter: jobHooks.categoryFilter,
                companies: jobHooks.companies,
                locations: jobHooks.locations,
                categories,
              }}
              onFilterChange={handleFilterChange}
              onClear={clearFilters}
            />

            <div className="flex-1 min-w-0">
              {loading ? (
                <LoadingSkeleton count={6} />
              ) : jobHooks.paginatedJobs.length === 0 ? (
                <EmptyState title="No jobs found" description="Try adjusting your search or filters to find more opportunities." action={<button onClick={clearFilters} className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-medium">Clear Filters</button>} />
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobHooks.paginatedJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
                  </div>
                  <Pagination currentPage={jobHooks.currentPage} totalPages={jobHooks.totalPages} onPageChange={jobHooks.setCurrentPage} />
                </>
              )}
            </div>

            {/* Sidebar Ad */}
            <div className="hidden xl:block w-[300px] flex-shrink-0">
              <div className="sticky top-28 space-y-6">
                <AdPlaceholder type="vertical" label="Sidebar Ad" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}