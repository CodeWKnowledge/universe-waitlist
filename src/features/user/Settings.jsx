import { HugeiconsIcon } from '@hugeicons/react';
import { UserCircleIcon, Notification03Icon, Shield01Icon, PaintBoardIcon } from '@hugeicons/core-free-icons';

export function Settings() {
  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* Settings Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <h1 className="text-3xl font-bold font-display text-white mb-6">Settings</h1>
        
        <nav className="flex flex-col space-y-1">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-white font-bold transition-colors">
            <HugeiconsIcon icon={UserCircleIcon} size={18} /> Account
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <HugeiconsIcon icon={Notification03Icon} size={18} /> Notifications
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <HugeiconsIcon icon={Shield01Icon} size={18} /> Privacy & Security
          </button>
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors font-medium">
            <HugeiconsIcon icon={PaintBoardIcon} size={18} /> Appearance
          </button>
        </nav>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 space-y-8">
        
        <div className="space-y-4 pt-14">
          <h2 className="text-xl font-bold text-white">Account Information</h2>
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
            
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 bg-card">
                <img src="https://i.pravatar.cc/150?img=11" alt="Tunde Alabi" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-xl transition-colors">
                  Change Avatar
                </button>
                <p className="text-[10px] text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue="Tunde Alabi"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 ml-1">Display Name</label>
                  <input 
                    type="text" 
                    defaultValue="tunde_a"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 ml-1">Email Address (Verified)</label>
                <input 
                  type="email" 
                  defaultValue="tunde.alabi@stu.unilag.edu.ng"
                  disabled
                  className="w-full bg-white/5 border border-transparent rounded-xl px-4 py-3 text-sm text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>
            
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">University Details</h2>
          <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 ml-1">Department</label>
                <input 
                  type="text" 
                  defaultValue="Computer Science"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 ml-1">Level / Year</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                  <option value="100">100L (First Year)</option>
                  <option value="200">200L (Second Year)</option>
                  <option value="300">300L (Third Year)</option>
                  <option value="400" selected>400L (Fourth Year)</option>
                  <option value="500">500L (Fifth Year)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button className="px-8 py-3 bg-primary hover:bg-accent text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20">
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
