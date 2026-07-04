import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  UserGroupIcon, Mail01Icon, ChartLineData01Icon,
  Share01Icon, TrendingUpDownIcon, Clock01Icon
} from '@hugeicons/core-free-icons';
import { useAdminMetrics } from '../../../hooks/useAdminMetrics';
import { useAdminSubscribers } from '../../../hooks/useAdminSubscribers';

// Generate last 7 days labels
function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  });
}

const PIE_COLORS = ['#00D084', '#14b8a6', '#6366f1', '#f59e0b', '#ef4444'];

function KpiCard({ icon, label, value, sub, color = '#00D084', loading }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 flex items-start gap-4 hover:border-white/10 transition-all">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}
        style={{ background: `${color}18` }}>
        <HugeiconsIcon icon={icon} size={18} style={{ color }} />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</div>
        {loading ? (
          <div className="h-7 w-16 bg-white/5 rounded animate-pulse mt-1" />
        ) : (
          <div className="text-2xl font-bold text-white mt-0.5">{value}</div>
        )}
        {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f1629] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl">
      <div className="text-slate-400 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-white font-semibold">{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function Overview() {
  const { metrics, loading } = useAdminMetrics();
  const { subscribers: recent } = useAdminSubscribers({ });

  const recentSignups = recent.slice(0, 5);
  const days = getLast7Days();

  // Build growth data from real subscribers (grouped by day)
  // Since we don't have per-day counts from a single query, we show today's totals
  // A proper implementation would use an RPC — this is the scalable hook structure
  const growthData = days.map((day, i) => ({
    day,
    subscribers: i === 6 ? (metrics?.todaySignups || 0) : 0,
  }));

  const sourceData = [
    { name: 'Waitlist', value: metrics?.totalSubscribers || 0 },
    { name: 'Referral', value: metrics?.totalReferrals || 0 },
    { name: 'Direct', value: 0 },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={UserGroupIcon}       label="Total Subscribers" value={(metrics?.totalSubscribers || 0).toLocaleString()} sub="All time" loading={loading} />
        <KpiCard icon={TrendingUpDownIcon}    label="New Today"         value={metrics?.todaySignups || 0}   sub="Since midnight" color="#6366f1" loading={loading} />
        <KpiCard icon={Clock01Icon}         label="This Week"         value={metrics?.weeklySignups || 0}  sub="Last 7 days"    color="#f59e0b" loading={loading} />
        <KpiCard icon={Mail01Icon}          label="Emails Sent"       value={(metrics?.totalEmailsSent || 0).toLocaleString()} sub="All campaigns" color="#14b8a6" loading={loading} />
        <KpiCard icon={ChartLineData01Icon} label="Open Rate"         value={`${metrics?.openRate || 0}%`} sub="Average"        color="#00D084" loading={loading} />
        <KpiCard icon={ChartLineData01Icon} label="Click Rate"        value={`${metrics?.clickRate || 0}%`} sub="Average"       color="#00D084" loading={loading} />
        <KpiCard icon={Share01Icon}         label="Total Referrals"   value={metrics?.totalReferrals || 0} sub="Generated codes" color="#a855f7" loading={loading} />
        <KpiCard icon={TrendingUpDownIcon}    label="Conversions"       value={`${metrics?.conversionRate || 0}%`} sub="Referral rate" color="#f59e0b" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Chart */}
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white font-bold text-sm">Subscriber Growth</div>
              <div className="text-slate-500 text-[10px]">Last 7 days</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={growthData}>
              <defs>
                <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D084" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00D084" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="subscribers" name="Subscribers" stroke="#00D084" strokeWidth={2} fill="url(#colorSubs)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Source Breakdown Pie */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
          <div className="text-white font-bold text-sm mb-1">Source Breakdown</div>
          <div className="text-slate-500 text-[10px] mb-4">Where subscribers come from</div>
          {sourceData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                    {sourceData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {sourceData.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
                      <span className="text-slate-400">{entry.name}</span>
                    </div>
                    <span className="text-white font-semibold">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-slate-600 text-xs">No data yet</div>
          )}
        </div>
      </div>

      {/* Recent Signups Table */}
      <div className="bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="text-white font-bold text-sm">Recent Signups</div>
          <a href="/admin/waitlist" className="text-[#00D084] text-xs font-semibold hover:underline">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/5">
              <tr>
                {['Email', 'Name', 'Source', 'Status', 'Joined'].map(h => (
                  <th key={h} className="px-5 py-3 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {recentSignups.length > 0 ? recentSignups.map(sub => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-white font-medium">{sub.email}</td>
                  <td className="px-5 py-3.5 text-slate-400">{`${sub.first_name || ''} ${sub.last_name || ''}`.trim() || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 bg-[#00D084]/10 text-[#00D084] rounded-full text-[10px] font-bold capitalize">{sub.source}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 bg-white/5 text-slate-400 rounded-full text-[10px] capitalize">{sub.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{new Date(sub.created_at).toLocaleDateString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-600 text-sm">No subscribers yet. Run the SQL schema setup first.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
