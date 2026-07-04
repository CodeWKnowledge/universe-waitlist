import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';

const BREADCRUMB_MAP = {
  '/admin/overview':    'Overview',
  '/admin/waitlist':    'Waitlist Management',
  '/admin/subscribers': 'Subscribers',
  '/admin/campaigns':   'Email Campaigns',
  '/admin/templates':   'Email Templates',
  '/admin/analytics':   'Email Analytics',
  '/admin/referrals':   'Referrals',
  '/admin/settings':    'Settings',
};

export default function AdminTopbar({ onMenuToggle }) {
  const { pathname } = useLocation();
  const title = BREADCRUMB_MAP[pathname] || 'Admin';

  return (
    <header className="h-16 bg-[#070b14]/80 backdrop-blur border-b border-white/5 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 flex items-center justify-center transition-colors"
        >
          <HugeiconsIcon icon={Menu01Icon} size={18} />
        </button>

        {/* Desktop collapse toggle */}
        <button
          onClick={onMenuToggle}
          className="hidden lg:flex w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 items-center justify-center transition-colors"
        >
          <HugeiconsIcon icon={Menu01Icon} size={16} />
        </button>

        <div>
          <h1 className="text-white font-bold text-base leading-none">{title}</h1>
          <p className="text-slate-500 text-[10px] mt-0.5">UniVerse Admin Portal</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Back to site */}
        <Link
          to="/"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-medium transition-all"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={13} />
          <span>View Site</span>
        </Link>

        {/* Admin Badge */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D084] to-teal-400 flex items-center justify-center text-[#030712] font-extrabold text-xs">
          A
        </div>
      </div>
    </header>
  );
}
