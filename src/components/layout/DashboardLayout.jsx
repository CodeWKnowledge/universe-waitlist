import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  DashboardSquare01Icon, 
  ShoppingBag01Icon, 
  Book04Icon, 
  BubbleChatIcon, 
  UserCircleIcon 
} from '@hugeicons/core-free-icons';

const mobileNavItems = [
  { name: 'Home', path: '/marketplace', icon: DashboardSquare01Icon },
  { name: 'Shop', path: '/marketplace', icon: ShoppingBag01Icon },
  { name: 'Study', path: '/study-hub', icon: Book04Icon },
  { name: 'Chat', path: '/messages', icon: BubbleChatIcon },
  { name: 'Profile', path: '/profile', icon: UserCircleIcon },
];

export function DashboardLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-black flex text-sm transition-colors duration-200">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0 w-full overflow-x-hidden">
        <Topbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 p-3 sm:p-5 md:p-6 md:ml-60 w-full">
          <div className="max-w-6xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-card/90 backdrop-blur-xl border-t border-border z-40 flex items-center justify-around px-2">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          const IconObj = item.icon;
          return (
            <Link 
              key={item.name}
              to={item.path}
              className="flex flex-col items-center justify-center w-12 h-full gap-0.5 transition-colors"
            >
              <HugeiconsIcon 
                icon={IconObj} 
                size={18} 
                className={isActive ? 'text-primary' : 'text-muted-foreground'} 
              />
              <span className={`text-[9px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
