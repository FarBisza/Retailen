import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ShoppingBag, Search, Menu, User, ShieldCheck, Briefcase, Truck } from 'lucide-react';
import { UserProfile, Product } from '../../api/types';

interface HeaderProps {
  onCartClick: () => void;
  onHomeClick: () => void;
  onUserClick: () => void;
  onGoToAdmin: () => void;
  onGoToShop: () => void;
  onMenuClick: () => void;
  currentView: 'home' | 'shop' | 'cart' | 'checkout' | 'admin' | 'supplier' | 'product-detail';
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentUser: UserProfile | null;
  products: Product[];
  onProductClick: (product: Product) => void;
}

const Header: React.FC<HeaderProps> = ({
  onCartClick,
  onHomeClick,
  onUserClick,
  onGoToAdmin,
  onGoToShop,
  onMenuClick,
  currentView,
  cartCount,
  searchQuery,
  setSearchQuery,
  currentUser,
  products,
  onProductClick
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setShowDropdown(false);
      setIsSearchOpen(false);
      onGoToShop();
    }
  };

  const handleProductSelect = (product: Product) => {
    setShowDropdown(false);
    setIsSearchOpen(false);
    onProductClick(product);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full z-[100] bg-white" ref={searchRef}>
      <div className="bg-[#0c121e] text-white text-[11px] md:text-xs py-2 text-center font-light tracking-wide px-4">
        Save 20% on your first order | Labor day event up to 66% off | Earn 5% back in credit rewards
      </div>

      <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 relative h-[80px] md:h-[100px] border-b border-gray-100">

        {/* Left Side: Burger Menu + Logo */}
        <div className={`flex items-center gap-2 md:gap-4 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <button
            onClick={onMenuClick}
            className="flex items-center justify-center w-10 h-10 text-slate-900 hover:text-gray-500 transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu size={20} strokeWidth={1.5} />
          </button>

          <div
            className="text-2xl md:text-3xl font-bold tracking-tighter cursor-pointer hover:opacity-70 transition-opacity"
            onClick={onHomeClick}
          >
            Belo.fur
          </div>
        </div>

        {/* Search Overlay */}
        <div className={`absolute inset-x-6 top-1/2 -translate-y-1/2 flex flex-col transition-all duration-500 ease-out z-[60] ${isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="w-full relative flex items-center gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10" />
              <input
                type="text"
                placeholder="Search collection..."
                className="w-full bg-gray-50 border border-transparent focus:border-slate-200 px-12 py-3.5 text-sm rounded-full outline-none font-medium text-slate-900 shadow-sm"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                autoFocus={isSearchOpen}
              />
            </div>
            <button onClick={() => { setIsSearchOpen(false); setShowDropdown(false); }} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Close</button>
          </div>

          {/* Search Dropdown */}
          {showDropdown && filteredProducts.length > 0 && (
            <div className="absolute top-full left-0 right-16 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-[400px] overflow-y-auto z-[70]">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-900">${product.price}</span>
                </div>
              ))}
              <div
                onClick={() => { setShowDropdown(false); setIsSearchOpen(false); onGoToShop(); }}
                className="flex items-center justify-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors text-xs font-bold uppercase tracking-widest text-slate-900"
              >
                View all results ({filteredProducts.length})
              </div>
            </div>
          )}

          {showDropdown && searchQuery.trim() && filteredProducts.length === 0 && (
            <div className="absolute top-full left-0 right-16 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl p-6 text-center z-[70]">
              <p className="text-sm text-gray-500">No products found for "{searchQuery}"</p>
            </div>
          )}
        </div>

        {/* Right Side: Actions (Rounded borders) */}
        <div className={`flex items-center gap-2 md:gap-3 transition-opacity duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

          {/* Role-based management button */}
          {(currentUser?.role === 'admin' || currentUser?.role === 'employee' || currentUser?.role === 'supplier') && (
            <button
              onClick={onGoToAdmin}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-[9px] font-black uppercase tracking-widest mr-2
                ${(currentView === 'admin' || currentView === 'staff' || currentView === 'supplier') ? 'bg-[#0c121e] text-white border-[#0c121e]' : 'bg-white text-slate-900 border-gray-100 hover:border-slate-900 hover:bg-gray-50'}
              `}
            >
              {currentUser?.role === 'admin' && <><ShieldCheck size={14} /> Admin</>}
              {currentUser?.role === 'employee' && <><Briefcase size={14} /> Staff</>}
              {currentUser?.role === 'supplier' && <><Truck size={14} /> Supplier</>}
            </button>
          )}

          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-full text-slate-900 hover:bg-gray-50 hover:border-slate-900 transition-all duration-300"
          >
            <Search size={20} strokeWidth={1.5} />
          </button>

          <button
            onClick={onUserClick}
            className={`w-10 h-10 flex items-center justify-center border rounded-full transition-all duration-300 ${currentUser ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'border-gray-100 text-slate-900 hover:bg-gray-50 hover:border-slate-900'}`}
          >
            <User size={20} strokeWidth={1.5} />
          </button>

          <button
            onClick={onCartClick}
            className={`w-10 h-10 flex items-center justify-center border border-gray-100 rounded-full transition-all duration-300 relative text-slate-900 hover:bg-gray-50 hover:border-slate-900 ${currentView === 'cart' && 'bg-[#0c121e] text-white border-[#0c121e]'}`}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#0c121e] text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
