import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowUpRight01Icon, 
  ShoppingBag01Icon, 
  BubbleChatIcon, 
  Bookmark02Icon, 
  Download01Icon, 
  ViewIcon,
  Add01Icon,
  CloudUploadIcon,
  MessageMultiple01Icon
} from '@hugeicons/core-free-icons';

const stats = [
  { label: 'Active Listings', value: '12', trend: '+2 this week', icon: ShoppingBag01Icon },
  { label: 'Unread Messages', value: '3', trend: 'Requires attention', icon: BubbleChatIcon, alert: true },
  { label: 'Saved Items', value: '45', trend: '5 dropping in price', icon: Bookmark02Icon },
  { label: 'Downloads', value: '128', trend: '+14% last month', icon: Download01Icon },
  { label: 'Profile Views', value: '892', trend: '+24% last month', icon: ViewIcon },
];

const activities = [
  { id: 1, type: 'marketplace', title: 'Your listing "Mini Fridge" received an offer of ₦45,000', time: '2 hours ago' },
  { id: 2, type: 'study', title: 'Someone downloaded your "MTH 101 Notes"', time: '5 hours ago' },
  { id: 3, type: 'message', title: 'Amina sent you a message regarding "Lab Coat"', time: '1 day ago' },
];

export function DashboardHome() {
  return (
    <div className="space-y-5 pb-6">
      {/* Welcome Banner */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/30 border border-border rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shadow-lg shrink-0">
            <img src="https://i.pravatar.cc/150?img=11" alt="Tunde" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display tracking-tight text-foreground">
              Welcome back, Tunde 👋
            </h1>
            <p className="text-muted-foreground text-xs mt-0.5">
              <span className="text-primary font-medium">3 unread messages</span> · <span className="text-primary font-medium">2 active offers</span>
            </p>
          </div>
        </div>
        <button className="hidden sm:flex h-8 px-3 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-xs font-medium transition-colors items-center gap-1.5 shrink-0 text-foreground">
          View Profile
        </button>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-3 gap-2 sm:gap-3">
        <Link to="/create-listing" className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 bg-primary hover:bg-accent text-primary-foreground py-3 px-2 sm:px-4 rounded-xl font-bold transition-all active:scale-95 text-xs sm:text-sm shadow-md shadow-primary/10">
          <HugeiconsIcon icon={Add01Icon} size={16} />
          <span className="hidden sm:inline">Create</span>
          <span className="sm:hidden text-[10px]">List</span>
        </Link>
        <Link to="/upload-resource" className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 bg-card hover:bg-secondary border border-border py-3 px-2 sm:px-4 rounded-xl font-bold transition-all hover:border-primary/30 text-foreground text-xs sm:text-sm">
          <HugeiconsIcon icon={CloudUploadIcon} size={16} className="text-primary" />
          <span className="hidden sm:inline">Upload</span>
          <span className="sm:hidden text-[10px]">Upload</span>
        </Link>
        <Link to="/messages" className="relative flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 bg-card hover:bg-secondary border border-border py-3 px-2 sm:px-4 rounded-xl font-bold transition-all hover:border-primary/30 text-foreground text-xs sm:text-sm">
          <HugeiconsIcon icon={MessageMultiple01Icon} size={16} className="text-primary" />
          <span className="hidden sm:inline">Messages</span>
          <span className="sm:hidden text-[10px]">Chat</span>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
        </Link>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {stats.map((stat, i) => {
          const IconObj = stat.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-xl p-3 sm:p-4 flex flex-col justify-between gap-3 hover:border-primary/20 transition-colors group border border-border"
            >
              <div className="flex justify-between items-start">
                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <HugeiconsIcon icon={IconObj} size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                {stat.alert && <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1 mr-0.5" />}
              </div>
              <div>
                <p className="text-2xl font-display font-bold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-[10px] font-medium text-muted-foreground leading-tight mt-0.5">{stat.label}</p>
                <p className={`text-[9px] font-medium mt-0.5 ${stat.alert ? 'text-destructive' : 'text-primary/80'}`}>
                  {stat.trend}
                </p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Activity & Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold font-display text-foreground">Recent Activity</h3>
            <button className="text-[11px] text-primary font-medium hover:underline flex items-center gap-0.5">
              View All <HugeiconsIcon icon={ArrowUpRight01Icon} size={12} />
            </button>
          </div>
          <div className="glass-card rounded-2xl p-1.5 divide-y divide-border border border-border">
            {activities.map((act) => (
              <div key={act.id} className="p-3 flex items-center gap-3 hover:bg-secondary rounded-xl transition-colors cursor-pointer">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  act.type === 'marketplace' ? 'bg-amber-500/10 text-amber-500' :
                  act.type === 'study' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-emerald-500/10 text-emerald-500'
                }`}>
                  {act.type === 'marketplace' ? <HugeiconsIcon icon={ShoppingBag01Icon} size={14} /> : 
                   act.type === 'study' ? <HugeiconsIcon icon={Download01Icon} size={14} /> : 
                   <HugeiconsIcon icon={BubbleChatIcon} size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground line-clamp-1">{act.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold font-display text-foreground">Market Insights</h3>
          <div className="glass-card rounded-2xl p-4 space-y-4 border border-border">
            {[
              { label: 'Top Category', value: 'Electronics', color: 'bg-primary', w: 'w-[75%]' },
              { label: 'Avg. Selling Time', value: '3 Days', color: 'bg-blue-500', w: 'w-[45%]' },
              { label: 'Most Downloaded', value: 'MTH 101', color: 'bg-amber-500', w: 'w-[60%]' },
            ].map(row => (
              <div key={row.label} className="space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="text-foreground font-medium">{row.value}</span>
                </div>
                <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${row.color} ${row.w} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
