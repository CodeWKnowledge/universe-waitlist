import {
  ShoppingBag01Icon,
  BookOpen01Icon,
  BubbleChatIcon,
  Shield01Icon,
  UserGroupIcon,
  Location01Icon,
  StarIcon,
  Cancel01Icon
} from '@hugeicons/core-free-icons';

export const FEATURES_CONFIG = [
  {
    title: "Campus Marketplace",
    slug: "marketplace",
    description: "Buy and sell hostel items, electronics, books, and furniture directly with verified peers on your campus.",
    status: "Beta Testing",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: ShoppingBag01Icon,
    tagline: "Clear out clutter, score deals.",
    problem: "Sifting through unorganized WhatsApp group chats, spam updates, and random group threads just to find a study desk or textbook.",
    solution: "A single, campus-restricted market feed filterable by hostel blocks, category, and price tags. Easy listing uploads in 30 seconds.",
    benefits: [
      { title: "Direct Peer Transactions", desc: "No middleman cuts or listing fees — you keep 100% of the sale." },
      { title: "Hostel Filter", desc: "See items available in your own hostel or neighbouring blocks for fast pickups." },
      { title: "Simulated Pricing", desc: "See price trends of popular student items over the semester." }
    ],
    roadmap: [
      { step: "Phase 1", title: "Core listings upload & search", status: "completed" },
      { step: "Phase 2", title: "Zonal hostel tagging", status: "completed" },
      { step: "Phase 3", title: "Escrow payments integration", status: "upcoming" }
    ],
    previewData: {
      type: "marketplace",
      items: [
        { id: 1, name: "Rechargeable Study Lamp (3 Modes)", price: "₦4,500", hostel: "Hall 3 Atrium", condition: "Like New" },
        { id: 2, name: "Departmental Lab Coat (Size L)", price: "₦3,200", hostel: "Moremi Hall", condition: "Good" },
        { id: 3, name: "Single-Door Mini Fridge", price: "₦48,000", hostel: "Jaja Hall", condition: "Refurbished" },
        { id: 4, name: "Calculus textbook (11th Edition)", price: "₦2,500", hostel: "Fagunwa Hall", condition: "Slightly Used" }
      ]
    }
  },
  {
    title: "Academic Study Hub",
    slug: "study-hub",
    description: "Access shared study materials, lecture summary guides, exam past questions, and connect with verified course tutors.",
    status: "In Development",
    statusColor: "text-[#00D084] bg-[#00D084]/10 border-[#00D084]/20",
    icon: BookOpen01Icon,
    tagline: "Learn faster, together.",
    problem: "Struggling to find reliable past exam questions or paying high fees to external online tutorials that don't match your course syllabus.",
    solution: "A peer-to-peer repository organized by department and course codes. Students share summaries and offer local targeted prep tutorials.",
    benefits: [
      { title: "Course-Code Specific", desc: "Search content tagged to your actual campus course code (e.g. MTH 101)." },
      { title: "Tutor Verification", desc: "Tutors are badged based on verified high grades in the corresponding class." },
      { title: "Free Material Access", desc: "Many resources shared by graduating students are completely free." }
    ],
    roadmap: [
      { step: "Phase 1", title: "PDF document library", status: "completed" },
      { step: "Phase 2", title: "Peer tutor matchmaker", status: "upcoming" },
      { step: "Phase 3", title: "Interactive practice quizzes", status: "upcoming" }
    ],
    previewData: {
      type: "study-hub",
      materials: [
        { id: 1, title: "PHY 101 Lecture Summary Notes", course: "PHY 101", author: "Tunde (Verified Tutor)", format: "PDF", downloads: 142 },
        { id: 2, title: "MTH 102 past exam answers (2024)", course: "MTH 102", author: "Sarah A.", format: "PDF", downloads: 310 },
        { id: 3, title: "GST 111 introductory guide", course: "GST 111", author: "Student Union Academics", format: "DOCX", downloads: 88 }
      ]
    }
  },
  {
    title: "In-App Bargain Chat",
    slug: "bargain-chat",
    description: "Coordinate meetups, negotiate prices, and communicate securely with other campus residents.",
    status: "Beta Testing",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: BubbleChatIcon,
    tagline: "Secure negotiations without exchanging phone numbers.",
    problem: "Having to share your personal WhatsApp number with random unverified accounts just to arrange a pickup point.",
    solution: "A secure built-in messenger with pre-made campus meeting points, safety notices, and negotiation templates.",
    benefits: [
      { title: "Privacy Protection", desc: "Exchanging phone numbers is optional. Keep chat and coordination inside UniVerse." },
      { title: "Safe Meetup Suggestions", desc: "Get recommended, highly-visible public meet points near the main library or student union." },
      { title: "Quick Price Offer Action", desc: "Submit numeric counter-offers that sellers can accept or reject with a single click." }
    ],
    roadmap: [
      { step: "Phase 1", title: "Direct real-time messages", status: "completed" },
      { step: "Phase 2", title: "Meetup coordinates tagging", status: "upcoming" },
      { step: "Phase 3", title: "Encrypted offline delivery dropoffs", status: "upcoming" }
    ],
    previewData: {
      type: "bargain-chat",
      messages: [
        { sender: "buyer", text: "Hi! Is the study lamp still available? I can meet you by the Main Library tomorrow." },
        { sender: "seller", text: "Yes, it is! I have a lecture by 2:00 PM. How about we meet at the Library square by 1:30 PM?" },
        { sender: "buyer", text: "That works perfectly. Will bring the exact cash." }
      ]
    }
  },
  {
    title: "Verified Student Network",
    slug: "verified-access",
    description: "A secure environment restricted exclusively to current campus residents through institutional validation.",
    status: "Active Shield",
    statusColor: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    icon: Shield01Icon,
    tagline: "Safety-first campus social layer.",
    problem: "Being vulnerable to online bots, off-campus fraudsters, and scam artists who list fake rental rooms or request deposit prepayments.",
    solution: "Mandatory .edu.ng institutional email validation. Only active, verified students can join the feed or view listings.",
    benefits: [
      { title: "Zero Anonymous Users", desc: "Every profile links back to a genuine, checked student identity." },
      { title: "Fraud Mitigation", desc: "Spammers and off-campus bad actors are blocked at registration." },
      { title: "Peer Ratings", desc: "Feedback loop where buyers and sellers review each other on completed handovers." }
    ],
    roadmap: [
      { step: "Phase 1", title: "Institutional email validator", status: "completed" },
      { step: "Phase 2", title: "Safe-trade rating engine", status: "upcoming" },
      { step: "Phase 3", title: "Campus coordinator vetting", status: "upcoming" }
    ],
    previewData: {
      type: "verified-access",
      metrics: [
        { label: "Active Verified Campus Profiles", value: "4,829" },
        { label: "Fraud Incidents Blocked", value: "100%" },
        { label: "Safe-Trade Pickup Zones Tagged", value: "32" }
      ]
    }
  },
  {
    title: "Student Jobs & Errands",
    slug: "student-jobs",
    description: "Earn income by running errands, assisting with hostel moves, or offering freelance services to busy peers.",
    status: "Launching Sept",
    statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    icon: UserGroupIcon,
    tagline: "Campus gigs by students, for students.",
    problem: "Needing flexible income that fits around your class timetable, with zero local platforms to offer quick campus jobs.",
    solution: "A local micro-jobs noticeboard where students list tasks like laundry pickups, delivery runs, or slide design services.",
    benefits: [
      { title: "Timetable-Friendly", desc: "Accept tasks only when you are free. Set your own hours." },
      { title: "Campus Restricted", desc: "No long commutes. All jobs are on or around university property." },
      { title: "Guaranteed Payments", desc: "Secure gig escrow funds held until task creator confirms completion." }
    ],
    roadmap: [
      { step: "Phase 1", title: "Micro-gig listings", status: "upcoming" },
      { step: "Phase 2", title: "Escrow payout wallet", status: "upcoming" }
    ],
    previewData: {
      type: "student-jobs",
      gigs: [
        { id: 1, title: "Laundry pickup & dropoff (Hall 2 to City Cleaners)", pay: "₦2,000", time: "Flexible" },
        { id: 2, title: "Move two heavy storage boxes to Annex Hostel", pay: "₦3,500", time: "This Saturday" },
        { id: 3, title: "Format PowerPoint presentation slides for CSC 201 project", pay: "₦5,000", time: "Before Monday" }
      ]
    }
  },
  {
    title: "Off-Campus Hostels Finder",
    slug: "hostels",
    description: "Browse verified hostel rooms, review safety ratings, and find roommates matching your study habits.",
    status: "Beta Testing",
    statusColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    icon: Location01Icon,
    tagline: "Find your ideal accommodation near campus.",
    problem: "Relying on agents charging expensive visual viewing fees just to look at subpar, unsafe off-campus rentals.",
    solution: "Crowdsourced hostel directory with student-submitted reviews, safety metrics, price comparisons, and roommate matches.",
    benefits: [
      { title: "Real Reviews", desc: "Read honest feedback on water supply, security, and electricity from current tenants." },
      { title: "Visual Catalog", desc: "View actual room photos without paying agent visual search fees." },
      { title: "Roommate Matchmaker", desc: "Filter peers based on department, clean habits, and study schedules." }
    ],
    roadmap: [
      { step: "Phase 1", title: "Hostel review index", status: "completed" },
      { step: "Phase 2", title: "Roommate search criteria", status: "upcoming" },
      { step: "Phase 3", title: "Direct landlord communications", status: "upcoming" }
    ],
    previewData: {
      type: "hostels",
      hostels: [
        { id: 1, name: "Apex Heights Hostel", distance: "5 min walk", rating: "4.5★", rent: "₦180,000/yr", safety: "Highly Secure" },
        { id: 2, name: "Pinecrest Hostel", distance: "12 min shuttle", rating: "3.9★", rent: "₦120,000/yr", safety: "Gated Guarded" },
        { id: 3, name: "University Gate Apartments", distance: "2 min walk", rating: "4.8★", rent: "₦240,000/yr", safety: "CCTV Active" }
      ]
    }
  }
];
