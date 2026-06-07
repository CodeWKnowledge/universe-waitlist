import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, FilterIcon, ArrowDown01Icon, Add01Icon } from '@hugeicons/core-free-icons';
import { ProductCard } from "../../components/ui/ProductCard";
import { Link } from 'react-router-dom';

const CATEGORIES = ["All", "Electronics", "Furniture", "Textbooks", "Clothing", "Kitchen", "Stationery"];

const MOCK_PRODUCTS = [
  { id: 1, title: 'Sony WH-1000XM4 Headphones', price: '₦120,000', school: 'University of Lagos', seller: 'Tunde Alabi', sellerAvatar: 'https://i.pravatar.cc/150?img=11', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80', condition: 'Like New' },
  { id: 2, title: 'Medical Anatomy 8th Edition', price: '₦15,000', school: 'University of Ibadan', seller: 'Dr. John', sellerAvatar: 'https://i.pravatar.cc/150?img=12', image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80', condition: 'Used - Good' },
  { id: 3, title: 'Mini Fridge (Single Door)', price: '₦45,000', school: 'Obafemi Awolowo Univ.', seller: 'Amina B.', sellerAvatar: 'https://i.pravatar.cc/150?img=5', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?auto=format&fit=crop&w=400&q=80', condition: 'Refurbished' },
  { id: 4, title: 'Rechargeable Study Lamp', price: '₦8,500', school: 'University of Lagos', seller: 'Sam C.', sellerAvatar: 'https://i.pravatar.cc/150?img=15', image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=400&q=80', condition: 'Brand New' },
  { id: 5, title: 'Lab Coat (Size M)', price: '₦4,000', school: 'University of Ilorin', seller: 'Jessica', sellerAvatar: 'https://i.pravatar.cc/150?img=20', image: 'https://images.unsplash.com/photo-1584982751601-97d8cb0f66fc?auto=format&fit=crop&w=400&q=80', condition: 'Used' },
  { id: 6, title: 'HP Envy 13 Laptop', price: '₦350,000', school: 'University of Lagos', seller: 'Tech Bro', sellerAvatar: 'https://i.pravatar.cc/150?img=33', image: 'https://images.unsplash.com/photo-1531297172867-4d6480b0fb09?auto=format&fit=crop&w=400&q=80', condition: 'Like New' },
];

export function Marketplace() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-display text-foreground">Marketplace</h1>
          <p className="text-muted-foreground text-xs mt-0.5">Buy &amp; sell with verified students on campus.</p>
        </div>
        <Link to="/create-listing" className="flex items-center gap-1.5 px-3 py-2 bg-primary hover:bg-accent text-primary-foreground text-xs font-bold rounded-xl transition-all shadow-sm shadow-primary/20">
          <HugeiconsIcon icon={Add01Icon} size={14} />
          <span className="hidden sm:inline">New Listing</span>
          <span className="sm:hidden">List</span>
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <HugeiconsIcon icon={Search01Icon} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search textbooks, furniture, electronics..."
            className="w-full bg-secondary border border-border rounded-xl py-2.5 pl-9 pr-3 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 transition-all"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2.5 bg-secondary border border-border rounded-xl text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
          <HugeiconsIcon icon={FilterIcon} size={15} />
          <span className="hidden sm:inline">Filter</span>
        </button>
        <button className="hidden sm:flex items-center gap-1.5 px-3 py-2.5 bg-secondary border border-border rounded-xl text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
          <span>Newest</span>
          <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
        </button>
      </div>

      {/* Categories */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
              activeCategory === cat
                ? 'bg-foreground text-background border-foreground'
                : 'bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {MOCK_PRODUCTS.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
