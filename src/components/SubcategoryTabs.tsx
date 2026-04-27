import React from 'react';

interface SubcategoryTabsProps {
    subcategories: string[];
    activeSubcategory: string;
    onSelect: (sub: string) => void;
    accentColor?: string;
}

const SubcategoryTabs: React.FC<SubcategoryTabsProps> = ({
    subcategories,
    activeSubcategory,
    onSelect,
    accentColor = 'blue',
}) => {
    const getActiveClasses = () => {
        const map: Record<string, string> = {
            blue: 'bg-blue-600 text-white shadow-lg shadow-blue-600/30',
            orange: 'bg-orange-500 text-white shadow-lg shadow-orange-500/30',
            pink: 'bg-pink-500 text-white shadow-lg shadow-pink-500/30',
            rose: 'bg-rose-500 text-white shadow-lg shadow-rose-500/30',
            gray: 'bg-slate-700 text-white shadow-lg shadow-slate-700/30',
            teal: 'bg-teal-500 text-white shadow-lg shadow-teal-500/30',
        };
        return map[accentColor] || map.blue;
    };

    return (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1" id="subcategory-tabs">
            {/* "All" tab */}
            <button
                onClick={() => onSelect('')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                    activeSubcategory === ''
                        ? getActiveClasses()
                        : 'text-gray-500 bg-white border border-gray-100 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
                All
            </button>

            {subcategories.map((sub) => (
                <button
                    key={sub}
                    onClick={() => onSelect(sub)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-shrink-0 ${
                        activeSubcategory === sub
                            ? getActiveClasses()
                            : 'text-gray-500 bg-white border border-gray-100 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                >
                    {sub}
                </button>
            ))}
        </div>
    );
};

export default SubcategoryTabs;
