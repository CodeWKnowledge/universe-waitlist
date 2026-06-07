import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { 
  Search01Icon, 
  FilterIcon, 
  DocumentAttachmentIcon,
  Pdf01Icon,
  Download01Icon,
  ArrowUpRight01Icon,
  BookOpen02Icon
} from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CATEGORIES = ["All Courses", "Computer Science", "Engineering", "Medicine", "Business", "Law", "Arts"];

const MOCK_RESOURCES = [
  { id: 1, title: 'MTH 101 Advanced Calculus Complete Notes', course: 'MTH 101', school: 'University of Lagos', faculty: 'Science', downloads: 1240, uploader: 'Tunde A.', type: 'pdf', isFeatured: true },
  { id: 2, title: 'PHY 102 Past Questions (2018-2023)', course: 'PHY 102', school: 'Obafemi Awolowo Univ.', faculty: 'Science', downloads: 890, uploader: 'Sarah M.', type: 'pdf', isFeatured: true },
  { id: 3, title: 'Introduction to Programming (C++) Slides', course: 'CSC 201', school: 'University of Ibadan', faculty: 'Technology', downloads: 532, uploader: 'Dr. Kelechi', type: 'ppt', isFeatured: false },
  { id: 4, title: 'Anatomy Summary Charts', course: 'ANA 301', school: 'University of Lagos', faculty: 'Medicine', downloads: 2100, uploader: 'Med Student', type: 'pdf', isFeatured: true },
  { id: 5, title: 'Business Law Case Studies', course: 'LAW 204', school: 'University of Ilorin', faculty: 'Law', downloads: 145, uploader: 'John Doe', type: 'doc', isFeatured: false },
  { id: 6, title: 'Fluid Mechanics Lab Report Template', course: 'MEG 305', school: 'University of Lagos', faculty: 'Engineering', downloads: 340, uploader: 'Engr. D.', type: 'doc', isFeatured: false },
];

function ResourceCard({ resource }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-5 border border-white/5 hover:border-primary/30 transition-all flex flex-col group relative"
    >
      <Link to={`/study-hub/${resource.id}`} className="absolute inset-0 z-10" />
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          resource.type === 'pdf' ? 'bg-rose-500/10 text-rose-500' :
          resource.type === 'ppt' ? 'bg-amber-500/10 text-amber-500' :
          'bg-blue-500/10 text-blue-500'
        }`}>
          <HugeiconsIcon icon={resource.type === 'pdf' ? Pdf01Icon : DocumentAttachmentIcon} size={20} />
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-md text-[10px] font-bold text-slate-300">
          <HugeiconsIcon icon={Download01Icon} size={12} /> {resource.downloads}
        </div>
      </div>
      
      <div className="flex-1 space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-primary">{resource.course}</span>
        <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 group-hover:text-primary transition-colors">{resource.title}</h3>
        <p className="text-[11px] text-muted-foreground truncate">{resource.school} • {resource.faculty}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-bold text-white">
            {resource.uploader.charAt(0)}
          </div>
          <span className="text-[10px] text-slate-400">{resource.uploader}</span>
        </div>
        <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </motion.div>
  );
}

export function StudyHub() {
  const [activeCategory, setActiveCategory] = useState("All Courses");

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Study Hub</h1>
          <p className="text-muted-foreground mt-1">Access past questions, lecture notes, and study materials from your peers.</p>
        </div>
        <Link to="/upload-resource" className="flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-accent text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/10">
          <HugeiconsIcon icon={DocumentAttachmentIcon} size={18} />
          Upload Material
        </Link>
      </div>
      
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <HugeiconsIcon icon={Search01Icon} size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by course code (e.g. MTH 101) or topic..." 
            className="w-full bg-card/40 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:bg-card/80 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3.5 bg-card/40 border border-white/10 rounded-2xl text-sm font-medium text-white hover:bg-white/5 transition-colors">
          <HugeiconsIcon icon={FilterIcon} size={18} />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
              activeCategory === cat 
                ? 'bg-white text-black border-white' 
                : 'bg-transparent text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Resources */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={BookOpen02Icon} size={18} className="text-primary" />
          <h2 className="text-lg font-bold text-white font-display">Featured Materials</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {MOCK_RESOURCES.filter(r => r.isFeatured).map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

      {/* Recent Uploads */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-white font-display">Recent Uploads</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {MOCK_RESOURCES.filter(r => !r.isFeatured).map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      </div>

    </div>
  );
}
