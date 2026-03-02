
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '../../api/types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onProductClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const outOfStock = !product.inStock;
  const lowStock = product.inStock && (product.stockLevel ?? 0) > 0 && (product.stockLevel ?? 0) <= 5;

  return (
    <div
      className={`group relative flex flex-col mb-10 ${outOfStock ? 'opacity-60' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative aspect-[3/4] bg-[#f8f8f8] mb-4 overflow-hidden rounded-sm transition-all cursor-pointer"
        onClick={() => onProductClick(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 mix-blend-multiply opacity-90 ${outOfStock ? 'grayscale' : ''}`}
        />

        {outOfStock && (
          <div className="absolute top-4 left-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm z-10">
            Out of Stock
          </div>
        )}

        {lowStock && (
          <div className="absolute top-4 left-4 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-sm z-10">
            Only {product.stockLevel} left!
          </div>
        )}

        <button
          className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart size={16} strokeWidth={1.5} className="text-gray-700" />
        </button>

        {!outOfStock && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`absolute bottom-0 left-0 right-0 bg-[#0c121e] py-3 text-center transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
          >
            <span className="text-white text-xs font-semibold tracking-wide uppercase">Add to cart</span>
          </button>
        )}

        {outOfStock && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-400 py-3 text-center">
            <span className="text-white text-xs font-semibold tracking-wide uppercase">Unavailable</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h4
          className="text-[15px] font-medium text-slate-800 tracking-tight leading-tight cursor-pointer hover:text-black transition-colors"
          onClick={() => onProductClick(product)}
        >
          {product.name}
        </h4>
        <div className="flex items-center gap-3 mt-1">
          <span className={`text-[15px] font-bold ${product.originalPrice ? 'text-red-500' : 'text-slate-900'}`}>
            ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              ${product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
