import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { queries } from '../../../lib/supabase/queries';

export default function PreferencesPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // We use subscriber_id as token for simplicity
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [preferences, setPreferences] = useState({
    marketing: true,
    productUpdates: true
  });

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing link. Please use the link from your email.');
      setLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      try {
        const { data, error: fetchErr } = await queries.supabase
          .from('subscribers')
          .select('marketing_opt_in, product_opt_in')
          .eq('id', token)
          .single();

        if (fetchErr) throw fetchErr;

        if (data) {
          setPreferences({
            marketing: data.marketing_opt_in ?? true,
            productUpdates: data.product_opt_in ?? true
          });
        }
      } catch (err) {
        console.error(err);
        setError('Could not load your preferences. You might have already been removed.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error: updateErr } = await queries.supabase
        .from('subscribers')
        .update({
          marketing_opt_in: preferences.marketing,
          product_opt_in: preferences.productUpdates
        })
        .eq('id', token);

      if (updateErr) throw updateErr;
      
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to update preferences. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribeAll = async () => {
    setLoading(true);
    try {
      const { error: updateErr } = await queries.supabase
        .from('subscribers')
        .update({
          marketing_opt_in: false,
          product_opt_in: false,
          status: 'unsubscribed'
        })
        .eq('id', token);

      if (updateErr) throw updateErr;
      
      setPreferences({ marketing: false, productUpdates: false });
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError('Failed to unsubscribe. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !preferences.marketing && !preferences.productUpdates && !success) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#00D084] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#00D084] flex items-center justify-center text-[#030712] font-extrabold text-xl mx-auto mb-6">
            U
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Email Preferences</h2>
          <p className="text-slate-400">Manage what you want to hear about.</p>
        </div>

        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            {success && (
              <div className="bg-[#00D084]/10 border border-[#00D084]/20 text-[#00D084] p-4 rounded-xl text-center text-sm font-medium">
                Your preferences have been saved successfully!
              </div>
            )}

            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={preferences.marketing}
                  onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-black/20 text-[#00D084] focus:ring-[#00D084] focus:ring-offset-0"
                />
                <div>
                  <div className="text-white font-medium group-hover:text-[#00D084] transition-colors">Marketing & Offers</div>
                  <div className="text-slate-400 text-sm">Promotions, new features, and community events.</div>
                </div>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={preferences.productUpdates}
                  onChange={(e) => setPreferences({ ...preferences, productUpdates: e.target.checked })}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-black/20 text-[#00D084] focus:ring-[#00D084] focus:ring-offset-0"
                />
                <div>
                  <div className="text-white font-medium group-hover:text-[#00D084] transition-colors">Product Updates</div>
                  <div className="text-slate-400 text-sm">Important announcements about the platform and your account.</div>
                </div>
              </label>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00D084] text-[#030712] rounded-xl font-bold hover:bg-[#00D084]/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
              
              <button
                type="button"
                onClick={handleUnsubscribeAll}
                disabled={loading}
                className="w-full py-3 bg-transparent text-slate-400 rounded-xl font-medium hover:text-white transition-colors"
              >
                Unsubscribe from all
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
