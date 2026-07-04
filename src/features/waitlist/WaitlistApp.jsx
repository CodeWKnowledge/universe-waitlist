import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SoftAurora from './SoftAurora';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  CheckmarkCircle02Icon, 
  ArrowRight01Icon, 
  Share01Icon, 
  UserGroupIcon, 
  Shield01Icon, 
  Notification01Icon, 
  ShoppingBag01Icon, 
  StarIcon,
  BookOpen01Icon,
  Location01Icon,
  BubbleChatIcon,
  Cancel01Icon,
  Moon02Icon,
  Sun03Icon
} from '@hugeicons/core-free-icons';

import { generateReferralLink } from '../../utils/helpers';
import { validateWaitlistForm } from '../../utils/validators';
import { analytics } from '../../services/analytics/analytics.service';
import { useWaitlist } from '../../hooks/useWaitlist';
import { useUniversities } from '../../hooks/useUniversities';


// Hardcoded future launch date
const LAUNCH_DATE = new Date("2026-08-15T00:00:00").getTime();

const FAQ_ITEMS = [
  {
    q: "Is UniVerse free to use for university students?",
    a: "Yes, 100%! UniVerse is built by students, for students. There are zero listing fees, zero transaction fees, and zero hidden costs for standard buying, selling, and offering peer-to-peer campus services."
  },
  {
    q: "How does the student verification process work?",
    a: "When we launch, signing up will require a verified university email address (.edu.ng or official campus domain). This keeps the marketplace exclusive to actual students and creates a trusted campus environment."
  },
  {
    q: "What kind of services can I offer or hire on the platform?",
    a: "Anything campus-safe! Standard services include private tutoring, exam prep, graphic design, hostel moving assistance, laundry delivery runners, and quick errands."
  },
  {
    q: "How do transaction handovers work safely?",
    a: "UniVerse promotes face-to-face handovers at high-traffic, secure campus locations (e.g., student union buildings, library squares). Our platform includes safety checklists and reviews before transactions are concluded."
  }
];

const SLIDER_ITEMS = [
  "Students joining from UNILAG",
  "Students joining from UI",
  "Students joining from FUTA",
  "Students joining from UNIPORT",
  "Students joining from OAU",
  "Students joining from LASU",
  "Students joining from UNIBEN",
  "Students joining from ABU",
  "Students joining from UNN",
  "Students joining from BUK"
];

const PAIN_POINTS = [
  {
    problem: {
      icon: BubbleChatIcon,
      label: "WhatsApp Chaos",
      desc: "Hunting through endless status posts, screenshots, and group chats just to find a textbook or mattress."
    },
    solution: {
      icon: ShoppingBag01Icon,
      label: "Structured Market Feed",
      desc: "One searchable feed, filterable by campus zone, hostel block, category, and price — no noise."
    }
  },
  {
    problem: {
      icon: Cancel01Icon,
      label: "Scams & Unsafe Meetups",
      desc: "Unverified strangers, prepayment fraud, and no way to know if the seller even attends your school."
    },
    solution: {
      icon: Shield01Icon,
      label: "Verified Student Network",
      desc: "Every account is locked to an active .edu.ng email. Safe-trade locations and peer reviews are baked in."
    }
  },
  {
    problem: {
      icon: StarIcon,
      label: "Overpriced Study Resources",
      desc: "Paying inflated fees for past questions, prep guides, or struggling to find a tutor for your exact course."
    },
    solution: {
      icon: BookOpen01Icon,
      label: "Peer Study Hub",
      desc: "Direct peer-to-peer sharing of past questions, summaries, and quick tutoring for specific course codes."
    }
  }
];

export default function WaitlistApp({ triggerToast }) {
  // Timer States
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  // Waitlist States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    role: 'both',
    category: 'electronics'
  });
  const [errors, setErrors] = useState({});
  const { join, loading, error: joinError } = useWaitlist();
  const { getAll: getUniversities } = useUniversities();
  const UNIVERSITIES = getUniversities();
  const [joined, setJoined] = useState(false);
  const [alreadyJoined, setAlreadyJoined] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(1482);
  const [queuePosition, setQueuePosition] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [userSession, setUserSession] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [activeCarouselIdx, setActiveCarouselIdx] = useState(0);

  // ── Theme ──
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('universe_theme');
    return saved ? saved === 'dark' : true;
  });
  const toggleTheme = () => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('universe_theme', next ? 'dark' : 'light');
      analytics.track('Theme Toggled', { theme: next ? 'dark' : 'light' });
      return next;
    });
  };

  // Load existing user session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("universe_waitlist_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserSession(parsed);
        setJoined(true);
        setQueuePosition(parsed.queuePosition);
        setFormData({
          name: parsed.name,
          email: parsed.email,
          university: parsed.university,
          role: parsed.role,
          category: parsed.category || 'electronics'
        });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Track page visit & read query referrals
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
      analytics.track("Referral Landing Visited", { referralCode: ref });
    }
    analytics.track("Page Visited", { page: "home" });
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const timerInterval = setInterval(() => {
      const now = new Date().getTime();
      const difference = LAUNCH_DATE - now;

      if (difference <= 0) {
        setTimeLeft(prev => ({ ...prev, isExpired: true }));
        clearInterval(timerInterval);
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // Submit Waitlist Request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const { isValid, errors: validationErrors } = validateWaitlistForm(formData);
    if (!isValid) {
      setErrors(validationErrors);
      if (validationErrors.emailHint) {
        triggerToast(validationErrors.emailHint, 'success');
      }
      return;
    }

    analytics.trackCtaClicked("join_waitlist_submit", "home");

    try {
      const payload = {
        ...formData,
        referralCode: referralCode || undefined
      };
      const user = await join(payload);
      setUserSession(user);
      setQueuePosition(user.queue_position ?? 1);
      setAlreadyJoined(user.already_joined === true);
      setJoined(true);

      analytics.trackWaitlistJoined(user.email, user.university, user.queue_position ?? 1, user.referral_code);
      const displayName = user.first_name || formData.name.split(' ')[0] || 'there';
      if (user.already_joined) {
        triggerToast(`Welcome back, ${displayName}! You're already on the list.`, 'success');
      } else {
        triggerToast(`Welcome to the UniVerse, ${displayName}!`);
      }
    } catch (err) {
      setErrors({ form: err.message });
      triggerToast(err.message, "error");
    }
  };

  const handleCopyLink = () => {
    // Supabase returns snake_case: referral_code (not referralCode)
    const refCode = userSession?.referral_code || `UNI-${queuePosition}`;
    const link = generateReferralLink(refCode);
    
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    triggerToast("Referral link copied to clipboard!");
    analytics.trackReferralCopied(formData.email, refCode);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const doubledSliderItems = [...SLIDER_ITEMS, ...SLIDER_ITEMS];

  return (
    <div
      data-theme={isDark ? 'dark' : 'light'}
      className={`min-h-screen flex flex-col relative overflow-x-hidden selection:bg-[#00D084] selection:text-black transition-colors duration-300 ${isDark ? 'bg-[#030712] text-slate-100' : 'bg-[#f1f5f9] text-slate-900'}`}
    >
      
      {/* Aurora WebGL Background — full-page, seamless */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <SoftAurora
          speed={0.35}
          scale={1.1}
          brightness={1.1}
          color1="#00D084"
          color2="#00c866"
          noiseFrequency={1.8}
          noiseAmplitude={1.1}
          bandHeight={0.3}
          bandSpread={1.2}
          octaveDecay={0.12}
          layerOffset={0.5}
          colorSpeed={0.7}
          enableMouseInteraction={true}
          mouseInfluence={0.18}
        />
        {/* Four-stop gradient — adapts to theme */}
        <div
          className="aurora-overlay absolute inset-0 transition-opacity duration-300"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(3,7,18,0.55) 65%, rgba(3,7,18,0.92) 82%, #030712 100%)'
              : 'linear-gradient(to bottom, transparent 0%, transparent 30%, rgba(241,245,249,0.6) 60%, rgba(241,245,249,0.96) 82%, #f1f5f9 100%)'
          }}
        />
      </div>

      {/* --- HEADER --- */}
      <header className={`w-full h-20 backdrop-blur-xl border-b sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between shadow-lg select-none transition-colors duration-300 ${isDark ? 'bg-[#030712]/80 border-white/5' : 'bg-[#f1f5f9]/88 border-black/8'}`}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#00D084] flex items-center justify-center text-[#030712] font-display font-extrabold text-lg shadow-lg shadow-[#00D084]/20">
            U
          </div>
          <span className={`brand text-xl font-bold tracking-tight font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Uni<span className="text-[#00D084]">Verse</span>
          </span>
          <span className="text-[9px] bg-[#00D084]/10 text-[#00D084] font-extrabold uppercase px-2 py-0.5 rounded-md border border-[#00D084]/20 ml-1.5 tracking-wider">
            Launching Soon
          </span>
        </div>

        <div className="flex items-center gap-5">
          <a
            href="#features"
            className={`hidden sm:inline-block text-xs font-semibold transition-colors hover:text-[#00D084] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            Features
          </a>
          <a
            href="#faq"
            className={`hidden sm:inline-block text-xs font-semibold transition-colors hover:text-[#00D084] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}
          >
            FAQs
          </a>
          <span className={`hidden sm:inline ${isDark ? 'text-white/10' : 'text-black/10'}`}>|</span>

          {/* ── Theme toggle ── */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`relative w-9 h-9 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer overflow-hidden ${
              isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                : 'bg-black/5 border-black/10 hover:bg-black/10 text-slate-800'
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <HugeiconsIcon 
                icon={Sun03Icon} 
                size={18} 
                className={`absolute transition-all duration-500 ${isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`} 
              />
              <HugeiconsIcon 
                icon={Moon02Icon} 
                size={18} 
                className={`absolute transition-all duration-500 ${isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} 
              />
            </div>
          </button>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-24 z-10 flex flex-col gap-20 md:gap-32 relative">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[75vh]">
          {/* Messaging Block */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#00D084]/15 border border-[#00D084]/20 rounded-full text-[#00D084] text-[10px] font-extrabold uppercase tracking-widest mx-auto lg:mx-0 select-none shadow-[0_0_15px_rgba(0,208,132,0.05)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D084] animate-ping"></span>
              <span>Exclusive Pre-Launch Access</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] font-display">
              The Student <br/>
              <span className="text-[#00D084] bg-clip-text bg-gradient-to-r from-[#00D084] to-teal-400">Marketplace</span> <br/>
              Built For Campus Life.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed mx-auto lg:mx-0">
              Buy and sell hostel assets, request quick errand runs, find verified tutors, or exchange exam prep sheets directly within your campus network.
            </p>

            {/* Countdown widget */}
            <div className="bg-slate-950/60 backdrop-blur-xl rounded-2xl border border-white/5 p-4.5 shadow-xl inline-flex flex-col gap-2 max-w-md w-full select-none">
              <div className="text-[10px] font-extrabold text-[#00D084] uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
                <HugeiconsIcon icon={Notification01Icon} size={12} />
                <span>Target Campus Launch Countdown</span>
              </div>
              
              {timeLeft.isExpired ? (
                <div className="text-center py-1 font-bold text-[#00D084] text-sm">
                  We Are Officially Live! Launching Sandbox Demo.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: "Days", val: timeLeft.days },
                    { label: "Hours", val: timeLeft.hours },
                    { label: "Mins", val: timeLeft.minutes },
                    { label: "Secs", val: timeLeft.seconds }
                  ].map((unit, idx) => (
                    <div key={idx} className="bg-white/5 rounded-xl p-2.5 border border-white/5 flex flex-col">
                      <span className="text-xl sm:text-2xl font-bold text-white font-display">
                        {String(unit.val).padStart(2, '0')}
                      </span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">
                        {unit.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a 
                href="#waitlist-form" 
                className="w-full sm:w-auto px-8 py-3.5 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] font-bold rounded-2xl text-xs shadow-lg shadow-[#00D084]/20 hover:scale-105 active:scale-95 text-center cursor-pointer transition-all"
              >
                Claim Priority Spot
              </a>
              <Link 
                to="/marketplace" 
                className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold border border-white/10 rounded-2xl text-xs hover:scale-105 active:scale-95 text-center cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} size={13} className="text-[#00D084]" />
                <span>Explore Live Sandbox</span>
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-4 select-none">
              <div className="space-y-0.5">
                <div className="text-xl font-bold text-white font-display">1,480+</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Students Registered</div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="space-y-0.5">
                <div className="text-xl font-bold text-white font-display">12+</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Campuses Integrated</div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="space-y-0.5">
                <div className="text-xl font-bold text-[#00D084] font-display">4.9★</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Early Beta Score</div>
              </div>
            </div>

          </div>

          {/* Form Block / Floating Mockup Card */}
          <div className="lg:col-span-5 relative flex flex-col justify-center">
            
            {/* Background glowing frame */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00D084] to-teal-500 rounded-3xl opacity-10 blur-2xl pointer-events-none z-0"></div>

            {/* Interactive Floating Glass Card Visuals behind Hero (shown on Desktop) */}
            <div className="hidden lg:block absolute -top-16 -left-16 w-48 p-3 glass-card rounded-2xl shadow-xl animate-float pointer-events-none">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[#00D084]/15 flex items-center justify-center text-[#00D084] text-xs font-bold">✓</div>
                <span className="text-[10px] font-bold text-white">Verified Account</span>
              </div>
              <div className="w-full h-1 bg-[#00D084]/20 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-[#00D084]"></div>
              </div>
            </div>

            <div className="hidden lg:block absolute -bottom-10 -right-10 w-56 p-4.5 glass-card rounded-2xl shadow-2xl animate-float-delay pointer-events-none">
              <div className="text-[9px] font-bold text-slate-500 uppercase mb-1">Live Feed Offer</div>
              <div className="text-[11px] font-bold text-white mb-2">Hostel Bed Frame</div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#00D084]">₦15,000</span>
                <span className="text-[8px] bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-slate-400">UNILAG</span>
              </div>
            </div>

            {joined ? (
              /* Success confirmation Ticket View */
              <div className="glass-card rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl relative overflow-hidden select-none space-y-6 text-center z-10 animate-[fadeIn_0.5s_ease-out]">
                
                {/* Visual success check */}
                <div className="w-16 h-16 bg-[#00D084]/10 text-[#00D084] rounded-full flex items-center justify-center mx-auto mb-2 border border-[#00D084]/20 shadow-[0_0_15px_rgba(0,208,132,0.1)]">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={28} />
                </div>

                <div className="space-y-1.5">
                  {alreadyJoined ? (
                    <>
                      <h3 className="text-2xl font-bold text-white font-display">Already on the list!</h3>
                      <p className="text-xs text-amber-400 font-semibold">This email has already joined the waitlist.</p>
                      <p className="text-xs text-slate-400">Here's your existing queue spot and referral link.</p>
                    </>
                  ) : (
                    <>
                      <h3 className="text-2xl font-bold text-white font-display">You're on the list!</h3>
                      <p className="text-xs text-slate-400">Welcome to the future of student trading.</p>
                    </>
                  )}
                </div>

                {/* Simulated priority badge */}
                <div className="bg-[#00D084]/5 rounded-2xl border border-[#00D084]/10 p-4.5 max-w-xs mx-auto space-y-1 shadow-[inset_0_0_10px_rgba(0,208,132,0.03)]">
                  <span className="text-[9px] font-bold text-[#00D084] uppercase tracking-widest block">
                    {alreadyJoined ? 'Your Original Queue Spot' : 'Your Queue Position'}
                  </span>
                  <span className="text-3xl font-bold text-white font-display block">
                    #{queuePosition.toLocaleString()}
                  </span>
                  
                  {/* Progress bar to next rank */}
                  <div className="pt-2">
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="w-4/5 h-full bg-gradient-to-r from-[#00D084] to-teal-400 shadow-[0_0_8px_#00D084]"></div>
                    </div>
                    <span className="text-[8px] text-slate-500 mt-1 block">80% progress to beta tier invite</span>
                  </div>
                </div>

                {/* Referral link Copy Block */}
                <div className="space-y-2">
                  <span className="text-[10px] text-[#00D084] font-bold uppercase tracking-wider block text-left">Your Referral Link</span>
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      readOnly 
                      value={userSession?.referral_code ? generateReferralLink(userSession.referral_code) : `${window.location.origin}?ref=UNI-${queuePosition}`}
                      className="bg-slate-950/60 border border-white/5 rounded-xl px-3.5 py-3 text-[11px] font-semibold text-slate-400 flex-1 outline-none text-left focus:border-[#00D084]/30"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="px-4 py-3 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] text-xs font-bold rounded-xl cursor-pointer active:scale-95 transition-all shadow-md shadow-[#00D084]/10"
                    >
                      {copiedLink ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>

                {/* Social Invite Links */}
                <div className="pt-2 flex flex-col gap-2">
                  <button 
                    onClick={() => {
                      window.open(`https://wa.me/?text=I%20just%20claimed%20my%20waitlist%20spot%20at%20UniVerse%20Student%20Marketplace!%20Join%20me%20here:%20https://universe.market?ref=UNILAG-${queuePosition}`);
                    }}
                    className="w-full py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-emerald-500/5"
                  >
                    <span>Invite via WhatsApp</span>
                  </button>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => {
                        window.open(`https://twitter.com/intent/tweet?text=Claimed%20queue%20%23${queuePosition}%20at%20UniVerse%20-%20the%20upcoming%20marketplace%20for%20hostels,%20tutoring%20and%20runs!%20Join:%20https://universe.market?ref=${queuePosition}`);
                      }}
                      className="py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors border border-white/10"
                    >
                      <span>Share on X</span>
                    </button>
                    
                    <Link 
                      to="/marketplace" 
                      className="py-3 bg-[#00D084]/10 border border-[#00D084]/20 hover:bg-[#00D084]/20 text-[#00D084] font-bold rounded-xl text-[10px] flex items-center justify-center gap-1 transition-all"
                    >
                      <span>Test Live Demo</span>
                    </Link>
                  </div>
                </div>

              </div>
            ) : (
              /* Waitlist Intake Form */
              <form 
                onSubmit={handleSubmit}
                className="glass-card rounded-3xl border border-white/10 p-6 md:p-8 shadow-2xl relative z-10 space-y-5 text-left"
              >
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white font-display">Claim Premium Invite</h3>
                  <p className="text-xs text-slate-400">Decentralized. Secure. Verified students only.</p>
                </div>

                {/* Full name input */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Chidera Okonkwo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-xs outline-none transition-all placeholder-slate-600
                      ${errors.name 
                        ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400' 
                        : 'border-white/10 focus:border-[#00D084] focus:ring-2 focus:ring-[#00D084]/10 focus:bg-white/10'}`}
                  />
                  {errors.name && <p className="text-[10px] text-rose-400 font-medium">{errors.name}</p>}
                </div>

                {/* Email input */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Campus Email Address</label>
                  <input 
                    type="email" 
                    placeholder="chidera@unilag.edu.ng"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-xs outline-none transition-all placeholder-slate-600
                      ${errors.email 
                        ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400' 
                        : 'border-white/10 focus:border-[#00D084] focus:ring-2 focus:ring-[#00D084]/10 focus:bg-white/10'}`}
                  />
                  {errors.email && <p className="text-[10px] text-rose-400 font-medium">{errors.email}</p>}
                </div>

                {/* University Select */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">University</label>
                  <select 
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-xs outline-none transition-all cursor-pointer
                      ${errors.university 
                        ? 'border-rose-500 focus:border-rose-400' 
                        : 'border-white/10 focus:border-[#00D084] focus:ring-2 focus:ring-[#00D084]/10 focus:bg-white/10'}`}
                  >
                    <option value="" className="bg-slate-900 text-slate-400">-- Choose Campus --</option>
                    {UNIVERSITIES.map((uni, idx) => (
                      <option key={idx} value={uni.name} className="bg-slate-900 text-white">{uni.name}</option>
                    ))}
                  </select>
                  {errors.university && <p className="text-[10px] text-rose-400 font-medium">{errors.university}</p>}
                </div>

                {/* Campus Role options */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Primary Focus</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'buyer', label: 'Bargain / Buy' },
                      { id: 'seller', label: 'Sell Assets' },
                      { id: 'both', label: 'Offer Services' }
                    ].map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: role.id })}
                        className={`py-2.5 px-1.5 rounded-xl text-[10px] font-bold border text-center transition-all cursor-pointer
                          ${formData.role === role.id 
                            ? 'bg-[#00D084] text-[#030712] border-[#00D084] shadow-md shadow-[#00D084]/10' 
                            : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form-level error banner */}
                {errors.form && (
                  <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-3 text-[11px] text-rose-300 font-medium text-center">
                    {errors.form}
                  </div>
                )}

                {/* Action button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#00D084] to-teal-400 hover:from-[#00C16A] hover:to-teal-500 text-[#030712] text-xs font-bold rounded-xl shadow-lg shadow-[#00D084]/10 hover:shadow-[#00D084]/25 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-[#030712] border-t-transparent rounded-full animate-spin"></span>
                      <span>Reserving Spot...</span>
                    </>
                  ) : (
                    <span>Register Priority Invite</span>
                  )}
                </button>

                <p className="text-[10px] text-slate-500 text-center leading-normal">
                  🔒 Verified students only (.edu.ng email priority). No spam, ever.
                </p>
              </form>
            )}

          </div>

        </div>

        {/* --- SOCIAL PROOF STRIP (INFINITE SLIDER) --- */}
        <div className="relative w-full overflow-hidden py-5 bg-slate-950/40 border-y border-white/5 select-none rounded-2xl shadow-inner">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#030712] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#030712] to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex w-max gap-10 animate-infinite-scroll">
            {doubledSliderItems.map((item, idx) => (
              <span key={idx} className="glass-card px-5 py-2.5 rounded-full text-xs font-semibold text-slate-300 flex items-center gap-2.5 border border-white/5">
                <HugeiconsIcon icon={Location01Icon} size={14} className="text-[#00D084]" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* --- PROBLEM vs SOLUTION SECTION --- */}
        <section className="space-y-10 scroll-mt-24 select-none">

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#00D084]">Why UniVerse Exists</h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-display leading-tight">
              Every campus problem, <span className="text-[#00D084]">solved.</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              We built UniVerse because campus commerce is broken. Here's exactly what we're fixing.
            </p>
          </div>

          {/* Desktop column labels */}
          <div className="hidden md:grid grid-cols-[1fr_52px_1fr] gap-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-rose-400/80">
              <HugeiconsIcon icon={Cancel01Icon} size={12} />
              <span>The Problem Today</span>
            </div>
            <div />
            <div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[#00D084]/80">
              <HugeiconsIcon icon={CheckmarkCircle02Icon} size={12} />
              <span>The UniVerse Fix</span>
            </div>
          </div>

          {/* Paired rows */}
          <div className="flex flex-col gap-3 max-w-4xl mx-auto">
            {PAIN_POINTS.map((pair, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-[1fr_52px_1fr] gap-3 items-stretch">

                {/* Problem card */}
                <div className="glass-card rounded-2xl border border-rose-500/10 bg-rose-500/[0.025] p-5 flex items-start gap-4 hover:border-rose-500/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/15 flex items-center justify-center text-rose-400 flex-shrink-0 mt-0.5">
                    <HugeiconsIcon icon={pair.problem.icon} size={18} />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-rose-400/60 md:hidden">The Problem</div>
                    <h4 className="text-sm font-bold text-white font-display">{pair.problem.label}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{pair.problem.desc}</p>
                  </div>
                </div>

                {/* Arrow — desktop */}
                <div className="hidden md:flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[#00D084]/10 border border-[#00D084]/20 flex items-center justify-center shadow-[0_0_12px_rgba(0,208,132,0.08)]">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-[#00D084]" />
                  </div>
                </div>

                {/* Arrow — mobile */}
                <div className="flex md:hidden justify-center items-center py-1">
                  <div className="w-8 h-8 rounded-full bg-[#00D084]/10 border border-[#00D084]/20 flex items-center justify-center rotate-90">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} className="text-[#00D084]" />
                  </div>
                </div>

                {/* Solution card */}
                <div className="glass-card rounded-2xl border border-[#00D084]/15 bg-[#00D084]/[0.025] p-5 flex items-start gap-4 hover:border-[#00D084]/30 hover:shadow-[0_0_20px_rgba(0,208,132,0.06)] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#00D084]/10 border border-[#00D084]/20 flex items-center justify-center text-[#00D084] flex-shrink-0 mt-0.5">
                    <HugeiconsIcon icon={pair.solution.icon} size={18} />
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="text-[9px] font-extrabold uppercase tracking-widest text-[#00D084]/60 md:hidden">UniVerse Fix</div>
                    <h4 className="text-sm font-bold text-white font-display">{pair.solution.label}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{pair.solution.desc}</p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </section>

        {/* --- EXPLORE THE PRODUCT CTA --- */}
        <section id="features" className="scroll-mt-24">
          <div className={`relative rounded-3xl overflow-hidden border transition-all duration-300 ${
            isDark
              ? 'glass-card border-white/8'
              : 'bg-white border-black/8 shadow-xl'
          }`}>

            {/* Glow orb background accent */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#00D084]/10 blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-[#00D084]/8 blur-[70px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-0">

              {/* ── Left: copy ── */}
              <div className="p-8 md:p-12 flex flex-col justify-center gap-8">

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00D084] bg-[#00D084]/10 px-3 py-1 rounded-md border border-[#00D084]/20 inline-block">
                    Product Preview
                  </span>
                  <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight mt-3 ${ isDark ? 'text-white' : 'text-slate-900' }`}>
                    See what's waiting
                    <span className="block text-[#00D084]">for you at launch.</span>
                  </h2>
                  <p className={`text-sm leading-relaxed max-w-sm ${ isDark ? 'text-slate-400' : 'text-slate-500' }`}>
                    We've built a full interactive demo of every module. Explore the marketplace, try the bargain chat, browse the study hub — right now, before anyone else.
                  </p>
                </div>

                {/* Feature pill row */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Campus Marketplace', slug: 'marketplace', icon: ShoppingBag01Icon },
                    { label: 'Study Hub', slug: 'study-hub', icon: BookOpen01Icon },
                    { label: 'Bargain Chat', slug: 'messages', icon: BubbleChatIcon },
                    { label: 'My Listings', slug: 'my-listings', icon: Shield01Icon },
                  ].map(f => (
                    <Link
                      key={f.slug}
                      to={`/${f.slug}`}
                      onClick={() => analytics.trackFeatureClicked(f.slug, formData.email)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all hover:border-[#00D084]/40 hover:text-[#00D084] cursor-pointer ${
                        isDark
                          ? 'bg-white/5 border-white/8 text-slate-300'
                          : 'bg-slate-100 border-black/8 text-slate-600'
                      }`}
                    >
                      <HugeiconsIcon icon={f.icon} size={11} />
                      {f.label}
                    </Link>
                  ))}
                </div>

                {/* Primary CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/marketplace"
                    onClick={() => analytics.trackCtaClicked('explore_product_cta', 'home')}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#00D084]/20 hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                    Enter Live Sandbox Preview
                  </Link>
                  <Link
                    to="/study-hub"
                    onClick={() => analytics.trackCtaClicked('explore_study_hub_cta', 'home')}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      isDark
                        ? 'bg-white/5 border-white/8 text-slate-300 hover:border-[#00D084]/30 hover:text-[#00D084]'
                        : 'bg-slate-100 border-black/10 text-slate-600 hover:border-[#00D084]/40 hover:text-[#00D084]'
                    }`}
                  >
                    <HugeiconsIcon icon={BookOpen01Icon} size={14} />
                    Sneak Peek: Study Hub
                  </Link>
                </div>
              </div>

              {/* ── Right: floating product mockup ── */}
              <div className={`hidden lg:flex items-center justify-center p-8 border-l ${ isDark ? 'border-white/5' : 'border-black/6' }`}>
                <div className={`w-full max-w-sm rounded-2xl border overflow-hidden shadow-2xl transition-all ${ isDark ? 'bg-[#0a0f1d] border-white/5' : 'bg-slate-50 border-black/8' }`}>

                  {/* Mock browser chrome */}
                  <div className={`flex items-center gap-1.5 px-4 py-3 border-b ${ isDark ? 'border-white/5' : 'border-black/6' }`}>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className={`ml-3 text-[9px] font-bold uppercase tracking-widest ${ isDark ? 'text-slate-600' : 'text-slate-400' }`}>universe.app / marketplace</span>
                  </div>

                  {/* Mock content */}
                  <div className="p-4 space-y-3">

                    {/* Search bar mock */}
                    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 border text-[10px] ${ isDark ? 'bg-white/5 border-white/5 text-slate-500' : 'bg-white border-black/8 text-slate-400' }`}>
                      <HugeiconsIcon icon={ShoppingBag01Icon} size={11} className="text-[#00D084]" />
                      <span>Search student listings...</span>
                    </div>

                    {/* Listing cards */}
                    {[
                      { name: 'Rechargeable Study Lamp', price: '₦4,500', hostel: 'Hall 3', badge: 'Like New' },
                      { name: 'Lab Coat (Size L)', price: '₦3,200', hostel: 'Moremi Hall', badge: 'Good' },
                      { name: 'Mini-Fridge (Single Door)', price: '₦48,000', hostel: 'Jaja Hall', badge: 'Refurbished' },
                    ].map((item, i) => (
                      <div key={i} className={`rounded-xl border p-3 flex items-center justify-between gap-3 transition-all hover:border-[#00D084]/25 ${ isDark ? 'bg-white/[0.02] border-white/5' : 'bg-white border-black/6' }`}>
                        <div className="min-w-0">
                          <p className={`text-[11px] font-bold truncate ${ isDark ? 'text-slate-200' : 'text-slate-800' }`}>{item.name}</p>
                          <p className={`text-[9px] mt-0.5 ${ isDark ? 'text-slate-500' : 'text-slate-400' }`}>{item.hostel}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-[11px] font-extrabold text-[#00D084]">{item.price}</span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${ isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400' }`}>{item.badge}</span>
                        </div>
                      </div>
                    ))}

                    {/* CTA strip */}
                    <Link 
                      to="/marketplace"
                      className="block bg-[#00D084] text-[#030712] rounded-xl py-2.5 text-center text-[10px] font-extrabold cursor-pointer hover:bg-[#00C16A] transition-colors"
                    >
                      Enter Live Sandbox →
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>



        {/* --- SCROLLABLE DEVICE PREVIEW SECTION --- */}
        <section className="space-y-8 select-none">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#00D084]">Interactive Views</h2>
            <h3 className={`text-2xl sm:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>A sneak peek at the interface</h3>
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
            {[
              {
                title: "Market Feed Preview",
                desc: "Discover active campus trades, filterable by hosteling block structures.",
                icon: ShoppingBag01Icon,
                items: ["Bargain mattress - ₦12,000", "Physics Textbook - ₦2,500", "Rechargeable Fan - ₦18,000"]
              },
              {
                title: "Live Chat Box",
                desc: "Instant bargain messaging between student seller and student buyer.",
                icon: BubbleChatIcon,
                items: ["Tunde: Let's meet at Jaja Hall", "Amina: Deal, see you soon!", "System: Safe-trade location verified"]
              },
              {
                title: "Past Questions Hub",
                desc: "Peer study library to download lecture slides and exam packs.",
                icon: BookOpen01Icon,
                items: ["Chm 101 Exam Prep", "Mth 102 Summary notes", "Gst 111 Q&A guide"]
              },
              {
                title: "Erran runners",
                desc: "Coordinate hostel runners to grab quick snacks or groceries.",
                icon: UserGroupIcon,
                items: ["Laundry runner - Hall 1", "Snack delivery - Hall 4", "Quick pharmacy run"]
              }
            ].map((card, idx) => (
              <div 
                key={idx}
                className={`w-[280px] sm:w-[320px] p-6 rounded-3xl border flex-shrink-0 snap-align-start flex flex-col justify-between gap-6 hover:border-[#00D084]/20 transition-all cursor-pointer ${
                  isDark ? 'glass-card border-white/5' : 'bg-white border-black/8 shadow-xl hover:shadow-2xl'
                }`}
              >
                <div className="space-y-3 text-left">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[#00D084] border ${isDark ? 'bg-[#00D084]/10 border-[#00D084]/25' : 'bg-[#00D084]/10 border-[#00D084]/30'}`}>
                    <HugeiconsIcon icon={card.icon} size={20} />
                  </div>
                  <h4 className={`text-base font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>{card.title}</h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{card.desc}</p>
                </div>

                <div className={`space-y-2 pt-4 border-t ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                  {card.items.map((it, i) => (
                    <div key={i} className={`flex items-center gap-2 text-[10px] px-2.5 py-1.5 rounded-lg border ${isDark ? 'text-slate-400 bg-white/5 border-white/5' : 'text-slate-600 bg-slate-50 border-black/5'}`}>
                      <span className="w-1 h-1 rounded-full bg-[#00D084]"></span>
                      <span className="truncate">{it}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- PREMIUM DYNAMIC PREVIEW PANEL --- */}
        <section className={`rounded-3xl p-8 md:p-12 relative overflow-hidden select-none border shadow-2xl transition-all ${isDark ? 'glass-card text-white border-white/10' : 'bg-white text-slate-900 border-black/8'}`}>
          
          <div className="absolute top-[-50%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#00D084]/5 blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00D084] bg-[#00D084]/10 px-3 py-1 rounded-md border border-[#00D084]/20">
                Live Prototype Sandbox
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
                Try the interactive sandbox model today!
              </h3>
              <p className={`text-xs leading-relaxed max-w-md ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                You don't need to wait for launch. Experience the interface right now inside our sandbox mockup dashboard. Chat with mock sellers, check notifications, and add bookmarks.
              </p>
              
              <div className="pt-2">
                <a 
                  href="http://localhost:5174"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] text-xs font-bold rounded-xl transition-all shadow-md shadow-[#00D084]/10"
                >
                  <span>Launch Live Beta Sandbox</span>
                  <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 relative flex justify-center">
              
              {/* Floating Sandbox Interactive Mockup Card */}
              <div className={`border p-5 rounded-2xl w-full max-w-sm shadow-2xl relative select-none ${isDark ? 'bg-[#0a0f1d] border-white/5' : 'bg-slate-50 border-black/5'}`}>
                
                {/* Header detail */}
                <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-white/5' : 'border-black/5'}`}>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                  </div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Active Sandbox Mockup</span>
                </div>

                <div className="pt-4 space-y-4">
                  
                  {/* Simulated Product Card */}
                  <div className={`border rounded-xl p-3 flex gap-3 ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-black/5'}`}>
                    <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center text-[#00D084] select-none border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-black/5'}`}>
                      <HugeiconsIcon icon={ShoppingBag01Icon} size={20} />
                    </div>
                    <div className="flex-1 space-y-1 text-left">
                      <h5 className={`text-[11px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Hostel Mattress (Single Bed)</h5>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#00D084]">₦22,000</span>
                        <span className="text-[8px] bg-[#00D084]/10 text-[#00D084] px-1.5 py-0.5 rounded font-extrabold">VERIFIED SELLER</span>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Bargain Action box */}
                  <div className={`border rounded-xl p-3 space-y-2 text-left ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-black/5'}`}>
                    
                    <div className="flex items-center gap-1.5 text-[9px] text-[#00D084] font-bold">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={11} />
                      <span>Negotiate directly inside UniVerse chat!</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className={`text-[10px] border rounded-lg px-2 py-1 font-semibold flex-1 text-left ${isDark ? 'bg-slate-900 border-white/5 text-slate-300' : 'bg-slate-100 border-black/5 text-slate-700'}`}>
                        Hi, would you take ₦18k for this?
                      </div>
                      <span className="text-[9px] text-slate-500">Sent</span>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* --- FAQ SECTION --- */}
        <section id="faq" className="space-y-8 scroll-mt-24 select-none">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#00D084]">Got Questions?</h2>
            <h3 className={`text-2xl sm:text-4xl font-extrabold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>Frequently Asked Details</h3>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx}
                  className={`rounded-2xl border overflow-hidden transition-all ${isDark ? 'glass-card border-white/5' : 'bg-white border-black/5 shadow-md'}`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className={`w-full p-5 text-left font-bold flex items-center justify-between gap-4 cursor-pointer text-xs sm:text-sm ${isDark ? 'text-white hover:bg-white/5' : 'text-slate-800 hover:bg-slate-50'}`}
                  >
                    <span>{item.q}</span>
                    <span className="text-slate-400 font-normal">{isOpen ? '−' : '+'}</span>
                  </button>
                  
                  {isOpen && (
                    <div className={`p-5 pt-0 border-t text-xs leading-relaxed text-left animate-[fadeIn_0.25s_ease-out] ${isDark ? 'border-white/5 text-slate-400' : 'border-black/5 text-slate-600'}`}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      {/* --- PUBLIC WAITLIST FOOTER --- */}
      <footer className={`w-full border-t py-10 select-none z-10 transition-colors ${isDark ? 'bg-[#030712] border-white/5' : 'bg-[#f1f5f9] border-black/5'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-1.5">
              <span className={`text-xs font-bold font-display ${isDark ? 'text-white' : 'text-slate-900'}`}>UniVerse Marketplace</span>
            </div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Building the future of campus interactions.</p>
          </div>

          <div className="text-[10px] text-slate-500 font-medium space-y-1.5">
            <p>&copy; {new Date().getFullYear()} UniVerse. All rights reserved.</p>
            <p className="tracking-wide">Designed for verified university campus trade hubs. Launching September 2026.</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
