import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/client';

export default function RequireAdmin({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkAdminRole(session.user.id);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await checkAdminRole(session.user.id);
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const checkAdminRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (data && !error) {
        setIsAuthenticated(true);
      } else {
        setError('Unauthorized: Admin access required');
        // Optionally sign out if not admin
        // await supabase.auth.signOut();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
      // If successful, onAuthStateChange will trigger checkAdminRole
    } catch (err) {
      setError('An error occurred during login');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-[#00D084] border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl w-full max-w-sm text-center">
        <div className="w-12 h-12 rounded-xl bg-[#00D084] flex items-center justify-center text-[#030712] font-extrabold text-xl mx-auto mb-6">
          U
        </div>
        <h2 className="text-white text-xl font-bold mb-2">Admin Access</h2>
        <p className="text-slate-400 text-sm mb-6">Enter credentials to access the dashboard</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin Email"
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D084] transition-colors mb-3"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#00D084] transition-colors"
              required
            />
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00D084] text-[#030712] rounded-xl font-bold hover:bg-[#00D084]/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
