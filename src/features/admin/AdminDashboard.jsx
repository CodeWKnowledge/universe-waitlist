import React, { useState } from 'react';
import SubscriberList from './SubscriberList';
import CampaignManager from './CampaignManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('subscribers');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Admin Portal</h1>
            <p className="text-sm text-slate-500">Manage waitlist, newsletters, and email analytics.</p>
          </div>
        </header>

        <nav className="flex gap-4 mb-8 border-b border-slate-200">
          {['subscribers', 'campaigns', 'analytics'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold capitalize transition-colors ${
                activeTab === tab 
                  ? 'border-b-2 border-indigo-500 text-indigo-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <main className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          {activeTab === 'subscribers' && <SubscriberList />}
          {activeTab === 'campaigns' && <CampaignManager />}
          {activeTab === 'analytics' && (
            <div className="text-center py-20 text-slate-500">
              Analytics Dashboard coming soon. View stats in Supabase/Resend for now.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
