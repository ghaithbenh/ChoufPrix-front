import React, { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Package, Loader2, Plus, Trash2, ExternalLink } from 'lucide-react';
import { productService } from '../api/productService';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';

const MyProducts: React.FC = () => {
    const { getToken, isSignedIn } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        if (!isSignedIn) {
            navigate('/');
            return;
        }
        fetchMyProducts();
    }, [isSignedIn]);

    const fetchMyProducts = async () => {
        try {
            const token = await getToken();
            if (!token) return;
            const data = await productService.getMyProducts(token);
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch my products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;
        
        setDeletingId(id);
        try {
            const token = await getToken();
            if (!token) return;
            await productService.deleteProduct(id, token);
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            console.error('Failed to delete product:', err);
            alert('Erreur lors de la suppression.');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-500 font-medium">Chargement de vos annonces...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Mes Annonces</h2>
                    <p className="text-gray-500 font-medium">Gérez les produits que vous avez mis en vente.</p>
                </div>
                <button
                    onClick={() => navigate('/add-product')}
                    className="flex items-center gap-2 px-6 py-4 bg-orange-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter un produit</span>
                </button>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6 premium-card">
                    <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center border border-gray-100">
                        <Package className="w-12 h-12 text-gray-300" />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">Vous n'avez pas encore d'annonces</h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                            Vendez vos articles d'occasion ou neufs en les ajoutant à la plateforme.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/add-product')}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95"
                    >
                        Créer ma première annonce
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div key={product._id} className="group premium-card p-6 flex flex-col h-full bg-white transition-all hover:shadow-2xl">
                            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-50 mb-4">
                                <img
                                    src={product.image || 'https://via.placeholder.com/300x300?text=No+Image'}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute top-3 left-3 px-3 py-1 bg-orange-100 text-orange-700 border border-orange-200 rounded-full text-[10px] font-black uppercase tracking-wider">
                                    Mon Annonce
                                </div>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    disabled={deletingId === product._id}
                                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur border border-red-100 text-red-500 rounded-xl shadow-sm hover:bg-red-50 transition-all disabled:opacity-50"
                                >
                                    {deletingId === product._id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            <div className="flex flex-col flex-1">
                                <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-blue-600 transition-colors leading-tight mb-2">
                                    {product.name}
                                </h3>
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-2.5 py-1 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg border border-gray-100 uppercase">
                                        {product.category}
                                    </span>
                                </div>

                                <div className="mt-auto pt-4 flex flex-col gap-3">
                                    <div className="flex items-end justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">Votre Prix</span>
                                            <span className="text-xl font-black text-gray-900 leading-none">{formatPrice(product.price)}</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        >
                                            <ExternalLink className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProducts;
