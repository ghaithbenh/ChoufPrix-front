import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../api/productService';
import ProductCard from './ProductCard';
import SkeletonCard from './SkeletonCard';
import { TrendingUp, ArrowRight } from 'lucide-react';

const TrendingProducts: React.FC = () => {
    const navigate = useNavigate();

    const { data: result, isLoading } = useQuery({
        queryKey: ['trending-products'],
        queryFn: () => productService.getProducts({ limit: 8, page: 1 }),
    });

    return (
        <section className="mt-16" id="trending-section">
            {/* Section header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-50 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Trending Products
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mt-0.5">
                            Popular picks across all categories
                        </p>
                    </div>
                </div>
                <Link
                    to="/search?q="
                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all"
                    id="view-all-link"
                >
                    View all
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Product grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : result?.data && result.data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {result.data.slice(0, 8).map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onClick={() => navigate(`/product/${product._id}`)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-gray-400 font-medium">
                    No products found yet.
                </div>
            )}
        </section>
    );
};

export default TrendingProducts;
