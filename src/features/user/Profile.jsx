import { HugeiconsIcon } from '@hugeicons/react';
import { Shield01Icon, Store01Icon, Edit01Icon, Location01Icon, LinkSquare01Icon, Book04Icon } from '@hugeicons/core-free-icons';

export function Profile() {
  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-primary/20 via-emerald-500/10 to-transparent border border-white/5">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        <button className="absolute top-4 right-4 px-4 py-2 bg-black/50 hover:bg-black/80 backdrop-blur-md rounded-xl text-xs font-bold text-white transition-colors border border-white/10 flex items-center gap-2">
          <HugeiconsIcon icon={Edit01Icon} size={14} /> Edit Cover
        </button>
      </div>

      <div className="relative px-4 sm:px-8 -mt-20 flex flex-col md:flex-row gap-6 md:items-end">
        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-[#080808] bg-card shrink-0">
          <img src="https://i.pravatar.cc/150?img=11" alt="Tunde Alabi" className="w-full h-full object-cover" />
          <button className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm">
            <HugeiconsIcon icon={Edit01Icon} size={24} />
          </button>
        </div>
        <div className="flex-1 space-y-2 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold font-display text-white flex items-center gap-2">
                Tunde Alabi
                <HugeiconsIcon icon={Shield01Icon} size={20} className="text-primary" />
              </h1>
              <p className="text-muted-foreground mt-1 font-medium">Computer Science • 400L</p>
            </div>
            <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-colors shrink-0">
              Edit Profile
            </button>
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm text-slate-400 pt-2">
            <span className="flex items-center gap-1.5"><HugeiconsIcon icon={Location01Icon} size={16} /> University of Lagos</span>
            <span className="flex items-center gap-1.5"><HugeiconsIcon icon={LinkSquare01Icon} size={16} /> Joined Sept 2024</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Trust & Verification</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center"><HugeiconsIcon icon={Shield01Icon} size={16} /></div>
                University Email Verified
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center"><HugeiconsIcon icon={Shield01Icon} size={16} /></div>
                Phone Number Verified
              </div>
              <div className="pt-3 border-t border-white/5">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tunde has completed all standard verification steps. Highly trusted member of the community.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                <HugeiconsIcon icon={Store01Icon} size={24} />
              </div>
              <h4 className="text-3xl font-black text-white">4</h4>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Listings</p>
            </div>
            <div className="glass-card rounded-3xl p-6 border border-white/5 flex flex-col items-center justify-center text-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
                <HugeiconsIcon icon={Book04Icon} size={24} />
              </div>
              <h4 className="text-3xl font-black text-white">12</h4>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Study Materials</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">About</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Final year Computer Science student at UNILAG. I usually sell old textbooks, gadgets, and sometimes hostel furniture. I also upload my summarized notes for 100L - 300L courses. Feel free to message me!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
