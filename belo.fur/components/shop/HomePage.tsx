import React, { useState, useEffect } from 'react';
import { ArrowRight, Smartphone, Shirt, Sofa, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProducts } from '../../api/productApi';
import ProductCard from './ProductCard';
import { Product } from '../../api/types';

interface HomePageProps {
    onShopNow: () => void;
    onAddToCart: (product: Product) => void;
    onProductClick: (product: Product) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onShopNow, onAddToCart, onProductClick }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const slides = [
        {
            title: "Artisan \nFurniture.",
            subtitle: "FURNITURE DESIGN",
            description: "Timeless pieces crafted from natural materials to elevate your living space.",
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000",
            accent: "amber-600",
            icon: <Sofa size={24} />
        },
        {
            title: "Visionary \nTechnology.",
            subtitle: "ELECTRONICS & TECH",
            description: "Cutting-edge gadgets that blend seamless performance with minimal aesthetics.",
            image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&q=80&w=2000",
            accent: "blue-600",
            icon: <Smartphone size={24} />
        },
        {
            title: "Essential \nApparel.",
            subtitle: "MINIMALIST FASHION",
            description: "Premium fabrics and structured silhouettes for the modern urban dweller.",
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=2000",
            accent: "slate-500",
            icon: <Shirt size={24} />
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchProducts()
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load products', err);
                setLoading(false);
            });
    }, []);

    const isFurniture = (p: Product) =>
        ['furniture', 'sofa', 'table', 'chair', 'ottoman', 'dresser', 'sideboard', 'cabinet', 'bookcase', 'bistro']
            .some(k => p.category?.toLowerCase().includes(k));

    const isTech = (p: Product) =>
        ['audio', 'headphone', 'smartphone', 'tech', 'electronics', 'gadget', 'pixel', 'sennheiser']
            .some(k => p.category?.toLowerCase().includes(k));

    const isApparel = (p: Product) =>
        ['apparel', 'clothing', 'fashion', 'accessory', 'accessories', 'wear', 'hoodie', 'sweater', 'tote']
            .some(k => p.category?.toLowerCase().includes(k));

    const featuredFurniture = products.filter(isFurniture).slice(0, 2);
    const featuredTech = products.filter(isTech).slice(0, 2);
    const featuredApparel = products.filter(isApparel).slice(0, 2);

    return (
        <div className="animate-in fade-in duration-700">

            <section className="relative h-[85vh] w-full overflow-hidden bg-[#0c121e]">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c121e] via-transparent to-transparent opacity-80" />

                        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-[1400px] mx-auto">
                            <p className={`text-${slide.accent} text-[10px] md:text-xs font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-3`}>
                                {slide.icon} {slide.subtitle}
                            </p>
                            <h1 className="text-white text-5xl md:text-8xl font-black tracking-tighter mb-8 max-w-3xl leading-[0.85] whitespace-pre-line">
                                {slide.title}
                            </h1>
                            <p className="text-gray-400 text-sm md:text-base font-medium max-w-md mb-12 leading-relaxed">
                                {slide.description}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={onShopNow}
                                    className="group bg-white text-black px-12 py-5 text-xs font-black uppercase tracking-widest flex items-center gap-4 hover:bg-slate-900 hover:text-white transition-all duration-500 shadow-xl"
                                >
                                    Explore Collection
                                    <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="absolute bottom-10 right-10 flex items-center gap-4 z-20">
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                        className="w-12 h-12 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all backdrop-blur-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                        {slides.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                        className="w-12 h-12 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all backdrop-blur-sm"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto px-6 py-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="group relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-sm cursor-pointer" onClick={onShopNow}>
                        <img src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" alt="Furniture" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-500" />
                        <div className="absolute bottom-10 left-10 text-white">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-amber-600 px-3 py-1.5 rounded-full mb-4 inline-block">Home Interior</span>
                            <h3 className="text-3xl font-black tracking-tighter">Artisan Furniture</h3>
                            <p className="text-white/60 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500">Curated pieces for living & dining</p>
                        </div>
                    </div>

                    <div className="group relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-sm cursor-pointer" onClick={onShopNow}>
                        <img src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" alt="Tech" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-500" />
                        <div className="absolute bottom-10 left-10 text-white">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-blue-600 px-3 py-1.5 rounded-full mb-4 inline-block">High Performance</span>
                            <h3 className="text-3xl font-black tracking-tighter">Premium Tech</h3>
                            <p className="text-white/60 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500">Audio, visual & connectivity</p>
                        </div>
                    </div>

                    <div className="group relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-sm cursor-pointer" onClick={onShopNow}>
                        <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" alt="Fashion" />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-all duration-500" />
                        <div className="absolute bottom-10 left-10 text-white">
                            <span className="text-[9px] font-black uppercase tracking-widest bg-slate-500 px-3 py-1.5 rounded-full mb-4 inline-block">Apparel</span>
                            <h3 className="text-3xl font-black tracking-tighter">Modern Fashion</h3>
                            <p className="text-white/60 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500">Sustainable & structured basics</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gray-50/50 py-32 border-y border-gray-100">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                        <div>
                            <h2 className="text-4xl font-black tracking-tighter text-slate-900 mb-4">New Arrivals</h2>
                            <p className="text-sm text-gray-400 font-medium max-w-sm uppercase tracking-widest">A collective of modern essentials</p>
                        </div>
                        <button onClick={onShopNow} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-900 border-b-2 border-slate-900 pb-1">
                            Shop Entire Collective
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {[...featuredFurniture, ...featuredTech, ...featuredApparel].slice(0, 6).map(p => (
                            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onProductClick={onProductClick} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-[1400px] mx-auto px-6 py-40">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-12 leading-[0.9]">
                        The intersection of <br /> life, style & <br /> intelligence.
                    </h2>
                    <p className="text-lg text-gray-500 leading-relaxed font-medium mb-16">
                        Belo.fur isn't just a store. It's a curated collective of everything required for the modern human experience.
                        From the chair you sit in, to the device you create with, to the clothes you wear—we believe in high quality,
                        low impact, and timeless design.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-gray-100">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center text-amber-600"><Sofa size={28} /></div>
                            <span className="text-xs font-black uppercase tracking-widest">Sourced Materials</span>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><Smartphone size={28} /></div>
                            <span className="text-xs font-black uppercase tracking-widest">Precision Tech</span>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"><Shirt size={28} /></div>
                            <span className="text-xs font-black uppercase tracking-widest">Timeless Fit</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
