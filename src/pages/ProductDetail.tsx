import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, ShieldCheck, Clock, History, ArrowLeft, TrendingDown, TrendingUp } from 'lucide-react';
import { productService } from '../api/productService';
import { formatPrice, formatDate } from '../lib/utils';
import PriceTrendChart from '../components/PriceTrendChart';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: product, isLoading: productLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProductById(id!),
        enabled: !!id,
    });

    const { data: history = [], isLoading: historyLoading } = useQuery({
        queryKey: ['history', id],
        queryFn: () => productService.getPriceHistory(id!),
        enabled: !!id,
    });

    if (productLoading || historyLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm animate-pulse">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6" />
                <p className="text-slate-500 font-bold text-xl">Analyse des prix en cours...</p>
            </div>
        );
    }

    if (!product) return (
        <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-slate-800">Produit non trouvé</h2>
            <button onClick={() => navigate('/')} className="mt-4 text-blue-600 font-bold hover:underline">Retour à l'accueil</button>
        </div>
    );

    const latestPrice = history[history.length - 1]?.price;
    const previousPrice = history[history.length - 2]?.price;
    const priceDiff = latestPrice && previousPrice ? latestPrice - previousPrice : 0;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <button 
                onClick={() => navigate(-1)}
                className="group mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-lg"
            >
                <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm group-hover:bg-slate-50 transition-all">
                    <ArrowLeft className="w-5 h-5" />
                </div>
                Retour
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Image Card */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 shadow-2xl shadow-slate-200/50 sticky top-24">
                        <div className="relative aspect-square">
                            <img 
                                src={product.image || 'https://via.placeholder.com/600x600?text=No+Image'} 
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                            <div className="absolute top-0 right-0">
                                <span className={`px-4 py-2 rounded-2xl border shadow-lg font-black text-xs uppercase tracking-widest ${
                                    product.store.toLowerCase() === 'mytek' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                    product.store.toLowerCase() === 'tunisianet' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                    'bg-purple-100 text-purple-700 border-purple-200'
                                }`}>
                                    {product.store}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Info & Chart */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-black bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                                <ShieldCheck className="w-4 h-4" />
                                DISPONIBLE
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                <Clock className="w-4 h-4" />
                                {formatDate(product.lastUpdated)}
                            </div>
                            {product.category && (
                                <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-tight">
                                    {product.category}
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl font-black text-slate-900 mb-4 leading-[1.1]">
                            {product.name}
                        </h1>
                        
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-50">
                            <div className="flex flex-col">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Meilleur Prix</span>
                                <span className="text-5xl font-black text-slate-900 tracking-tight">{formatPrice(product.price)}</span>
                            </div>

                            {priceDiff !== 0 && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm border ${
                                    priceDiff < 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                    {priceDiff < 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                                    {formatPrice(Math.abs(priceDiff))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <a 
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-300 transform active:scale-[0.98]"
                            >
                                <ExternalLink className="w-6 h-6" />
                                Acheter chez {product.store}
                            </a>
                            <p className="text-center text-slate-400 text-sm font-medium">
                                * Le prix peut varier selon les stocks du magasin.
                            </p>
                        </div>
                    </div>

                    {/* Chart Card */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                    <History className="w-6 h-6 text-blue-600" />
                                    Evolution du prix
                                </h3>
                                <p className="text-slate-400 text-sm font-medium mt-1">Historique des 30 derniers jours</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                    <span className="text-xs font-bold text-slate-600">Prix (DT)</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="h-[300px] w-full">
                            <PriceTrendChart data={history} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
