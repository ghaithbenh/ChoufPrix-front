import React from 'react';
import { Link } from 'react-router-dom';
import type { TopCategory } from '../data/categories';

interface CategoryCardProps {
    category: TopCategory;
    productCount?: number;
    index: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, productCount, index }) => {
    return (
        <Link
            to={`/category/${category.slug}`}
            className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-stagger-in"
            style={{ animationDelay: `${index * 80}ms` }}
            id={`category-card-${category.slug}`}
        >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl group-hover:scale-150 transition-transform duration-700" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between min-h-[180px] sm:min-h-[200px]">
                <div>
                    {/* Icon */}
                    <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-500 drop-shadow-sm">
                        {category.icon}
                    </div>

                    {/* Label */}
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-tight tracking-tight">
                        {category.label}
                    </h3>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4">
                    {productCount !== undefined && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-xs font-bold">
                            {productCount} produits
                        </span>
                    )}
                    <div className="ml-auto flex items-center gap-1 text-white/70 text-sm font-medium group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
                        <span className="hidden sm:inline">Explorer</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
