import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase/client';

const PAGE_SIZE = 25;

export function useAdminSubscribers({ search = '', status = '', source = '' } = {}) {
  const [subscribers, setSubscribers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('subscribers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (search) query = query.ilike('email', `%${search}%`);
      if (status) query = query.eq('status', status);
      if (source) query = query.eq('source', source);

      const { data, count, error: err } = await query;
      if (err) throw err;

      setSubscribers(data || []);
      setTotal(count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, status, source, page]);

  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  const exportCSV = () => {
    const headers = ['Email', 'First Name', 'Last Name', 'Source', 'Status', 'Tags', 'Joined'];
    const rows = subscribers.map(s => [
      s.email, s.first_name, s.last_name, s.source, s.status,
      (s.tags || []).join('; '),
      new Date(s.created_at).toLocaleDateString()
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    subscribers, total, loading, error,
    page, setPage,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(total / PAGE_SIZE),
    refetch: fetchSubscribers,
    exportCSV,
  };
}
