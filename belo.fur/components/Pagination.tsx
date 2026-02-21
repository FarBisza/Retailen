import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
        if (currentPage >= totalPages - 3)
            return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex items-center justify-center gap-2 mt-16">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 transition-colors ${currentPage === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-black'}`}
            >
                <ChevronLeft size={16} />
            </button>

            {visiblePages.map((page, index) => (
                <React.Fragment key={index}>
                    {page === '...' ? (
                        <span className="text-gray-400 px-2">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page as number)}
                            className={`w-8 h-8 rounded-sm text-xs font-bold transition-all border
                  ${currentPage === page
                                    ? 'bg-[#0c121e] text-white border-[#0c121e]'
                                    : 'bg-white text-gray-400 border-gray-100 hover:border-gray-300'
                                }
                  `}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 transition-colors ${currentPage === totalPages ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-black'}`}
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;
