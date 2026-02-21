import React, { useState, useEffect } from 'react';
import {
    X, CreditCard, Box, Truck, Star, RefreshCcw,
    Heart, Ticket, User,
    Wallet, HelpCircle, MessageSquare, AlertTriangle,
    Settings, ChevronRight, LogOut, LogIn, UserPlus,
    ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../../api/types';
import { getOrderCounts, OrderCounts } from '../../api/orderApi';

interface UserSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserProfile | null;
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onLogoutClick: () => void;
    onProfileClick?: () => void;
}

const UserSidebar: React.FC<UserSidebarProps> = ({
    isOpen,
    onClose,
    currentUser,
    onLoginClick,
    onRegisterClick,
    onLogoutClick,
    onProfileClick
}) => {
    const [counts, setCounts] = useState<OrderCounts | null>(null);

    useEffect(() => {
        if (isOpen && currentUser) {
            getOrderCounts().then(setCounts).catch(() => { });
        }
    }, [isOpen, currentUser]);

    const MenuSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <div className="mb-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-5 px-8">{title}</h3>
            <div className="grid grid-cols-1 gap-1">
                {children}
            </div>
        </div>
    );

    const MenuItem = ({ icon: Icon, label, badge, onClick }: { icon: any, label: string, badge?: string, onClick?: () => void }) => (
        <button onClick={onClick} className="flex items-center justify-between w-full px-8 py-3.5 hover:bg-gray-50 transition-all group text-left">
            <div className="flex items-center gap-4">
                <Icon size={18} strokeWidth={1.5} className="text-slate-400 group-hover:text-black transition-colors" />
                <span className="text-sm font-bold text-slate-700 group-hover:text-black">{label}</span>
            </div>
            {badge ? (
                <span className="bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm">{badge}</span>
            ) : (
                <ChevronRight size={14} className="text-gray-200 group-hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-all" />
            )}
        </button>
    );

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[110] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[120] shadow-2xl transition-transform duration-500 transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="px-8 pt-12 pb-8 border-b border-gray-50">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black tracking-tighter">Account Center</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
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
                            <button onClick={onLogoutClick} className="p-2 text-gray-300 hover:text-red-500 transition-colors" title="Logout">
                                <LogOut size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <p className="text-sm text-gray-400 font-medium">Join us to manage orders, track shipping, and earn exclusive rewards.</p>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={onLoginClick}
                                    className="flex items-center justify-center gap-2 bg-[#0c121e] text-white py-3.5 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-black transition-all"
                                >
                                    <LogIn size={14} /> Log In
                                </button>
                                <button
                                    onClick={onRegisterClick}
                                    className="flex items-center justify-center gap-2 border border-slate-900 text-slate-900 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-gray-50 transition-all"
                                >
                                    <UserPlus size={14} /> Register
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Dynamic Content */}
                <div className="flex-1 overflow-y-auto pt-8 pb-10 custom-scrollbar">
                    {currentUser ? (
                        <>
                            <MenuSection title="Order Management">
                                <MenuItem icon={CreditCard} label="To Pay" badge={counts?.toPay ? String(counts.toPay) : undefined} />
                                <MenuItem icon={Box} label="To Ship" badge={counts?.toShip ? String(counts.toShip) : undefined} />
                                <MenuItem icon={Truck} label="Shipped" badge={counts?.shipped ? String(counts.shipped) : undefined} />
                                <MenuItem icon={Star} label="To Review" badge={counts?.toReview ? String(counts.toReview) : undefined} />
                                <MenuItem icon={RefreshCcw} label="Returns" badge={counts?.returns ? String(counts.returns) : undefined} />
                            </MenuSection>

                            <MenuSection title="Account & Perks">
                                <MenuItem icon={User} label="My Profile" onClick={() => { onProfileClick?.(); onClose(); }} />
                                <MenuItem icon={Ticket} label="My Coupons" />
                                <MenuItem icon={Wallet} label="Wallet Balance" />
                                <MenuItem icon={Heart} label="Wishlist" />
                                <MenuItem icon={Settings} label="Settings" />
                            </MenuSection>
                        </>
                    ) : (
                        <div className="px-8 py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                <ShieldCheck size={32} />
                            </div>
                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Restricted Access</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">Please log in to view your order history and profile settings.</p>
                        </div>
                    )}

                    <MenuSection title="General Support">
                        <MenuItem icon={HelpCircle} label="Help Center" />
                        <MenuItem icon={MessageSquare} label="Feedback" />
                        <MenuItem icon={AlertTriangle} label="Safety Notices" />
                    </MenuSection>
                </div>
            </div>
        </>
    );
};

export default UserSidebar;
