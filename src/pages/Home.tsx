import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../api/productService';
import { TOP_CATEGORIES } from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import HeroSearch from '../components/HeroSearch';
import TrendingProducts from '../components/TrendingProducts';
import HeroScene from '../components/HeroScene';

const Home: React.FC = () => {
    // Fetch taxonomy to get subcategory counts per parent
    const { data: taxonomy = {} } = useQuery({
        queryKey: ['taxonomy'],
        queryFn: () => productService.getTaxonomy(),
    });

    return (
        <div className="animate-in fade-in duration-700">
            {/* ──────────────── HERO SECTION ──────────────── */}
            <section className="flex flex-col items-center justify-center text-center mb-16 pt-4" id="hero-section">
                {/* 3D Scene */}
                <div className="flex-shrink-0 w-full flex justify-center mb-4">
                    <HeroScene />
                </div>

                {/* Hero title */}
                <div className="max-w-3xl px-4 mb-8">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-tight mb-4">
                        Find the best price in{' '}
                        <span className="gradient-text">Tunisia</span>{' '}
                        <span className="inline-block animate-bounce">🇹🇳</span>
                    </h1>
                    <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto">
                        Compare prices across 100+ Tunisian stores. Find the best deals on tech, fashion, home, and more.
                    </p>
                </div>

                {/* Search bar */}
                <HeroSearch />
            </section>

            {/* ──────────────── CATEGORY GRID ──────────────── */}
            <section className="mb-16" id="categories-section">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Browse Categories
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            Choose a category to start comparing prices
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {TOP_CATEGORIES.map((cat, index) => {
                        // Count subcategories for this parent
                        const subcategories = taxonomy[cat.parentCategory] || [];
                        return (
                            <CategoryCard
                                key={cat.slug}
                                category={cat}
                                productCount={subcategories.length}
                                index={index}
                            />
                        );
                    })}
                </div>
            </section>

            {/* ──────────────── TRENDING PRODUCTS ──────────────── */}
            <TrendingProducts />
        </div>
    );
};

export default Home;