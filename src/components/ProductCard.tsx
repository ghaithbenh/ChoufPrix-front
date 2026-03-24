import { ExternalLink, History } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice } from '../lib/utils';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

const getStoreColor = (store: string) => {
    switch (store.toLowerCase()) {
        case 'mytek': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'tunisianet': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'scoop': return 'bg-purple-100 text-purple-700 border-purple-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    return (
        <div 
            className="group relative bg-white rounded-3xl border border-slate-100 p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 cursor-pointer flex flex-col h-full"
            onClick={onClick}
        >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 mb-4">
                <img 
                    src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'} 
                    alt={product.name}
                    className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border shadow-sm text-[10px] font-bold uppercase tracking-wider ${getStoreColor(product.store)}`}>
                    {product.store}
                </div>
            </div>

            <div className="flex flex-col flex-1">
                <h3 className="font-bold text-slate-800 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors leading-tight mb-2">
                    {product.name}
                </h3>

                {product.category && (
                    <div className="flex items-center gap-1.5 mb-4">
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-400 text-[10px] font-bold rounded-lg border border-slate-100 uppercase tracking-tight">
                            {product.category}
                        </span>
                    </div>
                )}
                
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Prix Actuel</span>
                        <span className="text-xl font-black text-slate-900">{formatPrice(product.price)}</span>
                    </div>
                    
                    <div className="flex gap-2">
                         <button 
                            className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all transform active:scale-95 border border-transparent hover:border-blue-100"
                            title="Historique"
                        >
                            <History className="w-5 h-5" />
                        </button>
                        <a 
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all transform active:scale-95 shadow-lg shadow-slate-200"
                            onClick={(e) => e.stopPropagation()}
                            title="Voir sur le site"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
