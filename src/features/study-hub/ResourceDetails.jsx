import { HugeiconsIcon } from '@hugeicons/react';
import { 
  ArrowLeft01Icon, 
  Download01Icon, 
  DocumentAttachmentIcon, 
  Share01Icon, 
  Bookmark02Icon, 
  Alert01Icon,
  Pdf01Icon
} from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';

const MOCK_RESOURCE = {
  id: 1,
  title: 'MTH 101 Advanced Calculus Complete Notes',
  course: 'MTH 101',
  school: 'University of Lagos',
  faculty: 'Science',
  downloads: 1240,
  size: '4.2 MB',
  pages: 142,
  type: 'pdf',
  description: 'Complete lecture notes covering limits, differentiation, integration, and series. Includes solved examples from past questions from 2018 to 2023. Highly recommended for first-year engineering and science students.',
  uploader: {
    name: 'Tunde Alabi',
    avatar: 'https://i.pravatar.cc/150?img=11',
    role: 'Student • 400L',
    department: 'Computer Science',
    contributions: 14
  },
  uploadedAt: 'Oct 12, 2025'
};

export function ResourceDetails() {
  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Back navigation */}
      <Link to="/study-hub" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} /> Back to Study Hub
      </Link>

      <div className="glass-card rounded-3xl p-6 md:p-10 border border-white/5 space-y-8">
        
        {/* Header Info */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center flex-shrink-0 border border-rose-500/20">
              <HugeiconsIcon icon={Pdf01Icon} size={32} />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-primary px-2 py-1 bg-primary/10 rounded-md border border-primary/20">
                {MOCK_RESOURCE.course}
              </span>
              <h1 className="text-2xl font-bold font-display text-white leading-tight">
                {MOCK_RESOURCE.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {MOCK_RESOURCE.school} • {MOCK_RESOURCE.faculty}
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="w-12 h-12 rounded-xl bg-card border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 transition-colors shrink-0">
              <HugeiconsIcon icon={Bookmark02Icon} size={20} />
            </button>
            <button className="w-12 h-12 rounded-xl bg-card border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/5 transition-colors shrink-0">
              <HugeiconsIcon icon={Share01Icon} size={20} />
            </button>
            <button className="flex-1 md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-accent text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20">
              <HugeiconsIcon icon={Download01Icon} size={18} />
              Download ({MOCK_RESOURCE.size})
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-white/5">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">File Type</p>
            <p className="text-sm font-medium text-white uppercase">{MOCK_RESOURCE.type}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Pages</p>
            <p className="text-sm font-medium text-white">{MOCK_RESOURCE.pages}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Downloads</p>
            <p className="text-sm font-medium text-white">{MOCK_RESOURCE.downloads}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-1">Uploaded</p>
            <p className="text-sm font-medium text-white">{MOCK_RESOURCE.uploadedAt}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Description</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {MOCK_RESOURCE.description}
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Document Preview</h3>
              <div className="aspect-[1/1.4] w-full bg-[#1e1e1e] rounded-xl border border-white/10 flex flex-col items-center justify-center text-center p-8 text-muted-foreground relative overflow-hidden">
                <HugeiconsIcon icon={DocumentAttachmentIcon} size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium text-white mb-2">Preview not available</p>
                <p className="text-xs">Download the file to view the full contents.</p>
                
                {/* Fake page shadow overlay */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Uploader</h3>
            <div className="bg-card/40 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center space-y-3">
              <img src={MOCK_RESOURCE.uploader.avatar} alt={MOCK_RESOURCE.uploader.name} className="w-20 h-20 rounded-full object-cover border-2 border-white/10" />
              <div>
                <h4 className="font-bold text-white text-base">{MOCK_RESOURCE.uploader.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{MOCK_RESOURCE.uploader.department} • {MOCK_RESOURCE.uploader.role}</p>
              </div>
              <div className="w-full pt-3 mt-1 border-t border-white/5 flex justify-between items-center px-2">
                <span className="text-xs text-slate-400">Contributions</span>
                <span className="text-xs font-bold text-primary">{MOCK_RESOURCE.uploader.contributions} docs</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
              <HugeiconsIcon icon={Alert01Icon} size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-500/90 leading-relaxed">
                If you believe this document violates copyright or contains inappropriate content, please report it.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
