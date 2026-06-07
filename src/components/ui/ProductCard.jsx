import { HugeiconsIcon } from '@hugeicons/react';
import { FavouriteIcon } from '@hugeicons/core-free-icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      onClick={() => navigate(`/marketplace/${product.id}`)}
      className="glass-card rounded-xl overflow-hidden group cursor-pointer border border-border hover:border-primary/30 transition-all flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={e => e.stopPropagation()}
          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:text-rose-400 transition-colors"
        >
          <HugeiconsIcon icon={FavouriteIcon} size={12} />
        </button>
        <div className="absolute bottom-2 left-2">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-white border border-white/10">
            {product.condition}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between gap-2">
        <div>
          <div className="flex justify-between items-start gap-1">
            <h4 className="text-[11px] sm:text-xs font-bold text-foreground leading-tight line-clamp-2 flex-1">{product.title}</h4>
          </div>
          <p className="text-primary text-xs font-black mt-1">{product.price}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{product.school}</p>
        </div>
        <div className="flex items-center gap-1.5 pt-2 border-t border-border">
          <img src={product.sellerAvatar} alt={product.seller} className="w-4 h-4 rounded-full object-cover bg-secondary" />
          <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground truncate">{product.seller}</span>
        </div>
      </div>
    </motion.div>
  );
}
