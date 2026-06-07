import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, CloudUploadIcon } from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';

export function CreateListing() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} /> Back
        </Link>
        <button className="px-6 py-2.5 bg-primary hover:bg-accent text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20">
          Publish Listing
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-bold font-display text-white">Create New Listing</h1>
        <p className="text-muted-foreground mt-1">Fill out the details below to list your item on the marketplace.</p>
      </div>

      <div className="glass-card rounded-3xl p-8 border border-white/5 space-y-8">
        
        {/* Images Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">1. Product Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="col-span-2 sm:col-span-4 aspect-[21/9] sm:aspect-[21/6] rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors bg-white/5 flex flex-col items-center justify-center text-center cursor-pointer p-6">
              <HugeiconsIcon icon={CloudUploadIcon} size={32} className="text-primary mb-3" />
              <p className="text-sm font-medium text-white">Click or drag images here to upload</p>
              <p className="text-xs text-muted-foreground mt-1">High-quality photos make your listing stand out</p>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4 pt-6 border-t border-white/5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">2. Listing Details</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Title</label>
              <input 
                type="text" 
                placeholder="e.g., iPhone 13 Pro Max - 256GB" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 ml-1">Price (₦)</label>
                <input 
                  type="text" 
                  placeholder="0.00" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 ml-1">Condition</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                  <option value="" disabled selected>Select condition</option>
                  <option value="new">Brand New</option>
                  <option value="like-new">Like New</option>
                  <option value="good">Used - Good</option>
                  <option value="fair">Used - Fair</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 ml-1">Category</label>
                <select className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none">
                  <option value="" disabled selected>Select category</option>
                  <option value="electronics">Electronics</option>
                  <option value="furniture">Hostel Furniture</option>
                  <option value="books">Textbooks & Notes</option>
                  <option value="clothing">Clothing</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 ml-1">Hostel / Location</label>
                <input 
                  type="text" 
                  placeholder="e.g., Moremi Hall" 
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 ml-1">Description</label>
              <textarea 
                rows={4}
                placeholder="Describe your item in detail. Include any flaws, reason for selling, and features." 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
