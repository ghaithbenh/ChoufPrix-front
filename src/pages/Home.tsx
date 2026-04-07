import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';
import SearchFilters from '../components/SearchFilters';
import CategorySidebar from '../components/CategorySidebar';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import HeroScene from '../components/HeroScene';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [store, setStore] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [parentCategory, setParentCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: stores = [] } = useQuery({
        queryKey: ['stores'],
        queryFn: () => productService.getStores(),
    });

    const { data: taxonomy = {} } = useQuery({
        queryKey: ['taxonomy'],
        queryFn: () => productService.getTaxonomy(),
    });

    const { data: result, isLoading, error, refetch } = useQuery({
        queryKey: ['products', debouncedSearch, store, parentCategory, subcategory, minPrice, maxPrice, page],
        queryFn: async () => {
            if (debouncedSearch) {
                const searchData = await productService.searchProducts({
                    q: debouncedSearch,
                    minPrice: minPrice ? Number(minPrice) * 1000 : undefined,
                    maxPrice: maxPrice ? Number(maxPrice) * 1000 : undefined,
                    parentCategory: parentCategory || undefined,
                    subcategory: subcategory || undefined,
                });
                const sortedResults = [...searchData.results].sort((a, b) => a.price - b.price);
                return {
                    data: sortedResults,
                    total: sortedResults.length,
                    page: 1,
                    totalPages: 1,
                    normalized: searchData.normalized
                };
            } else {
                const productsData = await productService.getProducts({
                    store,
                    minPrice: minPrice ? Number(minPrice) * 1000 : undefined,
                    maxPrice: maxPrice ? Number(maxPrice) * 1000 : undefined,
                    parentCategory: parentCategory || undefined,
                    subcategory: subcategory || undefined,
                    page,
                    limit: 12
                });
                return {
                    data: productsData.data,
                    total: productsData.total,
                    page: productsData.page,
                    totalPages: productsData.totalPages,
                    normalized: null
                };
            }
        },
    });

    return (
        <div className="animate-in fade-in duration-700">
            <div className="mb-12 flex flex-col items-center justify-center gap-6 text-center">
                <div className="flex-shrink-0 w-full flex justify-center mt-4">
                    <HeroScene />
                </div>
                <div className="max-w-4xl px-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                        Trouvez le meilleur prix en <span className="gradient-text">Tunisie</span>
                    </h2>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <CategorySidebar
                    taxonomy={taxonomy}
                    selectedParentCategory={parentCategory}
                    selectedSubcategory={subcategory}
                    onCategoryChange={(parent, sub) => {
                        setParentCategory(parent);
                        setSubcategory(sub);
                        setPage(1);
                    }}
                />

                <div className="flex-1 min-w-0">
                    <SearchFilters
                        search={search}
                        onSearchChange={setSearch}
                        minPrice={minPrice}
                        onMinPriceChange={(val) => { setMinPrice(val); setPage(1); }}
                        maxPrice={maxPrice}
                        onMaxPriceChange={(val) => { setMaxPrice(val); setPage(1); }}
                        store={store}
                        onStoreChange={(val) => { setStore(val); setPage(1); }}
                        stores={stores}
                    />

                    {result?.normalized && (
                        <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                            <span className="text-blue-600 text-sm font-bold">Recherche comprise:</span>
                            <span className="text-blue-800 text-sm">{result.normalized.normalizedQuery}</span>
                            {result.normalized.specs.length > 0 && (
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

                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-[2.5rem] border border-red-100 px-6">
                            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                            <h3 className="text-xl font-bold text-red-900 mb-2">Une erreur est survenue</h3>
                            <p className="text-red-600 text-center mb-6">Impossible de charger les produits.</p>
                            <button
                                onClick={() => refetch()}
                                className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition-all"
                            >
                                Réessayer
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
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm transition-colors duration-300">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 transition-colors duration-300">
                                <ShoppingBag className="w-12 h-12 text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 transition-colors duration-300">Aucun produit trouvé</h3>
                            <p className="text-gray-400 font-medium transition-colors duration-300">Réinitialisez les filtres pour voir plus de produits.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;