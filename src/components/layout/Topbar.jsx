import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Notification03Icon, Mail01Icon, Menu01Icon, Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';
import { useTheme } from '../../app/providers/ThemeContext';

export function Topbar({ toggleSidebar }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-14 md:h-16 bg-background/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-3 md:px-6 sticky top-0 z-40 md:ml-60 transition-colors duration-200">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button 
          onClick={toggleSidebar}
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-foreground hover:bg-white/10 transition-colors shrink-0"
        >
          <HugeiconsIcon icon={Menu01Icon} size={18} />
        </button>
        <div className="relative group flex-1">
          <HugeiconsIcon icon={Search01Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search listings, materials, or messages..." 
            className="w-full bg-transparent border-none py-2 pl-9 pr-4 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-0 transition-all"
          />
          <div className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1">
            <kbd className="px-1.5 py-0.5 text-[9px] font-medium bg-secondary text-secondary-foreground rounded">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-[9px] font-medium bg-secondary text-secondary-foreground rounded">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-6">
        <button 
          onClick={toggleTheme}
          className="relative w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={theme === 'dark' ? Sun03Icon : Moon02Icon} size={18} />
        </button>
        <Link to="/messages" className="hidden md:flex relative w-8 h-8 rounded-full items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-transparent">
          <HugeiconsIcon icon={Mail01Icon} size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-background"></span>
        </Link>
        <Link to="/notifications" className="relative w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-transparent">
          <HugeiconsIcon icon={Notification03Icon} size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-destructive ring-2 ring-background"></span>
        </Link>
        <div className="hidden md:block h-5 w-px bg-border mx-0.5"></div>
        <Link to="/profile" className="flex items-center gap-2 pl-1 hover:opacity-80 transition-opacity">
          <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-7 h-7 rounded-full border border-border object-cover" />
        </Link>
      </div>
    </header>
  );
}
