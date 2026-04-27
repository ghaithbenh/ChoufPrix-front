import { ExternalLink, History, Heart, ShoppingCart, TrendingDown } from 'lucide-react';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import type { Product } from '../types';
import { formatPrice } from '../lib/utils';
import { trackedItemsService } from '../api/trackedItemsService';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

const getStoreStyles = (store: string) => {
    const s = store.toLowerCase();
    if (s.includes('mytek')) return 'from-orange-400 to-orange-600 shadow-orange-200/50';
    if (s.includes('tunisianet')) return 'from-blue-500 to-blue-700 shadow-blue-200/50';
    if (s.includes('scoop')) return 'from-purple-500 to-purple-700 shadow-purple-200/50';
    return 'from-slate-600 to-slate-800 shadow-slate-200/50';
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    const { isSignedIn, getToken } = useAuth();
    const { openSignIn } = useClerk();
    const [isTracked, setIsTracked] = useState(false);
    const [trackLoading, setTrackLoading] = useState(false);

    useEffect(() => {
        if (isSignedIn) {
            checkIfTracked();
        }
    }, [isSignedIn]);

    const checkIfTracked = async () => {
        try {
            const token = await getToken();
            if (!token) return;
            const ids = await trackedItemsService.getTrackedProductIds(token);
            setIsTracked(ids.includes(product._id));
        } catch {
            // silently fail
        }
    };

    const handleTrackToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isSignedIn) {
            openSignIn();
            return;
        }

        setTrackLoading(true);
        try {
            const token = await getToken();
            if (!token) return;

            if (isTracked) {
                await trackedItemsService.untrackItem(token, product._id);
                setIsTracked(false);
            } else {
                await trackedItemsService.trackItem(token, product._id);
                setIsTracked(true);
            }
        } catch (err) {
            console.error('Track toggle failed:', err);
        } finally {
            setTrackLoading(false);
        }
    };

    const getGlowClass = (store: string) => {
        const s = store.toLowerCase();
        if (s.includes('mytek')) return 'glow-mytek';
        if (s.includes('tunisianet')) return 'glow-tunisianet';
        if (s.includes('scoop')) return 'glow-scoop';
        return 'shadow-slate-200/50';
    };

    return (
        <div 
            className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden p-5"
            onClick={onClick}
            style={{ perspective: '1000px' }}
        >
            {/* Image Container */}
            <div className={`relative aspect-square rounded-[1.5rem] bg-slate-50/50 border border-slate-100/50 overflow-hidden mb-5 transition-all duration-500 group-hover:bg-white group-hover:rotate-x-2 group-hover:rotate-y-1 ${getGlowClass(product.store)}`}>
                {/* Background Store Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getStoreStyles(product.store)} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
                
                {/* Shimmer on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 shimmer-effect pointer-events-none" />

                <img 
                    src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'} 
                    alt={product.name}
                    className="w-full h-full object-contain p-6 transition-all duration-700 group-hover:scale-110 group-hover:translate-z-10"
                    style={{ transformStyle: 'preserve-3d' }}
                />
                
                {/* Store Badge - Glassmorphism */}
                <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-xl backdrop-blur-md bg-gradient-to-br ${getStoreStyles(product.store)} text-white text-[9px] font-black uppercase tracking-widest shadow-lg border border-white/20 z-20`}>
                    {product.store}
                </div>

                {/* Tracking Action */}
                <button
                    onClick={handleTrackToggle}
                    disabled={trackLoading}
                    className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md border shadow-sm transition-all transform active:scale-90 z-20 ${
                        isTracked
                            ? 'bg-red-500 border-red-400 text-white shadow-red-200'
                            : 'bg-white/80 border-white text-slate-400 hover:text-red-500 hover:bg-white'
                    }`}
                >
                    <Heart className={`w-4 h-4 ${isTracked ? 'fill-current' : ''}`} />
                </button>

                {/* Quick Indicators */}
                {product.source === 'user' && (
                    <div className="absolute bottom-3 left-3 px-2 py-1 rounded-lg bg-blue-600/90 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-tighter shadow-sm border border-blue-400/30 z-20">
                        Communauté
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col flex-1">
                <div className="mb-2">
                    <span className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest mb-1 block">
                        {product.parentCategory || 'Produit'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 min-h-[2.5rem] leading-tight group-hover:text-blue-600 transition-colors font-outfit">
                        {product.name}
                    </h3>
                </div>

                <div className="mt-auto pt-4 flex flex-col gap-4">
                    {/* Price Section */}
                    <div className="flex items-end justify-between border-t border-slate-50 pt-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-tighter mb-0.5">
                                <TrendingDown className="w-3 h-3" />
                                Meilleur Prix
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-slate-900 leading-none tracking-tighter font-outfit">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-xs font-bold text-slate-400 font-outfit uppercase">TND</span>
                            </div>
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100"
                                onClick={(e) => e.stopPropagation()}
                                title="Historique"
                            >
                                <History className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    
                    {/* Primary Action */}
                    <a 
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-[1.25rem] bg-slate-900 text-white hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-200 font-black text-xs uppercase tracking-widest group/btn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span>Acheter</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover/btn:translate-x-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
