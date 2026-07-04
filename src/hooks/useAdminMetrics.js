import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';

export function useAdminMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const [
          { count: total },
          { count: todayCount },
          { count: weekCount },
          { count: monthCount },
          { count: emailsSent },
          { count: emailsOpened },
          { count: emailsClicked },
          { count: referralCount },
          { count: convertedReferrals },
        ] = await Promise.all([
          supabase.from('subscribers').select('*', { count: 'exact', head: true }),
          supabase.from('subscribers').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
          supabase.from('subscribers').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo.toISOString()),
          supabase.from('subscribers').select('*', { count: 'exact', head: true }).gte('created_at', monthAgo.toISOString()),
          supabase.from('email_logs').select('*', { count: 'exact', head: true }),
          supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('opened', true),
          supabase.from('email_logs').select('*', { count: 'exact', head: true }).eq('clicked', true),
          supabase.from('referral_tracking').select('*', { count: 'exact', head: true }),
          supabase.from('referral_tracking').select('*', { count: 'exact', head: true }).eq('conversion_status', 'converted'),
        ]);

        const openRate = emailsSent > 0 ? Math.round((emailsOpened / emailsSent) * 100) : 0;
        const clickRate = emailsSent > 0 ? Math.round((emailsClicked / emailsSent) * 100) : 0;
        const conversionRate = referralCount > 0 ? Math.round((convertedReferrals / referralCount) * 100) : 0;

        setMetrics({
          totalSubscribers: total || 0,
          todaySignups: todayCount || 0,
          weeklySignups: weekCount || 0,
          monthlySignups: monthCount || 0,
          totalEmailsSent: emailsSent || 0,
          openRate,
          clickRate,
          totalReferrals: referralCount || 0,
          convertedReferrals: convertedReferrals || 0,
          conversionRate,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return { metrics, loading, error };
}
