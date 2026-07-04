import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  Mail01Icon,
  BarChartIcon,
  Settings01Icon,
  Share01Icon,
  MessageNotification01Icon,
  FileEditIcon,
  ChartLineData01Icon,
  Menu01Icon,
  Cancel01Icon,
  Shield01Icon,
  WorkflowSquare08Icon,
  PaintBoardIcon
} from '@hugeicons/core-free-icons';

const NAV_GROUPS = [
  {
    label: 'Command Center',
    items: [
      { to: '/admin/overview', icon: DashboardSquare01Icon, label: 'Overview' },
    ]
  },
  {
    label: 'Users',
    items: [
      { to: '/admin/waitlist', icon: UserGroupIcon, label: 'Waitlist' },
      { to: '/admin/subscribers', icon: Shield01Icon, label: 'Subscribers' },
      { to: '/admin/audiences', icon: UserGroupIcon, label: 'Audiences' },
    ]
  },
  {
    label: 'Email',
    items: [
      { to: '/admin/campaigns', icon: Mail01Icon, label: 'Campaigns' },
      { to: '/admin/automations', icon: WorkflowSquare08Icon, label: 'Automations' },
      { to: '/admin/templates', icon: FileEditIcon, label: 'Templates' },
      { to: '/admin/analytics', icon: BarChartIcon, label: 'Analytics' },
    ]
  },
  {
    label: 'Growth',
    items: [
      { to: '/admin/referrals', icon: Share01Icon, label: 'Referrals' },
    ]
  },
  {
    label: 'System',
    items: [
      { to: '/admin/settings', icon: Settings01Icon, label: 'Settings' },
      { to: '/admin/brand', icon: PaintBoardIcon, label: 'Brand Identity' },
    ]
  },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out
          bg-[#070b14] border-r border-white/5
          ${collapsed ? '-translate-x-full lg:translate-x-0 lg:w-[68px]' : 'translate-x-0 w-[240px]'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 h-16 border-b border-white/5 flex-shrink-0 ${collapsed ? 'lg:justify-center' : ''}`}>
          <div className="w-8 h-8 rounded-xl bg-[#00D084] flex items-center justify-center text-[#030712] font-extrabold text-sm flex-shrink-0">
            U
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-bold text-sm">UniVerse</div>
              <div className="text-[#00D084] text-[9px] font-bold uppercase tracking-widest">Admin</div>
            </div>
          )}
        </div>

        {/* Nav Groups */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 scrollbar-none">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              {!collapsed && (
                <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">
                  {group.label}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative
                      ${isActive
                        ? 'bg-[#00D084]/10 text-[#00D084]'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }
                      ${collapsed ? 'lg:justify-center lg:px-2' : ''}
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <HugeiconsIcon icon={item.icon} size={18} className="flex-shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                        {isActive && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#00D084] rounded-full" />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/5 flex-shrink-0">
          <div className={`flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 ${collapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D084] to-teal-400 flex-shrink-0" />
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-white text-xs font-semibold truncate">Admin</div>
                <div className="text-slate-500 text-[10px] truncate">universe.market</div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
