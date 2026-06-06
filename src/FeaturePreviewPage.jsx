import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  Shield01Icon,
  Search01Icon,
  Location01Icon,
  BubbleChatIcon,
  BookOpen01Icon,
  ShoppingBag01Icon
} from '@hugeicons/core-free-icons';
import SoftAurora from './SoftAurora';
import { FEATURES_CONFIG } from './features.config';
import { joinWaitlist } from './services/waitlist/waitlist.service';
import { validateWaitlistForm } from './services/waitlist/waitlist.validation';
import { analytics } from './services/analytics/analytics.service';
import { UNIVERSITIES, USER_ROLES, PREFERRED_CATEGORIES } from './services/waitlist/waitlist.constants';

export default function FeaturePreviewPage({ triggerToast }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const feature = FEATURES_CONFIG.find(f => f.slug === slug);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    role: 'both',
    category: 'electronics'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);

  // Interactive Playground States
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [downloadedId, setDownloadedId] = useState(null);

  // Seed chat messages when feature loads
  useEffect(() => {
    if (feature?.previewData?.messages) {
      setChatMessages(feature.previewData.messages);
    }
  }, [slug]);

  // Track page visit and redirect if slug is invalid
  useEffect(() => {
    if (!feature) {
      navigate('/');
    } else {
      analytics.trackPreviewPageVisited(slug);
    }
  }, [slug, feature, navigate]);

  // Guard after all hooks
  if (!feature) return null;

  const handleJoin = async (e) => {
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

    setLoading(true);
    analytics.trackCtaClicked('join_waitlist_feature_preview', slug);

    try {
      const user = await joinWaitlist(formData);
      setQueuePosition(user.queuePosition);
      setJoined(true);
      analytics.trackWaitlistJoined(user.email, user.university, user.queuePosition, user.referralCode);
      triggerToast("Welcome to the UniVerse waitlist!", "success");
    } catch (err) {
      setErrors({ form: err.message });
      triggerToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Chat interactive sender
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'buyer', text: typedMessage }];
    setChatMessages(newMsgs);
    setTypedMessage('');
    analytics.trackFeatureClicked('bargain_chat_send_simulated_message', slug);

    // Auto response simulator
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'seller', text: "Hey! Sounds good, I'll update you as soon as the main UniVerse sandbox goes live!" }
      ]);
    }, 1500);
  };

  // Verification Simulator
  const handleSimulateVerification = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setVerificationStatus('checking');
    analytics.trackFeatureClicked('verified_access_simulate_verify', slug);

    setTimeout(() => {
      if (emailInput.toLowerCase().endsWith('.edu.ng')) {
        setVerificationStatus('success');
      } else {
        setVerificationStatus('error');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-[#00D084] selection:text-black">
      
      {/* Dynamic Aurora */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-60">
        <SoftAurora
          speed={0.3}
          scale={1.1}
          brightness={0.8}
          color1="#00D084"
          color2="#002d18"
          noiseFrequency={1.8}
          noiseAmplitude={1.1}
          bandHeight={0.3}
          bandSpread={1.2}
          octaveDecay={0.12}
          layerOffset={0.5}
          colorSpeed={0.7}
          enableMouseInteraction={true}
          mouseInfluence={0.15}
        />
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(3,7,18,0.7) 60%, #030712 100%)'
          }} 
        />
      </div>

      {/* Header */}
      <header className="w-full h-20 bg-[#030712]/75 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between shadow-lg select-none">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-[#00D084] flex items-center justify-center text-[#030712] font-display font-extrabold text-lg shadow-lg shadow-[#00D084]/20 group-hover:scale-105 transition-all">
            U
          </div>
          <span className="brand text-xl font-bold tracking-tight text-white font-display">
            Uni<span className="text-[#00D084]">Verse</span>
          </span>
        </Link>
        <Link 
          to="/" 
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 hover:border-[#00D084]/30 hover:bg-[#00D084]/5 text-xs text-slate-300 font-semibold transition-all"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={13} />
          Back to Homepage
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 md:py-20 z-10 flex flex-col gap-16 md:gap-24 relative">
        
        {/* --- HERO SECTION --- */}
        <section className="text-left space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${feature.statusColor}`}>
              {feature.status}
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-[#00D084]/10 border border-[#00D084]/25 text-[#00D084] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#00D084]/5">
              <HugeiconsIcon icon={feature.icon} size={28} />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight leading-none">
                {feature.title}
              </h1>
              <p className="text-sm text-[#00D084] font-medium tracking-wide uppercase font-display">
                {feature.tagline}
              </p>
            </div>
          </div>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            {feature.description}
          </p>
        </section>

        {/* --- INTERACTIVE PRODUCT PREVIEW (MINI PRODUCT DEMO) --- */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#00D084]">Interactive Sandbox</h2>
            <p className="text-sm text-slate-400">Play around with this live simulator to preview how the feature works.</p>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-2xl bg-slate-950/20 backdrop-blur-xl relative overflow-hidden">
            
            {/* RENDER DEMO BASED ON FEATURE TYPE */}
            {feature.previewData.type === 'marketplace' && (
              <div className="space-y-5">
                <div className="flex items-center gap-3 bg-white/5 border border-white/5 px-4 py-2.5 rounded-2xl">
                  <HugeiconsIcon icon={Search01Icon} size={16} className="text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search rechargeable lamps, mini fridges, course books..." 
                    className="bg-transparent border-none outline-none text-xs w-full text-white placeholder-slate-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {feature.previewData.items
                    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(item => (
                      <div key={item.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col justify-between gap-3 hover:border-white/10 transition-all">
                        <div>
                          <div className="flex justify-between items-start">
                            <span className="text-[9px] bg-white/5 text-slate-400 px-2 py-0.5 rounded font-extrabold uppercase">{item.condition}</span>
                            <span className="text-[10px] text-[#00D084] font-extrabold">{item.price}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white mt-2">{item.name}</h4>
                        </div>
                        <div className="text-[10px] text-slate-400 border-t border-white/5 pt-2 flex items-center gap-1">
                          <HugeiconsIcon icon={Location01Icon} size={11} className="text-[#00D084]" />
                          <span>{item.hostel}</span>
                        </div>
                      </div>
                    ))}
                  {feature.previewData.items.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                    <div className="col-span-2 text-center py-6 text-xs text-slate-500">
                      No matching student listings found. Try searching another item!
                    </div>
                  )}
                </div>
              </div>
            )}

            {feature.previewData.type === 'study-hub' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400 font-bold border-b border-white/5 pb-2">Course Material Directory</div>
                <div className="space-y-2">
                  {feature.previewData.materials.map(mat => (
                    <div key={mat.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] bg-[#00D084]/15 text-[#00D084] px-2 py-0.5 rounded font-extrabold uppercase">{mat.course}</span>
                          <span className="text-[9px] bg-white/5 text-slate-400 px-2 py-0.5 rounded font-bold">{mat.format}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white mt-1.5">{mat.title}</h4>
                        <p className="text-[10px] text-slate-500">{mat.author}</p>
                      </div>
                      <button 
                        onClick={() => {
                          setDownloadedId(mat.id);
                          triggerToast(`Simulated download of ${mat.title} started!`, 'success');
                          analytics.trackFeatureClicked(`study_hub_download_${mat.id}`, slug);
                        }}
                        className="px-3.5 py-1.5 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        {downloadedId === mat.id ? "Downloaded ✅" : "Download PDF"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {feature.previewData.type === 'bargain-chat' && (
              <div className="space-y-4">
                <div className="h-48 overflow-y-auto bg-white/[0.01] border border-white/5 p-4 rounded-2xl flex flex-col gap-3 scrollbar-none">
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`max-w-[75%] p-3 rounded-2xl text-[11px] leading-relaxed
                        ${msg.sender === 'buyer' 
                          ? 'bg-[#00D084]/10 border border-[#00D084]/10 text-white ml-auto' 
                          : 'bg-white/5 text-slate-300'}`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type counter offer or coordination message..." 
                    className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl text-xs w-full text-white placeholder-slate-500 outline-none focus:border-[#00D084]/40"
                    value={typedMessage}
                    onChange={(e) => setTypedMessage(e.target.value)}
                  />
                  <button type="submit" className="px-4 py-2 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer transition-colors">
                    Send
                  </button>
                </form>
              </div>
            )}

            {feature.previewData.type === 'verified-access' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400 font-bold border-b border-white/5 pb-2">Verification Shield Validator</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {feature.previewData.metrics.map((m, i) => (
                    <div key={i} className="bg-white/[0.01] border border-white/5 p-4 rounded-xl text-center">
                      <div className="text-lg font-extrabold text-[#00D084]">{m.value}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSimulateVerification} className="space-y-3 pt-3 border-t border-white/5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Test email verification (.edu.ng format required)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. tunde.alabi@unilag.edu.ng" 
                      className="bg-white/5 border border-white/5 px-4 py-2.5 rounded-xl text-xs w-full text-white placeholder-slate-500 outline-none focus:border-[#00D084]/40"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                    />
                    <button type="submit" className="px-4 py-2 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer transition-colors whitespace-nowrap">
                      {verificationStatus === 'checking' ? 'Validating...' : 'Test Shield'}
                    </button>
                  </div>
                  {verificationStatus === 'success' && (
                    <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                      ✓ Valid student email! Verification shield grants ACCESS badge.
                    </p>
                  )}
                  {verificationStatus === 'error' && (
                    <p className="text-[11px] text-rose-400 font-bold">
                      ✗ Restricted. Access requires a valid institution domain ending in .edu.ng
                    </p>
                  )}
                </form>
              </div>
            )}

            {feature.previewData.type === 'student-jobs' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400 font-bold border-b border-white/5 pb-2">Active Gigs & Errands Noticeboard</div>
                <div className="space-y-2.5">
                  {feature.previewData.gigs.map(gig => (
                    <div key={gig.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex justify-between items-center hover:border-[#00D084]/20 transition-all">
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">{gig.title}</h4>
                        <div className="flex gap-3 text-[10px] text-slate-400 mt-1">
                          <span>Pay: <strong className="text-[#00D084]">{gig.pay}</strong></span>
                          <span>Timeframe: {gig.time}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          triggerToast("Applied for task gig simulation!", "success");
                          analytics.trackFeatureClicked(`student_gig_apply_${gig.id}`, slug);
                        }}
                        className="px-3 py-1.5 bg-[#00D084]/10 border border-[#00D084]/25 hover:bg-[#00D084]/20 text-[#00D084] text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Apply Gig
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {feature.previewData.type === 'hostels' && (
              <div className="space-y-4">
                <div className="text-xs text-slate-400 font-bold border-b border-white/5 pb-2">Off-Campus Student Accommodation</div>
                <div className="space-y-2.5">
                  {feature.previewData.hostels.map(h => (
                    <div key={h.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-white">{h.name}</span>
                          <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{h.rating}</span>
                        </div>
                        <div className="flex flex-wrap gap-3 text-[10px] text-slate-400 mt-1">
                          <span>Rent: <strong className="text-[#00D084]">{h.rent}</strong></span>
                          <span>Distance: {h.distance}</span>
                          <span>Security: <strong className="text-emerald-400">{h.safety}</strong></span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          triggerToast(`Simulating room details lookup for ${h.name}!`, "success");
                          analytics.trackFeatureClicked(`hostels_view_${h.id}`, slug);
                        }}
                        className="px-3.5 py-1.5 bg-[#00D084] hover:bg-[#00C16A] text-[#030712] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        View Rooms
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </section>

        {/* --- PROBLEM → SOLUTION SECTION --- */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <div className="glass-card rounded-3xl border border-rose-500/10 bg-rose-500/[0.02] p-6 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/15">
                The Pain Point
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                {feature.problem}
              </p>
            </div>
          </div>
          <div className="glass-card rounded-3xl border border-[#00D084]/20 bg-[#00D084]/[0.02] p-6 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#00D084] bg-[#00D084]/10 px-2.5 py-0.5 rounded border border-[#00D084]/20">
                The solution
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
                {feature.solution}
              </p>
            </div>
          </div>
        </section>

        {/* --- FUTURE ROADMAP SECTION --- */}
        <section className="space-y-6">
          <div className="text-left space-y-1">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#00D084]">Development Roadmap</h2>
            <p className="text-sm text-slate-400">See our rollout schedule for this particular feature.</p>
          </div>
          <div className="glass-card rounded-3xl border border-white/5 p-6 space-y-4">
            {feature.roadmap.map((step, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 py-2.5 border-b border-white/5 last:border-none">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] bg-white/5 border border-white/8 px-2 py-0.5 rounded text-slate-300 font-bold uppercase">{step.step}</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">{step.title}</span>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${step.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-slate-400'}`}>
                  {step.status === 'completed' ? 'Live' : 'Scheduled'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* --- JOIN WAITLIST CTA SECTION --- */}
        <section className="glass-card rounded-3xl border border-[#00D084]/20 bg-[#00D084]/[0.01] p-8 text-center space-y-8 relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-3">
            <h3 className="text-2xl font-extrabold text-white font-display">Get Early Access to {feature.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We are rolling out this module in phases. Join the UniVerse waitlist to reserve your slot and receive direct referral incentives when we go live.
            </p>
          </div>

          {joined ? (
            <div className="max-w-sm mx-auto bg-slate-900/40 border border-[#00D084]/35 p-6 rounded-2xl space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-[#00D084]/15 border border-[#00D084]/25 flex items-center justify-center text-[#00D084] mx-auto">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={22} />
              </div>
              <h4 className="text-sm font-bold text-white">You're on the list!</h4>
              <div className="bg-[#030712]/50 border border-white/5 p-3 rounded-xl">
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Queue Position</div>
                <div className="text-2xl font-extrabold text-[#00D084] mt-1">#{queuePosition}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="max-w-md mx-auto space-y-4 text-left">
              {errors.form && (
                <div className="bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl text-xs text-rose-300 text-center font-bold">
                  {errors.form}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tunde Alabi"
                    className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#00D084]/40 focus:ring-1 focus:ring-[#00D084]/20 transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                  {errors.name && <p className="text-[10px] text-rose-400">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. tunde@university.edu.ng"
                    className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none focus:border-[#00D084]/40 focus:ring-1 focus:ring-[#00D084]/20 transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                  {errors.email && <p className="text-[10px] text-rose-400">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Institution</label>
                  <select
                    required
                    className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#00D084]/40 transition-all"
                    value={formData.university}
                    onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                  >
                    <option value="" disabled className="bg-[#030712]">Select your university</option>
                    {UNIVERSITIES.map((uni, idx) => (
                      <option key={idx} value={uni} className="bg-[#030712] text-slate-300">{uni}</option>
                    ))}
                  </select>
                  {errors.university && <p className="text-[10px] text-rose-400">{errors.university}</p>}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Your Role</label>
                  <select
                    required
                    className="w-full bg-[#030712]/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#00D084]/40 transition-all"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  >
                    {USER_ROLES.map((r, idx) => (
                      <option key={idx} value={r.value} className="bg-[#030712] text-slate-300">{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00D084] hover:bg-[#00C16A] disabled:bg-slate-700 disabled:cursor-not-allowed text-[#030712] text-xs font-bold rounded-xl transition-all shadow-lg shadow-[#00D084]/15 hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#030712] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Join Early Access Waitlist</span>
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </section>

      </main>
    </div>
  );
}
