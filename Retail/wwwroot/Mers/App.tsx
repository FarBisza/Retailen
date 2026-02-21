
import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductCard from './components/ProductCard';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import AdminPage from './components/AdminPage';
import { PRODUCTS } from './constants';
import { CartItem } from './types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import * as api from './cartApi';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'shop' | 'cart' | 'checkout' | 'admin'>('shop');
  const [currentPage, setCurrentPage] = useState(2);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<number | null>(null);
  const [loadingCart, setLoadingCart] = useState(false);

  // Initialize Session ID & Load Cart
  useEffect(() => {
    let sessionId = localStorage.getItem('cart_session_id');
    if (!sessionId) {
      // Default: Secure (HTTPS/Localhost)
      sessionId = crypto.randomUUID();
      /*
      // Fallback: Non-Secure (HTTP IP) - Uncomment if testing on network without HTTPS
      sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      */
      localStorage.setItem('cart_session_id', sessionId);
    }
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoadingCart(true);
      const data = await api.fetchCart();
      setCartId(data.id);

      // Map API items to frontend CartItems
      const items: CartItem[] = data.pozycje.map((p: any) => {
        const product = PRODUCTS.find(prod => prod.id === p.produktId.toString());
        if (!product) return null;
        return {
          ...product,
          quantity: p.ilosc,
          basketItemId: p.id // This is the ITEM ID (PozycjaId)
        };
      }).filter(Boolean);

      setCartItems(items);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoadingCart(false);
    }
  };

  const handleAddToCart = async (product: any) => {
    try {
      await api.addToCart(parseInt(product.id), 1);
      await loadCart();
      alert('Added to cart');
    } catch (err) {
      console.error(err);
      alert('Failed to add to cart');
    }
  };

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    if (!cartId) return;
    const item = cartItems.find(i => i.id === itemId);
    if (!item || !item.basketItemId) return;

    if (quantity < 1) {
      return;
    }

    // Optimistic Update
    setCartItems(prev => prev.map(i =>
      i.id === itemId ? { ...i, quantity } : i
    ));

    try {
      await api.updateCartItem(cartId, item.basketItemId, quantity);
      // Background sync to ensure consistency, but UI is already updated
      loadCart();
    } catch (err) {
      console.error(err);
      // Revert on error (reload actual state)
      loadCart();
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!cartId) return;
    const item = cartItems.find(i => i.id === itemId);
    if (!item || !item.basketItemId) return;

    // Optimistic Update
    setCartItems(prev => prev.filter(i => i.id !== itemId));

    try {
      await api.removeCartItem(cartId, item.basketItemId);
      loadCart();
    } catch (err) {
      console.error(err);
      loadCart();
    }
  };


  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      if (selectedCategory && product.category !== selectedCategory) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      if (selectedColors.length > 0) {
        const hasColor = product.colors.some(c => selectedColors.includes(c));
        if (!hasColor) return false;
      }
      if (selectedStyles.length > 0 && !selectedStyles.includes(product.style)) return false;
      if (inStockOnly && !product.inStock) return false;
      return true;
    });
  }, [selectedCategory, priceRange, selectedColors, selectedStyles, inStockOnly]);

  const Pagination = () => (
    <div className="flex items-center justify-center gap-2 mt-16">
      <button className="p-2 text-gray-400 hover:text-black transition-colors">
        <ChevronLeft size={16} />
      </button>
      {[1, 2, 3, 4].map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`w-8 h-8 rounded-sm text-xs font-bold transition-all border
            ${currentPage === page
              ? 'bg-[#0c121e] text-white border-[#0c121e]'
              : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
            }
          `}
        >
          {page}
        </button>
      ))}
      <button className="p-2 text-gray-400 hover:text-black transition-colors">
        <ChevronRight size={16} />
      </button>
    </div>
  );

  const ActiveFilters = () => {
    const filters = [];
    if (selectedCategory) filters.push({ type: 'Category', value: selectedCategory, onClear: () => setSelectedCategory(null) });
    if (priceRange[1] < 2000) filters.push({ type: 'Price', value: `Under $${priceRange[1]}`, onClear: () => setPriceRange([0, 2000]) });
    selectedColors.forEach(c => filters.push({ type: 'Color', value: c, onClear: () => setSelectedColors(selectedColors.filter(color => color !== c)) }));
    selectedStyles.forEach(s => filters.push({ type: 'Style', value: s, onClear: () => setSelectedStyles(selectedStyles.filter(style => style !== s)) }));
    if (inStockOnly) filters.push({ type: 'Availability', value: 'In Stock', onClear: () => setInStockOnly(false) });

    if (filters.length === 0) return null;

    return (
      <div className="flex flex-wrap items-center gap-2 mb-8 animate-in fade-in slide-in-from-top-2">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mr-2">Active:</span>
        {filters.map((f, i) => (
          <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-tighter">
              {f.type === 'Color' ? (
                <div className="w-2 h-2 rounded-full inline-block mr-1" style={{ backgroundColor: f.value }} />
              ) : null}
              {f.value}
            </span>
            <button onClick={f.onClear} className="text-gray-400 hover:text-black transition-colors">
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            setSelectedCategory(null);
            setPriceRange([0, 2000]);
            setSelectedColors([]);
            setSelectedStyles([]);
            setInStockOnly(false);
          }}
          className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-700 ml-2"
        >
          Clear All
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        currentView={currentView === 'admin' ? 'shop' : currentView}
        onCartClick={() => setCurrentView('cart')}
        onHomeClick={() => setCurrentView('shop')}
        onUserClick={() => setIsAuthOpen(true)}
      />

      {/* Quick Admin Toggle (Demo purposes) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setCurrentView(currentView === 'admin' ? 'shop' : 'admin')}
          className="bg-white border border-gray-200 shadow-xl px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-black transition-all"
        >
          {currentView === 'admin' ? 'Exit Admin' : 'Admin Demo'}
        </button>
      </div>

      <div className="flex-1">
        {currentView === 'shop' && (
          <main className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 mt-4">
            <Sidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedStyles={selectedStyles}
              setSelectedStyles={setSelectedStyles}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
            />
            <div className="flex-1 px-6 pb-20">
              <ActiveFilters />

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={(p) => handleAddToCart(p)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 border-t border-gray-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Try adjusting your filters to find what you're looking for.</p>
                </div>
              )}

              {filteredProducts.length > 0 && <Pagination />}
            </div>
          </main>
        )}

        {currentView === 'cart' && (
          <CartPage
            items={cartItems}
            onContinueShopping={() => setCurrentView('shop')}
            onCheckout={() => setCurrentView('checkout')}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            items={cartItems}
            onBackToCart={() => setCurrentView('cart')}
          />
        )}

        {currentView === 'admin' && (
          <AdminPage />
        )}
      </div>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
};

export default App;
