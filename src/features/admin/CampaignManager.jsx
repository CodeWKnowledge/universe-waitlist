import React, { useState, useEffect } from 'react';
import { campaignService } from '../../services/email/campaignService';
import { queries } from '../../lib/supabase/queries';

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({ title: '', subject: '', content: '' });

  useEffect(() => {
    async function fetchCampaigns() {
      const { data } = await queries.getCampaigns();
      setCampaigns(data || []);
    }
    fetchCampaigns();
  }, [showForm]);

  const handleDraft = async (e) => {
    e.preventDefault();
    await campaignService.createDraft(formData.title, formData.subject, formData.content, ['waitlist']);
    setShowForm(false);
    setFormData({ title: '', subject: '', content: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Newsletters & Campaigns</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : 'New Campaign'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleDraft} className="mb-8 p-6 bg-slate-50 border rounded-xl space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Internal Title</label>
            <input 
              required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="e.g. November Waitlist Update"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Subject Line</label>
            <input 
              required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg text-sm" placeholder="Big updates coming to UniVerse 🚀"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Content (HTML)</label>
            <textarea 
              required rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg text-sm font-mono" placeholder="<h1>Hello</h1><p>Update...</p>"
            />
          </div>
          <button type="submit" className="px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold">
            Save Draft
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {campaigns.map(camp => (
          <div key={camp.id} className="p-4 border rounded-xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800">{camp.title}</h3>
              <p className="text-sm text-slate-500">Subject: {camp.subject}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ${
                camp.status === 'draft' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {camp.status}
              </span>
              {camp.status === 'draft' && (
                <button className="text-sm font-semibold text-indigo-600 hover:underline">
                  Send Now
                </button>
              )}
            </div>
          </div>
        ))}
        {campaigns.length === 0 && <p className="text-slate-500 py-4 text-center">No campaigns created yet.</p>}
      </div>
    </div>
  );
}
