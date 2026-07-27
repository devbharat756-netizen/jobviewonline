import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMapPin, HiClock, HiBriefcase, HiBookmark, HiShare, HiArrowLeft, HiBuildingOffice2, HiGlobeAlt, HiCalendarDays, HiUserGroup, HiCurrencyDollar, HiDocumentText, HiCloudArrowUp, HiXMark } from 'react-icons/hi2';
import SEO from '@components/common/SEO';
import Breadcrumb from '@components/common/Breadcrumb';
import JobCard from '@components/common/JobCard';
import EmptyState from '@components/common/EmptyState';
import Modal from '@components/common/Modal';
import AdPlaceholder from '@components/common/AdPlaceholder';
import { useJobs } from '@hooks/useJobs';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useToast } from '@context/ToastContext';
import { formatDate, getModeColor } from '@utils/helpers';
import { useState, useRef } from 'react';

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
  const [savedJobs, setSavedJobs] = useLocalStorage('savedJobs', []);
  const [appliedJobs, setAppliedJobs] = useLocalStorage('appliedJobs', []);
  const { addToast } = useToast();
  const [showApply, setShowApply] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const job = jobs.find(j => j.id === Number(id));
  if (!job) return <div className="pt-32 pb-16 max-w-4xl mx-auto px-4"><EmptyState title="Job Not Found" description="This job listing may have been removed or doesn't exist." action={<Link to="/jobs" className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-medium">Browse Jobs</Link>} /></div>;

  const isSaved = savedJobs.some(s => s.id === job.id);
  const isApplied = appliedJobs.some(a => a.jobId === job.id);

  const toggleSave = () => {
    if (isSaved) { setSavedJobs(prev => prev.filter(s => s.id !== job.id)); addToast('Job removed from saved', 'info'); }
    else { setSavedJobs(prev => [...prev, { id: job.id, savedAt: new Date().toISOString() }]); addToast('Job saved!', 'success'); }
  };

  const updateField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      addToast('Please upload a PDF file', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      addToast('File size must be under 5MB', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateField('resume', ev.target.result);
      updateField('resumeName', file.name);
    };
    reader.readAsDataURL(file);
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

  const handleApply = () => {
    if (isApplied) { addToast('You already applied for this job', 'warning'); return; }
    if (!validate()) { addToast('Please fill all required fields', 'error'); return; }

    setAppliedJobs(prev => [...prev, {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      companyLogo: job.companyLogo,
      appliedAt: new Date().toISOString(),
      status: 'Applied',
      applicant: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        expectedSalary: form.expectedSalary,
        currentSalary: form.currentSalary,
        yearsOfExperience: form.yearsOfExperience,
        noticePeriod: form.noticePeriod,
        availability: form.availability,
        relocation: form.relocation,
        linkedIn: form.linkedIn,
        portfolio: form.portfolio,
      },
    }]);
    setForm(emptyForm);
    setErrors({});
    setShowApply(false);
    addToast('Application submitted successfully!', 'success');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShowShare(false);
    addToast('Link copied to clipboard!', 'success');
  };

  const closeApplyModal = () => {
    setForm(emptyForm);
    setErrors({});
    setShowApply(false);
  };

  const similarJobs = jobs.filter(j => j.id !== job.id && (j.category === job.category || j.mode === job.mode)).slice(0, 3);

  const inputClass = (field) => `w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors ${errors[field] ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`;
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';
  const errorText = (field) => errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>;

  return (
    <>
      <SEO path={`/jobs/${job.id}`} title={job.title} description={`${job.title} at ${job.company}. ${job.description.substring(0, 150)}...`} />

      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Jobs', path: '/jobs' }, { label: job.title }]} />

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 min-w-0">
              {/* Header Card */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row items-start gap-5 mb-6">
                  <img src={job.companyLogo} alt={job.company} className="w-16 h-16 rounded-2xl object-cover bg-gray-100 flex-shrink-0" />
                  <div className="flex-1">
                    <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-1">{job.title}</h1>
                    <Link to={`/jobs?company=${encodeURIComponent(job.company)}`} className="text-primary-600 hover:text-primary-700 font-medium">{job.company}</Link>
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
                  <button onClick={() => setShowApply(true)} className={`gradient-btn text-white px-6 py-3 rounded-xl font-semibold text-sm flex-1 sm:flex-none min-w-[160px] ${isApplied ? 'opacity-60 cursor-not-allowed' : ''}`}>
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
                <p className="text-gray-600 leading-relaxed">{job.description}</p>
              </div>

              {/* Responsibilities */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Responsibilities</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex gap-3 text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />{r}</li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-3">
                  {job.requirements.map((r, i) => (
                    <li key={i} className="flex gap-3 text-gray-600"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />{r}</li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Skills Required</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(s => <span key={s} className="text-sm font-medium text-primary-700 bg-primary-50 px-4 py-2 rounded-xl">{s}</span>)}
                </div>
              </div>

              {/* Company Details */}
              {job.companyDetails && (
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About {job.companyDetails.name}</h2>
                  <p className="text-gray-600 leading-relaxed mb-5">{job.companyDetails.description}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-xl p-3 text-center"><HiBuildingOffice2 className="w-5 h-5 mx-auto text-gray-400 mb-1" /><p className="text-xs text-gray-500">Industry</p><p className="text-sm font-semibold text-gray-900">{job.companyDetails.industry}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center"><HiUserGroup className="w-5 h-5 mx-auto text-gray-400 mb-1" /><p className="text-xs text-gray-500">Size</p><p className="text-sm font-semibold text-gray-900">{job.companyDetails.size}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center"><HiCalendarDays className="w-5 h-5 mx-auto text-gray-400 mb-1" /><p className="text-xs text-gray-500">Founded</p><p className="text-sm font-semibold text-gray-900">{job.companyDetails.founded}</p></div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center"><HiGlobeAlt className="w-5 h-5 mx-auto text-gray-400 mb-1" /><p className="text-xs text-gray-500">Website</p><p className="text-sm font-semibold text-primary-600 truncate">{job.companyDetails.website.replace('https://', '')}</p></div>
                  </div>
                </div>
              )}

              {/* Similar Jobs */}
              {similarJobs.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Jobs</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarJobs.map((j, i) => <JobCard key={j.id} job={j} index={i} />)}
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
                    { label: 'Location', value: job.location, icon: HiMapPin },
                    { label: 'Salary', value: job.salary, icon: HiCurrencyDollar },
                    { label: 'Experience', value: job.experience, icon: HiClock },
                    { label: 'Job Type', value: job.type, icon: HiBriefcase },
                    { label: 'Work Mode', value: job.mode, icon: HiGlobeAlt },
                    { label: 'Posted', value: formatDate(job.postedDate), icon: HiCalendarDays },
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
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* Job Summary Banner */}
          <div className="bg-gradient-to-r from-primary-50 to-amber-50 rounded-xl p-4 flex items-center gap-4 border border-primary-100">
            <img src={job.companyLogo} alt={job.company} className="w-12 h-12 rounded-xl object-cover bg-white shadow-sm" />
            <div>
              <p className="font-bold text-gray-900 text-sm">{job.title}</p>
              <p className="text-xs text-gray-500">{job.company} · {job.location} · {job.salary}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">1</span>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-8">
              <div>
                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={form.fullName} onChange={e => updateField('fullName', e.target.value)} className={inputClass('fullName')} placeholder="John Doe" />
                {errorText('fullName')}
              </div>
              <div>
                <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} className={inputClass('email')} placeholder="john@example.com" />
                {errorText('email')}
              </div>
              <div>
                <label className={labelClass}>Phone <span className="text-red-500">*</span></label>
                <input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)} className={inputClass('phone')} placeholder="+1 (555) 123-4567" />
                {errorText('phone')}
              </div>
              <div>
                <label className={labelClass}>LinkedIn Profile</label>
                <input type="url" value={form.linkedIn} onChange={e => updateField('linkedIn', e.target.value)} className={inputClass('linkedIn')} placeholder="https://linkedin.com/in/..." />
              </div>
            </div>
          </div>

          {/* Resume */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">2</span>
              Resume <span className="text-red-500 text-xs font-normal">(Required)</span>
            </h3>
            <div className="pl-8">
              {form.resume ? (
                <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <HiDocumentText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{form.resumeName}</p>
                    <p className="text-xs text-emerald-600">Uploaded successfully</p>
                  </div>
                  <button onClick={removeResume} className="w-8 h-8 rounded-lg hover:bg-emerald-100 text-emerald-600 hover:text-red-500 flex items-center justify-center transition-colors">
                    <HiXMark className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/30 transition-colors group">
                  <HiCloudArrowUp className="w-8 h-8 text-gray-400 group-hover:text-primary-500 mb-2 transition-colors" />
                  <p className="text-sm text-gray-500 group-hover:text-primary-600 transition-colors">Click to upload your resume</p>
                  <p className="text-xs text-gray-400 mt-1">PDF only, max 5MB</p>
                  <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                </label>
              )}
              {errorText('resume')}
            </div>
          </div>

          {/* Experience & Salary */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">3</span>
              Experience & Salary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-8">
              <div>
                <label className={labelClass}>Years of Experience <span className="text-red-500">*</span></label>
                <select value={form.yearsOfExperience} onChange={e => updateField('yearsOfExperience', e.target.value)} className={inputClass('yearsOfExperience')}>
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
                {errorText('yearsOfExperience')}
              </div>
              <div>
                <label className={labelClass}>Expected Salary <span className="text-red-500">*</span></label>
                <input type="text" value={form.expectedSalary} onChange={e => updateField('expectedSalary', e.target.value)} className={inputClass('expectedSalary')} placeholder="$120,000/year" />
                {errorText('expectedSalary')}
              </div>
              <div>
                <label className={labelClass}>Current Salary</label>
                <input type="text" value={form.currentSalary} onChange={e => updateField('currentSalary', e.target.value)} className={inputClass('currentSalary')} placeholder="$100,000/year (optional)" />
              </div>
              <div>
                <label className={labelClass}>Notice Period <span className="text-red-500">*</span></label>
                <select value={form.noticePeriod} onChange={e => updateField('noticePeriod', e.target.value)} className={inputClass('noticePeriod')}>
                  <option value="">Select notice period</option>
                  <option value="Immediate">Immediate</option>
                  <option value="15 days">15 days</option>
                  <option value="30 days">30 days</option>
                  <option value="60 days">60 days</option>
                  <option value="90 days">90 days</option>
                  <option value="More than 90 days">More than 90 days</option>
                </select>
                {errorText('noticePeriod')}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">4</span>
              Availability
            </h3>
            <div className="pl-8 space-y-4">
              <div>
                <label className={labelClass}>When can you start? <span className="text-red-500">*</span></label>
                <select value={form.availability} onChange={e => updateField('availability', e.target.value)} className={inputClass('availability')}>
                  <option value="">Select availability</option>
                  <option value="Immediately">Immediately</option>
                  <option value="Within 1 week">Within 1 week</option>
                  <option value="Within 2 weeks">Within 2 weeks</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="Specific date">Specific date (mention in cover letter)</option>
                </select>
                {errorText('availability')}
              </div>
              <div>
                <label className={labelClass}>Open to Relocation?</label>
                <div className="flex gap-3 mt-1">
                  {['yes', 'no', 'negotiable'].map(opt => (
                    <label key={opt} className={`flex-1 cursor-pointer`}>
                      <input type="radio" name="relocation" value={opt} checked={form.relocation === opt} onChange={e => updateField('relocation', e.target.value)} className="sr-only peer" />
                      <div className={`text-center py-2.5 rounded-xl text-sm font-medium border-2 transition-colors peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700 border-gray-200 text-gray-600 hover:border-gray-300`}>
                        {opt === 'yes' ? 'Yes' : opt === 'no' ? 'No' : 'Negotiable'}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Portfolio / Website</label>
                <input type="url" value={form.portfolio} onChange={e => updateField('portfolio', e.target.value)} className={inputClass('portfolio')} placeholder="https://yourportfolio.com" />
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">5</span>
              Cover Letter <span className="text-xs font-normal text-gray-400">(Optional)</span>
            </h3>
            <div className="pl-8">
              <textarea
                rows={5}
                value={form.coverLetter}
                onChange={e => updateField('coverLetter', e.target.value)}
                className={inputClass('coverLetter') + ' resize-none'}
                placeholder="Why are you interested in this role? What makes you a great fit? Highlight relevant experience, skills, and achievements..."
              />
              <p className="text-xs text-gray-400 mt-1">{form.coverLetter.length} / 2000 characters</p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
            <button onClick={closeApplyModal} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleApply} className="flex-1 gradient-btn text-white px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              <HiDocumentText className="w-4 h-4" />
              Submit Application
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