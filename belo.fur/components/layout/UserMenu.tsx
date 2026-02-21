//not executed
import React from 'react';
import {
    X, CreditCard, Box, Truck, Star, RefreshCcw,
    History, Heart, Store, Ticket, BadgePercent,
    Wallet, HelpCircle, MessageSquare, AlertTriangle,
    Settings, ChevronRight
} from 'lucide-react';
import { UserProfile } from '../../api/types';

interface UserMenuProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: UserProfile | null;
    onAuthClick: () => void;
    onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onClose, currentUser, onAuthClick, onLogout }) => {

    const MenuSection = ({ title, children }: { title: string, children?: React.ReactNode }) => (
        <div className="mb-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-5 px-8">{title}</h3>
            <div className="grid grid-cols-1 gap-1">
                {children}
            </div>
        </div>
    );

    const MenuItem = ({ icon: Icon, label, badge }: { icon: React.ElementType, label: string, badge?: string }) => (
        <button className="flex items-center justify-between w-full px-8 py-3.5 hover:bg-gray-50 transition-all group">
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
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[110] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[380px] bg-white z-[120] shadow-2xl transition-transform duration-500 transform flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* User Header */}
                <div className="px-8 pt-10 pb-8 border-b border-gray-50 bg-gray-50/30">
                    <div className="flex items-center justify-between mb-8">
                        <div className="text-2xl font-black tracking-tighter">My Account</div>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"><X size={20} /></button>
                    </div>

                    {currentUser ? (
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-[#0c121e] flex items-center justify-center text-white shadow-lg overflow-hidden border-4 border-white">
                                <span className="text-xl font-bold">{currentUser.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-base font-black text-slate-900">{currentUser.name}</p>
                                <div className="flex gap-4 mt-1">
                                    <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-colors">Settings</button>
                                    <button onClick={onLogout} className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors">Logout</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-sm text-gray-500 mb-4">Sign in to manage your orders and rewards</p>
                            <button
                                onClick={onAuthClick}
                                className="w-full bg-[#0c121e] text-white py-3.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-black transition-all"
                            >
                                Sign In / Register
                            </button>
                        </div>
                    )}
                </div>

                {/* Scrollable Content (только для авторизованных) */}
                <div className={`flex-1 overflow-y-auto pt-8 pb-10 custom-scrollbar ${!currentUser && 'opacity-30 pointer-events-none grayscale'}`}>
                    <MenuSection title="Order Management">
                        <MenuItem icon={CreditCard} label="To Pay" badge="2" />
                        <MenuItem icon={Box} label="To Ship" />
                        <MenuItem icon={Truck} label="Shipped" />
                        <MenuItem icon={Star} label="To Review" badge="5" />
                        <MenuItem icon={RefreshCcw} label="Returns" />
                    </MenuSection>

                    <MenuSection title="Activity & History">
                        <MenuItem icon={History} label="History / Refunds" />
                        <MenuItem icon={Settings} label="Processed" />
                        <MenuItem icon={Heart} label="Wishlist" />
                        <MenuItem icon={Store} label="Followed Stores" />
                    </MenuSection>

                    <MenuSection title="Rewards & Wallet">
                        <MenuItem icon={Ticket} label="Coupons" badge="NEW" />
                        <MenuItem icon={BadgePercent} label="Bonus" />
                        <MenuItem icon={Wallet} label="Shopping Credits" />
                    </MenuSection>

                    <MenuSection title="Support & Safety">
                        <MenuItem icon={HelpCircle} label="Help Center" />
                        <MenuItem icon={MessageSquare} label="Suggestion" />
                        <MenuItem icon={AlertTriangle} label="Product Safety Alerts" />
                    </MenuSection>
                </div>

                {/* Fixed Footer */}
                <div className="p-6 border-t border-gray-50 bg-white">
                    <button className="w-full border border-gray-200 text-slate-900 py-4 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <MessageSquare size={14} /> Contact Support
                    </button>
                </div>
            </div>
        </>
    );
};

export default UserMenu;
