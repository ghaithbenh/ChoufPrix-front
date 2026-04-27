import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

interface HeroSearchProps {
    /** If set, search is scoped to this category slug */
    categorySlug?: string;
    placeholder?: string;
}

const HeroSearch: React.FC<HeroSearchProps> = ({
    categorySlug,
    placeholder = 'Search for any product across Tunisia...',
}) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (!trimmed) return;

        if (categorySlug) {
            // Scoped search within category — stay on category page with search param
            navigate(`/category/${categorySlug}?q=${encodeURIComponent(trimmed)}`);
        } else {
            // Global search
            navigate(`/search?q=${encodeURIComponent(trimmed)}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto" id="hero-search-form">
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center">
                    <Search className="absolute left-5 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors duration-300" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="w-full pl-14 pr-28 py-4 bg-white border border-gray-200 rounded-2xl shadow-lg shadow-gray-200/50 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-400 transition-all duration-300 font-semibold text-gray-800 placeholder-gray-400 text-base"
                        id="hero-search-input"
                    />
                    <button
                        type="submit"
                        className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
                        id="hero-search-button"
                    >
                        Search
                    </button>
                </div>
            </div>
        </form>
    );
};

export default HeroSearch;
