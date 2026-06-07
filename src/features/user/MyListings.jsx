import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Edit01Icon, Delete01Icon, ViewIcon } from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';

const MY_LISTINGS = [
  { id: 1, title: 'Sony WH-1000XM4 Headphones', price: '₦120,000', status: 'Active', views: 245, inquiries: 4, date: 'Oct 10, 2025', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=150&q=80' },
  { id: 2, title: 'Medical Anatomy 8th Edition', price: '₦15,000', status: 'Sold', views: 89, inquiries: 12, date: 'Oct 02, 2025', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=150&q=80' },
];

export function MyListings() {
  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">My Listings</h1>
          <p className="text-muted-foreground mt-1">Manage the items you are selling on the marketplace.</p>
        </div>
        <Link to="/create-listing" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-accent text-black font-bold rounded-xl transition-all shadow-lg shadow-primary/20 shrink-0">
          <HugeiconsIcon icon={Add01Icon} size={18} />
          Create New
        </Link>
      </div>

      <div className="glass-card border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Item</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stats</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {MY_LISTINGS.map(listing => (
                <tr key={listing.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={listing.image} alt={listing.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{listing.title}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Listed: {listing.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm font-bold text-white">{listing.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      listing.status === 'Active' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                    }`}>
                      {listing.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5"><HugeiconsIcon icon={ViewIcon} size={12} /> {listing.views} Views</span>
                      <span className="flex items-center gap-1.5 text-white/60">{listing.inquiries} Inquiries</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-white transition-colors hover:bg-white/5 rounded-lg" title="Edit">
                        <HugeiconsIcon icon={Edit01Icon} size={16} />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-rose-500 transition-colors hover:bg-rose-500/10 rounded-lg" title="Delete">
                        <HugeiconsIcon icon={Delete01Icon} size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {MY_LISTINGS.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              You haven't posted any listings yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
