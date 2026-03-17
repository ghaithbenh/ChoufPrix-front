import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        if (totalPages <= 5) return i + 1;
        if (currentPage <= 3) return i + 1;
        if (currentPage >= totalPages - 2) return totalPages - 4 + i;
        return currentPage - 2 + i;
    });

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-1">
                {pages[0] > 1 && (
                    <>
                        <button
                             onClick={() => onPageChange(1)}
                             className="w-10 h-10 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                        >
                            1
                        </button>
                        {pages[0] > 2 && <span className="text-slate-300">...</span>}
                    </>
                )}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                            currentPage === page 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                            : 'text-slate-500 hover:bg-slate-100'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {pages[pages.length - 1] < totalPages && (
                    <>
                        {pages[pages.length - 1] < totalPages - 1 && <span className="text-slate-300">...</span>}
                        <button
                             onClick={() => onPageChange(totalPages)}
                             className="w-10 h-10 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-all"
                        >
                            {totalPages}
                        </button>
                    </>
                )}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default Pagination;
