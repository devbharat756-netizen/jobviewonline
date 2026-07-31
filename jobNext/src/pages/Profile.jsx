import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiCloudArrowUp, HiTrash, HiDocumentText } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import SEO from '@components/common/SEO';
import DashboardSidebar from '@components/layout/DashboardSidebar';
import { useToast } from '@context/ToastContext';

import { useAuth } from '../context/AuthContext';

const emptyProfile = { name: '', email: '', phone: '', address: '', about: '', skills: [], education: [{ degree: '', school: '', year: '' }], experience: [{ title: '', company: '', duration: '' }], portfolio: '', github: '', linkedin: '', avatar: '', resume: '' };

const normalizeProfile = (value) => ({
  ...emptyProfile,
  ...(value || {}),
  skills: Array.isArray(value?.skills) ? value.skills : [],
  education: Array.isArray(value?.education) && value.education.length > 0
    ? value.education.map(e => ({ degree: e.degree || '', school: e.school || '', year: e.year || '' }))
    : [{ degree: '', school: '', year: '' }],
  experience: Array.isArray(value?.experience) && value.experience.length > 0
    ? value.experience.map(ex => ({ title: ex.title || '', company: ex.company || '', duration: ex.duration || '' }))
    : [{ title: '', company: '', duration: '' }],
});

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();
  const [skillInput, setSkillInput] = useState('');
  const [formState, setFormState] = useState(normalizeProfile(user));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormState(normalizeProfile(user));
    }
  }, [user]);

  const safeProfile = formState;

  const update = (key, value) => {
    let formatted = value;
    if (key === 'phone' && typeof value === 'string') {
      formatted = value.replace(/\D/g, '').slice(0, 10);
    } else if (typeof value === 'string' && key !== 'email' && key !== 'portfolio' && key !== 'github' && key !== 'linkedin' && key !== 'avatar' && key !== 'resume') {
      formatted = value.charAt(0).toUpperCase() + value.slice(1);
    }
    setFormState(prev => normalizeProfile({ ...prev, [key]: formatted }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !safeProfile.skills.includes(skillInput.trim())) {
      const tag = skillInput.trim();
      const capitalized = tag.charAt(0).toUpperCase() + tag.slice(1);
      update('skills', [...safeProfile.skills, capitalized]);
      setSkillInput('');
    }
  };

  const removeSkill = (s) => update('skills', safeProfile.skills.filter(sk => sk !== s));

  const addEducation = () => update('education', [...safeProfile.education, { degree: '', school: '', year: '' }]);
  const updateEducation = (i, key, val) => {
    const ed = [...safeProfile.education];
    let formatted = val;
    if (typeof val === 'string' && key !== 'year') {
      formatted = val.charAt(0).toUpperCase() + val.slice(1);
    }
    ed[i] = { ...ed[i], [key]: formatted };
    update('education', ed);
  };
  const removeEducation = (i) => update('education', safeProfile.education.filter((_, idx) => idx !== i));

  const addExperience = () => update('experience', [...safeProfile.experience, { title: '', company: '', duration: '' }]);
  const updateExperience = (i, key, val) => {
    const ex = [...safeProfile.experience];
    let formatted = val;
    if (typeof val === 'string' && key !== 'duration') {
      formatted = val.charAt(0).toUpperCase() + val.slice(1);
    }
    ex[i] = { ...ex[i], [key]: formatted };
    update('experience', ex);
  };
  const removeExperience = (i) => update('experience', safeProfile.experience.filter((_, idx) => idx !== i));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      addToast("Please upload an image file (PNG, JPG, WebP).", "error");
      return;
    }
    update('avatarFile', file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      update('avatar', ev.target.result);
      addToast('Profile image selected locally. Click Save to upload.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleResume = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      addToast('Please upload a PDF file.', 'error');
      return;
    }
    update('resumeFile', file);
    update('resume', file.name);
    addToast('Resume file selected locally. Click Save to upload.', 'info');
  };

  const handleSave = async () => {
    if (!formState.name.trim()) {
      addToast('Name is required.', 'error');
      return;
    }
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', formState.name);
      formData.append('phone', formState.phone || '');
      formData.append('address', formState.address || '');
      formData.append('about', formState.about || '');
      formData.append('skills', JSON.stringify(formState.skills));
      formData.append('education', JSON.stringify(formState.education));
      formData.append('experience', JSON.stringify(formState.experience));
      formData.append('portfolio', formState.portfolio || '');
      formData.append('github', formState.github || '');
      formData.append('linkedin', formState.linkedin || '');

      if (formState.avatarFile) {
        formData.append('avatar', formState.avatarFile);
      }
      if (formState.resumeFile) {
        formData.append('resume', formState.resumeFile);
      }

      const res = await updateProfile(formData);
      if (res.success) {
        // Reset file controls
        setFormState(prev => ({
          ...prev,
          avatarFile: null,
          resumeFile: null,
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500';

  return (
    <>
      <SEO path="/dashboard/profile" title="Edit Profile" description="Edit your jobView profile - update your personal info, skills, education, and experience." />
      <div className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <DashboardSidebar />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 min-w-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Edit Profile</h1>

                <div className="space-y-6">
                  {/* Avatar & Resume */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                      <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 transition-colors overflow-hidden">
                        {safeProfile.avatar ? <img src={safeProfile.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <><HiCloudArrowUp className="w-6 h-6 text-gray-400" /><span className="text-[10px] text-gray-400 mt-1">Upload</span></>}
                        <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                      </label>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Resume (PDF)</label>
                      <div className="flex items-center gap-3">
                        <label className="flex-1 flex items-center gap-3 px-4 py-3 border border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary-400 transition-colors">
                          <HiCloudArrowUp className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-500">{safeProfile.resume ? 'Resume uploaded ✓' : 'Choose PDF file'}</span>
                          <input type="file" accept=".pdf" onChange={handleResume} className="hidden" />
                        </label>
                        {safeProfile.resume && (
                          <a
                            href={safeProfile.resume}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-xl text-sm font-semibold border border-emerald-200 transition-colors flex items-center gap-1.5"
                            title="View current resume PDF"
                          >
                            <HiDocumentText className="w-5 h-5" />
                            View
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label><input type="text" value={safeProfile.name} onChange={e => update('name', e.target.value)} className={inputClass} placeholder="John Doe" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input type="email" value={safeProfile.email} readOnly className={`${inputClass} bg-gray-100 cursor-not-allowed`} placeholder="john@example.com" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label><input type="tel" value={safeProfile.phone} onChange={e => update('phone', e.target.value)} className={inputClass} placeholder="e.g. 5550000000" /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label><input type="text" value={safeProfile.address} onChange={e => update('address', e.target.value)} className={inputClass} placeholder="San Francisco, CA" /></div>
                  </div>

                  {/* About */}
                  <div><label className="block text-sm font-medium text-gray-700 mb-1.5">About Me</label><textarea rows={4} value={safeProfile.about} onChange={e => update('about', e.target.value)} className={inputClass + ' resize-none'} placeholder="Tell employers about yourself..." /></div>

                  {/* Skills */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills</label>
                    <div className="flex gap-2 mb-3"><input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className={inputClass + ' flex-1'} placeholder="Type a skill and press Enter" /><button type="button" onClick={addSkill} className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-medium">Add</button></div>
                    <div className="flex flex-wrap gap-2">{safeProfile.skills.map(s => <span key={s} className="inline-flex items-center gap-1 text-sm text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg">{s}<button onClick={() => removeSkill(s)} className="hover:text-red-500"><HiTrash className="w-3.5 h-3.5" /></button></span>)}</div>
                  </div>

                  {/* Education */}
                  <div>
                    <div className="flex items-center justify-between mb-3"><label className="text-sm font-medium text-gray-700">Education</label><button type="button" onClick={addEducation} className="text-xs text-primary-600 font-medium hover:text-primary-700">+ Add</button></div>
                    <div className="space-y-3">
                      {safeProfile.education.map((ed, i) => (
                        <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
                          <input type="text" value={ed.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} className={inputClass} placeholder="Degree" />
                          <input type="text" value={ed.school} onChange={e => updateEducation(i, 'school', e.target.value)} className={inputClass} placeholder="School" />
                          <div className="flex gap-2"><input type="text" value={ed.year} onChange={e => updateEducation(i, 'year', e.target.value)} className={inputClass + ' flex-1'} placeholder="Year" />{safeProfile.education.length > 1 && <button onClick={() => removeEducation(i)} className="w-10 h-10 text-red-400 hover:text-red-600 flex items-center justify-center"><HiTrash className="w-4 h-4" /></button>}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience */}
                  <div>
                    <div className="flex items-center justify-between mb-3"><label className="text-sm font-medium text-gray-700">Experience</label><button type="button" onClick={addExperience} className="text-xs text-primary-600 font-medium hover:text-primary-700">+ Add</button></div>
                    <div className="space-y-3">
                      {safeProfile.experience.map((ex, i) => (
                        <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
                          <input type="text" value={ex.title} onChange={e => updateExperience(i, 'title', e.target.value)} className={inputClass} placeholder="Job Title" />
                          <input type="text" value={ex.company} onChange={e => updateExperience(i, 'company', e.target.value)} className={inputClass} placeholder="Company" />
                          <div className="flex gap-2"><input type="text" value={ex.duration} onChange={e => updateExperience(i, 'duration', e.target.value)} className={inputClass + ' flex-1'} placeholder="Duration" />{safeProfile.experience.length > 1 && <button onClick={() => removeExperience(i)} className="w-10 h-10 text-red-400 hover:text-red-600 flex items-center justify-center"><HiTrash className="w-4 h-4" /></button>}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Portfolio URL</label><input type="url" value={safeProfile.portfolio} onChange={e => update('portfolio', e.target.value)} className={inputClass} placeholder="https://..." /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">GitHub</label><input type="url" value={safeProfile.github} onChange={e => update('github', e.target.value)} className={inputClass} placeholder="https://github.com/..." /></div>
                    <div><label className="block text-sm font-medium text-gray-700 mb-1.5">LinkedIn</label><input type="url" value={safeProfile.linkedin} onChange={e => update('linkedin', e.target.value)} className={inputClass} placeholder="https://linkedin.com/in/..." /></div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={handleSave}
                      disabled={submitting}
                      className="gradient-btn text-white px-8 py-3 rounded-xl font-semibold text-sm disabled:opacity-60 transition-opacity cursor-pointer"
                    >
                      {submitting ? 'Saving Profile...' : 'Save Profile'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}