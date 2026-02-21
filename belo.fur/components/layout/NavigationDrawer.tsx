import React from 'react';
import { X, ChevronRight, Sparkles, Sofa, Smartphone, Shirt, Home, Package } from 'lucide-react';

interface NavigationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onCategorySelect: (category: string | null) => void;
    onHomeClick: () => void;
    categories: string[];
}

const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
    isOpen,
    onClose,
    onCategorySelect,
    onHomeClick,
    categories
}) => {
    // Dynamically filter categories into groups
    const furnitureCategories = categories.filter(c =>
        c.includes('Furniture') || c.includes('Sofa') || c.includes('Table') ||
        c.includes('Ottoman') || c.includes('Dresser') || c.includes('Sideboard') ||
        c.includes('Kitchen') || c.includes('Bookcase') || c.includes('Credenza') ||
        c.includes('Patio') || c.includes('Sets')
    );
    const techCategories = categories.filter(c =>
        c.includes('Smartphone') || c.includes('Audio') || c.includes('Laptop') ||
        c.includes('Smart Home') || c.includes('Wearable')
    );
    const apparelCategories = categories.filter(c =>
        c.includes('Apparel') || c.includes('Essential') || c.includes('Accessor')
    );

    const NavItem = ({ icon: Icon, label, onClick, badge }: { icon: any, label: string, onClick: () => void, badge?: string }) => (
        <button onClick={onClick} className="flex items-center justify-between w-full py-4 text-sm font-black uppercase tracking-widest text-slate-900 border-b border-gray-50 hover:pl-2 transition-all">
            <div className="flex items-center gap-3">
                <Icon size={18} className="text-slate-400" />
                {label}
                {badge && <span className="bg-slate-900 text-white text-[8px] px-1.5 py-0.5 rounded-sm ml-2">{badge}</span>}
            </div>
            <ChevronRight size={14} className="text-gray-300" />
        </button>
    );

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 left-0 h-full w-full max-w-[400px] bg-white z-[120] shadow-2xl transition-transform duration-500 transform flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="px-8 pt-12 pb-8 border-b border-gray-100 flex items-center justify-between">
                    <div className="text-2xl font-black tracking-tighter">Belo.fur Collective</div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto pt-8 pb-10 px-8 custom-scrollbar">
                    {/* Core Navigation */}
                    <div className="mb-12">
                        <NavItem icon={Home} label="Home" onClick={() => { onHomeClick(); onClose(); }} />
                        <NavItem icon={Package} label="Entire Shop" onClick={() => { onCategorySelect(null); onClose(); }} />
                        <NavItem icon={Sparkles} label="Latest Drops" onClick={() => { onCategorySelect(null); onClose(); }} badge="NEW" />
                    </div>

                    {/* Furniture */}
                    <div className="mb-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-600 mb-6 flex items-center gap-2">
                            <Sofa size={14} /> Furniture Design
                        </h3>
                        <div className="grid grid-cols-1 gap-1">
                            {furnitureCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { onCategorySelect(cat); onClose(); }}
                                    className="flex items-center justify-between w-full py-3 text-sm font-bold text-slate-600 hover:text-black hover:bg-amber-50/30 px-2 rounded-sm transition-all text-left"
                                >
                                    {cat}
                                    <ChevronRight size={14} className="text-gray-200" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tech */}
                    <div className="mb-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-500 mb-6 flex items-center gap-2">
                            <Smartphone size={14} /> Technology
                        </h3>
                        <div className="grid grid-cols-1 gap-1">
                            {techCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { onCategorySelect(cat); onClose(); }}
                                    className="flex items-center justify-between w-full py-3 text-sm font-bold text-slate-600 hover:text-black hover:bg-blue-50/30 px-2 rounded-sm transition-all text-left"
                                >
                                    {cat}
                                    <ChevronRight size={14} className="text-gray-200" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Apparel */}
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-6 flex items-center gap-2">
                            <Shirt size={14} /> Apparel & Essentials
                        </h3>
                        <div className="grid grid-cols-1 gap-1">
                            {apparelCategories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => { onCategorySelect(cat); onClose(); }}
                                    className="flex items-center justify-between w-full py-3 text-sm font-bold text-slate-600 hover:text-black hover:bg-slate-50 px-2 rounded-sm transition-all text-left"
                                >
                                    {cat}
                                    <ChevronRight size={14} className="text-gray-200" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-50 text-[9px] font-bold text-gray-300 uppercase tracking-widest flex justify-between items-center">
                    <span>Global Collective 2025</span>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-black">Instagram</a>
                        <a href="#" className="hover:text-black">Twitter</a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavigationDrawer;
