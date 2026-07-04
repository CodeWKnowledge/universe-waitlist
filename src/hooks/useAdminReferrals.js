import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

export function useAdminReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('referral_tracking')
        .select(`*, subscribers:referrer_id(email, first_name, last_name)`)
        .order('created_at', { ascending: false });

      setReferrals(data || []);

      // Build leaderboard: count referrals per referrer_id
      const counts = {};
      (data || []).forEach(r => {
        if (!r.referrer_id) return;
        if (!counts[r.referrer_id]) {
          counts[r.referrer_id] = {
            id: r.referrer_id,
            email: r.subscribers?.email || 'Unknown',
            name: `${r.subscribers?.first_name || ''} ${r.subscribers?.last_name || ''}`.trim(),
            total: 0,
            converted: 0,
          };
        }
        counts[r.referrer_id].total++;
        if (r.conversion_status === 'converted') counts[r.referrer_id].converted++;
      });

      const board = Object.values(counts)
        .sort((a, b) => b.total - a.total)
        .slice(0, 20);

      setLeaderboard(board);
      setLoading(false);
    }
    load();
  }, []);

  return { referrals, leaderboard, loading };
}
