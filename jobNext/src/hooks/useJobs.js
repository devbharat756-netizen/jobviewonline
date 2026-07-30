import { useState, useEffect, useMemo } from "react";
import { getJobs } from "../services/jobService";

export function useJobs() {
  const [adminJobs, setAdminJobs] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 9;

  const fetchJobs = async () => {
    try {
      const res = await getJobs();
      const mappedJobs = (res.data.data || []).map(j => ({
        ...j,
        id: j._id,
      }));
      setAdminJobs(mappedJobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const jobs = adminJobs;

  const publishedJobs = useMemo(() => {
    return jobs.filter((j) => j.published !== false);
  }, [jobs]);

  const companies = useMemo(() => {
    return [...new Set(publishedJobs.map((j) => j.company))];
  }, [publishedJobs]);

  const locations = useMemo(() => {
    return [...new Set(publishedJobs.map((j) => j.location))];
  }, [publishedJobs]);

  const filteredJobs = useMemo(() => {
    let result = [...publishedJobs];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();

      result = result.filter(
        (j) =>
          j.title?.toLowerCase().includes(term) ||
          j.company?.toLowerCase().includes(term) ||
          j.location?.toLowerCase().includes(term) ||
          (j.skills || []).some((s) => s?.toLowerCase().includes(term))
      );
    }

    if (locationFilter)
      result = result.filter((j) => j.location === locationFilter);

    if (companyFilter)
      result = result.filter((j) => j.company === companyFilter);

    if (categoryFilter)
      result = result.filter((j) => j.category === categoryFilter);

    if (modeFilter)
      result = result.filter((j) => j.mode === modeFilter);

    if (experienceFilter) {
      const [min] = experienceFilter.split("-").map(Number);

      result = result.filter((j) => {
        const nums = j.experience?.match(/\d+/g)?.map(Number) || [0];
        return nums[0] >= min;
      });
    }

    if (salaryFilter) {
      const [min] = salaryFilter.split("-").map(Number);
      result = result.filter((j) => j.salaryMin >= min);
    }

    switch (sortBy) {
      case "highest":
        result.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
        break;

      case "lowest":
        result.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
        break;

      default:
        result.sort((a, b) => {
          const dateA = a.postedDate ? new Date(a.postedDate).getTime() : 0;
          const dateB = b.postedDate ? new Date(b.postedDate).getTime() : 0;
          return dateB - dateA;
        });
    }

    return result;
  }, [
    publishedJobs,
    searchTerm,
    locationFilter,
    companyFilter,
    salaryFilter,
    experienceFilter,
    modeFilter,
    categoryFilter,
    sortBy,
  ]);

  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    locationFilter,
    companyFilter,
    salaryFilter,
    experienceFilter,
    modeFilter,
    categoryFilter,
    sortBy,
  ]);

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

    searchTerm,
    setSearchTerm,

    locationFilter,
    setLocationFilter,

    companyFilter,
    setCompanyFilter,

    salaryFilter,
    setSalaryFilter,

    experienceFilter,
    setExperienceFilter,

    modeFilter,
    setModeFilter,

    categoryFilter,
    setCategoryFilter,

    sortBy,
    setSortBy,

    setCurrentPage,
    setAdminJobs,

    fetchJobs,
  };
}