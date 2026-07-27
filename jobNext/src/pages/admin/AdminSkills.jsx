import { useState, useEffect } from 'react';
import { HiPlus, HiXMark } from 'react-icons/hi2';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useToast } from '@context/ToastContext';

export default function AdminSkills() {
  const [defaultSkills, setDefaultSkills] = useState([]);
  const [customSkills, setCustomSkills] = useLocalStorage('customSkills', []);
  const [input, setInput] = useState('');
  const { addToast } = useToast();
  const allSkills = [...defaultSkills, ...customSkills];

  useEffect(() => {
    fetch('/data/skills.json')
      .then(res => res.json())
      .then(data => setDefaultSkills(data))
      .catch(err => console.error('Failed to load skills:', err));
  }, []);

  const addSkill = () => {
    if (input.trim() && !allSkills.includes(input.trim())) {
      setCustomSkills(prev => [...prev, input.trim()]);
      setInput('');
      addToast('Skill added', 'success');
    }
  };

  const removeSkill = (s) => {
    if (defaultSkills.includes(s)) { addToast('Cannot remove default skill — edit JSON file', 'warning'); return; }
    setCustomSkills(prev => prev.filter(sk => sk !== s));
    addToast('Skill removed', 'info');
  };

  return (
    <div>
      <div className="flex gap-2 mb-6 max-w-md">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="Add new skill..." />
        <button onClick={addSkill} className="gradient-btn text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1"><HiPlus className="w-4 h-4" />Add</button>
      </div>
      <p className="text-sm text-gray-500 mb-4">{allSkills.length} total skills ({defaultSkills.length} default + {customSkills.length} custom)</p>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-wrap gap-2">
          {allSkills.map(s => (
            <span key={s} className="inline-flex items-center gap-1.5 text-sm bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-100">
              {s}
              <button onClick={() => removeSkill(s)} className="text-gray-400 hover:text-red-500"><HiXMark className="w-3.5 h-3.5" /></button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}