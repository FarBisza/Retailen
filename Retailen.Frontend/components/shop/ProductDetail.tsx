import React, { useState, useMemo } from 'react';
import { Minus, Plus, Heart, ShieldCheck, Truck, RefreshCcw, ChevronDown, ChevronUp, Ruler, Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { Product, UserProfile, Review } from '../../api/types';

interface ProductDetailProps {
    product: Product;
    onAddToCart: (product: Product, quantity: number) => void;
    onBack: () => void;
    currentUser: UserProfile | null;
    onLoginClick: () => void;
}

const Accordion: React.FC<{
    title: string;
    id: string;
    isOpen: boolean;
    onToggle: (id: string | null) => void;
    children?: React.ReactNode
}> = ({ title, id, isOpen, onToggle, children }) => (
    <div className="border-b border-gray-100">
        <button
            onClick={() => onToggle(isOpen ? null : id)}
            className="w-full py-5 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-900"
        >
            {title}
            {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] pb-6' : 'max-h-0'}`}>
            <div className="text-sm text-gray-500 leading-relaxed font-medium">
                {children}
            </div>
        </div>
    </div>
);

const ProductDetail: React.FC<ProductDetailProps> = ({ product: initialProduct, onAddToCart, onBack, currentUser, onLoginClick }) => {
    const [product, setProduct] = useState(initialProduct);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [activeImage, setActiveImage] = useState(product.image);
    const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState('');
    const [hasPurchased, setHasPurchased] = useState(false);
    const [purchaseCheckDone, setPurchaseCheckDone] = useState(false);

    const images = product.images || [product.image];

    React.useEffect(() => {
        (async () => {
            try {
                const { fetchProductById } = await import('../../api/productApi');
                const refreshed = await fetchProductById(initialProduct.id);
                if (refreshed) setProduct(refreshed);
            } catch {
            }
        })();
    }, [initialProduct.id]);

    React.useEffect(() => {
        if (!currentUser) {
            setPurchaseCheckDone(true);
            return;
        }
        (async () => {
            try {
                const { getMyOrders } = await import('../../api/orderApi');
                const orders = await getMyOrders();
                const purchased = orders.some(
                    o => o.items.some(item => item.productId === Number(product.id)) && o.statusId >= 2 && o.statusId !== 6
                );
                setHasPurchased(purchased);
            } catch {
                setHasPurchased(false);
            } finally {
                setPurchaseCheckDone(true);
            }
        })();
    }, [currentUser, product.id]);

    const { avgRating, distribution } = useMemo(() => {
        if (product.reviews.length === 0) return { avgRating: 0, distribution: [0, 0, 0, 0, 0] };

        const dist = [0, 0, 0, 0, 0];
        const sum = product.reviews.reduce((acc, rev) => {
            dist[5 - rev.rating]++;
            return acc + rev.rating;
        }, 0);

        return {
            avgRating: Number((sum / product.reviews.length).toFixed(1)),
            distribution: dist.map(count => (count / product.reviews.length) * 100)
        };
    }, [product.reviews]);

    const outOfStock = !product.inStock;
    const stockLimit = product.stockLevel ?? 999;
    const lowStock = product.inStock && stockLimit > 0 && stockLimit <= 5;

    const handleQuantity = (type: 'inc' | 'dec') => {
        if (type === 'inc') setQuantity(prev => Math.min(prev + 1, stockLimit || 999));
        else setQuantity(prev => Math.max(1, prev - 1));
    };

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !newComment.trim()) return;

        try {
            const { submitReview } = await import('../../api/reviewApi');
            await submitReview(product.id, newRating, newComment);

            try {
                const { fetchProductById } = await import('../../api/productApi');
                const refreshed = await fetchProductById(product.id);
                if (refreshed) {
                    setProduct(refreshed);
                }
            } catch {
                setProduct(prev => ({
                    ...prev,
                    reviews: [{
                        id: Date.now().toString(),
                        userId: currentUser.id?.toString() || '',
                        userName: currentUser.name || 'You',
                        rating: newRating,
                        comment: newComment,
                        date: new Date().toISOString().split('T')[0],
                    }, ...(prev.reviews || [])]
                }));
            }
            setNewComment('');
            setNewRating(5);
            window.dispatchEvent(new Event('product-data-changed'));
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Failed to submit review. Please try again.');
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button onClick={onBack} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black mb-6 sm:mb-12 flex items-center gap-2 transition-colors">
                <span className="text-lg">←</span> Back to Collection
            </button>

            <div className="flex flex-col lg:flex-row gap-8 sm:gap-16 lg:gap-24 mb-16 sm:mb-32">
                <div className="flex-1 space-y-6">
                    <div className="aspect-[4/5] bg-gray-50 rounded-sm overflow-hidden border border-gray-100 p-8">
                        <img src={activeImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-all duration-700 hover:scale-105" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={`aspect-square bg-gray-50 rounded-sm overflow-hidden border-2 transition-all p-2 ${activeImage === img ? 'border-slate-900' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 lg:max-w-md">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">{product.category}</span>
                            <div className="w-1 h-1 rounded-full bg-gray-200" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">{product.type || 'FURNITURE'}</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 mb-4 leading-tight">{product.name}</h1>

                        <div className="flex items-center gap-6 mb-8">
                            <div className="flex items-center gap-2">
                                <div className="flex text-amber-400">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <Star key={star} size={14} fill={star <= Number(avgRating) ? "currentColor" : "none"} />
                                    ))}
                                </div>
                                <span className="text-xs font-black text-slate-900">{avgRating}</span>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">({product.reviews.length} reviews)</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-2xl font-black text-slate-900">${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            {product.originalPrice && (
                                <span className="text-lg text-gray-300 line-through font-medium">${product.originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            )}
                        </div>

                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            {product.longDescription || product.shortDescription || "Meticulously designed for the modern dwelling, blending raw materials with refined aesthetics. Each piece in our collection represents a commitment to high-quality craftsmanship and minimalist functionality."}
                        </p>
                    </div>

                    <div className="space-y-8 mb-10 border-y border-gray-50 py-10">
                        {product.type === 'clothing' && product.sizes && (
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                                    <Ruler size={12} /> Size Selection
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {product.sizes.map(size => (
                                        <button key={size} className="w-12 h-12 border border-gray-100 text-[10px] font-black uppercase tracking-widest rounded-sm hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Palette & Finish</p>
                            <div className="flex gap-4">
                                {product.colors.map(color => (
                                    <button key={color} onClick={() => setSelectedColor(color)} className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color ? 'border-slate-900 p-0.5' : 'border-transparent hover:scale-110'}`}>
                                        <div className="w-full h-full rounded-full border border-gray-100" style={{ backgroundColor: color }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {outOfStock && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 rounded-sm">
                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Out of Stock</span>
                            </div>
                        )}
                        {lowStock && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 rounded-sm">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Only {stockLimit} left in stock!</span>
                            </div>
                        )}

                        <div className="flex flex-row gap-3">
                            <div className={`flex items-center justify-center border border-gray-200 rounded-sm h-[52px] min-w-[120px] bg-white flex-shrink-0 ${outOfStock ? 'opacity-40 pointer-events-none' : ''}`}>
                                <button onClick={() => handleQuantity('dec')} className="p-2 hover:text-black text-gray-400"><Minus size={16} /></button>
                                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                                <button onClick={() => handleQuantity('inc')} className={`p-2 hover:text-black ${quantity >= stockLimit ? 'text-gray-200 pointer-events-none' : 'text-gray-400'}`}><Plus size={16} /></button>
                            </div>
                            <button
                                onClick={() => !outOfStock && onAddToCart(product, quantity)}
                                disabled={outOfStock}
                                className={`flex-1 h-[52px] px-4 font-bold text-[11px] uppercase tracking-[0.15em] rounded-sm transition-all ${outOfStock
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#0c121e] text-white hover:bg-black shadow-xl shadow-[#0c121e]/10'
                                    }`}
                            >
                                {outOfStock ? 'Out of Stock' : 'Add to cart'}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Accordion
                            title="Technical Attributes"
                            id="specs"
                            isOpen={openAccordion === 'specs'}
                            onToggle={setOpenAccordion}
                        >
                            <div className="space-y-4 pt-2">
                                {product.attributes && product.attributes.length > 0 && (
                                    <div className="grid grid-cols-2 gap-y-5">
                                        {product.attributes.map((attr) => (
                                            <div key={attr.id} className="flex flex-col gap-1">
                                                <span className="text-[9px] uppercase font-black tracking-widest text-gray-400">
                                                    {attr.attributeName}
                                                </span>
                                                <span className="text-slate-900 font-bold">
                                                    {attr.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {(!product.attributes || product.attributes.length === 0) && product.type === 'furniture' && product.dimensions && (
                                    <div className="grid grid-cols-2 gap-y-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] uppercase font-black tracking-widest text-gray-400">Width</span>
                                            <span className="text-slate-900 font-bold">{product.dimensions.width_cm} cm</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] uppercase font-black tracking-widest text-gray-400">Height</span>
                                            <span className="text-slate-900 font-bold">{product.dimensions.height_cm} cm</span>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[9px] uppercase font-black tracking-widest text-gray-400">Material</span>
                                            <span className="text-slate-900 font-bold">{product.material}</span>
                                        </div>
                                    </div>
                                )}
                                {(!product.attributes || product.attributes.length === 0) && product.type === 'electronics' && product.specs && (
                                    <div className="grid grid-cols-2 gap-y-5">
                                        {Object.entries(product.specs).map(([key, value]) => (
                                            <div key={key} className="flex flex-col gap-1">
                                                <span className="text-[9px] uppercase font-black tracking-widest text-gray-400">{key.replace('_', ' ')}</span>
                                                <span className="text-slate-900 font-bold">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Accordion>

                        <Accordion
                            title="Operations & Fulfillment"
                            id="shipping"
                            isOpen={openAccordion === 'shipping'}
                            onToggle={setOpenAccordion}
                        >
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-3 text-xs">
                                    <Truck size={14} className="text-slate-400" />
                                    <span>Free global express fulfillment</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <ShieldCheck size={14} className="text-slate-400" />
                                    <span>2-year limited technical warranty</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                    <RefreshCcw size={14} className="text-slate-400" />
                                    <span>30-day effortless return policy</span>
                                </div>
                            </div>
                        </Accordion>
                    </div>
                </div>
            </div>

            <section className="border-t border-gray-100 pt-12 sm:pt-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex flex-col lg:flex-row gap-10 sm:gap-20">

                    <div className="w-full lg:w-80 flex flex-col gap-10">
                        <div>
                            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-8">Customer Feedback</h2>
                            <div className="flex items-end gap-4 mb-6">
                                <span className="text-5xl sm:text-7xl font-black text-slate-900 leading-none">{avgRating}</span>
                                <div className="flex flex-col gap-1.5 mb-1">
                                    <div className="flex text-amber-400">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} size={20} fill={star <= Number(avgRating) ? "currentColor" : "none"} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.reviews.length} Verified Reviews</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[5, 4, 3, 2, 1].map((stars, idx) => (
                                <div key={stars} className="flex items-center gap-4 group cursor-default">
                                    <span className="text-[10px] font-black text-gray-400 w-3">{stars}</span>
                                    <div className="flex-1 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-slate-900 transition-all duration-1000 delay-300"
                                            style={{ width: `${distribution[idx]}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-300 w-8 text-right">{Math.round(distribution[idx])}%</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-gray-50">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-4">Performance Metrics</h4>
                            <div className="flex flex-wrap gap-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                                    <CheckCircle2 size={12} className="text-green-600" />
                                    <span className="text-[10px] font-black uppercase text-green-700">Excellent Quality</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                                    <CheckCircle2 size={12} className="text-blue-600" />
                                    <span className="text-[10px] font-black uppercase text-blue-700">Reliable Fit</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
                                    <CheckCircle2 size={12} className="text-gray-400" />
                                    <span className="text-[10px] font-black uppercase text-gray-500">Fast Fulfillment</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 max-w-3xl">
                        <div className="bg-gray-50/50 p-10 rounded-sm border border-gray-100 mb-16 shadow-sm">
                            {!currentUser ? (
                                <div className="text-center py-10">
                                    <MessageSquare size={40} className="mx-auto text-gray-200 mb-6" />
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Authentication required to post feedback</p>
                                    <button
                                        onClick={onLoginClick}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] bg-slate-900 text-white px-8 py-3.5 hover:bg-black transition-all shadow-lg"
                                    >
                                        Authenticate Now
                                    </button>
                                </div>
                            ) : !purchaseCheckDone ? (
                                <div className="text-center py-10">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest animate-pulse">Checking purchase history...</p>
                                </div>
                            ) : !hasPurchased ? (
                                <div className="text-center py-10">
                                    <ShieldCheck size={40} className="mx-auto text-gray-200 mb-6" />
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Verified Buyers Only</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-1">Purchase this product to leave a review</p>
                                </div>
                            ) : (
                                <form onSubmit={handleAddReview} className="space-y-8">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Add a Review</h4>
                                            <p className="text-[10px] text-gray-400 font-medium mt-1">Share your perspective with our community</p>
                                        </div>
                                        <div className="flex gap-2.5 text-amber-400">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button key={star} type="button" onClick={() => setNewRating(star)} className="focus:outline-none hover:scale-125 transition-transform">
                                                    <Star size={24} fill={star <= newRating ? "currentColor" : "none"} />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Your testimony matters. Tell us about the craftsmanship, aesthetics, and overall experience..."
                                            className="w-full bg-white border border-gray-200 rounded-sm p-8 text-sm font-medium focus:outline-none focus:border-slate-900 min-h-[160px] transition-all resize-none shadow-sm leading-relaxed"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim()}
                                            className="absolute bottom-8 right-8 bg-slate-900 text-white p-4 rounded-full hover:bg-black transition-all shadow-xl hover:scale-105 disabled:opacity-20 disabled:scale-100"
                                        >
                                            <Send size={20} />
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        <div className="divide-y divide-gray-100">
                            {product.reviews.length > 0 ? (
                                product.reviews.map(rev => (
                                    <div key={rev.id} className="py-12 first:pt-0 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm border-2 border-white shadow-lg">
                                                    {rev.userName.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black text-slate-900">{rev.userName}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{rev.date}</span>
                                                </div>
                                            </div>
                                            <div className="flex text-amber-400">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} size={14} fill={star <= rev.rating ? "currentColor" : "none"} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 leading-loose font-medium pl-16 max-w-2xl italic">
                                            "{rev.comment}"
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-24 bg-white border border-dashed border-gray-100 rounded-sm">
                                    <p className="text-[11px] text-gray-300 font-black uppercase tracking-[0.2em]">No testimonials available yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProductDetail;