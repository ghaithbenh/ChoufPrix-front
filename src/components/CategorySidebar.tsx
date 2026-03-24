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
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-24">
                <div className="p-6 border-b border-slate-50">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Catégories</h3>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Filtrer..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 placeholder:text-slate-400"
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
                                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl transition-all ${!selectedParentCategory && !selectedSubcategory ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}`}>
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
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                                    : selectedParentCategory === parent 
                                                        ? 'bg-blue-50 text-blue-900' 
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-xl transition-all ${isParentSelected ? 'bg-blue-500 text-white' : selectedParentCategory === parent ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500 group-hover:bg-white'}`}>
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
                                                className={`p-3 rounded-2xl transition-all flex items-center justify-center ${isParentSelected ? 'text-white hover:bg-blue-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                                            >
                                                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </button>
                                        )}
                                    </div>
                                    
                                    {isExpanded && subs.length > 0 && (
                                        <ul className="pl-4 pr-1 py-1 space-y-1 relative before:absolute before:left-6 before:top-0 before:bottom-4 before:w-px before:bg-slate-100">
                                            {subs.map(sub => {
                                                const isSelected = selectedParentCategory === parent && selectedSubcategory === sub;
                                                return (
                                                    <li key={sub} className="relative">
                                                        <div className="absolute left-2 top-1/2 -mt-px w-3 h-px bg-slate-100" />
                                                        <button
                                                            onClick={() => onCategoryChange(parent, sub)}
                                                            className={`w-full flex items-center justify-between pl-8 pr-4 py-2 rounded-xl transition-all group text-sm ${isSelected
                                                                    ? 'bg-blue-50 text-blue-700 font-bold'
                                                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
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
                
                <div className="p-4 bg-slate-50 border-t border-slate-100 italic text-[10px] text-slate-400 text-center font-bold uppercase tracking-tighter">
                    {totalCategories} éléments trouvés
                </div>
            </div>
        </aside>
    );
};

export default CategorySidebar;
