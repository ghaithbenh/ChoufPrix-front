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
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    return (
        <div 
            className="group premium-card animate-fade-up p-6 flex flex-col h-full cursor-pointer"
            onClick={onClick}
        >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 mb-4">
                <img 
                    src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'} 
                    alt={product.name}
                    className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                />
                <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border shadow-sm text-[10px] font-bold uppercase tracking-wider ${getStoreColor(product.store)}`}>
                    {product.store}
                </div>
            </div>

            <div className="flex flex-col flex-1 mt-2">
                <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors leading-tight mb-2">
                    {product.name}
                </h3>

                {product.category && (
                    <div className="flex items-center gap-1.5 mb-4">
                        <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-200 uppercase tracking-tight">
                            {product.category}
                        </span>
                    </div>
                )}
                
                <div className="mt-auto pt-4 flex flex-col gap-3">
                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Prix Actuel</span>
                            <span className="text-xl font-black text-gray-900 leading-none">{formatPrice(product.price)}</span>
                        </div>
                        <button 
                            className="p-2 rounded-xl bg-gray-50 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all transform active:scale-95 border border-transparent flex-shrink-0"
                            title="Historique"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <History className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <a 
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all transform active:scale-95 shadow-md hover:shadow-lg hover:shadow-orange-500/30 font-bold text-sm"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span>Voir sur le site</span>
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
