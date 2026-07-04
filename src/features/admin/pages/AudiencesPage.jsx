import React, { useState } from 'react';
import { useAdminAudiences } from '../../../hooks/useAdminAudiences';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon, Delete01Icon, UserGroupIcon, UserAdd01Icon } from '@hugeicons/core-free-icons';

export default function AudiencesPage() {
  const { audiences, loading, createAudience, deleteAudience, addSubscriberToAudience } = useAdminAudiences();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  
  // State for adding subscribers
  const [activeAudienceId, setActiveAudienceId] = useState(null);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [addError, setAddError] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    await createAudience(formData.name, formData.description);
    setShowForm(false);
    setFormData({ name: '', description: '' });
  };

  const handleAddSubscriber = async (e, audienceId) => {
    e.preventDefault();
    setAddError('');
    if (!subscriberEmail) return;

    const { error } = await addSubscriberToAudience(audienceId, subscriberEmail);
    if (error) {
      setAddError(error);
    } else {
      setSubscriberEmail('');
      setActiveAudienceId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Audiences & Segments</h2>
          <p className="text-sm text-slate-500">Manage your subscriber lists for targeted campaigns.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] rounded-xl text-sm font-bold transition-colors"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={16} />
          {showForm ? 'Cancel' : 'New Audience'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Audience Name</label>
            <input
              required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              placeholder="e.g. VIP Early Access"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <input
              type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084]"
              placeholder="Optional description"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="px-6 py-2.5 bg-[#00D084] text-[#030712] rounded-xl text-sm font-bold">
              Create Audience
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-slate-500">Loading audiences...</div>
        ) : audiences.length > 0 ? (
          audiences.map(aud => (
            <div key={aud.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-white/10 min-h-[160px]">
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#00D084]/10 text-[#00D084] flex items-center justify-center mb-3">
                    <HugeiconsIcon icon={UserGroupIcon} size={20} />
                  </div>
                  <button onClick={() => deleteAudience(aud.id)} className="text-slate-600 hover:text-rose-400 transition-colors">
                    <HugeiconsIcon icon={Delete01Icon} size={16} />
                  </button>
                </div>
                <h3 className="font-bold text-white text-lg">{aud.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{aud.description || 'No description'}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-slate-500">Subscribers</span>
                  <span className="text-white font-bold px-2 py-1 bg-white/5 rounded-lg">{aud.subscriberCount}</span>
                </div>
                
                {activeAudienceId === aud.id ? (
                  <form onSubmit={(e) => handleAddSubscriber(e, aud.id)} className="space-y-2">
                    <input
                      type="email"
                      required
                      placeholder="Subscriber email..."
                      value={subscriberEmail}
                      onChange={e => setSubscriberEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/20 border border-white/5 rounded-lg text-xs text-white focus:outline-none focus:border-[#00D084]"
                    />
                    {addError && <div className="text-red-400 text-[10px]">{addError}</div>}
                    <div className="flex gap-2">
                      <button type="submit" className="flex-1 py-1.5 bg-[#00D084]/20 text-[#00D084] rounded-lg text-xs font-bold hover:bg-[#00D084]/30">Add</button>
                      <button type="button" onClick={() => {setActiveAudienceId(null); setAddError('');}} className="flex-1 py-1.5 bg-white/5 text-slate-400 rounded-lg text-xs hover:bg-white/10">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => {setActiveAudienceId(aud.id); setSubscriberEmail(''); setAddError('');}}
                    className="w-full flex items-center justify-center gap-1 py-1.5 border border-dashed border-white/10 rounded-lg text-xs text-slate-400 hover:text-white hover:border-white/20 transition-colors"
                  >
                    <HugeiconsIcon icon={UserAdd01Icon} size={14} />
                    Add Member
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center border border-white/5 border-dashed rounded-2xl text-slate-500">
            No audiences found. Create one to segment your users.
          </div>
        )}
      </div>
    </div>
  );
}
