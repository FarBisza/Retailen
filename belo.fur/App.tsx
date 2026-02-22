import React, { useState } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import ProductCard from './components/shop/ProductCard';
import CartPage from './components/cart/CartPage';
import CheckoutPage from './components/cart/CheckoutPage';
import Footer from './components/layout/Footer';
import AuthModal from './components/auth/AuthModal';
import ForgotPasswordModal from './components/auth/ForgotPasswordModal';
import ResetPasswordPage from './components/auth/ResetPasswordPage';
const AdminPage = React.lazy(() => import('./components/AdminPage'));
const StaffPage = React.lazy(() => import('./components/StaffPage'));
const SupplierPage = React.lazy(() => import('./components/SupplierPage'));
import HomePage from './components/shop/HomePage';
import CartDrawer from './components/cart/CartDrawer';
import NavigationDrawer from './components/layout/NavigationDrawer';
import NavMenu from './components/layout/NavMenu';
import OrderModal, { OrderTab } from './components/order/OrderModal';
import ProfileModal from './components/auth/ProfileModal';
import MenuToggle from './components/layout/MenuToggle';
import ProductDetail from './components/shop/ProductDetail';
import Pagination from './components/shop/Pagination';
import ActiveFilters from './components/shop/ActiveFilters';
import { Product } from './api/types';
import { X } from 'lucide-react';

import { useAuth } from './hooks/useAuth';
import { useCart } from './hooks/useCart';
import { useProducts } from './hooks/useProducts';
import { useFilters } from './hooks/useFilters';

const App: React.FC = () => {
  console.log("App component mounting...");

  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'cart' | 'checkout' | 'admin' | 'staff' | 'supplier' | 'product-detail' | 'reset-password'>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalInitialTab, setOrderModalInitialTab] = useState<OrderTab>('to-pay');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { currentUser, setCurrentUser, handleLogin: authLogin, handleLogout: authLogout } = useAuth();
  const { products, productsLoading, categories, categoriesLoading, availableColors } = useProducts();
  const { cartItems, setCartItems, addToCart, removeFromCart, updateQuantity } = useCart(currentUser);
  const filters = useFilters(products);

  React.useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, '');
    if (path === '/reset-password') {
      setCurrentView('reset-password');
    }
  }, []);

  const handleLogin = (user: any) => {
    authLogin(user);
    setIsAuthOpen(false);
    setIsAccountOpen(true);
  };

  const handleLogout = async () => {
    await authLogout();
    setCartItems([]);
    setIsAccountOpen(false);
    setIsOrderModalOpen(false);
    if (currentView === 'admin' || currentView === 'staff') setCurrentView('home');
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
    window.scrollTo(0, 0);
  };

  const handleCategoryFromMenu = (category: string) => {
    filters.setSelectedCategory(category);
    setCurrentView('shop');
    setIsMenuOpen(false);
  };

  const handleOpenOrderCenter = (tab: OrderTab) => {
    setOrderModalInitialTab(tab);
    setIsAccountOpen(false);
    setIsOrderModalOpen(true);
  };

  const handleAddToCart = async (product: Product, quantity: number = 1) => {
    const success = await addToCart(product, quantity);
    if (success) setIsCartDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        currentView={currentView}
        onCartClick={() => setIsCartDrawerOpen(true)}
        onHomeClick={() => setCurrentView('home')}
        onUserClick={() => setIsAccountOpen(true)}
        onGoToAdmin={() => {
          if (currentUser?.role === 'supplier') setCurrentView('supplier');
          else if (currentUser?.role === 'employee') setCurrentView('staff');
          else setCurrentView('admin');
        }}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        searchQuery={filters.searchQuery}
        setSearchQuery={filters.setSearchQuery}
        onGoToShop={() => setCurrentView('shop')}
        onMenuClick={() => setIsMenuOpen(true)}
        currentUser={currentUser}
        products={products}
        onProductClick={openProductDetail}
      />

      <MenuToggle
        onClick={() => setIsMenuOpen(true)}
        isVisible={!isMenuOpen && !isCartDrawerOpen}
      />

      <NavigationDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onHomeClick={() => { setCurrentView('home'); setIsMenuOpen(false); }}
        onCategorySelect={handleCategoryFromMenu}
        categories={categories}
      />

      <NavMenu
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onLoginClick={() => { setIsAccountOpen(false); setAuthMode('login'); setIsAuthOpen(true); }}
        onRegisterClick={() => { setIsAccountOpen(false); setAuthMode('register'); setIsAuthOpen(true); }}
        onLogoutClick={handleLogout}
        onOpenOrderCenter={handleOpenOrderCenter}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialTab={orderModalInitialTab}
        onBackToAccount={() => { setIsOrderModalOpen(false); setIsAccountOpen(true); }}
      />

      <div className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onShopNow={() => { setCurrentView('shop'); window.scrollTo(0, 0); }}
            onAddToCart={handleAddToCart}
            onProductClick={openProductDetail}
          />
        )}

        {currentView === 'reset-password' && (
          <ResetPasswordPage
            onNavigateToLogin={() => { setCurrentView('home'); setIsAuthOpen(true); setAuthMode('login'); }}
          />
        )}

        {currentView === 'shop' && (
          <main className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 mt-4">
            <Sidebar
              selectedCategory={filters.selectedCategory}
              setSelectedCategory={filters.setSelectedCategory}
              priceRange={filters.priceRange}
              setPriceRange={filters.setPriceRange}
              selectedColors={filters.selectedColors}
              setSelectedColors={filters.setSelectedColors}
              selectedStyles={filters.selectedStyles}
              setSelectedStyles={filters.setSelectedStyles}
              inStockOnly={filters.inStockOnly}
              setInStockOnly={filters.setInStockOnly}
              searchQuery={filters.searchQuery}
              setSearchQuery={filters.setSearchQuery}
              categories={categories}
              currentUser={currentUser}
              onGoToAdmin={() => setCurrentView('admin')}
            />
            <div className="flex-1 px-6 pb-20">
              <ActiveFilters
                searchQuery={filters.searchQuery}
                selectedCategory={filters.selectedCategory}
                priceRange={filters.priceRange}
                selectedColors={filters.selectedColors}
                selectedStyles={filters.selectedStyles}
                inStockOnly={filters.inStockOnly}
                onClearSearch={() => filters.setSearchQuery('')}
                onClearCategory={() => filters.setSelectedCategory(null)}
                onClearPrice={() => filters.setPriceRange([0, 2000])}
                onRemoveColor={(c) => filters.setSelectedColors(filters.selectedColors.filter(color => color !== c))}
                onRemoveStyle={(s) => filters.setSelectedStyles(filters.selectedStyles.filter(style => style !== s))}
                onClearStock={() => filters.setInStockOnly(false)}
                onClearAll={filters.clearAllFilters}
              />

              {filters.displayedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
                  {filters.displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={(p) => handleAddToCart(p)} onProductClick={openProductDetail} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 border-t border-gray-50">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Try adjusting your filters or search query.</p>
                </div>
              )}

              <Pagination
                currentPage={filters.currentPage}
                totalPages={filters.totalPages}
                onPageChange={filters.setCurrentPage}
              />
            </div>
          </main>
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBack={() => setCurrentView('shop')}
            currentUser={currentUser}
            onLoginClick={() => setIsAuthOpen(true)}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            items={cartItems}
            onContinueShopping={() => setCurrentView('shop')}
            onCheckout={() => setCurrentView('checkout')}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            items={cartItems}
            onBackToCart={() => setCurrentView('cart')}
            onGoHome={() => setCurrentView('home')}
            onViewOrders={() => { setCurrentView('home'); setOrderModalInitialTab('to-pay'); setIsOrderModalOpen(true); }}
            onOrderSuccess={() => setCartItems([])}
            currentUser={currentUser}
            onLoginClick={() => setIsAuthOpen(true)}
          />
        )}

        {currentView === 'admin' ? (
          <React.Suspense fallback={<div>Loading Admin...</div>}>
            {currentUser && currentUser.role === 'admin' ? (
              <AdminPage />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
                  <X size={32} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-widest mb-2">Access Denied</h2>
                <p className="text-sm text-gray-500 font-medium mb-6">You do not have permission to access the Administration Panel.</p>
                <button
                  onClick={() => setCurrentView('home')}
                  className="bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                >
                  Return to Home
                </button>
              </div>
            )}
          </React.Suspense>
        ) : null}

        {currentView === 'staff' ? (
          <React.Suspense fallback={<div>Loading Staff Panel...</div>}>
            {currentUser && currentUser.role === 'employee' ? (
              <StaffPage />
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-6">
                  <X size={32} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-widest mb-2">Access Denied</h2>
                <p className="text-sm text-gray-500 font-medium mb-6">You do not have permission to access the Staff Panel.</p>
                <button
                  onClick={() => setCurrentView('home')}
                  className="bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                >
                  Return to Home
                </button>
              </div>
            )}
          </React.Suspense>
        ) : null}

        {currentView === 'supplier' && (
          <React.Suspense fallback={<div>Loading Supplier...</div>}>
            <SupplierPage />
          </React.Suspense>
        )}
      </div>

      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        initialMode={authMode}
        onForgotPassword={() => { setIsAuthOpen(false); setIsForgotPasswordOpen(true); }}
      />

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        onBackToLogin={() => { setIsForgotPasswordOpen(false); setAuthMode('login'); setIsAuthOpen(true); }}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onGoToCart={() => { setIsCartDrawerOpen(false); setCurrentView('cart'); }}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
};

export default App;
