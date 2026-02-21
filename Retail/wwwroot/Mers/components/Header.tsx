
import React from 'react';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';

interface HeaderProps {
  onCartClick: () => void;
  onHomeClick: () => void;
  onUserClick: () => void;
  currentView: 'shop' | 'cart' | 'checkout';
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onHomeClick, onUserClick, currentView }) => {
  return (
    <header className="w-full">
      {/* Promo Banner */}
      <div className="bg-[#0c121e] text-white text-[11px] md:text-xs py-2 text-center font-light tracking-wide px-4">
        Save 20% on your first order | Labor day event up to 66% off | Earn 5% back in credit rewards
      </div>

      {/* Navbar */}
      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 py-5 md:py-8 border-b border-gray-100">
        <div
          className="text-2xl font-bold tracking-tight cursor-pointer"
          onClick={onHomeClick}
        >
          Mers
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={onUserClick}
            className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors hidden sm:flex"
          >
            <User size={20} strokeWidth={1.5} />
          </button>
          <button
            onClick={onCartClick}
            className={`p-2 border rounded-full transition-colors ${currentView === 'cart' || currentView === 'checkout' ? 'bg-[#0c121e] text-white border-[#0c121e]' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
          </button>
          <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            <Menu size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center text-xs text-gray-500 gap-1.5">
        <span className="cursor-pointer hover:text-black" onClick={onHomeClick}>Home</span>
        <span>&rsaquo;</span>
        {currentView === 'shop' && (
          <>
            <span className="cursor-pointer hover:text-black">Collection</span>
            <span>&rsaquo;</span>
            <span className="text-black font-medium">Aaram Kedara Series</span>
          </>
        )}
        {currentView === 'cart' && (
          <span className="text-black font-medium">Shopping Cart</span>
        )}
        {currentView === 'checkout' && (
          <>
            <span className="cursor-pointer hover:text-black" onClick={onCartClick}>Shopping Cart</span>
            <span>&rsaquo;</span>
            <span className="text-black font-medium">Checkout</span>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
