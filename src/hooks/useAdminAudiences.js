import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';

export function useAdminAudiences() {
  const [audiences, setAudiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAudiences = useCallback(async () => {
    setLoading(true);
    // Fetch audiences with their subscriber counts
    const { data, error } = await supabase
      .from('audiences')
      .select(`
        id, name, description, created_at,
        audience_subscribers(count)
      `)
      .order('created_at', { ascending: false });

    if (!error) {
      const formatted = data.map(a => ({
        ...a,
        subscriberCount: a.audience_subscribers[0]?.count || 0
      }));
      setAudiences(formatted);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAudiences(); }, [fetchAudiences]);

  const createAudience = async (name, description) => {
    const { data, error } = await supabase
      .from('audiences')
      .insert([{ name, description }])
      .select()
      .single();
    if (!error) await fetchAudiences();
    return { data, error };
  };

  const deleteAudience = async (id) => {
    await supabase.from('audiences').delete().eq('id', id);
    await fetchAudiences();
  };

  const addSubscriberToAudience = async (audienceId, subscriberEmail) => {
    const { data: sub, error: subError } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', subscriberEmail)
      .maybeSingle();
      
    if (subError || !sub) return { error: 'Subscriber not found' };
    
    const { error } = await supabase
      .from('audience_subscribers')
      .insert([{ audience_id: audienceId, subscriber_id: sub.id }]);
      
    if (!error) await fetchAudiences();
    return { error };
  };

  return { audiences, loading, createAudience, deleteAudience, addSubscriberToAudience, refetch: fetchAudiences };
}
