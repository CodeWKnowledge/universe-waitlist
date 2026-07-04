import React from 'react';
import { useAdminReferrals } from '../../../hooks/useAdminReferrals';
import { HugeiconsIcon } from '@hugeicons/react';
import { Award01Icon } from '@hugeicons/core-free-icons';

export default function ReferralsPage() {
  const { leaderboard, loading } = useAdminReferrals();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Referral Leaderboard</h2>
          <p className="text-sm text-slate-500">Top ambassadors bringing in new waitlist signups.</p>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center gap-2 text-[#00D084]">
          <HugeiconsIcon icon={Award01Icon} size={18} />
          <h3 className="font-bold text-sm">Top 20 Referrers</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5 bg-white/[0.02]">
              <tr>
                {['Rank', 'Ambassador', 'Total Invites', 'Successful Conversions'].map((h) => (
                  <th key={h} className="px-5 py-4 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-slate-500">Loading leaderboard...</td>
                </tr>
              ) : leaderboard.length > 0 ? (
                leaderboard.map((user, i) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4 text-slate-400 font-mono">#{i + 1}</td>
                    <td className="px-5 py-4">
                      <div className="text-white font-medium">{user.name || 'Unknown'}</div>
                      <div className="text-slate-500">{user.email}</div>
                    </td>
                    <td className="px-5 py-4 text-white font-bold">{user.total}</td>
                    <td className="px-5 py-4 text-[#00D084] font-bold">{user.converted}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-slate-600">No referrals recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
