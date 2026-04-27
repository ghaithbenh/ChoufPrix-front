import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
    ExternalLink, ShieldCheck, Clock, History, ArrowLeft, 
    TrendingDown, TrendingUp, Share2, Heart, Info,
    CheckCircle2, AlertTriangle, Truck, RotateCcw, 
    ShoppingBag, ChevronRight, Star
} from 'lucide-react';
import { productService } from '../api/productService';
import { formatPrice, formatDate } from '../lib/utils';
import PriceTrendChart from '../components/PriceTrendChart';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'store'>('overview');

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

    const { data: similarProducts = [] } = useQuery({
        queryKey: ['similar-products', product?.parentCategory, id],
        queryFn: async () => {
            if (!product?.parentCategory) return [];
            const result = await productService.getProductsByCategory({
                parentCategory: product.parentCategory,
                limit: 5,
            });
            return result.data.filter(p => p._id !== id).slice(0, 4);
        },
        enabled: !!product?.parentCategory,
    });

    if (productLoading || historyLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm animate-pulse">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6" />
                    <p className="text-slate-500 font-bold text-xl font-outfit">Analyse des prix en cours...</p>
                </div>
            </div>
        );
    }

    if (!product) return (
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">Produit non trouvé</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">Le produit que vous recherchez n'existe plus ou a été retiré de notre catalogue.</p>
            <button 
                onClick={() => navigate('/')} 
                className="px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
                Retour à l'accueil
            </button>
        </div>
    );

    const latestPrice = history[history.length - 1]?.price || product.price;
    const previousPrice = history[history.length - 2]?.price || latestPrice;
    const priceDiff = latestPrice - previousPrice;
    const isPriceDrop = priceDiff < 0;

    const getStoreBadgeColor = (store: string) => {
        const s = store.toLowerCase();
        if (s.includes('mytek')) return 'bg-orange-500';
        if (s.includes('tunisianet')) return 'bg-blue-600';
        if (s.includes('scoop')) return 'bg-purple-600';
        return 'bg-slate-800';
    };

    const getGlowClass = (store: string) => {
        const s = store.toLowerCase();
        if (s.includes('mytek')) return 'glow-mytek';
        if (s.includes('tunisianet')) return 'glow-tunisianet';
        if (s.includes('scoop')) return 'glow-scoop';
        return 'shadow-slate-200/40';
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Breadcrumb & Navigation */}
            <div className="flex items-center justify-between mb-8">
                <nav className="flex items-center gap-2 text-sm font-bold text-slate-400">
                    <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">Accueil</button>
                    <ChevronRight className="w-4 h-4" />
                    <button onClick={() => navigate(`/category/${product.parentCategory?.toLowerCase()}`)} className="hover:text-blue-600 transition-colors capitalize">
                        {product.parentCategory}
                    </button>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
                </nav>
                
                <div className="flex items-center gap-3">
                    <button className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-red-500 transition-all">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-blue-600 transition-all">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ──────────────── LEFT SIDE: VISUALS ──────────────── */}
                <div className="lg:col-span-6 xl:col-span-5 flex flex-col gap-6">
                    {/* Main Image Card */}
                    <div 
                        className={`relative bg-white rounded-[3rem] border border-slate-100 p-8 sm:p-12 shadow-2xl transition-all duration-500 overflow-hidden group ${getGlowClass(product.store)}`}
                        style={{ perspective: '1200px' }}
                    >
                        {/* Decorative Background Elements */}
                        <div className={`absolute top-0 right-0 w-64 h-64 ${getStoreBadgeColor(product.store)} opacity-[0.03] rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl group-hover:opacity-[0.05] transition-opacity`} />
                        
                        {/* Shimmer on Hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 shimmer-effect pointer-events-none" />

                        <div 
                            className="relative z-10 aspect-square flex items-center justify-center transition-all duration-500 group-hover:rotate-x-2 group-hover:rotate-y-1"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <img 
                                src={product.image || 'https://via.placeholder.com/600x600?text=No+Image'} 
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply transition-all duration-700 group-hover:scale-110 group-hover:translate-z-20"
                            />
                        </div>

                        {/* Badges Overlay */}
                        <div className="absolute top-8 left-8 flex flex-col gap-2 z-20">
                            <div className={`px-4 py-2 rounded-2xl text-white font-black text-[10px] uppercase tracking-widest shadow-lg ${getStoreBadgeColor(product.store)}`}>
                                {product.store}
                            </div>
                            {isPriceDrop && (
                                <div className="px-4 py-2 rounded-2xl bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                                    <TrendingDown className="w-3 h-3" />
                                    Baisse de prix
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Trust Banner */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <Truck className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Livraison Rapide</span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Vendeur Vérifié</span>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 flex flex-col items-center text-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <RotateCcw className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Meilleur Deal</span>
                        </div>
                    </div>
                </div>

                {/* ──────────────── RIGHT SIDE: DETAILS ──────────────── */}
                <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6">
                    {/* Main Info Card */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 p-8 sm:p-10 shadow-sm relative overflow-hidden">
                        {/* Status Bar */}
                        <div className="flex flex-wrap items-center gap-4 mb-8">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-black border border-emerald-100/50 uppercase">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                En Stock
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 text-slate-500 text-xs font-bold border border-slate-100 uppercase">
                                <Clock className="w-3.5 h-3.5" />
                                Mis à jour: {formatDate(product.lastUpdated)}
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                                ))}
                                <span className="text-xs font-bold text-slate-400">(4.0)</span>
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight font-outfit text-gradient-blue">
                            {product.name}
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-10 pb-10 border-b border-slate-50">
                            <div className="flex flex-col gap-1">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] mb-1">Meilleure Offre</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter font-outfit">
                                        {formatPrice(product.price)}
                                    </span>
                                    <span className="text-2xl font-bold text-slate-300 font-outfit">TND</span>
                                </div>
                            </div>

                            {priceDiff !== 0 && (
                                <div className={`mb-3 flex items-center gap-2 px-5 py-3 rounded-[1.25rem] font-black text-sm border shadow-xl ${
                                    isPriceDrop 
                                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-200/50' 
                                        : 'bg-red-500 text-white border-red-400 shadow-red-200/50'
                                }`}>
                                    {isPriceDrop ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                                    {isPriceDrop ? 'BAISSE DE ' : 'HAUSSE DE '}
                                    {formatPrice(Math.abs(priceDiff))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <a 
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-5 bg-slate-900 text-white rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 hover:shadow-blue-200 transform active:scale-[0.98] group"
                            >
                                <ShoppingBag className="w-6 h-6 group-hover:animate-bounce" />
                                Acheter chez {product.store}
                                <ExternalLink className="w-5 h-5 opacity-50" />
                            </a>
                        </div>

                        {/* Tabs */}
                        <div className="flex items-center gap-8 border-b border-slate-100 mb-6">
                            {(['overview', 'history', 'store'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                                        activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {tab === 'overview' ? 'Aperçu' : tab === 'history' ? 'Historique' : 'Magasin'}
                                    {activeTab === tab && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="min-h-[150px]">
                            {activeTab === 'overview' && (
                                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                                    <p className="text-slate-600 leading-relaxed font-medium mb-6">
                                        {product.description || `Retrouvez le ${product.name} au meilleur prix chez ${product.store}. Comparez l'évolution des prix sur ChoufPrix pour acheter au meilleur moment.`}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Catégorie</span>
                                            <span className="text-sm font-bold text-slate-900 capitalize">{product.category || 'Non spécifié'}</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Marque</span>
                                            <span className="text-sm font-bold text-slate-900">Disponible chez {product.store}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-black text-slate-900">Evolution du prix</h3>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">
                                            <Info className="w-3 h-3" />
                                            Derniers 30 jours
                                        </div>
                                    </div>
                                    <div className="h-[250px] w-full bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                                        <PriceTrendChart data={history} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'store' && (
                                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-16 h-16 rounded-2xl ${getStoreBadgeColor(product.store)} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                                            {product.store.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">{product.store}</h3>
                                            <p className="text-slate-500 font-medium text-sm">Boutique partenaire vérifiée</p>
                                        </div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {product.store} est l'un des leaders de la distribution en Tunisie. Profitez des meilleures garanties et du SAV officiel en achetant via ChoufPrix.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Price History Card - Desktop Secondary */}
                    {activeTab !== 'history' && (
                        <div className="bg-white rounded-[3rem] border border-slate-100 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-emerald-500" />
                                    Pourquoi acheter maintenant ?
                                </h3>
                            </div>
                            <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100">
                                <p className="text-emerald-800 text-sm font-bold leading-relaxed">
                                    {isPriceDrop 
                                        ? `Le prix a baissé de ${formatPrice(Math.abs(priceDiff))} récemment. C'est une excellente opportunité d'achat !`
                                        : "Le prix est actuellement stable. ChoufPrix surveille les baisses pour vous alerter en temps réel."
                                    }
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ──────────────── BOTTOM SECTION: SIMILAR PRODUCTS ──────────────── */}
            <div className="mt-20">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Produits similaires</h2>
                        <p className="text-slate-500 font-medium">Découvrez d'autres offres dans la catégorie <span className="text-blue-600 capitalize">{product.parentCategory}</span></p>
                    </div>
                    <button 
                        onClick={() => navigate(`/category/${product.parentCategory?.toLowerCase()}`)}
                        className="group flex items-center gap-2 text-blue-600 font-black text-sm uppercase tracking-widest hover:translate-x-1 transition-all"
                    >
                        Tout voir
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {similarProducts.length > 0 ? (
                        similarProducts.map((p) => (
                            <ProductCard 
                                key={p._id} 
                                product={p} 
                                onClick={() => {
                                    navigate(`/product/${p._id}`);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }} 
                            />
                        ))
                    ) : (
                        [...Array(4)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;

