import React from 'react';
import { Menu } from 'lucide-react';

interface MenuToggleProps {
    onClick: () => void;
    isVisible: boolean;
}

const MenuToggle: React.FC<MenuToggleProps> = ({ onClick, isVisible }) => {
    if (!isVisible) return null;

    return (
        <button
            onClick={onClick}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-[90] group flex items-center outline-none"
            aria-label="Open Menu"
        >
            <div className="h-24 w-1.5 bg-[#0c121e] rounded-r-full transition-all duration-300 group-hover:w-4 flex items-center justify-center overflow-hidden shadow-lg">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -rotate-90 whitespace-nowrap text-[10px] font-black text-white uppercase tracking-[0.2em] pointer-events-none">
                    Menu
                </div>
            </div>

            <div className="absolute left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform -translate-x-2 group-hover:translate-x-0">
                <Menu size={16} className="text-[#0c121e]" />
            </div>
        </button>
    );
};

export default MenuToggle;