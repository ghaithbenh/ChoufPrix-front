import React from 'react';
import {
    LayoutGrid,
    Smartphone,
    Monitor,
    Tv,
    Gamepad2,
    Laptop,
    ChefHat,
    Headphones,
    ChevronRight
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    icon: React.ElementType;
}

const categories: Category[] = [
    { id: '', name: 'Toutes les catégories', icon: LayoutGrid },
    { id: 'informatique', name: 'Informatique', icon: Monitor },
    { id: 'smartphone', name: 'Smartphones', icon: Smartphone },
    { id: 'laptop', name: 'PC Portables', icon: Laptop },
    { id: 'electromenager', name: 'Électroménager', icon: ChefHat },
    { id: 'tv', name: 'TV & Audio', icon: Tv },
    { id: 'audio', name: 'Accessoires & Audio', icon: Headphones },
    { id: 'gaming', name: 'Jeux Vidéo & Gaming', icon: Gamepad2 },
];

interface CategorySidebarProps {
    selectedCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
    selectedCategory,
    onCategoryChange
}) => {
    return (
        <aside className="w-full md:w-64 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-2">
                <div className="px-4 py-3 mb-2 border-b border-slate-50">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Catégories</h3>
                </div>
                <nav className="space-y-1">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        const isActive = selectedCategory === category.id;

                        return (
                            <button
                                key={category.id}
                                onClick={() => onCategoryChange(category.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${isActive
                                        ? 'bg-blue-50 text-blue-600 shadow-sm shadow-blue-100'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm'
                                        }`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-sm">{category.name}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Price Filter Mock (Optional extension later) */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hidden md:block">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Prix</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <span className="text-slate-400">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <button className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                        Appliquer
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default CategorySidebar;
