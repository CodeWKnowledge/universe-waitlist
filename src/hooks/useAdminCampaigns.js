import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';

export function useAdminCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('newsletter_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setCampaigns(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const createDraft = async ({ title, subject, content, segmentTags }) => {
    const { data, error: err } = await supabase
      .from('newsletter_campaigns')
      .insert([{ title, subject, content, segment_tags: segmentTags, status: 'draft' }])
      .select().single();
    if (err) throw err;
    await fetch();
    return data;
  };

  const deleteCampaign = async (id) => {
    await supabase.from('newsletter_campaigns').delete().eq('id', id);
    await fetch();
  };

  const updateStatus = async (id, status) => {
    await supabase.from('newsletter_campaigns').update({ status }).eq('id', id);
    await fetch();
  };

  return { campaigns, loading, error, createDraft, deleteCampaign, updateStatus, refetch: fetch };
}
