import React, { useEffect, useState } from 'react';
import { queries } from '../../lib/supabase/queries';
import { TABLES } from '../../lib/supabase/constants';

export default function SubscriberList() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // In a real app, you'd use a paginated function from subscriberService
      const { data } = await queries.supabase
        .from(TABLES.SUBSCRIBERS)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      setSubscribers(data || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-4 text-sm text-slate-500 animate-pulse">Loading subscribers...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Recent Subscribers</h2>
        <input 
          type="search" 
          placeholder="Search emails..." 
          className="px-4 py-2 border rounded-lg text-sm outline-none focus:border-indigo-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b">
            <tr>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Source</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Date Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {subscribers.map(sub => (
              <tr key={sub.id} className="hover:bg-slate-50">
                <td className="p-4 font-medium">{sub.email}</td>
                <td className="p-4 text-slate-500 capitalize">{sub.source}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 capitalize">
                    {sub.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500">
                  {new Date(sub.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subscribers.length === 0 && (
          <div className="p-8 text-center text-slate-500">No subscribers found.</div>
        )}
      </div>
    </div>
  );
}
