import { useState, useEffect, useMemo, useCallback } from 'react';
import defaultJobs from '@data/jobs.json';
import { useLocalStorage } from './useLocalStorage';
import { saveToCloud, loadFromCloud, isConfigured } from '../services/cloudStorage';

export function useJobs() {
  const [adminJobs, setAdminJobs] = useLocalStorage('adminJobs', null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [modeFilter, setModeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [syncing, setSyncing] = useState(false);
  const [cloudStatus, setCloudStatus] = useState(isConfigured() ? 'ready' : 'not_configured');
  const jobsPerPage = 9;

  // Merge default JSON + admin changes
  const jobs = useMemo(() => {
    if (!adminJobs) return defaultJobs;
    const adminIds = new Set(adminJobs.map(j => j.id));
    const defaultIds = new Set(defaultJobs.map(j => j.id));
    const newJobs = adminJobs.filter(j => !defaultIds.has(j.id));
    const merged = defaultJobs.map(j => {
      const adminVersion = adminJobs.find(aj => aj.id === j.id);
      return adminVersion || j;
    });
    return [...merged, ...newJobs];
  }, [adminJobs]);

  const publishedJobs = useMemo(() => jobs.filter(j => j.published !== false), [jobs]);
  const companies = useMemo(() => [...new Set(publishedJobs.map(j => j.company))], [publishedJobs]);
  const locations = useMemo(() => [...new Set(publishedJobs.map(j => j.location))], [publishedJobs]);

  const filteredJobs = useMemo(() => {
    let result = [...publishedJobs];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(j =>
        j.title.toLowerCase().includes(term) ||
        j.company.toLowerCase().includes(term) ||
        j.skills.some(s => s.toLowerCase().includes(term)) ||
        j.location.toLowerCase().includes(term)
      );
    }
    if (locationFilter) result = result.filter(j => j.location === locationFilter);
    if (companyFilter) result = result.filter(j => j.company === companyFilter);
    if (categoryFilter) result = result.filter(j => j.category === categoryFilter);
    if (modeFilter) result = result.filter(j => j.mode === modeFilter);
    if (experienceFilter) {
      const [min] = experienceFilter.split('-').map(Number);
      result = result.filter(j => { const nums = j.experience.match(/\d+/g)?.map(Number) || [0]; return nums[0] >= min; });
    }
    if (salaryFilter) {
      const [min] = salaryFilter.split('-').map(Number);
      result = result.filter(j => j.salaryMin >= min);
    }
    switch (sortBy) {
      case 'highest': result.sort((a, b) => b.salaryMax - a.salaryMax); break;
      case 'lowest': result.sort((a, b) => a.salaryMin - b.salaryMin); break;
      default: result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    }
    return result;
  }, [publishedJobs, searchTerm, locationFilter, companyFilter, salaryFilter, experienceFilter, modeFilter, categoryFilter, sortBy]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const paginatedJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, locationFilter, companyFilter, salaryFilter, experienceFilter, modeFilter, categoryFilter, sortBy]);

  // ⭐ CLOUD SYNC: Save to cloud automatically
  const syncToCloud = useCallback(async (jobsData) => {
    if (!isConfigured()) return;
    setSyncing(true);
    setCloudStatus('syncing');
    try {
      await saveToCloud(jobsData);
      setCloudStatus('synced');
    } catch {
      setCloudStatus('error');
    } finally {
      setSyncing(false);
    }
  }, []);

  // ⭐ CLOUD SYNC: Load from cloud on first visit
  useEffect(() => {
    if (!isConfigured()) return;
    const loadCloud = async () => {
      setSyncing(true);
      setCloudStatus('syncing');
      try {
        const cloudData = await loadFromCloud();
        if (cloudData && Array.isArray(cloudData) && cloudData.length > 0) {
          setAdminJobs(cloudData);
          setCloudStatus('synced');
        } else {
          setCloudStatus('ready');
        }
      } catch {
        setCloudStatus('error');
      } finally {
        setSyncing(false);
      }
    };
    loadCloud();
  }, []);

  // ⭐ Helper: Save locally + sync to cloud
  const persistJobs = useCallback((newJobs) => {
    setAdminJobs(newJobs);
    syncToCloud(newJobs);
  }, [setAdminJobs, syncToCloud]);

  const addJob = (newJob) => {
    const current = adminJobs || defaultJobs;
    persistJobs([...current, newJob]);
  };

  const updateJob = (id, updatedJob) => {
    const current = adminJobs || defaultJobs;
    persistJobs(current.map(j => j.id === id ? updatedJob : j));
  };

  const deleteJob = (id) => {
    const current = adminJobs || defaultJobs;
    persistJobs(current.filter(j => j.id !== id));
  };

  const togglePublish = (id) => {
    const current = adminJobs || defaultJobs;
    persistJobs(current.map(j => j.id === id ? { ...j, published: j.published === false ? true : false } : j));
  };

  const resetToDefaults = () => {
    persistJobs(null);
  };

  return {
    jobs: publishedJobs,
    allJobs: jobs,
    filteredJobs,
    paginatedJobs,
    companies,
    locations,
    currentPage,
    totalPages,
    totalJobs: filteredJobs.length,
    searchTerm, setSearchTerm,
    locationFilter, setLocationFilter,
    companyFilter, setCompanyFilter,
    salaryFilter, setSalaryFilter,
    experienceFilter, setExperienceFilter,
    modeFilter, setModeFilter,
    categoryFilter, setCategoryFilter,
    sortBy, setSortBy,
    setCurrentPage,
    setAdminJobs,
    addJob, updateJob, deleteJob, togglePublish, resetToDefaults,
    syncing,
    cloudStatus,
    syncToCloud,
  };
}