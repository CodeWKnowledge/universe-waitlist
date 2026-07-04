import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../../lib/supabase/client';

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const d = new Date();
      d.setDate(d.getDate() - 14);
      
      const { data: logs, error } = await supabase
        .from('email_logs')
        .select('created_at, opened, clicked')
        .gte('created_at', d.toISOString());

      if (error) {
        console.error('Error fetching email logs:', error);
        setLoading(false);
        return;
      }

      // Initialize bins
      const bins = {};
      for (let i = 0; i < 14; i++) {
        const binDate = new Date();
        binDate.setDate(binDate.getDate() - (13 - i));
        const dateStr = binDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        bins[dateStr] = { date: dateStr, sent: 0, opens: 0, clicks: 0 };
      }

      // Bin data
      if (logs) {
        logs.forEach(log => {
          const logDate = new Date(log.created_at);
          const dateStr = logDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (bins[dateStr]) {
            bins[dateStr].sent += 1;
            if (log.opened) bins[dateStr].opens += 1;
            if (log.clicked) bins[dateStr].clicks += 1;
          }
        });
      }

      setData(Object.values(bins));
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Email Analytics</h2>
          <p className="text-sm text-slate-500">Track delivery and engagement across all campaigns.</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading analytics...</div>
      ) : (
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-6">14-Day Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D084" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00D084" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f1629', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="sent" stroke="#64748b" fillOpacity={1} fill="url(#colorSent)" name="Sent" />
                <Area type="monotone" dataKey="opens" stroke="#00D084" fillOpacity={1} fill="url(#colorOpens)" name="Opens" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
