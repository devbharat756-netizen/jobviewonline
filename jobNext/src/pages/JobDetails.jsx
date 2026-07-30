import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMapPin, HiClock, HiBriefcase, HiBookmark, HiShare, HiBuildingOffice2, HiGlobeAlt, HiCalendarDays, HiUserGroup, HiCurrencyDollar, HiDocumentText, HiCloudArrowUp, HiXMark, HiChevronDown } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import Breadcrumb from '@components/common/Breadcrumb';
import JobCard from '@components/common/JobCard';
import EmptyState from '@components/common/EmptyState';
import Modal from '@components/common/Modal';
import AdPlaceholder from '@components/common/AdPlaceholder';
import { useJobs } from '@hooks/useJobs';
import { useToast } from '@context/ToastContext';
import { formatDate, getModeColor } from '@utils/helpers';
import { useState, useRef, useEffect } from 'react';
import { getJobDetails, applyJob, toggleSaveJob } from '../services/jobService';
import LoadingSkeleton from '@components/common/LoadingSkeleton';
import { useAuth } from '../context/AuthContext';

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  resume: null,
  resumeName: '',
  coverLetter: '',
  expectedSalary: '',
  currentSalary: '',
  noticePeriod: '',
  yearsOfExperience: '',
  linkedIn: '',
  portfolio: '',
  availability: '',
  relocation: 'no',
  customQuestion: '',
};

export default function JobDetails() {
  const { id } = useParams();
  const { jobs } = useJobs();
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [applicantCount, setApplicantCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [showApply, setShowApply] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const jobId = id;

  const getResetForm = () => {
    return {
      ...emptyForm,
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    };
  };

  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      setIsSaved(false);
      setIsApplied(false);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const fetchJobData = async () => {
      setLoading(true);
      setError(null);

      setForm(getResetForm());

      try {
        const res = await getJobDetails(id);
        if (res.data.success) {
          setJob(res.data.data);
          setIsSaved(res.data.data.isSaved);
          setIsApplied(res.data.data.isApplied);
          setApplicantCount(res.data.data.totalApplicantCount || 0);
        } else {
          setError(res.data.message || "Failed to load job details.");
        }
      } catch (err) {
        console.error("Fetch job details failed:", err);
        if (!handleAuthError(err)) {
          setError(err.response?.data?.message || "Failed to load job details.");
        } else {
          // Re-fetch as guest to display public details
          try {
            const guestRes = await getJobDetails(id);
            if (guestRes.data.success) {
              setJob(guestRes.data.data);
              setIsSaved(false);
              setIsApplied(false);
              setApplicantCount(guestRes.data.data.totalApplicantCount || 0);
            }
          } catch (guestErr) {
            setError(guestErr.response?.data?.message || "Failed to load job details.");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="pt-32 pb-16 max-w-4xl mx-auto px-4">
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 pb-16 max-w-4xl mx-auto px-4">
        <EmptyState
          title="Error Loading Job"
          description={error}
          action={<Link to="/jobs" className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-medium">Browse Jobs</Link>}
        />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-32 pb-16 max-w-4xl mx-auto px-4">
        <EmptyState
          title="Job Not Found"
          description="This job listing may have been removed or doesn't exist."
          action={<Link to="/jobs" className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-medium">Browse Jobs</Link>}
        />
      </div>
    );
  }

  const toggleSave = async () => {
    if (!user) {
      addToast('Please complete your profile details and save your Profile in the Dashboard to save jobs.', 'warning');
      return;
    }

    try {
      const res = await toggleSaveJob(jobId);
      if (res.data.success) {
        const newSaved = res.data.isSaved;
        setIsSaved(newSaved);
        addToast(res.data.message || (newSaved ? 'Job saved!' : 'Job removed from saved'), 'success');
      }
    } catch (err) {
      console.error("Toggle save failed:", err);
      handleAuthError(err);
    }
  };

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      addToast('Please upload a PDF file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('File size must be under 5MB', 'error');
      return;
    }
    updateField('resume', file);
    updateField('resumeName', file.name);
  };

  const removeResume = () => {
    updateField('resume', null);
    updateField('resumeName', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    if (!form.resume) errs.resume = 'Resume is required';
    if (!form.yearsOfExperience) errs.yearsOfExperience = 'Years of experience is required';
    if (!form.expectedSalary.trim()) errs.expectedSalary = 'Expected salary is required';
    if (!form.noticePeriod.trim()) errs.noticePeriod = 'Notice period is required';
    if (!form.availability) errs.availability = 'Please select availability';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleApply = async () => {
    if (isApplied) {
      addToast('You already applied for this job', 'warning');
      return;
    }
    if (!validate()) {
      addToast('Please fill all required fields', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fullName', form.fullName);
      formData.append('email', form.email);
      formData.append('phone', form.phone);
      formData.append('yearsOfExperience', form.yearsOfExperience);
      formData.append('expectedSalary', form.expectedSalary);
      formData.append('currentSalary', form.currentSalary);
      formData.append('noticePeriod', form.noticePeriod);
      formData.append('availability', form.availability);
      formData.append('relocation', form.relocation);
      formData.append('linkedIn', form.linkedIn);
      formData.append('portfolio', form.portfolio);
      formData.append('coverLetter', form.coverLetter);
      formData.append('resume', form.resume);

      const res = await applyJob(jobId, formData);

      if (res.data.success) {
        setIsApplied(true);
        setApplicantCount(prev => prev + 1);
        setForm(getResetForm());
        setErrors({});
        setShowApply(false);
        addToast('Application submitted successfully!', 'success');
      }
    } catch (err) {
      console.error("Apply job failed:", err);
      if (!handleAuthError(err)) {
        const errMsg = err.response?.data?.message || 'Failed to submit application. Please try again.';
        addToast(errMsg, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      addToast('Link copied to clipboard!', 'success');
    } catch {
      window.prompt('Copy this link:', window.location.href);
    }

    setShowShare(false);
  };

  const closeApplyModal = () => {
    setForm(getResetForm());
    setErrors({});
    setShowApply(false);
  };

  const similarJobs = jobs
    .filter(j => {
      if ((j._id || j.id) === jobId) return false;

      const sameCategory =
        job.category && j.category === job.category;

      const sameMode =
        job.mode && j.mode === job.mode;

      return sameCategory || sameMode;
    })
    .slice(0, 3);

  const inputClass = (field) => `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors ${errors[field] ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`;
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';
  const errorText = (field) => errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>;

  return (
    <>
      <SEO path={`/jobs/${jobId}`} title={job.title} description={`${job.title} at ${job.company}. ${(job.description || '').substring(0, 150)}...`} />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Jobs', path: '/jobs' }, { label: job.title }]} />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 min-w-0">
              {/* Header Card */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
                  <img src={job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&size=80`} alt={job.company} className="w-16 h-16 rounded-2xl object-cover bg-gray-100 flex-shrink-0" />
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">{job.title}</h1>
                    <Link to={`/jobs?company=${encodeURIComponent(job.company || '')}`} className="text-primary-600 hover:text-primary-700 font-medium">{job.company}</Link>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600"><HiMapPin className="w-4 h-4 text-gray-400" />{job.location}</span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600"><HiClock className="w-4 h-4 text-gray-400" />{job.experience}</span>
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-600"><HiBriefcase className="w-4 h-4 text-gray-400" />{job.type}</span>
                      <span className={`inline-flex items-center text-sm font-medium px-2.5 py-0.5 rounded-lg ${getModeColor(job.mode)}`}>{job.mode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-lg font-bold text-primary-600 flex items-center gap-1.5"><HiCurrencyDollar className="w-5 h-5" />{job.salary}</span>
                  <span className="text-sm text-gray-400">Posted {formatDate(job.postedDate)}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    disabled={isApplied}
                    onClick={() => !isApplied && setShowApply(true)}
                    className={`gradient-btn text-white px-6 py-3 rounded-xl font-semibold text-sm flex-1 sm:flex-none min-w-[160px]
  ${isApplied ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {isApplied ? 'Already Applied' : 'Apply Now'}
                  </button>
                  <button onClick={toggleSave} className={`px-5 py-3 rounded-xl font-semibold text-sm border-2 flex items-center justify-center gap-2 transition-colors ${isSaved ? 'border-primary-200 bg-primary-50 text-primary-600' : 'border-gray-200 text-gray-600 hover:border-primary-200 hover:text-primary-600'}`}>
                    <HiBookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />{isSaved ? 'Saved' : 'Save Job'}
                  </button>
                  <button onClick={() => setShowShare(true)} className="px-5 py-3 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-600 hover:border-primary-200 hover:text-primary-600 flex items-center justify-center gap-2 transition-colors">
                    <HiShare className="w-5 h-5" />Share
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-600 leading-relaxed"> {job.description || "No description available."}</p>
              </div>

              {/* Responsibilities */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                <ul className="space-y-3">
                  {(job.responsibilities || []).map((r, i) => (
                    <li key={i} className="flex gap-3 text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />{r}</li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {(job.requirements || []).map((r, i) => (
                    <li key={i} className="flex gap-3 text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />{r}</li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {(job.skills || []).map(s => <span key={s} className="text-sm font-medium text-primary-700 bg-primary-50 px-4 py-2 rounded-xl">{s}</span>)}
                </div>
              </div>

              {/* Company Details */}
              {job.companyDetails && (
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About {job.company}</h2>
                  <p className="text-gray-600 leading-relaxed mb-5">{job.companyDetails?.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-xl p-3 text-center"><HiBuildingOffice2 className="w-5 h-5 mx-auto text-gray-400 mb-1" /><p className="text-xs text-gray-500">Industry</p><p className="text-sm font-semibold text-gray-900">{job.companyDetails?.industry}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center"><HiUserGroup className="w-5 h-5 mx-auto text-gray-400 mb-1" /><p className="text-xs text-gray-500">Size</p><p className="text-sm font-semibold text-gray-900">{job.companyDetails?.size}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center"><HiCalendarDays className="w-5 h-5 mx-auto text-gray-400 mb-1" /><p className="text-xs text-gray-500">Founded</p><p className="text-sm font-semibold text-gray-900">{job.companyDetails?.founded}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center"><HiGlobeAlt className="w-5 h-5 mx-auto text-gray-400 mb-1" /><p className="text-xs text-gray-500">Website</p>
                      <a
                        href={job.companyDetails?.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-primary-600 hover:underline truncate block"
                      >
                        {(job.companyDetails?.website || '').replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Jobs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarJobs.map((j, i) => <JobCard key={j._id || j.id} job={j} index={i} />)}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0 space-y-6">
              <AdPlaceholder type="square" label="Sidebar Ad" />
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Job Overview</h3>
                <div className="space-y-4">
                  {[
                    {
                      label: 'Location',
                      value: job.location || 'Not specified',
                      icon: HiMapPin,
                    },
                    {
                      label: 'Salary',
                      value: job.salary || 'Not disclosed',
                      icon: HiCurrencyDollar,
                    },
                    {
                      label: 'Experience',
                      value: job.experience || 'Not specified',
                      icon: HiClock,
                    },
                    {
                      label: 'Job Type',
                      value: job.type || 'Not specified',
                      icon: HiBriefcase,
                    },
                    {
                      label: 'Work Mode',
                      value: job.mode || 'Not specified',
                      icon: HiGlobeAlt,
                    },
                    {
                      label: 'Posted',
                      value: formatDate(job.postedDate),
                      icon: HiCalendarDays
                    },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <item.icon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div><p className="text-xs text-gray-400">{item.label}</p><p className="text-sm font-medium text-gray-800">{item.value}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal isOpen={showApply} onClose={closeApplyModal} title="Apply for this Position" size="xl">
        <div className="space-y-6">
          {/* Job Summary Banner */}
          <div className="bg-gradient-to-r from-primary-50/70 to-secondary-50/70 dark:from-primary-950/20 dark:to-secondary-950/20 rounded-2xl p-5 flex items-center gap-4 border border-primary-100/60 dark:border-primary-900/30">
            <img src={job.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&size=80`} alt={job.company} className="w-14 h-14 rounded-xl object-cover bg-white shadow-sm" />
            <div>
              <p className="font-extrabold text-gray-900 dark:text-slate-100 text-base">{job.title}</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{job.company} · {job.location} · {job.salary}</p>
            </div>
          </div>
 
          {/* Personal Information */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/80 space-y-4">
            <h3 className="text-sm font-bold text-gray-950 dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">1</span>
              Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.fullName} onChange={e => updateField('fullName', e.target.value)} className={inputClass('fullName')} placeholder="John Doe" />
                {errorText('fullName')}
              </div>
              <div>
                <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className={inputClass('email')} placeholder="john@example.com" />
                {errorText('email')}
              </div>
              <div>
                <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} className={inputClass('phone')} placeholder="+1 (555) 123-4567" />
                {errorText('phone')}
              </div>
              <div>
                <label className={labelClass}>LinkedIn Profile URL</label>
                <input type="url" value={form.linkedIn} onChange={e => updateField('linkedIn', e.target.value)} className={inputClass('linkedIn')} placeholder="https://linkedin.com/in/username" />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="bg-gray-50/50 dark:bg-slate-800/10 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/50 space-y-4">
            <h3 className="text-sm font-bold text-gray-950 dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-450 text-xs font-extrabold flex items-center justify-center">2</span>
              Resume Document <span className="text-red-500 text-xs font-normal">(Required)</span>
            </h3>
            <div>
              {form.resume ? (
                <div className="flex items-center gap-4 p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-250 dark:border-emerald-900/30 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 flex items-center justify-center flex-shrink-0">
                    <HiDocumentText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-slate-200 truncate">{form.resumeName}</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-450">Uploaded successfully</p>
                  </div>
                  <button onClick={removeResume} className="w-8 h-8 rounded-lg hover:bg-emerald-100 dark:hover:bg-slate-800 text-emerald-600 dark:text-emerald-450 hover:text-red-500 flex items-center justify-center transition-colors">
                    <HiXMark className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/10 transition-colors group">
                  <HiCloudArrowUp className="w-8 h-8 text-gray-400 group-hover:text-primary-500 mb-2 transition-colors" />
                  <p className="text-sm text-gray-600 dark:text-slate-300 group-hover:text-primary-600 transition-colors">Click to upload your resume</p>
                  <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
                  <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                </label>
              )}
              {errorText('resume')}
            </div>
          </div>

          {/* Experience & Notice Period */}
          <div className="bg-gray-50/50 dark:bg-slate-800/10 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/50 space-y-4">
            <h3 className="text-sm font-bold text-gray-950 dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-450 text-xs font-extrabold flex items-center justify-center">3</span>
              Experience & Timeline
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Years of Experience <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={form.yearsOfExperience} onChange={e => updateField('yearsOfExperience', e.target.value)} className={inputClass('yearsOfExperience') + ' appearance-none pr-10 cursor-pointer'}>
                    <option value="">Select experience</option>
                    <option value="0-1 years">0-1 years (Fresher)</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-4 years">2-4 years</option>
                    <option value="4-6 years">4-6 years</option>
                    <option value="6-8 years">6-8 years</option>
                    <option value="8-10 years">8-10 years</option>
                    <option value="10-15 years">10-15 years</option>
                    <option value="15+ years">15+ years</option>
                  </select>
                  <HiChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute right-3 top-3 pointer-events-none" />
                </div>
                {errorText('yearsOfExperience')}
              </div>
              <div>
                <label className={labelClass}>Notice Period <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={form.noticePeriod} onChange={e => updateField('noticePeriod', e.target.value)} className={inputClass('noticePeriod') + ' appearance-none pr-10 cursor-pointer'}>
                    <option value="">Select notice period</option>
                    <option value="Immediate">Immediate</option>
                    <option value="15 days">15 days</option>
                    <option value="30 days">30 days</option>
                    <option value="60 days">60 days</option>
                    <option value="90 days">90 days</option>
                    <option value="More than 90 days">More than 90 days</option>
                  </select>
                  <HiChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute right-3 top-3 pointer-events-none" />
                </div>
                {errorText('noticePeriod')}
              </div>
              <div>
                <label className={labelClass}>Current Salary (USD per annum)</label>
                <input type="text" value={form.currentSalary} onChange={e => updateField('currentSalary', e.target.value)} className={inputClass('currentSalary')} placeholder="e.g. $100,000 (optional)" />
              </div>
              <div>
                <label className={labelClass}>Expected Salary (USD per annum) <span className="text-red-500">*</span></label>
                <input type="text" value={form.expectedSalary} onChange={e => updateField('expectedSalary', e.target.value)} className={inputClass('expectedSalary')} placeholder="e.g. $120,000" />
                {errorText('expectedSalary')}
              </div>
            </div>
          </div>

          {/* Availability & Links */}
          <div className="bg-gray-50/50 dark:bg-slate-800/10 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/50 space-y-4">
            <h3 className="text-sm font-bold text-gray-950 dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-450 text-xs font-extrabold flex items-center justify-center">4</span>
              Availability & Portfolios
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>When can you start? <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select value={form.availability} onChange={e => updateField('availability', e.target.value)} className={inputClass('availability') + ' appearance-none pr-10 cursor-pointer'}>
                    <option value="">Select availability</option>
                    <option value="Immediately">Immediately</option>
                    <option value="Within 1 week">Within 1 week</option>
                    <option value="Within 2 weeks">Within 2 weeks</option>
                    <option value="Within 1 month">Within 1 month</option>
                    <option value="Specific date">Specific date (mention in cover letter)</option>
                  </select>
                  <HiChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute right-3 top-3 pointer-events-none" />
                </div>
                {errorText('availability')}
              </div>
              <div>
                <label className={labelClass}>Portfolio / Personal Website</label>
                <input type="url" value={form.portfolio} onChange={e => updateField('portfolio', e.target.value)} className={inputClass('portfolio')} placeholder="https://yourportfolio.com" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Are you open to relocation?</label>
                <div className="flex gap-3 mt-1">
                  {['yes', 'no', 'negotiable'].map(opt => (
                    <label key={opt} className={`flex-1 cursor-pointer`}>
                      <input type="radio" name="relocation" value={opt} checked={form.relocation === opt} onChange={e => updateField('relocation', e.target.value)} className="sr-only peer" />
                      <div className={`text-center py-2.5 rounded-xl text-sm font-semibold border-2 transition-all peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-950/20 peer-checked:text-primary-700 dark:peer-checked:text-primary-400 border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-350 hover:border-gray-300 dark:hover:border-slate-700`}>
                        {opt === 'yes' ? 'Yes' : opt === 'no' ? 'No' : 'Negotiable'}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="bg-gray-50/50 dark:bg-slate-800/10 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/50 space-y-4">
            <h3 className="text-sm font-bold text-gray-950 dark:text-slate-200 border-b border-gray-100 dark:border-slate-800 pb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-500/10 text-primary-700 dark:text-primary-450 text-xs font-extrabold flex items-center justify-center">5</span>
              Cover Letter <span className="text-xs font-normal text-gray-400">(Optional)</span>
            </h3>
            <div>
              <textarea
                maxLength={2000}
                rows={5}
                value={form.coverLetter}
                onChange={e => updateField('coverLetter', e.target.value)}
                className={inputClass('coverLetter') + ' resize-none'}
                placeholder="Highlight relevant experience, skills, and why you are a great fit for this position..."
              />
              <p className="text-xs text-gray-400 mt-1">{form.coverLetter.length} / 2000 characters</p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button onClick={closeApplyModal} disabled={submitting} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50">Cancel</button>
            <button onClick={handleApply} disabled={submitting} className="flex-1 gradient-btn text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
              <HiDocumentText className="w-4 h-4" />
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal isOpen={showShare} onClose={() => setShowShare(false)} title="Share this Job" size="sm">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-4">Copy the link below to share this job listing.</p>
          <div className="flex items-center gap-2">
            <input readOnly value={window.location.href} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50" />
            <button onClick={handleShare} className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-semibold">Copy</button>
          </div>
        </div>
      </Modal>
    </>
  );
}