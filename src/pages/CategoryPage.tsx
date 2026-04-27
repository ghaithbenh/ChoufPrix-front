import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../api/productService';
import { getCategoryBySlug } from '../data/categories';
import SubcategoryTabs from '../components/SubcategoryTabs';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import { Search, X, SlidersHorizontal, ChevronRight, Home, ShoppingBag, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CategoryPage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const category = getCategoryBySlug(slug || '');

    // State
    const [subcategory, setSubcategory] = useState('');
    const [store, setStore] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get('q') || '');
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Reset state when slug changes
    useEffect(() => {
        setSubcategory('');
        setStore('');
        setMinPrice('');
        setMaxPrice('');
        setSearch(searchParams.get('q') || '');
        setDebouncedSearch(searchParams.get('q') || '');
        setPage(1);
    }, [slug]);

    // Fetch taxonomy for subcategories
    const { data: taxonomy = {} } = useQuery({
        queryKey: ['taxonomy'],
        queryFn: () => productService.getTaxonomy(),
    });

    // Fetch stores
    const { data: stores = [] } = useQuery({
        queryKey: ['stores'],
        queryFn: () => productService.getStores(),
    });

    // Fetch products
    const { data: result, isLoading, error, refetch } = useQuery({
        queryKey: ['category-products', category?.parentCategory, subcategory, store, minPrice, maxPrice, debouncedSearch, page],
        queryFn: async () => {
            if (!category) return null;

            if (debouncedSearch) {
                const searchData = await productService.searchProducts({
                    q: debouncedSearch,
                    parentCategory: category.parentCategory,
                    subcategory: subcategory || undefined,
                    minPrice: minPrice ? Number(minPrice) * 1000 : undefined,
                    maxPrice: maxPrice ? Number(maxPrice) * 1000 : undefined,
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

            return await productService.getProductsByCategory({
                parentCategory: category.parentCategory,
                subcategory: subcategory || undefined,
                store: store || undefined,
                minPrice: minPrice ? Number(minPrice) * 1000 : undefined,
                maxPrice: maxPrice ? Number(maxPrice) * 1000 : undefined,
                page,
                limit: 12,
            });
        },
        enabled: !!category,
    });

    // Subcategories for this parent
    const subcategories = category ? (taxonomy[category.parentCategory] || []) : [];

    // 404 guard
    if (!category) {
        return (
            <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
                <div className="text-6xl mb-6">🔍</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Category not found</h2>
                <p className="text-gray-500 mb-8">The category you're looking for doesn't exist.</p>
                <Link
                    to="/"
                    className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm mb-6">
                <Link to="/" className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span>Home</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <span className="font-bold text-gray-800">{category.label}</span>
            </nav>

            {/* Category Header */}
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${category.gradient} p-6 sm:p-8 mb-8`}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-4">
                    <span className="text-5xl sm:text-6xl">{category.icon}</span>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                            {category.label}
                        </h1>
                        <p className="text-white/70 text-sm font-medium mt-1">
                            Browse {subcategories.length} subcategories in {category.parentCategory}
                        </p>
                    </div>
                </div>
            </div>

            {/* Subcategory Tabs */}
            {subcategories.length > 0 && (
                <div className="mb-6">
                    <SubcategoryTabs
                        subcategories={subcategories}
                        activeSubcategory={subcategory}
                        onSelect={(sub) => { setSubcategory(sub); setPage(1); }}
                        accentColor={category.color}
                    />
                </div>
            )}

            {/* Search + Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Scoped Search */}
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder={`Search in ${category.label}...`}
                        className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-400 transition-all font-semibold text-gray-800 placeholder-gray-400 text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        id="category-search-input"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filter toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all border ${
                        showFilters
                            ? 'bg-blue-50 border-blue-200 text-blue-600'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                    id="toggle-filters-button"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-wrap gap-4">
                        {/* Store filter */}
                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => { setStore(''); setPage(1); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                    store === '' ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:bg-white'
                                }`}
                            >
                                All Stores
                            </button>
                            {stores.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => { setStore(s); setPage(1); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                        store === s ? 'bg-blue-600 text-white shadow shadow-blue-200' : 'text-gray-500 hover:bg-white'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>

                        {/* Price range */}
                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl">
                            <div className="relative w-28">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Min</span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-full pl-9 pr-2 py-1.5 bg-white border-none rounded-lg text-xs font-bold text-gray-800 focus:ring-0 placeholder-gray-300"
                                    value={minPrice}
                                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                                />
                            </div>
                            <div className="w-2 h-px bg-gray-300" />
                            <div className="relative w-28">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Max</span>
                                <input
                                    type="number"
                                    placeholder="9999"
                                    className="w-full pl-9 pr-2 py-1.5 bg-white border-none rounded-lg text-xs font-bold text-gray-800 focus:ring-0 placeholder-gray-300"
                                    value={maxPrice}
                                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                                />
                            </div>
                            <span className="pr-2 text-[10px] font-bold text-gray-400">DT</span>
                        </div>
                    </div>
                </div>
            )}

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

            {/* Product Grid */}
            {error ? (
                <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-2xl border border-red-100 px-6">
                    <AlertCircle className="w-14 h-14 text-red-500 mb-4" />
                    <h3 className="text-xl font-bold text-red-900 mb-2">An error occurred</h3>
                    <p className="text-red-600 text-center mb-6">Unable to load products.</p>
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
                    {/* Results count */}
                    <p className="text-sm text-gray-400 font-medium mb-4">
                        {result.total} product{result.total !== 1 ? 's' : ''} found
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
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                    <p className="text-gray-400 font-medium">Try adjusting your filters or search query.</p>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;
