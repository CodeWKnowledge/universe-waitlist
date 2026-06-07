import { HugeiconsIcon } from '@hugeicons/react';
import { ShoppingBag01Icon, BubbleChatIcon, Alert01Icon, StarIcon } from '@hugeicons/core-free-icons';

const NOTIFICATIONS = [
  { id: 1, type: 'marketplace', text: 'Your item "Mini Fridge" received a new offer of ₦40,000.', time: '2 hours ago', read: false },
  { id: 2, type: 'message', text: 'Sam C. sent you a message.', time: '5 hours ago', read: false },
  { id: 3, type: 'alert', text: 'Please verify your university email to get the "Verified Student" badge.', time: '1 day ago', read: true },
  { id: 4, type: 'system', text: 'Welcome to UniVerse Marketplace! Start exploring or list your first item.', time: '3 days ago', read: true },
];

export function Notifications() {
  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on your listings, messages, and account activity.</p>
        </div>
        <button className="text-xs font-bold text-primary hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="glass-card border border-white/5 rounded-3xl overflow-hidden divide-y divide-white/5">
        {NOTIFICATIONS.map(note => (
          <div key={note.id} className={`p-5 flex gap-4 transition-colors hover:bg-white/[0.02] ${!note.read ? 'bg-white/[0.03]' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
              note.type === 'marketplace' ? 'bg-amber-500/10 text-amber-500' :
              note.type === 'message' ? 'bg-emerald-500/10 text-emerald-500' :
              note.type === 'alert' ? 'bg-rose-500/10 text-rose-500' :
              'bg-blue-500/10 text-blue-500'
            }`}>
              {note.type === 'marketplace' ? <HugeiconsIcon icon={ShoppingBag01Icon} size={18} /> : 
               note.type === 'message' ? <HugeiconsIcon icon={BubbleChatIcon} size={18} /> : 
               note.type === 'alert' ? <HugeiconsIcon icon={Alert01Icon} size={18} /> : 
               <HugeiconsIcon icon={StarIcon} size={18} />}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${!note.read ? 'text-white font-bold' : 'text-slate-300 font-medium'}`}>
                {note.text}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1.5">{note.time}</p>
            </div>
            {!note.read && (
              <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 shrink-0"></div>
            )}
          </div>
        ))}
        {NOTIFICATIONS.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            You have no notifications right now.
          </div>
        )}
      </div>
    </div>
  );
}
