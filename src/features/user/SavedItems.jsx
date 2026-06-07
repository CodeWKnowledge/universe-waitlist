import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Bookmark02Icon, ShoppingBag01Icon, Book04Icon } from '@hugeicons/core-free-icons';
import { ProductCard } from '../../components/ui/ProductCard';

const MOCK_SAVED_PRODUCTS = [
  { id: 1, title: 'Sony WH-1000XM4 Headphones', price: '₦120,000', school: 'University of Lagos', seller: 'Tunde Alabi', sellerAvatar: 'https://i.pravatar.cc/150?img=11', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80', condition: 'Like New' },
  { id: 3, title: 'Mini Fridge (Single Door)', price: '₦45,000', school: 'Obafemi Awolowo Univ.', seller: 'Amina B.', sellerAvatar: 'https://i.pravatar.cc/150?img=5', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=400&q=80', condition: 'Refurbished' },
];

const MOCK_SAVED_RESOURCES = [
  { id: 1, title: 'MTH 101 Advanced Calculus Complete Notes', course: 'MTH 101', type: 'PDF', uploader: 'Tunde A.', downloads: 1240 },
  { id: 4, title: 'Anatomy Summary Charts', course: 'ANA 301', type: 'PDF', uploader: 'Med Student', downloads: 2100 },
];

export function SavedItems() {
  const [activeTab, setActiveTab] = useState('marketplace'); // 'marketplace' | 'study'

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold font-display text-white">Saved Items</h1>
        <p className="text-muted-foreground mt-1">Keep track of items you want to buy later and materials you want to download.</p>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'marketplace' ? 'bg-primary text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <HugeiconsIcon icon={ShoppingBag01Icon} size={18} />
          Marketplace ({MOCK_SAVED_PRODUCTS.length})
        </button>
        <button 
          onClick={() => setActiveTab('study')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'study' ? 'bg-primary text-black' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
          <HugeiconsIcon icon={Book04Icon} size={18} />
          Study Materials ({MOCK_SAVED_RESOURCES.length})
        </button>
      </div>

      {activeTab === 'marketplace' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {MOCK_SAVED_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_SAVED_RESOURCES.map(resource => (
            <div key={resource.id} className="glass-card rounded-2xl p-5 flex items-center justify-between border border-white/5 hover:border-primary/30 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center">
                  <HugeiconsIcon icon={Book04Icon} size={24} className="text-rose-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-0.5">{resource.title}</h4>
                  <p className="text-[11px] text-muted-foreground">{resource.course} • {resource.type}</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center text-primary transition-colors">
                <HugeiconsIcon icon={Bookmark02Icon} size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
