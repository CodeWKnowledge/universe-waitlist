import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, CloudUploadIcon, DocumentAttachmentIcon } from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';

export function UploadResource() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <Link to="/study-hub" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} /> Back to Study Hub
        </Link>
        <button className="px-6 py-2.5 bg-primary hover:bg-accent text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
          <HugeiconsIcon icon={DocumentAttachmentIcon} size={18} /> Publish Resource
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold font-display text-white">Upload Study Material</h1>
        <p className="text-muted-foreground mt-1">Share lecture notes, past questions, or summaries with your peers.</p>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-8">
        
        {/* Upload Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">1. File Upload</h3>
          <div className="aspect-[21/9] sm:aspect-[21/6] rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors bg-white/5 flex flex-col items-center justify-center text-center cursor-pointer p-6">
            <HugeiconsIcon icon={CloudUploadIcon} size={32} className="text-primary mb-3" />
            <p className="text-sm font-medium text-white">Click or drag your document here</p>
            <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOCX, PPTX, or ZIP (Max 50MB)</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">2. Document Details</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Document Title</label>
              <input 
                type="text" 
                placeholder="e.g., MTH 101 Complete Lecture Notes" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 ml-1">Course Code</label>
                <input 
                  type="text" 
                  placeholder="e.g., MTH 101" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 ml-1">Faculty / Department</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                  <option value="" disabled selected>Select faculty</option>
                  <option value="science">Science</option>
                  <option value="engineering">Engineering</option>
                  <option value="medicine">Medicine</option>
                  <option value="arts">Arts & Humanities</option>
                  <option value="business">Business & Economics</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Description</label>
              <textarea 
                rows={4}
                placeholder="Briefly describe what this document covers..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl mt-2">
              <input type="checkbox" id="terms" className="w-4 h-4 rounded border-white/20 bg-black/40 text-primary focus:ring-primary focus:ring-offset-0" />
              <label htmlFor="terms" className="text-xs text-slate-300 select-none">
                I confirm that I own this material or have the right to distribute it, and it does not violate academic integrity policies.
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
