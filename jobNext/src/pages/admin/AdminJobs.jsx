import { useState, useEffect } from "react";
import {
  HiPlus,
  HiPencilSquare,
  HiTrash,
  HiEye,
  HiEyeSlash,
  HiXMark,
  HiChevronDown,
} from "react-icons/hi2";

import Modal from "@components/common/Modal";
import EmptyState from "@components/common/EmptyState";
import { useJobs } from "@hooks/useJobs";
import { useFreelance } from "@hooks/useFreelance";
import { useToast } from "@context/ToastContext";
import { EMPLOYMENT_TYPES, WORK_MODES } from "@utils/constants";

import {
  createJob,
  updateJob,
  deleteJob,
  togglePublish,
} from "../../services/jobService";
import {
  createFreelanceProject,
  updateFreelanceProject,
  deleteFreelanceProject,
  togglePublishFreelance,
} from "../../services/freelanceService";

const getEmptyJob = () => ({
  title: "",
  company: "",
  companyLogo: "",
  salary: "",
  salaryMin: 0,
  salaryMax: 0,
  experience: "",
  location: "",
  type: "Full-time",
  mode: "Onsite",
  category: "",
  skills: [],
  description: "",
  responsibilities: [""],
  requirements: [""],
  postedDate: new Date().toISOString(),
  published: true,
  isFreelance: false,
  companyDetails: {
    name: "",
    size: "",
    industry: "",
    founded: "",
    website: "",
    description: "",
  },
});

export default function AdminJobs() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [defaultSkills, setDefaultSkills] = useState([]);

  const jobHooks = useJobs();
  const freelanceHooks = useFreelance();
  const currentHooks = activeTab === "jobs" ? jobHooks : freelanceHooks;

  const { addToast } = useToast();

  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState(getEmptyJob());

  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    fetch("/data/skills.json")
      .then((res) => res.json())
      .then((data) => setDefaultSkills(data))
      .catch(console.error);
  }, []);


  const openAdd = () => {
    setEditing(null);
    setForm({
      ...getEmptyJob(),
      isFreelance: activeTab === "freelance",
    });
    setModal(true);
  };

  const openEdit = (job) => {
    setEditing(job._id);

    setForm({
      ...job,
      responsibilities: job.responsibilities || [""],
      requirements: job.requirements || [""],
      isFreelance: activeTab === "freelance" || job.isFreelance || false,
      companyDetails: {
        name: job.companyDetails?.name || "",
        size: job.companyDetails?.size || "",
        industry: job.companyDetails?.industry || "",
        founded: job.companyDetails?.founded || "",
        website: job.companyDetails?.website || "",
        description: job.companyDetails?.description || "",
      },
    });

    setModal(true);
  };

  const save = async () => {
    if (!form.title || !form.company) {
      addToast("Title and Company are required", "error");
      return;
    }

    const computedSalary = form.salaryMin || form.salaryMax
      ? (activeTab === "freelance"
        ? `₹${Number(form.salaryMin).toLocaleString()} - ₹${Number(form.salaryMax).toLocaleString()} (Project Budget)`
        : `₹${Number(form.salaryMin).toLocaleString()} - ₹${Number(form.salaryMax).toLocaleString()}`)
      : "Negotiable";

    const payload = {
      ...form,
      salary: computedSalary,
      companyDetails: {
        ...form.companyDetails,
        name: form.company,
      }
    };

    try {
      if (editing) {
        if (activeTab === "freelance") {
          await updateFreelanceProject(editing, payload);
        } else {
          await updateJob(editing, payload);
        }
        addToast("Updated successfully", "success");
      } else {
        if (activeTab === "freelance") {
          await createFreelanceProject(payload);
        } else {
          await createJob(payload);
        }
        addToast("Created successfully", "success");
      }

      await currentHooks.fetchJobs();
      setModal(false);
      setEditing(null);
      setForm(getEmptyJob());
    } catch (err) {
      console.log(err);
      addToast("Something went wrong", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this listing?")) return;

    try {
      if (activeTab === "freelance") {
        await deleteFreelanceProject(id);
      } else {
        await deleteJob(id);
      }
      await currentHooks.fetchJobs();
      addToast("Deleted successfully", "success");
    } catch (err) {
      console.log(err);
      addToast("Delete failed", "error");
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      if (activeTab === "freelance") {
        await togglePublishFreelance(id);
      } else {
        await togglePublish(id);
      }
      await currentHooks.fetchJobs();
      addToast("Status Updated", "success");
    } catch (err) {
      console.log(err);
      addToast("Failed to update status", "error");
    }
  };

  const updateField = (key, val) => {
    let formatted = val;
    if (typeof val === "string" && key !== "companyLogo" && key !== "website") {
      formatted = val.charAt(0).toUpperCase() + val.slice(1);
    }
    setForm((prev) => ({
      ...prev,
      [key]: formatted,
    }));
  };

  const updateCompanyDetail = (key, val) => {
    let formatted = val;
    if (typeof val === "string" && key !== "website") {
      formatted = val.charAt(0).toUpperCase() + val.slice(1);
    }
    setForm((prev) => ({
      ...prev,
      companyDetails: {
        ...prev.companyDetails,
        [key]: formatted,
      },
    }));
  };

  const addListItem = (key) =>
    updateField(key, [...form[key], ""]);

  const updateListItem = (key, i, val) => {
    const arr = [...form[key]];
    arr[i] = typeof val === "string" ? val.charAt(0).toUpperCase() + val.slice(1) : val;
    updateField(key, arr);
  };

  const removeListItem = (key, i) => {
    updateField(
      key,
      form[key].filter((_, idx) => idx !== i)
    );
  };

  const addSkill = () => {
    if (
      skillInput.trim() &&
      !(form.skills || []).includes(skillInput.trim())
    ) {
      const tag = skillInput.trim();
      const capitalized = tag.charAt(0).toUpperCase() + tag.slice(1);
      updateField("skills", [...form.skills, capitalized]);

      setSkillInput("");
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500";

  const labelClass =
    "block text-sm font-medium text-gray-700 dark:text-slate-350 mb-1";

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-gray-150 dark:border-slate-800/80 pb-1">
        <div className="flex gap-5">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === "jobs"
                ? "border-primary-500 text-primary-650 dark:text-primary-400"
                : "border-transparent text-gray-500 dark:text-slate-450 hover:text-gray-700"
              }`}
          >
            Permanent Jobs ({jobHooks.allJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("freelance")}
            className={`pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === "freelance"
                ? "border-secondary-500 text-secondary-650 dark:text-secondary-400"
                : "border-transparent text-gray-500 dark:text-slate-450 hover:text-gray-700"
              }`}
          >
            Freelance Projects ({freelanceHooks.allJobs.length})
          </button>
        </div>
        <button onClick={openAdd} className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 mb-2"><HiPlus className="w-4 h-4" />{activeTab === "jobs" ? "Add Job" : "Add Project"}</button>
      </div>

      {currentHooks.allJobs.length === 0 ? (
        <EmptyState title={activeTab === "jobs" ? "No jobs yet" : "No freelance projects yet"} description={activeTab === "jobs" ? "Add your first job listing." : "Add your first freelance project."} action={<button onClick={openAdd} className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-medium">Add {activeTab === "jobs" ? "Job" : "Project"}</button>} />
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-150 dark:border-slate-800/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 text-left border-b border-gray-150 dark:border-slate-800/60">
                  <th className="px-6 py-4 font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Job / Company</th>
                  <th className="px-6 py-4 font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Salary Range</th>
                  <th className="px-6 py-4 font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Mode</th>
                  <th className="px-6 py-4 font-bold text-gray-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 font-bold text-gray-500 dark:text-slate-400 text-xs tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                {currentHooks.allJobs.map(j => (
                  <tr key={j._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/10 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={j.companyLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(j.company)}&background=random`}
                          alt={j.company}
                          className="w-10 h-10 rounded-xl object-cover bg-white shadow-sm flex-shrink-0 border border-gray-100 dark:border-slate-800/65"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-slate-200 flex items-center gap-1.5">
                            {j.title}
                            {j.isFreelance && <span className="text-[10px] font-bold text-secondary-700 bg-secondary-50 dark:bg-secondary-500/10 dark:text-secondary-400 px-1.5 py-0.5 rounded border border-secondary-100 dark:border-secondary-500/15">Freelance</span>}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{j.company}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-slate-300 font-medium">
                      {j.salary || "Negotiable"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border ${j.mode === 'Remote'
                          ? 'bg-emerald-50/50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                          : j.mode === 'Hybrid'
                            ? 'bg-amber-50/50 border-amber-100 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'
                            : 'bg-blue-50/50 border-blue-100 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400'
                        }`}>
                        {j.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${j.published !== false
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400'
                          : 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${j.published !== false ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {j.published !== false ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(j._id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${j.published !== false
                              ? 'text-amber-600 hover:bg-amber-50 border-amber-100 dark:text-amber-400 dark:border-amber-500/25 dark:hover:bg-amber-500/10'
                              : 'text-emerald-600 hover:bg-emerald-50 border-emerald-100 dark:text-emerald-400 dark:border-emerald-500/25 dark:hover:bg-emerald-500/10'
                            }`}
                          title={j.published !== false ? 'Change to Draft' : 'Publish Job'}
                        >
                          {j.published !== false ? <HiEyeSlash className="w-4.5 h-4.5" /> : <HiEye className="w-4.5 h-4.5" />}
                        </button>
                        <button onClick={() => openEdit(j)} className="w-8 h-8 rounded-lg border border-gray-150 dark:border-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 transition-colors" title="Edit"><HiPencilSquare className="w-4.5 h-4.5" /></button>
                        <button onClick={() => handleDelete(j._id)} className="w-8 h-8 rounded-lg border border-red-100 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center justify-center text-red-500 transition-colors" title="Delete"><HiTrash className="w-4.5 h-4.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modal}
        onClose={() => {
          setModal(false);
          setEditing(null);
          setForm(getEmptyJob());
        }} title={editing ? (form.isFreelance ? 'Edit Freelance Project' : 'Edit Job') : (form.isFreelance ? 'Add Freelance Project' : 'Add Job')} size="full">
        <div className="space-y-6">
          {/* Section 1: Job Overview */}
          <div className="bg-gray-50/50 dark:bg-slate-800/10 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/50 space-y-4">
            <h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">{form.isFreelance ? 'Project Overview' : 'Role Overview'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClass}>{form.isFreelance ? 'Project Title *' : 'Job Title *'}</label><input type="text" value={form.title} onChange={e => updateField('title', e.target.value)} className={inputClass} placeholder={form.isFreelance ? 'e.g. Design a landing page for SaaS' : 'e.g. Senior Frontend Developer'} /></div>
              <div><label className={labelClass}>{form.isFreelance ? 'Client / Organization *' : 'Company *'}</label><input type="text" value={form.company} onChange={e => updateField('company', e.target.value)} className={inputClass} placeholder={form.isFreelance ? 'e.g. Acme Corp or Client Name' : 'e.g. TechNova Inc.'} /></div>
              <div><label className={labelClass}>{form.isFreelance ? 'Client Logo URL' : 'Company Logo URL'}</label><input type="text" value={form.companyLogo} onChange={e => updateField('companyLogo', e.target.value)} className={inputClass} placeholder="https://example.com/logo.png" /></div>
              <div><label className={labelClass}>Category</label><input type="text" value={form.category} onChange={e => updateField('category', e.target.value)} className={inputClass} placeholder="e.g. Engineering" /></div>
              <div><label className={labelClass}>{form.isFreelance ? 'Project Duration' : 'Experience Level'}</label><input type="text" value={form.experience} onChange={e => updateField('experience', e.target.value)} className={inputClass} placeholder={form.isFreelance ? 'e.g. 2 months, 6 weeks' : 'e.g. 3-5 years'} /></div>
            </div>
          </div>

          {/* Section 2: Work Parameters */}
          <div className="bg-gray-50/50 dark:bg-slate-800/10 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/50 space-y-4">
            <h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">Work Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Employment Type</label>
                <div className="relative">
                  <select value={form.type} onChange={e => updateField('type', e.target.value)} className={inputClass + ' appearance-none pr-10 cursor-pointer'}>
                    {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <HiChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className={labelClass}>Work Mode</label>
                <div className="relative">
                  <select value={form.mode} onChange={e => updateField('mode', e.target.value)} className={inputClass + ' appearance-none pr-10 cursor-pointer'}>
                    {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <HiChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>
              <div><label className={labelClass}>Location</label><input type="text" value={form.location} onChange={e => updateField('location', e.target.value)} className={inputClass} placeholder="e.g. San Francisco, CA" /></div>
            </div>
          </div>

          {/* Section 3: Compensation */}
          <div className="bg-gray-50/50 dark:bg-slate-800/10 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/50 space-y-4">
            <h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">{form.isFreelance ? 'Project Budget (INR)' : 'Compensation (INR per annum)'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClass}>{form.isFreelance ? 'Minimum Budget (INR)' : 'Minimum Salary (INR)'}</label><input type="number" value={form.salaryMin || ''} onChange={e => updateField('salaryMin', Number(e.target.value))} className={inputClass} placeholder={form.isFreelance ? 'e.g. 5000' : 'e.g. 120000'} /></div>
              <div><label className={labelClass}>{form.isFreelance ? 'Maximum Budget (INR)' : 'Maximum Salary (INR)'}</label><input type="number" value={form.salaryMax || ''} onChange={e => updateField('salaryMax', Number(e.target.value))} className={inputClass} placeholder={form.isFreelance ? 'e.g. 10000' : 'e.g. 160000'} /></div>
            </div>
          </div>

          {/* Section 4: Details & Skills */}
          <div className="bg-gray-50/50 dark:bg-slate-800/10 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/50 space-y-4">
            <h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">Details & Skills</h3>
            <div><label className={labelClass}>Job Description</label><textarea rows={4} value={form.description} onChange={e => updateField('description', e.target.value)} className={inputClass + ' resize-none'} placeholder="Write high-level details of the job listing..." /></div>
            <div>
              <label className={labelClass}>Skills</label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className={inputClass + ' flex-1'} placeholder="Press Enter or Add to append skill tag..." />
                <button type="button" onClick={addSkill} className="px-5 py-2.5 bg-gray-150 dark:bg-slate-800 text-gray-700 dark:text-slate-250 rounded-xl text-sm font-semibold hover:bg-gray-200 dark:hover:bg-slate-700 cursor-pointer">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(form.skills || []).map(s => (
                  <span key={s} className="inline-flex items-center gap-1.5 text-xs text-primary-750 bg-primary-50 dark:bg-primary-500/10 dark:text-primary-400 px-3 py-1.5 rounded-xl font-medium border border-primary-100/50 dark:border-primary-500/20">
                    {s}
                    <button type="button" onClick={() => updateField('skills', form.skills.filter(sk => sk !== s))} className="text-primary-500 hover:text-primary-700"><HiXMark className="w-3.5 h-3.5" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: List Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Responsibilities */}
            <div className="bg-gray-50/50 dark:bg-slate-800/10 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/50 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2"><h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm">Responsibilities</h3><button type="button" onClick={() => addListItem('responsibilities')} className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">+ Add</button></div>
              <div className="space-y-2">
                {form.responsibilities.map((r, i) => <div key={i} className="flex gap-2"><input type="text" value={r} onChange={e => updateListItem('responsibilities', i, e.target.value)} className={inputClass + ' flex-1'} placeholder="Responsibility..." />{form.responsibilities.length > 1 && <button type="button" onClick={() => removeListItem('responsibilities', i)} className="text-red-400 hover:text-red-650"><HiXMark className="w-5 h-5" /></button>}</div>)}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-gray-50/50 dark:bg-slate-800/10 p-5 rounded-2xl border border-gray-150 dark:border-slate-800/50 space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2"><h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm">Requirements</h3><button type="button" onClick={() => addListItem('requirements')} className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">+ Add</button></div>
              <div className="space-y-2">
                {form.requirements.map((r, i) => <div key={i} className="flex gap-2"><input type="text" value={r} onChange={e => updateListItem('requirements', i, e.target.value)} className={inputClass + ' flex-1'} placeholder="Requirement..." />{form.requirements.length > 1 && <button type="button" onClick={() => removeListItem('requirements', i)} className="text-red-400 hover:text-red-650"><HiXMark className="w-5 h-5" /></button>}</div>)}
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="border-t border-gray-100 dark:border-slate-800 pt-5">
            <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-3">{form.isFreelance ? 'Client / Organization Details' : 'Company Details'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClass}>Industry</label><input type="text" value={form.companyDetails.industry || ''} onChange={e => updateCompanyDetail('industry', e.target.value)} className={inputClass} placeholder={form.isFreelance ? 'e.g. Design, Software' : ''} /></div>
              <div><label className={labelClass}>Size</label><input type="text" value={form.companyDetails.size || ''} onChange={e => updateCompanyDetail('size', e.target.value)} className={inputClass} placeholder="e.g. 10-50" /></div>
              <div><label className={labelClass}>Founded</label><input type="text" value={form.companyDetails.founded || ''} onChange={e => updateCompanyDetail('founded', e.target.value)} className={inputClass} placeholder="e.g. 2020" /></div>
              <div><label className={labelClass}>Website</label><input type="text" value={form.companyDetails.website || ''} onChange={e => updateCompanyDetail('website', e.target.value)} className={inputClass} placeholder="https://..." /></div>
            </div>
            <div className="mt-4"><label className={labelClass}>{form.isFreelance ? 'Client / Project Description' : 'Company Description'}</label><textarea rows={3} value={form.companyDetails.description || ''} onChange={e => updateCompanyDetail('description', e.target.value)} className={inputClass + ' resize-none'} /></div>
          </div>

          {/* Job Status Selection Block */}
          <div className="border-t border-gray-100 pt-5">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2.5">Job Status</label>
            <div className="grid grid-cols-2 gap-4">
              {/* Draft option */}
              <button
                type="button"
                onClick={() => updateField('published', false)}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${form.published === false
                    ? 'border-amber-500 bg-amber-500/[0.03] dark:border-amber-500/80 dark:bg-amber-500/[0.05]'
                    : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
                  }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${form.published === false ? 'border-amber-500 font-semibold text-amber-500' : 'border-gray-300'}`}>
                  {form.published === false && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-slate-200">Save as Draft</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Save details without showing to candidates.</p>
                </div>
              </button>

              {/* Published option */}
              <button
                type="button"
                onClick={() => updateField('published', true)}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${form.published !== false
                    ? 'border-emerald-500 bg-emerald-500/[0.03] dark:border-emerald-500/80 dark:bg-emerald-500/[0.05]'
                    : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700'
                  }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${form.published !== false ? 'border-emerald-500 font-semibold text-emerald-500' : 'border-gray-300'}`}>
                  {form.published !== false && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-slate-200">Publish Immediately</h4>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Activate listing immediately for job seekers.</p>
                </div>
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button onClick={() => setModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={save} className="flex-1 gradient-btn text-white px-4 py-2.5 rounded-xl text-sm font-semibold">{editing ? 'Update Job' : 'Add Job'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}