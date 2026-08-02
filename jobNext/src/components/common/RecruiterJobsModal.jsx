import { useState, useEffect } from "react";
import { HiXMark, HiChevronDown } from "react-icons/hi2";
import Modal from "./Modal";
import { WORK_MODES, EMPLOYMENT_TYPES } from "@utils/constants";
import { useToast } from "@context/ToastContext";
import { createJob, updateJob } from "../../services/jobService";
import { createFreelanceProject, updateFreelanceProject } from "../../services/freelanceService";

const getEmptyJob = (isFreelance = false) => ({
  title: "",
  company: "",
  companyLogo: "",
  category: "",
  experience: "",
  type: EMPLOYMENT_TYPES[0],
  mode: WORK_MODES[0],
  location: "",
  salaryMin: 0,
  salaryMax: 0,
  description: "",
  skills: [],
  responsibilities: [""],
  requirements: [""],
  isFreelance,
  published: true,
  companyDetails: {
    website: "",
    industry: "",
    size: "",
    founded: "",
    description: "",
  },
});

export default function RecruiterJobsModal({ isOpen, onClose, editingListing, onSaveSuccess, defaultCompany = "" }) {
  const [form, setForm] = useState(getEmptyJob());
  const [skillInput, setSkillInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    if (editingListing) {
      setForm({
        ...getEmptyJob(editingListing.isFreelance),
        ...editingListing,
        responsibilities: editingListing.responsibilities?.length ? editingListing.responsibilities : [""],
        requirements: editingListing.requirements?.length ? editingListing.requirements : [""],
        skills: editingListing.skills || [],
        companyDetails: {
          ...getEmptyJob().companyDetails,
          ...(editingListing.companyDetails || {}),
        },
      });
    } else {
      setForm({
        ...getEmptyJob(false),
        company: defaultCompany,
        companyDetails: {
          ...getEmptyJob().companyDetails,
          name: defaultCompany,
        }
      });
    }
  }, [editingListing, isOpen, defaultCompany]);

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

  const addListItem = (key) => updateField(key, [...form[key], ""]);

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
    if (skillInput.trim() && !(form.skills || []).includes(skillInput.trim())) {
      const tag = skillInput.trim();
      const capitalized = tag.charAt(0).toUpperCase() + tag.slice(1);
      updateField("skills", [...form.skills, capitalized]);
      setSkillInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.company.trim()) {
      addToast("Title and Company name are required.", "warning");
      return;
    }

    setSubmitting(true);
    const computedSalary = form.salaryMin || form.salaryMax
      ? (form.isFreelance
        ? `₹${Number(form.salaryMin).toLocaleString()} - ₹${Number(form.salaryMax).toLocaleString()} (Project Budget)`
        : `₹${Number(form.salaryMin).toLocaleString()} - ₹${Number(form.salaryMax).toLocaleString()}`)
      : "Negotiable";

    const payload = {
      ...form,
      salary: computedSalary,
      companyDetails: {
        ...form.companyDetails,
        name: form.company,
      },
      responsibilities: form.responsibilities.filter(r => r.trim() !== ""),
      requirements: form.requirements.filter(r => r.trim() !== ""),
    };

    try {
      if (editingListing) {
        if (form.isFreelance) {
          await updateFreelanceProject(editingListing._id || editingListing.id, payload);
        } else {
          await updateJob(editingListing._id || editingListing.id, payload);
        }
        addToast("Listing updated successfully", "success");
      } else {
        if (form.isFreelance) {
          await createFreelanceProject(payload);
        } else {
          await createJob(payload);
        }
        addToast("Listing posted successfully", "success");
      }
      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Failed to save listing", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingListing ? (form.isFreelance ? "Edit Freelance Project" : "Edit Job") : (form.isFreelance ? "Post Freelance Project" : "Post a Job")} size="full">
      <form onSubmit={handleSubmit} className="space-y-6 pb-6">

        {/* Toggle Listing Type (only on create) */}
        {!editingListing && (
          <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => updateField("isFreelance", false)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${!form.isFreelance ? "bg-white text-primary-650 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Permanent Job
            </button>
            <button
              type="button"
              onClick={() => updateField("isFreelance", true)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${form.isFreelance ? "bg-white text-secondary-650 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Freelance Project
            </button>
          </div>
        )}

        {/* Section 1: Overview */}
        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-150 space-y-4">
          <h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">
            {form.isFreelance ? "Project Overview" : "Role Overview"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{form.isFreelance ? "Project Title *" : "Job Title *"}</label>
              <input type="text" value={form.title} onChange={e => updateField("title", e.target.value)} className={inputClass} placeholder={form.isFreelance ? "e.g. Redesign Landing Page" : "e.g. Senior Product Manager"} required />
            </div>
            <div>
              <label className={labelClass}>{form.isFreelance ? "Client / Company *" : "Company Name *"}</label>
              <input type="text" value={form.company} onChange={e => updateField("company", e.target.value)} className={inputClass} placeholder="e.g. Acme Corp" required />
            </div>
            <div>
              <label className={labelClass}>Company Logo URL</label>
              <input type="text" value={form.companyLogo} onChange={e => updateField("companyLogo", e.target.value)} className={inputClass} placeholder="e.g. https://example.com/logo.png" />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input type="text" value={form.category} onChange={e => updateField("category", e.target.value)} className={inputClass} placeholder="e.g. Design, Software Engineering" />
            </div>
            <div>
              <label className={labelClass}>{form.isFreelance ? "Project Duration" : "Experience Level Required"}</label>
              <input type="text" value={form.experience} onChange={e => updateField("experience", e.target.value)} className={inputClass} placeholder={form.isFreelance ? "e.g. 3 months" : "e.g. 3-5 years"} />
            </div>
          </div>
        </div>

        {/* Section 2: Work Parameters */}
        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-150 space-y-4">
          <h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">Work Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Employment Type</label>
              <div className="relative">
                <select value={form.type} onChange={e => updateField("type", e.target.value)} className={`${inputClass} appearance-none pr-10 cursor-pointer`}>
                  {EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <HiChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Work Mode</label>
              <div className="relative">
                <select value={form.mode} onChange={e => updateField("mode", e.target.value)} className={`${inputClass} appearance-none pr-10 cursor-pointer`}>
                  {WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <HiChevronDown className="w-5 h-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input type="text" value={form.location} onChange={e => updateField("location", e.target.value)} className={inputClass} placeholder="e.g. San Francisco, CA (or Remote)" />
            </div>
          </div>
        </div>

        {/* Section 3: Compensation */}
        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-150 space-y-4">
          <h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">
            {form.isFreelance ? "Project Budget (INR)" : "Compensation (INR per annum)"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{form.isFreelance ? "Minimum Budget (INR)" : "Minimum Salary (INR)"}</label>
              <input type="number" value={form.salaryMin || ""} onChange={e => updateField("salaryMin", Number(e.target.value))} className={inputClass} placeholder="e.g. 5000" />
            </div>
            <div>
              <label className={labelClass}>{form.isFreelance ? "Maximum Budget (INR)" : "Maximum Salary (INR)"}</label>
              <input type="number" value={form.salaryMax || ""} onChange={e => updateField("salaryMax", Number(e.target.value))} className={inputClass} placeholder="e.g. 10000" />
            </div>
          </div>
        </div>

        {/* Section 4: Details & Skills */}
        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-150 space-y-4">
          <h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">Details & Skills</h3>
          <div>
            <label className={labelClass}>Description</label>
            <textarea rows={4} value={form.description} onChange={e => updateField("description", e.target.value)} className={`${inputClass} resize-none`} placeholder="Write details about the role/project..." />
          </div>
          <div>
            <label className={labelClass}>Skills Needed</label>
            <div className="flex gap-2 mb-3">
              <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addSkill())} className={`${inputClass} flex-1`} placeholder="Type skill and press Enter..." />
              <button type="button" onClick={addSkill} className="px-5 py-2.5 bg-gray-150 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 cursor-pointer">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(form.skills || []).map(s => (
                <span key={s} className="inline-flex items-center gap-1.5 text-xs text-primary-750 bg-primary-50 px-3 py-1.5 rounded-xl font-medium border border-primary-100/50">
                  {s}
                  <button type="button" onClick={() => updateField("skills", form.skills.filter(sk => sk !== s))} className="text-primary-500 hover:text-primary-700">
                    <HiXMark className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: List Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Responsibilities */}
          <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-150 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm pb-1">Responsibilities</h3>
              <button type="button" onClick={() => addListItem("responsibilities")} className="text-xs text-primary-650 font-semibold hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
              {form.responsibilities.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={r} onChange={e => updateListItem("responsibilities", i, e.target.value)} className={inputClass + " flex-1"} placeholder="Responsibility..." />
                  {form.responsibilities.length > 1 && (
                    <button type="button" onClick={() => removeListItem("responsibilities", i)} className="text-red-400 hover:text-red-650"><HiXMark className="w-5 h-5" /></button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-150 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2">
              <h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm pb-1">Requirements</h3>
              <button type="button" onClick={() => addListItem("requirements")} className="text-xs text-primary-650 font-semibold hover:underline">+ Add</button>
            </div>
            <div className="space-y-2">
              {form.requirements.map((reqItem, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={reqItem} onChange={e => updateListItem("requirements", i, e.target.value)} className={`${inputClass} flex-1`} placeholder="Requirement..." />
                  {form.requirements.length > 1 && (
                    <button type="button" onClick={() => removeListItem("requirements", i)} className="text-red-400 hover:text-red-650">
                      <HiXMark className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 6: Client details */}
        <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-150 space-y-4">
          <h3 className="font-bold text-gray-950 dark:text-slate-200 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">Client Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Company Website</label>
              <input type="text" value={form.companyDetails?.website || ""} onChange={e => updateCompanyDetail("website", e.target.value)} className={inputClass} placeholder="e.g. https://acme.com" />
            </div>
            <div>
              <label className={labelClass}>Industry</label>
              <input type="text" value={form.companyDetails?.industry || ""} onChange={e => updateCompanyDetail("industry", e.target.value)} className={inputClass} placeholder="e.g. Technology, Finance" />
            </div>
            <div>
              <label className={labelClass}>Company Size</label>
              <input type="text" value={form.companyDetails?.size || ""} onChange={e => updateCompanyDetail("size", e.target.value)} className={inputClass} placeholder="e.g. 50-200 employees" />
            </div>
            <div>
              <label className={labelClass}>Founded Year</label>
              <input type="text" value={form.companyDetails?.founded || ""} onChange={e => updateCompanyDetail("founded", e.target.value)} className={inputClass} placeholder="e.g. 2018" />
            </div>
          </div>
          <div className="mt-2">
            <label className={labelClass}>Company Description</label>
            <textarea rows={3} value={form.companyDetails?.description || ""} onChange={e => updateCompanyDetail("description", e.target.value)} className={`${inputClass} resize-none`} placeholder="Write description about your company..." />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors" disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white text-sm font-semibold hover:shadow-lg transition-all" disabled={submitting}>
            {submitting ? "Saving..." : (editingListing ? "Save Changes" : "Post Listing")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
