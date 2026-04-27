import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../api/productService';
import { TOP_CATEGORIES, ALL_CATEGORIES } from '../data/categories';
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
    
    // Fetch product counts per category
    const { data: productCounts = {} } = useQuery({
        queryKey: ['product-counts'],
        queryFn: () => productService.getProductCounts(),
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
                        const count = productCounts[cat.parentCategory] || 0;
                        return (
                            <CategoryCard
                                key={cat.slug}
                                category={cat}
                                productCount={count}
                                index={index}
                            />
                        );
                    })}
                </div>
            </section>

            {/* ──────────────── ALL CATEGORIES ──────────────── */}
            <section className="mb-16" id="all-categories-section">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            All Categories
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">
                            Explore our complete catalog
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {ALL_CATEGORIES.map((cat, index) => {
                        const count = productCounts[cat.parentCategory] || 0;
                        return (
                            <Link
                                key={cat.slug}
                                to={`/category/${cat.slug}`}
                                className="group flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 animate-stagger-in"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center text-2xl ${cat.bgLight} ${cat.textColor} group-hover:scale-110 transition-transform duration-300`}>
                                    {cat.icon}
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 text-center leading-tight mb-1">
                                    {cat.label}
                                </h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                    {count} produits
                                </p>
                            </Link>
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