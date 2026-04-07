import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchFiltersProps {
    search: string;
    onSearchChange: (value: string) => void;
    minPrice: string;
    onMinPriceChange: (value: string) => void;
    maxPrice: string;
    onMaxPriceChange: (value: string) => void;
    store: string;
    onStoreChange: (value: string) => void;
    stores: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
    search,
    onSearchChange,
    minPrice,
    onMinPriceChange,
    maxPrice,
    onMaxPriceChange,
    store,
    onStoreChange,
    stores
}) => {
    return (
        <div className="space-y-6 mb-10">
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-blue-600 transition-colors" />
                <input
                    type="text"
                    placeholder="Chercher un produit ou coller un lien..."
                    className="w-full pl-14 pr-14 py-5 bg-white border border-gray-100 rounded-3xl shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all font-bold text-lg text-gray-800 placeholder-gray-400"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {search && (
                    <button 
                        onClick={() => onSearchChange('')}
                        className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar transition-colors duration-300">
                    <button
                        onClick={() => onStoreChange('')}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                            store === '' 
                            ? 'bg-gray-900 text-white shadow-lg' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        Tous les Magasins
                    </button>
                    {stores.map(s => (
                        <button
                            key={s}
                            onClick={() => onStoreChange(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                store === s 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm ml-auto transition-colors duration-300">
                    <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Min</span>
                        <input
                            type="number"
                            placeholder="0"
                            className="w-full pl-10 pr-3 py-2 bg-gray-50 text-gray-800 border-none rounded-xl text-sm font-bold focus:ring-0 placeholder-gray-400 transition-colors duration-300"
                            value={minPrice}
                            onChange={(e) => onMinPriceChange(e.target.value)}
                        />
                    </div>
                    <div className="w-2 h-px bg-gray-200" />
                    <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Max</span>
                        <input
                            type="number"
                            placeholder="9999"
                            className="w-full pl-10 pr-3 py-2 bg-gray-50 text-gray-800 border-none rounded-xl text-sm font-bold focus:ring-0 placeholder-gray-400 transition-colors duration-300"
                            value={maxPrice}
                            onChange={(e) => onMaxPriceChange(e.target.value)}
                        />
                    </div>
                    <span className="pr-3 text-xs font-bold text-gray-400">DT</span>
                </div>
            </div>
        </div>
    );
};

export default SearchFilters;
