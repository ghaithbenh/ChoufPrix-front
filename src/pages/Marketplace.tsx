import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../api/productService';
import ProductCard from '../components/ProductCard';
import SearchFilters from '../components/SearchFilters';
import CategorySidebar from '../components/CategorySidebar';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import { ShoppingBag, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketplace: React.FC = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
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

    const { data: taxonomy = {} } = useQuery({
        queryKey: ['taxonomy'],
        queryFn: () => productService.getTaxonomy(),
    });

    const { data: result, isLoading, error, refetch } = useQuery({
        queryKey: ['marketplace-products', debouncedSearch, parentCategory, subcategory, minPrice, maxPrice, page],
        queryFn: async () => {
            if (debouncedSearch) {
                const searchData = await productService.searchProducts({
                    q: debouncedSearch,
                    minPrice: minPrice ? Number(minPrice) * 1000 : undefined,
                    maxPrice: maxPrice ? Number(maxPrice) * 1000 : undefined,
                    parentCategory: parentCategory || undefined,
                    subcategory: subcategory || undefined,
                    source: 'user'
                });
                return {
                    data: searchData.results,
                    total: searchData.results.length,
                    page: 1,
                    totalPages: 1,
                    normalized: searchData.normalized
                };
            } else {
                const productsData = await productService.getProducts({
                    source: 'user',
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
            <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-black uppercase tracking-wider mb-4 border border-blue-100">
                    <Sparkles className="w-4 h-4" />
                    <span>Communauté ChoufPrix</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                    Le Marketplace <span className="gradient-text">Solidaire</span>
                </h2>
                <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
                    Découvrez les pépites dénichées et vendues par les membres de notre communauté. 
                    Des articles d'occasion ou neufs, de particulier à particulier.
                </p>
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
                        store=""
                        onStoreChange={() => {}}
                        stores={[]}
                        // Hide stores filter for marketplace
                    />

                    {error ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-[2.5rem] border border-red-100 px-6 text-center">
                            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                            <h3 className="text-xl font-bold text-red-900 mb-2">Une erreur est survenue</h3>
                            <p className="text-red-600 mb-6">Impossible de charger les annonces communautaires.</p>
                            <button
                                onClick={() => refetch()}
                                className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg hover:bg-red-700 transition-all"
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
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag className="w-12 h-12 text-gray-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucune annonce trouvée</h3>
                            <p className="text-gray-400 font-medium">Soyez le premier à ajouter un produit dans cette catégorie !</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
