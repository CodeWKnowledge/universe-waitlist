import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  DashboardSquare01Icon, 
  ShoppingBag01Icon, 
  Book04Icon, 
  BubbleChatIcon, 
  Bookmark02Icon, 
  Store01Icon, 
  Notification03Icon, 
  UserCircleIcon, 
  Settings01Icon,
  Cancel01Icon,
  Logout05Icon
} from '@hugeicons/core-free-icons';

const navItems = [
  { name: 'Dashboard', path: '/marketplace', icon: DashboardSquare01Icon },
  { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag01Icon },
  { name: 'Study Hub', path: '/study-hub', icon: Book04Icon },
  { name: 'Messages', path: '/messages', icon: BubbleChatIcon, badge: 3 },
  { name: 'Saved Items', path: '/saved', icon: Bookmark02Icon },
  { name: 'My Listings', path: '/my-listings', icon: Store01Icon },
];

const bottomNavItems = [
  { name: 'Notifications', path: '/notifications', icon: Notification03Icon, badge: 5 },
  { name: 'Profile', path: '/profile', icon: UserCircleIcon },
  { name: 'Settings', path: '/settings', icon: Settings01Icon },
];

export function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
    const IconObj = item.icon;
    return (
      <Link
        to={item.path}
        onClick={() => setIsOpen && setIsOpen(false)}
        className={`relative flex items-center justify-between px-3 py-2 rounded-xl transition-all group ${
          isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <HugeiconsIcon icon={IconObj} size={17} className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground transition-colors'} />
          <span className="text-[13px] font-medium">{item.name}</span>
        </div>
        {item.badge && (
          <span className="bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
            {item.badge}
          </span>
        )}
        {isActive && (
          <motion.div
            layoutId="sidebar-active"
            className="absolute left-0 w-0.5 h-5 bg-primary rounded-r-full"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-60 border-r border-border bg-card flex flex-col h-screen
        fixed top-0 left-0 z-50
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>
        {/* Logo */}
        <div className="h-14 md:h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-black text-xs">
              U
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-foreground">
              Uni<span className="text-primary">Verse</span>
            </span>
          </div>
          <button
            className="md:hidden p-1 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} />
          </button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-none">
          <div className="space-y-0.5">
            <p className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Main</p>
            {navItems.map(item => <NavItem key={item.path} item={item} />)}
          </div>

          <div className="space-y-0.5">
            <p className="px-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">Account</p>
            {bottomNavItems.map(item => <NavItem key={item.path} item={item} />)}
          </div>

          <div className="pt-4 mt-2 border-t border-border/50">
            <Link 
              to="/"
              onClick={() => setIsOpen && setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-500/10 transition-colors group"
            >
              <HugeiconsIcon icon={Logout05Icon} size={17} className="group-hover:text-rose-400 transition-colors" />
              <span className="text-[13px] font-bold">Exit Sandbox</span>
            </Link>
          </div>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-border shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-secondary cursor-pointer transition-colors">
            <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-7 h-7 rounded-full object-cover border border-border shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-foreground truncate">Tunde Alabi</p>
              <p className="text-[10px] text-muted-foreground truncate">CS • 400L</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
