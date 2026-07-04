import React from 'react';

export const TextInput = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</label>
    <input 
      type="text" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} 
      className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" 
    />
  </div>
);

export const TextArea = ({ label, value, onChange, rows=4, placeholder }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</label>
    <textarea 
      rows={rows} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors" 
    />
  </div>
);

export const Section = ({ title, children }) => (
  <div className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6">
    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 pb-4 border-b border-white/10">{title}</h4>
    {children}
  </div>
);
