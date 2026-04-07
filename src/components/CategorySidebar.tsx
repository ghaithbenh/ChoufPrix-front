import React, { useState } from 'react';
import {
    LayoutGrid,
    Search,
    ChevronRight,
    ChevronDown,
    Folder,
    Tag
} from 'lucide-react';

interface CategorySidebarProps {
    taxonomy: Record<string, string[]>;
    selectedParentCategory: string;
    selectedSubcategory: string;
    onCategoryChange: (parentCategory: string, subcategory: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
    taxonomy,
    selectedParentCategory,
    selectedSubcategory,
    onCategoryChange
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});

    const toggleParent = (parent: string) => {
        setExpandedParents(prev => ({
            ...prev,
            [parent]: !prev[parent]
        }));
    };

    // Filter taxonomy by search term
    const entries = Object.entries(taxonomy);
    const filteredTaxonomy: Record<string, string[]> = {};
    let totalCategories = 0;

    entries.forEach(([parent, subs]) => {
        const parentMatches = parent.toLowerCase().includes(searchTerm.toLowerCase());
        const matchingSubs = subs.filter(sub => sub.toLowerCase().includes(searchTerm.toLowerCase()));

        if (parentMatches || matchingSubs.length > 0) {
            filteredTaxonomy[parent] = parentMatches ? subs : matchingSubs;
            totalCategories += 1 + filteredTaxonomy[parent].length;
        }
    });

    return (
        <aside className="w-full md:w-72 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-24 transition-colors duration-300">
                <div className="p-6 border-b border-gray-50 transition-colors duration-300">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Catégories</h3>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filtrer..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm font-bold text-gray-800 focus:ring-2 focus:ring-blue-600/10 placeholder:text-gray-400 transition-colors duration-300"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                // Expand all when searching
                                if (e.target.value) {
                                    const allExpanded: Record<string, boolean> = {};
                                    Object.keys(taxonomy).forEach(p => allExpanded[p] = true);
                                    setExpandedParents(allExpanded);
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
                    <ul className="space-y-1">
                        <li>
                            <button
                                onClick={() => onCategoryChange('', '')}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${!selectedParentCategory && !selectedSubcategory
                                    ? 'bg-gray-900 text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl transition-all ${!selectedParentCategory && !selectedSubcategory ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white'}`}>
                                        <LayoutGrid className="w-4 h-4" />
                                    </div>
                                    <span className="font-bold text-sm">Toutes les catégories</span>
                                </div>
                                {!selectedParentCategory && !selectedSubcategory && <ChevronRight className="w-4 h-4" />}
                            </button>
                        </li>

                        {Object.entries(filteredTaxonomy).map(([parent, subs]) => {
                            const isExpanded = expandedParents[parent] || searchTerm.length > 0 || selectedParentCategory === parent;
                            const isParentSelected = selectedParentCategory === parent && !selectedSubcategory;

                            return (
                                <li key={parent} className="space-y-1">
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => onCategoryChange(parent, '')}
                                            className={`flex-1 flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${isParentSelected
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                                : selectedParentCategory === parent
                                                    ? 'bg-blue-600/10 text-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl transition-all ${isParentSelected ? 'bg-blue-600 text-white' : selectedParentCategory === parent ? 'bg-blue-600/10 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-white'}`}>
                                                    <Folder className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-sm text-left line-clamp-1">{parent}</span>
                                            </div>
                                            {isParentSelected && <ChevronRight className="w-4 h-4" />}
                                        </button>

                                        {subs.length > 0 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleParent(parent);
                                                }}
                                                className={`p-3 rounded-2xl transition-all flex items-center justify-center ${isParentSelected ? 'text-white hover:bg-white/20' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'}`}
                                            >
                                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </button>
                                        )}
                                    </div>

                                    {isExpanded && subs.length > 0 && (
                                        <ul className="pl-0 pr-1 py-1 space-y-1 relative before:absolute before:left-6 before:top-0 before:bottom-4 before:w-px before:bg-gray-100">
                                            {subs.map(sub => {
                                                const isSelected = selectedParentCategory === parent && selectedSubcategory === sub;
                                                return (
                                                    <li key={sub} className="relative">
                                                        <div className="absolute left-6 top-1/2 -mt-px w-3 h-px bg-gray-100" />
                                                        <button
                                                            onClick={() => onCategoryChange(parent, sub)}
                                                            className={`w-full flex items-center justify-between pl-11 pr-4 py-2 rounded-xl transition-all group text-sm ${isSelected
                                                                ? 'bg-blue-600/10 text-blue-600 font-bold'
                                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
                                                                }`}
                                                        >
                                                            <span className="text-left line-clamp-1">{sub}</span>
                                                            {isSelected && <Tag className="w-3 h-3 flex-shrink-0 ml-2" />}
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 italic text-[10px] text-gray-400 text-center font-bold uppercase tracking-tighter transition-colors duration-300">
                    {totalCategories} éléments trouvés
                </div>
            </div>
        </aside>
    );
};

export default CategorySidebar;
