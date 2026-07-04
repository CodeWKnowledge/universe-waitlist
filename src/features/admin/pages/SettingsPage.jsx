import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase/client';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle02Icon, AlertCircleIcon, Loading03Icon } from '@hugeicons/core-free-icons';

const EDGE_FUNCTIONS = [
  { name: 'send-email', label: 'Send Email', desc: 'Transactional emails (welcome, onboarding)' },
  { name: 'process-email-queue', label: 'Process Queue', desc: 'Automated sequence dispatcher' },
  { name: 'send-broadcast', label: 'Send Broadcast', desc: 'Campaign batch sending' },
  { name: 'unsubscribe', label: 'Unsubscribe', desc: 'Unsubscribe link handler' },
];

function FunctionStatus({ fn }) {
  const [status, setStatus] = useState('checking'); // checking | ok | not_deployed

  useEffect(() => {
    async function ping() {
      try {
        // We send an intentionally invalid body — a deployed function will return a proper error JSON.
        // An undeployed function throws a network/fetch error.
        const { error } = await supabase.functions.invoke(fn.name, { body: { __ping: true } });
        // Any response (even a 400) means the function IS deployed
        setStatus('ok');
      } catch {
        setStatus('not_deployed');
      }
    }
    ping();
  }, [fn.name]);

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <div className="text-sm font-semibold text-white">{fn.label}</div>
        <div className="text-xs text-slate-500 font-mono">{fn.name}</div>
        <div className="text-[10px] text-slate-600 mt-0.5">{fn.desc}</div>
      </div>
      <div className="shrink-0 ml-4">
        {status === 'checking' && (
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <HugeiconsIcon icon={Loading03Icon} size={14} className="animate-spin" />
            Checking...
          </div>
        )}
        {status === 'ok' && (
          <div className="flex items-center gap-1.5 text-[#00D084] text-xs font-bold">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} />
            Deployed
          </div>
        )}
        {status === 'not_deployed' && (
          <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
            <HugeiconsIcon icon={AlertCircleIcon} size={14} />
            Not Deployed
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const adminPasskeySet = !!import.meta.env.VITE_ADMIN_PASSKEY;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-white">Platform Settings</h2>
          <p className="text-sm text-slate-500">System configuration and deployment status.</p>
        </div>
      </div>

      <div className="space-y-4">

        {/* Edge Function Status */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h3 className="font-bold text-white border-b border-white/5 pb-3 mb-4">
            Edge Function Deployment Status
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            These server-side functions handle all email sending. Each must be deployed to Supabase for its feature to work.
            See <span className="text-slate-300 font-mono">docs/SUPABASE_EDGE_FUNCTIONS_GUIDE.md</span> for deployment instructions.
          </p>
          {EDGE_FUNCTIONS.map(fn => <FunctionStatus key={fn.name} fn={fn} />)}
        </div>

        {/* Security */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white border-b border-white/5 pb-3">Security</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">Admin Passkey</div>
              <div className="text-xs text-slate-500">Controls access to this admin portal.</div>
            </div>
            <div className={`flex items-center gap-1.5 text-xs font-bold ${adminPasskeySet ? 'text-[#00D084]' : 'text-rose-400'}`}>
              <HugeiconsIcon icon={adminPasskeySet ? CheckmarkCircle02Icon : AlertCircleIcon} size={14} />
              {adminPasskeySet ? 'Set via VITE_ADMIN_PASSKEY' : 'Not set — using default!'}
            </div>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white border-b border-white/5 pb-3">Email Configuration</h3>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Default Sender Address</label>
            <input
              type="text"
              value="UniVerse <hello@universe.market>"
              disabled
              className="w-full px-4 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-slate-500"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Provider</label>
            <input
              type="text"
              value="Resend — via server-side Edge Functions"
              disabled
              className="w-full px-4 py-2 bg-black/20 border border-white/5 rounded-xl text-sm text-slate-500"
            />
          </div>
          <p className="text-[10px] text-slate-600">
            The Resend API key is stored as a Supabase server secret and is never exposed to the browser.
          </p>
        </div>

        {/* Waitlist Settings */}
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white border-b border-white/5 pb-3">Waitlist Behavior</h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white font-medium">Accept New Signups</div>
              <div className="text-xs text-slate-500">Allow users to join the waitlist.</div>
            </div>
            <div className="w-10 h-6 bg-[#00D084] rounded-full relative cursor-not-allowed opacity-50">
              <div className="w-4 h-4 bg-[#030712] rounded-full absolute top-1 right-1" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
