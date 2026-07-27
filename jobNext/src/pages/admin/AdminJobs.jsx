import { useState, useEffect } from 'react';
import { HiPlus, HiPencilSquare, HiTrash, HiEye, HiEyeSlash, HiXMark } from 'react-icons/hi2';
import Modal from '@components/common/Modal';
import EmptyState from '@components/common/EmptyState';
import { useJobs } from '@hooks/useJobs';
import { useToast } from '@context/ToastContext';
import { EMPLOYMENT_TYPES, WORK_MODES } from '@utils/constants';
import { generateId } from '@utils/helpers';

const emptyJob = { title: '', company: '', companyLogo: '', salary: '', salaryMin: 0, salaryMax: 0, experience: '', location: '', type: 'Full-time', mode: 'Onsite', category: '', skills: [], description: '', responsibilities: [''], requirements: [''], postedDate: new Date().toISOString().split('T')[0], published: true, companyDetails: { name: '', size: '', industry: '', founded: '', website: '', description: '' } };

export default function AdminJobs() {
  const [defaultSkills, setDefaultSkills] = useState([]);
  const { allJobs, setAdminJobs } = useJobs();
  const { addToast } = useToast();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyJob);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    fetch('/data/skills.json')
      .then(res => res.json())
      .then(data => setDefaultSkills(data))
      .catch(err => console.error('Failed to load skills:', err));
  }, []);

  const openAdd = () => { setForm({ ...emptyJob, id: generateId(), companyLogo: `https://picsum.photos/seed/${Date.now()}/80/80.jpg` }); setEditing(null); setModal(true); };
  const openEdit = (job) => { setForm({ ...job, responsibilities: job.responsibilities || [''], requirements: job.requirements || [''] }); setEditing(job.id); setModal(true); };

  const save = () => {
    if (!form.title || !form.company) { addToast('Title and Company are required', 'error'); return; }
    let updated;
    if (editing) {
      updated = allJobs.map(j => j.id === editing ? { ...form, companyDetails: { ...form.companyDetails, name: form.companyDetails.name || form.company } } : j);
    } else {
      updated = [...allJobs, { ...form, companyDetails: { ...form.companyDetails, name: form.companyDetails.name || form.company } }];
    }
    setAdminJobs(updated);
    setModal(false);
    addToast(editing ? 'Job updated!' : 'Job added!', 'success');
  };

  const deleteJob = (id) => {
    if (!confirm('Delete this job?')) return;
    setAdminJobs(allJobs.filter(j => j.id !== id));
    addToast('Job deleted', 'info');
  };

  const togglePublish = (id) => {
    setAdminJobs(allJobs.map(j => j.id === id ? { ...j, published: j.published === false ? true : false } : j));
    addToast('Status updated', 'success');
  };

  const updateField = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const updateCompanyDetail = (key, val) => setForm(prev => ({ ...prev, companyDetails: { ...prev.companyDetails, [key]: val } }));

  const addListItem = (key) => updateField(key, [...form[key], '']);
  const updateListItem = (key, i, val) => { const arr = [...form[key]]; arr[i] = val; updateField(key, arr); };
  const removeListItem = (key, i) => updateField(key, form[key].filter((_, idx) => idx !== i));

  const addSkill = () => { if (skillInput.trim() && !form.skills.includes(skillInput.trim())) { updateField('skills', [...form.skills, skillInput.trim()]); setSkillInput(''); } };

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{allJobs.length} jobs total</p>
        <button onClick={openAdd} className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2"><HiPlus className="w-4 h-4" />Add Job</button>
      </div>

      {allJobs.length === 0 ? (
        <EmptyState title="No jobs yet" description="Add your first job listing." action={<button onClick={openAdd} className="gradient-btn text-white px-6 py-2.5 rounded-xl text-sm font-medium">Add Job</button>} />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-left"><th className="px-5 py-3 font-medium text-gray-500">Job</th><th className="px-5 py-3 font-medium text-gray-500">Company</th><th className="px-5 py-3 font-medium text-gray-500">Mode</th><th className="px-5 py-3 font-medium text-gray-500">Status</th><th className="px-5 py-3 font-medium text-gray-500 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {allJobs.map(j => (
                  <tr key={j.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-3"><p className="font-medium text-gray-900">{j.title}</p><p className="text-xs text-gray-400">{j.salary}</p></td>
                    <td className="px-5 py-3 text-gray-600">{j.company}</td>
                    <td className="px-5 py-3"><span className={`text-xs font-medium px-2 py-1 rounded-lg ${j.mode === 'Remote' ? 'bg-emerald-50 text-emerald-700' : j.mode === 'Hybrid' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>{j.mode}</span></td>
                    <td className="px-5 py-3"><span className={`text-xs font-medium px-2 py-1 rounded-lg ${j.published !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{j.published !== false ? 'Published' : 'Draft'}</span></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => togglePublish(j.id)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500" title={j.published !== false ? 'Unpublish' : 'Publish'}>{j.published !== false ? <HiEyeSlash className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}</button>
                        <button onClick={() => openEdit(j)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500" title="Edit"><HiPencilSquare className="w-4 h-4" /></button>
                        <button onClick={() => deleteJob(j.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500" title="Delete"><HiTrash className="w-4 h-4" /></button>
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
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editing ? 'Edit Job' : 'Add Job'} size="full">
        <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={labelClass}>Job Title *</label><input type="text" value={form.title} onChange={e => updateField('title', e.target.value)} className={inputClass} placeholder="Senior Frontend Developer" /></div>
            <div><label className={labelClass}>Company *</label><input type="text" value={form.company} onChange={e => updateField('company', e.target.value)} className={inputClass} placeholder="TechNova Inc." /></div>
            <div><label className={labelClass}>Salary</label><input type="text" value={form.salary} onChange={e => updateField('salary', e.target.value)} className={inputClass} placeholder="$120,000 - $160,000" /></div>
            <div><label className={labelClass}>Salary Min</label><input type="number" value={form.salaryMin} onChange={e => updateField('salaryMin', Number(e.target.value))} className={inputClass} placeholder="120000" /></div>
            <div><label className={labelClass}>Salary Max</label><input type="number" value={form.salaryMax} onChange={e => updateField('salaryMax', Number(e.target.value))} className={inputClass} placeholder="160000" /></div>
            <div><label className={labelClass}>Experience</label><input type="text" value={form.experience} onChange={e => updateField('experience', e.target.value)} className={inputClass} placeholder="3-5 years" /></div>
            <div><label className={labelClass}>Location</label><input type="text" value={form.location} onChange={e => updateField('location', e.target.value)} className={inputClass} placeholder="San Francisco, CA" /></div>
            <div><label className={labelClass}>Category</label><input type="text" value={form.category} onChange={e => updateField('category', e.target.value)} className={inputClass} placeholder="Engineering" /></div>
            <div><label className={labelClass}>Employment Type</label><select value={form.type} onChange={e => updateField('type', e.target.value)} className={inputClass}>{EMPLOYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className={labelClass}>Work Mode</label><select value={form.mode} onChange={e => updateField('mode', e.target.value)} className={inputClass}>{WORK_MODES.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
          </div>

          <div><label className={labelClass}>Description</label><textarea rows={4} value={form.description} onChange={e => updateField('description', e.target.value)} className={inputClass + ' resize-none'} placeholder="Job description..." /></div>

          {/* Skills */}
          <div>
            <label className={labelClass}>Skills</label>
            <div className="flex gap-2 mb-2"><input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className={inputClass + ' flex-1'} placeholder="Add skill..." /><button type="button" onClick={addSkill} className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200">Add</button></div>
            <div className="flex flex-wrap gap-1.5">{form.skills.map(s => <span key={s} className="text-xs text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg flex items-center gap-1">{s}<button onClick={() => updateField('skills', form.skills.filter(sk => sk !== s))}><HiXMark className="w-3 h-3" /></button></span>)}</div>
          </div>

          {/* Responsibilities */}
          <div>
            <div className="flex items-center justify-between mb-1"><label className={labelClass}>Responsibilities</label><button type="button" onClick={() => addListItem('responsibilities')} className="text-xs text-primary-600 font-medium">+ Add</button></div>
            {form.responsibilities.map((r, i) => <div key={i} className="flex gap-2 mb-2"><input type="text" value={r} onChange={e => updateListItem('responsibilities', i, e.target.value)} className={inputClass + ' flex-1'} placeholder="Responsibility..." />{form.responsibilities.length > 1 && <button onClick={() => removeListItem('responsibilities', i)} className="text-red-400 hover:text-red-600"><HiXMark className="w-5 h-5" /></button>}</div>)}
          </div>

          {/* Requirements */}
          <div>
            <div className="flex items-center justify-between mb-1"><label className={labelClass}>Requirements</label><button type="button" onClick={() => addListItem('requirements')} className="text-xs text-primary-600 font-medium">+ Add</button></div>
            {form.requirements.map((r, i) => <div key={i} className="flex gap-2 mb-2"><input type="text" value={r} onChange={e => updateListItem('requirements', i, e.target.value)} className={inputClass + ' flex-1'} placeholder="Requirement..." />{form.requirements.length > 1 && <button onClick={() => removeListItem('requirements', i)} className="text-red-400 hover:text-red-600"><HiXMark className="w-5 h-5" /></button>}</div>)}
          </div>

          {/* Company Details */}
          <div className="border-t border-gray-100 pt-5">
            <h3 className="font-bold text-gray-900 mb-3">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className={labelClass}>Industry</label><input type="text" value={form.companyDetails.industry} onChange={e => updateCompanyDetail('industry', e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Size</label><input type="text" value={form.companyDetails.size} onChange={e => updateCompanyDetail('size', e.target.value)} className={inputClass} placeholder="100-200" /></div>
              <div><label className={labelClass}>Founded</label><input type="text" value={form.companyDetails.founded} onChange={e => updateCompanyDetail('founded', e.target.value)} className={inputClass} placeholder="2020" /></div>
              <div><label className={labelClass}>Website</label><input type="text" value={form.companyDetails.website} onChange={e => updateCompanyDetail('website', e.target.value)} className={inputClass} placeholder="https://..." /></div>
            </div>
            <div className="mt-4"><label className={labelClass}>Company Description</label><textarea rows={3} value={form.companyDetails.description} onChange={e => updateCompanyDetail('description', e.target.value)} className={inputClass + ' resize-none'} /></div>
          </div>

          {/* Published toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.published} onChange={e => updateField('published', e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
            <span className="text-sm text-gray-700 font-medium">Published</span>
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