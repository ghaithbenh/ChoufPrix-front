import React, { useEffect, useState } from 'react';
import { X, ExternalLink, ShieldCheck, Clock, History } from 'lucide-react';
import type { Product, PriceHistory } from '../types';
import { productService } from '../api/productService';
import { formatPrice, formatDate } from '../lib/utils';
import PriceTrendChart from './PriceTrendChart';

interface ProductDetailsProps {
    productId: string;
    onClose: () => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onClose }) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [history, setHistory] = useState<PriceHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const [p, h] = await Promise.all([
                    productService.getProductById(productId),
                    productService.getPriceHistory(productId)
                ]);
                setProduct(p);
                setHistory(h);
            } catch (error) {
                console.error("Failed to load product details", error);
            } finally {
                setLoading(false);
            }
        };
        loadDetails();
    }, [productId]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                <div className="bg-white p-8 rounded-3xl shadow-2xl animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-slate-600 font-medium">Chargement des détails...</p>
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
            
            <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left: Product Image */}
                <div className="md:w-2/5 bg-slate-50 p-8 flex items-center justify-center">
                    <img 
                        src={product.image} 
                        alt={product.name}
                        className="max-h-80 object-contain mix-blend-multiply"
                    />
                </div>

                {/* Right: Product Info & Chart */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                            {product.store}
                        </span>
                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Produit Vérifié
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">
                        {product.name}
                    </h2>
                    
                    <div className="flex items-baseline gap-4 mb-8">
                        <span className="text-4xl font-black text-slate-900">{formatPrice(product.price)}</span>
                        <div className="flex items-center gap-1 text-slate-400 text-sm">
                            <Clock className="w-4 h-4" />
                            Mis à jour le {formatDate(product.lastUpdated)}
                        </div>
                    </div>

                    <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <History className="w-5 h-5 text-blue-600" />
                                Historique des prix
                            </h3>
                            <div className="text-xs text-slate-500 font-medium">Evolution sur les 30 derniers jours</div>
                        </div>
                        <PriceTrendChart data={history} />
                    </div>

                    <div className="flex gap-4">
                        <a 
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg active:scale-[0.98]"
                        >
                            <ExternalLink className="w-5 h-5" />
                            Voir sur {product.store}
                        </a>
                        <button 
                            onClick={onClose}
                            className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
                        >
                            Retour
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
