import React, { useState } from 'react';
import { useAdminSubscribers } from '../../../hooks/useAdminSubscribers';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Download01Icon } from '@hugeicons/core-free-icons';

export default function WaitlistPage() {
  const [search, setSearch] = useState('');
  const { subscribers, loading, exportCSV } = useAdminSubscribers({ search, status: 'waitlist' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Waitlist Management</h2>
          <p className="text-sm text-slate-500">Manage users currently on the waitlist.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <HugeiconsIcon icon={Search01Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-[#00D084] w-full sm:w-64 transition-colors"
            />
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-[#00D084]/10 text-[#00D084] hover:bg-[#00D084]/20 border border-[#00D084]/20 rounded-xl text-sm font-semibold transition-colors"
          >
            <HugeiconsIcon icon={Download01Icon} size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 bg-white/[0.02]">
              <tr>
                {['Email', 'Name', 'University', 'Role', 'Joined'].map((h) => (
                  <th key={h} className="px-5 py-4 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-500">Loading waitlist...</td>
                </tr>
              ) : subscribers.length > 0 ? (
                subscribers.map((sub) => {
                  const university = (sub.tags || []).find(t => t.startsWith('university:'))?.split(':')[1] || 'Unknown';
                  const role = (sub.tags || []).find(t => t.startsWith('role:'))?.split(':')[1] || 'Unknown';
                  return (
                    <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 text-white font-medium">{sub.email}</td>
                      <td className="px-5 py-4 text-slate-400">{`${sub.first_name || ''} ${sub.last_name || ''}`.trim() || '—'}</td>
                      <td className="px-5 py-4 text-slate-400 capitalize">{university.replace(/-/g, ' ')}</td>
                      <td className="px-5 py-4 text-slate-400 capitalize">{role}</td>
                      <td className="px-5 py-4 text-slate-500">{new Date(sub.created_at).toLocaleDateString()}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-600">No waitlist users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
