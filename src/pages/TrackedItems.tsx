import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Heart, Loader2, PackageX, Trash2, ExternalLink } from 'lucide-react';
import { trackedItemsService } from '../api/trackedItemsService';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';

interface TrackedItemResponse {
    _id: string;
    clerkUserId: string;
    productId: Product;
    createdAt: string;
}

const TrackedItems: React.FC = () => {
    const { getToken, isSignedIn } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState<TrackedItemResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        if (!isSignedIn) {
            navigate('/');
            return;
        }
        fetchItems();
    }, [isSignedIn]);

    const fetchItems = async () => {
        try {
            const token = await getToken();
            if (!token) return;
            const data = await trackedItemsService.getTrackedItems(token);
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch tracked items:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId: string) => {
        setRemovingId(productId);
        try {
            const token = await getToken();
            if (!token) return;
            await trackedItemsService.untrackItem(token, productId);
            setItems((prev) => prev.filter((item) => item.productId._id !== productId));
        } catch (err) {
            console.error('Failed to untrack item:', err);
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium">Chargement de vos articles suivis...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            {/* Header */}
            <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-blue-200 mb-6">
                    <Heart className="w-6 h-6" />
                    <span className="font-black text-lg">Mes Articles Suivis</span>
                </div>
                <p className="text-gray-500 font-medium max-w-md mx-auto">
                    Retrouvez ici tous les produits que vous avez ajoutés à votre liste de suivi.
                </p>
            </div>

            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100">
                        <PackageX className="w-12 h-12 text-gray-300" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Aucun article suivi</h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                            Parcourez les produits et cliquez sur le bouton ❤️ pour commencer à suivre les prix.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95"
                    >
                        Parcourir les produits
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => {
                        const product = item.productId;
                        if (!product) return null;
                        
                        return (
                            <div
                                key={item._id}
                                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                            >
                                {/* Image */}
                                <div
                                    className="relative aspect-square bg-white border-b border-gray-50 cursor-pointer"
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    <img
                                        src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                                        alt={product.name}
                                        className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shadow-sm text-[10px] font-bold uppercase tracking-wider">
                                        {product.store}
                                    </div>
                                    {/* Remove button overlay */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(product._id);
                                        }}
                                        disabled={removingId === product._id}
                                        className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 backdrop-blur border border-gray-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm disabled:opacity-50"
                                        title="Retirer du suivi"
                                    >
                                        {removingId === product._id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3
                                        className="font-bold text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors leading-tight mb-3 cursor-pointer"
                                        onClick={() => navigate(`/product/${product._id}`)}
                                    >
                                        {product.name}
                                    </h3>

                                    <div className="mt-auto pt-3 flex flex-col gap-3">
                                        <div className="flex items-end justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Prix Actuel</span>
                                                <span className="text-xl font-black text-gray-900 leading-none">{formatPrice(product.price)}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                Suivi depuis {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
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
                    })}
                </div>
            )}
        </div>
    );
};

export default TrackedItems;
