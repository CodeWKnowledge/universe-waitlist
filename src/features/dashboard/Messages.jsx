import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Search01Icon, 
  MoreVerticalIcon, 
  AttachmentIcon, 
  SentIcon, 
  TickDouble01Icon,
  SmileIcon,
  Store01Icon,
  InformationCircleIcon,
  ArrowLeft01Icon
} from '@hugeicons/core-free-icons';

const CONVERSATIONS = [
  { id: 1, name: 'Amina B.', avatar: 'https://i.pravatar.cc/150?img=5', product: 'Mini Fridge', lastMessage: 'Yes, ₦40k works for me.', time: '10:42 AM', unread: 2, active: true },
  { id: 2, name: 'Sam C.', avatar: 'https://i.pravatar.cc/150?img=15', product: 'Rechargeable Lamp', lastMessage: 'When can we meet?', time: 'Yesterday', unread: 0, active: false },
  { id: 3, name: 'Tech Bro', avatar: 'https://i.pravatar.cc/150?img=33', product: 'HP Envy 13', lastMessage: 'Is it still available?', time: 'Tuesday', unread: 0, active: false },
];

const MESSAGES = [
  { id: 1, sender: 'me', text: 'Hi Amina, is the fridge still available?', time: '10:30 AM', status: 'read' },
  { id: 2, sender: 'them', text: 'Hi Tunde! Yes it is. It\'s in perfect working condition.', time: '10:32 AM' },
  { id: 3, sender: 'me', text: 'Great. Would you be willing to accept ₦40,000?', time: '10:35 AM', status: 'read' },
  { id: 4, sender: 'them', text: 'Yes, ₦40k works for me.', time: '10:42 AM' },
];

export function Messages() {
  const [msgInput, setMsgInput] = useState('');
  const [mobileView, setMobileView] = useState('list'); // 'list' | 'chat'

  return (
    <div className="h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] -mt-4 bg-card/30 border border-white/5 md:rounded-3xl overflow-hidden flex flex-col md:flex-row relative">
      
      {/* Sidebar: Conversations List */}
      <div className={`w-full md:w-80 border-r border-white/5 flex-col bg-[#0A0A0A] absolute md:static inset-0 z-20 ${mobileView === 'list' ? 'flex' : 'hidden md:flex'}`}>
        <div className="p-4 border-b border-white/5">
          <h2 className="text-xl font-bold font-display text-white mb-4">Inbox</h2>
          <div className="relative group">
            <HugeiconsIcon icon={Search01Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search messages..." 
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-none p-2 space-y-1">
          {CONVERSATIONS.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setMobileView('chat')}
              className={`p-3 rounded-2xl cursor-pointer flex items-center gap-3 transition-colors ${
                chat.active ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="relative">
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                {chat.active && <span className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-[#0A0A0A]"></span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`text-sm font-bold truncate ${chat.active ? 'text-white' : 'text-slate-300'}`}>{chat.name}</h4>
                  <span className={`text-[10px] ${chat.unread > 0 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-xs truncate mr-2 ${chat.unread > 0 ? 'text-white font-medium' : 'text-muted-foreground'}`}>{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-primary flex items-center justify-center text-[9px] font-black text-black">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex-col bg-[#080808] absolute md:static inset-0 z-10 ${mobileView === 'chat' ? 'flex' : 'hidden md:flex'}`}>
        
        {/* Chat Header */}
        <div className="h-16 border-b border-white/5 px-4 md:px-6 flex items-center justify-between bg-card/20 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-white"
              onClick={() => setMobileView('list')}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} />
            </button>
            <img src={CONVERSATIONS[0].avatar} alt="Amina" className="w-9 h-9 rounded-full object-cover border border-white/10" />
            <div>
              <h3 className="text-sm font-bold text-white">Amina B.</h3>
              <p className="text-[10px] text-primary font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span> Online
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button className="w-9 h-9 rounded-full hover:bg-white/5 flex items-center justify-center text-muted-foreground transition-colors">
              <HugeiconsIcon icon={InformationCircleIcon} size={18} />
            </button>
            <button className="w-9 h-9 rounded-full hover:bg-white/5 flex items-center justify-center text-muted-foreground transition-colors">
              <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-none pb-20 md:pb-6">
          <div className="text-center">
            <span className="text-[10px] font-bold text-muted-foreground bg-white/5 px-3 py-1 rounded-full uppercase tracking-wider">Today</span>
          </div>

          <div className="space-y-4">
            {MESSAGES.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] ${msg.sender === 'me' ? 'order-1' : 'order-2'}`}>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.sender === 'me' 
                      ? 'bg-primary text-black rounded-br-sm' 
                      : 'bg-card border border-white/5 text-white rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 text-[10px] text-muted-foreground ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.time}</span>
                    {msg.sender === 'me' && (
                      <HugeiconsIcon icon={TickDouble01Icon} size={14} className="text-primary" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            <div className="flex justify-start">
              <div className="bg-card border border-white/5 p-4 rounded-2xl rounded-bl-sm flex items-center gap-1.5 w-16">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Composer */}
        <div className="p-3 md:p-4 bg-card/80 border-t border-white/5 backdrop-blur-xl md:backdrop-blur-sm fixed md:static bottom-16 md:bottom-0 left-0 right-0 z-30">
          <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-2xl p-1 md:p-2 focus-within:border-primary/50 focus-within:bg-white/10 transition-colors">
            <button className="p-2 text-muted-foreground hover:text-white transition-colors shrink-0">
              <HugeiconsIcon icon={AttachmentIcon} size={20} />
            </button>
            <textarea 
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              placeholder="Message..." 
              className="flex-1 bg-transparent border-none text-sm text-white placeholder-muted-foreground focus:outline-none resize-none max-h-32 min-h-[40px] py-2"
              rows={1}
            />
            <div className="flex items-center gap-1 shrink-0 pb-1 pr-1">
              <button className="hidden sm:block p-2 text-muted-foreground hover:text-white transition-colors">
                <HugeiconsIcon icon={SmileIcon} size={20} />
              </button>
              <button className="p-2 bg-primary hover:bg-accent text-black rounded-xl transition-all shadow-md shadow-primary/20">
                <HugeiconsIcon icon={SentIcon} size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Details Panel */}
      <div className="hidden lg:flex w-72 border-l border-white/5 flex-col bg-[#0A0A0A]">
        <div className="p-6 border-b border-white/5 text-center">
          <img src={CONVERSATIONS[0].avatar} alt="Amina" className="w-20 h-20 rounded-full object-cover border-2 border-white/10 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Amina B.</h3>
          <p className="text-xs text-muted-foreground">Medicine • 200L</p>
        </div>
        
        <div className="p-6 space-y-6 flex-1 overflow-y-auto scrollbar-none">
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <HugeiconsIcon icon={Store01Icon} size={14} /> Regarding Item
            </h4>
            <div className="bg-card border border-white/5 rounded-xl p-3 flex gap-3 hover:border-primary/30 transition-colors cursor-pointer">
              <img src="https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=150&q=80" alt="Fridge" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-white truncate">Mini Fridge (Single Door)</h5>
                <p className="text-[10px] text-muted-foreground mt-0.5">Refurbished</p>
                <p className="text-xs font-black text-primary mt-1">₦45,000</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-colors">
              Make an Offer
            </button>
            <button className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-xl text-xs font-bold transition-colors">
              Report User
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
