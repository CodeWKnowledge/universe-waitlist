import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, FavouriteIcon, Share01Icon, BubbleChatIcon, Shield01Icon, Location01Icon } from '@hugeicons/core-free-icons';
import { Link } from 'react-router-dom';

const MOCK_PRODUCT = {
  id: 1,
  title: 'Sony WH-1000XM4 Noise Cancelling Headphones',
  price: '₦120,000',
  description: 'Used for about 3 months during last semester. Perfect condition, comes with original case and charging cable. Selling because I upgraded to the XM5. Noise cancelling works perfectly, great for studying in noisy hostels.',
  condition: 'Like New',
  category: 'Electronics',
  school: 'University of Lagos',
  location: 'Moremi Hall, Block B',
  postedAt: '2 days ago',
  images: [
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
  ],
  seller: {
    name: 'Tunde Alabi',
    avatar: 'https://i.pravatar.cc/150?img=11',
    rating: 4.8,
    reviews: 12,
    joined: 'Sept 2024',
    department: 'Computer Science',
    level: '300L'
  }
};

export function ProductDetails() {
  return (
    <div className="space-y-4 pb-8 max-w-5xl mx-auto">
      {/* Back navigation */}
      <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Images */}
        <div className="lg:col-span-7 space-y-3">
          <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border relative">
            <img src={MOCK_PRODUCT.images[0]} alt={MOCK_PRODUCT.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="bg-black/70 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded border border-white/10 uppercase tracking-wider">
                {MOCK_PRODUCT.condition}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {MOCK_PRODUCT.images.slice(1).map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-secondary border border-border cursor-pointer hover:border-primary/50 transition-colors">
                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-foreground leading-tight">
                {MOCK_PRODUCT.title}
              </h1>
              <div className="flex gap-1.5 shrink-0">
                <button className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-secondary/80 transition-colors">
                  <HugeiconsIcon icon={FavouriteIcon} size={14} />
                </button>
                <button className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
                  <HugeiconsIcon icon={Share01Icon} size={14} />
                </button>
              </div>
            </div>
            <div className="text-2xl font-black text-primary">{MOCK_PRODUCT.price}</div>
            
            <div className="flex flex-wrap gap-4 text-[11px] text-muted-foreground pt-1">
              <div className="flex items-center gap-1">
                <HugeiconsIcon icon={Location01Icon} size={14} /> {MOCK_PRODUCT.school} ({MOCK_PRODUCT.location})
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl glass-card space-y-3 border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={MOCK_PRODUCT.seller.avatar} alt={MOCK_PRODUCT.seller.name} className="w-10 h-10 rounded-full object-cover border border-border" />
                <div>
                  <h4 className="font-bold text-foreground text-xs">{MOCK_PRODUCT.seller.name}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{MOCK_PRODUCT.seller.department} • {MOCK_PRODUCT.seller.level}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-emerald-500">★ {MOCK_PRODUCT.seller.rating}</div>
                <div className="text-[9px] text-muted-foreground">{MOCK_PRODUCT.seller.reviews} reviews</div>
              </div>
            </div>
            
            <div className="pt-3 border-t border-border space-y-2.5">
              <button className="w-full py-2.5 bg-primary hover:bg-accent text-primary-foreground text-xs font-bold rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5">
                <HugeiconsIcon icon={BubbleChatIcon} size={16} /> Message Seller
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground font-medium">
                <HugeiconsIcon icon={Shield01Icon} size={10} className="text-emerald-500" />
                Verified student. Safe to trade on campus.
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Description</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {MOCK_PRODUCT.description}
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Details</h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-secondary/50 border border-border p-2.5 rounded-xl">
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Category</p>
                <p className="text-xs font-medium text-foreground">{MOCK_PRODUCT.category}</p>
              </div>
              <div className="bg-secondary/50 border border-border p-2.5 rounded-xl">
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Condition</p>
                <p className="text-xs font-medium text-foreground">{MOCK_PRODUCT.condition}</p>
              </div>
              <div className="bg-secondary/50 border border-border p-2.5 rounded-xl">
                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Posted</p>
                <p className="text-xs font-medium text-foreground">{MOCK_PRODUCT.postedAt}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
