import React, { useState, useEffect } from 'react';
import {
    X, CreditCard, Box, Truck, Star, RefreshCcw,
    ChevronRight, LogOut, User,
    ShieldCheck, MapPin, ExternalLink, MessageSquare
} from 'lucide-react';
import { UserProfile } from '../../api/types';
import { OrderTab } from '../order/OrderModal';
import { getOrderCounts, OrderCounts } from '../../api/orderApi';
import LiveChatDrawer from '../support/LiveChatDrawer';
import FindStoreModal from '../support/FindStoreModal';

interface NavMenuProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserProfile | null;
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onLogoutClick: () => void;
    onOpenOrderCenter: (tab: OrderTab) => void;
    onProfileClick?: () => void;
}

const NavMenu: React.FC<NavMenuProps> = ({
    isOpen,
    onClose,
    currentUser,
    onLoginClick,
    onRegisterClick,
    onLogoutClick,
    onOpenOrderCenter,
    onProfileClick
}) => {
    const [counts, setCounts] = useState<OrderCounts | null>(null);
    const [liveChatOpen, setLiveChatOpen] = useState(false);
    const [findStoreOpen, setFindStoreOpen] = useState(false);

    useEffect(() => {
        if (isOpen && currentUser) {
            getOrderCounts().then(setCounts).catch(() => { });
        }
    }, [isOpen, currentUser]);

    const handleClose = () => {
        onClose();
    };

    const MenuSection = ({ title, children }: { title: string, children?: React.ReactNode }) => (
        <div className="mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-5 px-8">{title}</h3>
            <div className="grid grid-cols-1 gap-1">{children}</div>
        </div>
    );

    const MenuItem = ({ icon: Icon, label, badge, onClick }: { icon: any, label: string, badge?: string, onClick?: () => void }) => (
        <button onClick={onClick} className="flex items-center justify-between w-full px-8 py-3.5 hover:bg-gray-50 transition-all group text-left">
            <div className="flex items-center gap-4">
                <Icon size={18} strokeWidth={1.5} className="text-slate-400 group-hover:text-black transition-colors" />
                <span className="text-sm font-bold text-slate-700 group-hover:text-black">{label}</span>
            </div>
            <div className="flex items-center gap-2">
                {badge && <span className="bg-slate-900 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">{badge}</span>}
                <ChevronRight size={14} className="text-gray-200 group-hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
        </button>
    );

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[110] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={handleClose}
            />

            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[120] shadow-2xl transition-transform duration-500 transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="px-8 pt-12 pb-8 border-b border-gray-50">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black tracking-tighter">Account Center</h2>
                        <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
                    </div>

                    {currentUser ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-white border-4 border-white shadow-xl">
                                    <span className="text-xl font-bold">{currentUser.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="text-base font-black text-slate-900">{currentUser.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Premium Member</p>
                                </div>
                            </div>
                            <button onClick={onLogoutClick} className="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={onLoginClick} className="bg-[#0c121e] text-white py-3.5 text-[10px] font-black uppercase tracking-widest rounded-sm">Log In</button>
                            <button onClick={onRegisterClick} className="border border-slate-900 text-slate-900 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-sm">Register</button>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto pt-8 pb-10 custom-scrollbar">
                    {!currentUser ? (
                        <div className="px-8 py-20 text-center space-y-4">
                            <ShieldCheck size={32} className="mx-auto text-gray-200" />
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Please log in to manage orders</p>
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-left-4 duration-500">
                            <MenuSection title="Order Management">
                                <MenuItem icon={CreditCard} label="To Pay" badge={counts?.toPay ? String(counts.toPay) : undefined} onClick={() => onOpenOrderCenter('to-pay')} />
                                <MenuItem icon={Box} label="To Ship" badge={counts?.toShip ? String(counts.toShip) : undefined} onClick={() => onOpenOrderCenter('to-ship')} />
                                <MenuItem icon={Truck} label="Shipped" badge={counts?.shipped ? String(counts.shipped) : undefined} onClick={() => onOpenOrderCenter('shipped')} />
                                <MenuItem icon={Star} label="To Review" badge={counts?.toReview ? String(counts.toReview) : undefined} onClick={() => onOpenOrderCenter('to-review')} />
                                <MenuItem icon={RefreshCcw} label="Returns" badge={counts?.returns ? String(counts.returns) : undefined} onClick={() => onOpenOrderCenter('returns')} />
                            </MenuSection>
                            <MenuSection title="Account">
                                <MenuItem icon={User} label="My Profile" onClick={() => { onProfileClick?.(); handleClose(); }} />
                            </MenuSection>
                            <MenuSection title="Support">
                                <MenuItem icon={MessageSquare} label="Live Chat" onClick={() => { handleClose(); setTimeout(() => setLiveChatOpen(true), 300); }} />
                                <MenuItem icon={MapPin} label="Find Store" onClick={() => { handleClose(); setTimeout(() => setFindStoreOpen(true), 300); }} />
                            </MenuSection>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-gray-50 text-[9px] font-bold text-gray-300 uppercase tracking-widest flex justify-between items-center">
                    <span>Member Services 2025</span>
                    <ExternalLink size={12} />
                </div>
            </div>

            <LiveChatDrawer
                isOpen={liveChatOpen}
                onClose={() => setLiveChatOpen(false)}
                userName={currentUser?.name}
            />
            <FindStoreModal
                isOpen={findStoreOpen}
                onClose={() => setFindStoreOpen(false)}
            />
        </>
    );
};

export default NavMenu;
