import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import { Search, X, Home, ChevronRight, ShoppingBag, AlertCircle } from 'lucide-react';

const SearchResults: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const initialQuery = searchParams.get('q') || '';

    const [search, setSearch] = useState(initialQuery);
    const [debouncedSearch, setDebouncedSearch] = useState(initialQuery);
    const [store, setStore] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [page, setPage] = useState(1);

    // Sync input with URL
    useEffect(() => {
        const q = searchParams.get('q') || '';
        setSearch(q);
        setDebouncedSearch(q);
    }, [searchParams]);

    // Debounce typed search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
            // Update URL without navigation
            if (search !== searchParams.get('q')) {
                setSearchParams({ q: search }, { replace: true });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Fetch stores
    const { data: stores = [] } = useQuery({
        queryKey: ['stores'],
        queryFn: () => productService.getStores(),
    });

    // Fetch search results
    const { data: result, isLoading, error, refetch } = useQuery({
        queryKey: ['search-results', debouncedSearch, store, minPrice, maxPrice, page],
        queryFn: async () => {
            if (debouncedSearch) {
                const searchData = await productService.searchProducts({
                    q: debouncedSearch,
                    minPrice: minPrice ? Number(minPrice) * 1000 : undefined,
                    maxPrice: maxPrice ? Number(maxPrice) * 1000 : undefined,
                    source: store || undefined,
                    page: page,
                    limit: 12,
                });
                const sortedResults = [...searchData.results].sort((a, b) => a.price - b.price);
                return {
                    data: sortedResults,
                    total: searchData.total,
                    page: searchData.page,
                    totalPages: searchData.totalPages,
                    normalized: searchData.normalized,
                };
            }

            // No query — show latest products
            return await productService.getProducts({
                store: store || undefined,
                minPrice: minPrice ? Number(minPrice) * 1000 : undefined,
                maxPrice: maxPrice ? Number(maxPrice) * 1000 : undefined,
                page,
                limit: 12,
            });
        },
    });

    return (
        <div className="animate-in fade-in duration-500">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6">
                <Link to="/" className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <span className="font-bold text-gray-800">Search Results</span>
            </nav>

            {/* Search bar */}
            <div className="mb-8">
                <div className="relative group max-w-2xl">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for any product..."
                        className="w-full pl-14 pr-14 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-400 transition-all font-semibold text-lg text-gray-800 placeholder-gray-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        id="search-results-input"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {debouncedSearch && (
                    <p className="mt-3 text-sm text-gray-500 font-medium">
                        Showing results for "<span className="text-gray-800 font-bold">{debouncedSearch}</span>"
                    </p>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
                {/* Store tabs */}
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => { setStore(''); setPage(1); }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                            store === '' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        All Stores
                    </button>
                    {stores.map((s) => (
                        <button
                            key={s}
                            onClick={() => { setStore(s); setPage(1); }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                                store === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {/* Price range */}
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm ml-auto">
                    <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Min</span>
                        <input
                            type="number"
                            placeholder="0"
                            className="w-full pl-10 pr-3 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-800 focus:ring-0 placeholder-gray-400"
                            value={minPrice}
                            onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                        />
                    </div>
                    <div className="w-2 h-px bg-gray-200" />
                    <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Max</span>
                        <input
                            type="number"
                            placeholder="9999"
                            className="w-full pl-10 pr-3 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-800 focus:ring-0 placeholder-gray-400"
                            value={maxPrice}
                            onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                        />
                    </div>
                    <span className="pr-3 text-xs font-bold text-gray-400">DT</span>
                </div>
            </div>

            {/* Normalized search info */}
            {result?.normalized && (
                <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                    <span className="text-blue-600 text-sm font-bold">Recherche comprise:</span>
                    <span className="text-blue-800 text-sm">{result.normalized.normalizedQuery}</span>
                    {result.normalized.specs?.length > 0 && (
                        <div className="flex gap-2 ml-auto">
                            {result.normalized.specs.map((spec: string) => (
                                <span key={spec} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-lg">
                                    {spec}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Results */}
            {error ? (
                <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-100 px-6">
                    <AlertCircle className="w-14 h-14 text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-red-900 mb-2">An error occurred</h3>
                    <p className="text-red-600 text-center mb-6">Unable to load search results.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
                    >
                        Retry
                    </button>
                </div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : result?.data && result.data.length > 0 ? (
                <>
                    <p className="text-sm text-gray-400 font-medium mb-4">
                        {result.total} result{result.total !== 1 ? 's' : ''} found
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {result.data.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onClick={() => navigate(`/product/${product._id}`)}
                            />
                        ))}
                    </div>
                    <Pagination
                        currentPage={result.page}
                        totalPages={result.totalPages}
                        onPageChange={setPage}
                    />
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No results found</h3>
                    <p className="text-gray-400 font-medium">Try a different search term or adjust your filters.</p>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
