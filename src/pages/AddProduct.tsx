import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, Loader2, Image as ImageIcon, Sparkles, Tag, DollarSign, AlignLeft } from 'lucide-react';
import { productService } from '../api/productService';

const AddProduct: React.FC = () => {
    const { getToken, isSignedIn } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [taxonomy, setTaxonomy] = useState<Record<string, string[]>>({});
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        parentCategory: '',
        subcategory: '',
        image: '',
        description: '',
        store: 'Communauté'
    });

    useEffect(() => {
        if (!isSignedIn) {
            navigate('/');
            return;
        }
        fetchTaxonomy();
    }, [isSignedIn]);

    const fetchTaxonomy = async () => {
        try {
            const data = await productService.getTaxonomy();
            setTaxonomy(data);
        } catch (err) {
            console.error('Failed to fetch taxonomy:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = await getToken();
            if (!token) return;

            await productService.createProduct({
                ...formData,
                price: Number(formData.price),
                category: formData.subcategory // Using subcategory as the display category
            }, token);

            navigate('/my-products');
        } catch (err) {
            console.error('Failed to create product:', err);
            alert('Une erreur est survenue lors de la création du produit.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Reset subcategory if parent category changes
            ...(name === 'parentCategory' ? { subcategory: '' } : {})
        }));
    };

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-orange-200 mb-6">
                    <PackagePlus className="w-6 h-6" />
                    <span className="font-black text-lg">Ajouter un produit</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2">Vendez votre article</h2>
                <p className="text-gray-500 font-medium">Remplissez les détails ci-dessous pour publier votre annonce sur ChoufPrix.</p>
            </div>

            <form onSubmit={handleSubmit} className="premium-card p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Nom du produit */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                            <Tag className="w-4 h-4 text-blue-600" />
                            Nom du produit
                        </label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="ex: iPhone 15 Pro Max 256GB"
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                        />
                    </div>

                    {/* Prix */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            Prix (TND)
                        </label>
                        <input
                            required
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.000"
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                        />
                    </div>

                    {/* URL de l'image */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                            <ImageIcon className="w-4 h-4 text-blue-600" />
                            URL de l'image
                        </label>
                        <input
                            required
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                        />
                    </div>

                    {/* Catégorie Parente */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            Catégorie
                        </label>
                        <select
                            required
                            name="parentCategory"
                            value={formData.parentCategory}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium appearance-none"
                        >
                            <option value="">Sélectionner</option>
                            {Object.keys(taxonomy).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sous-catégorie */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                            <Tag className="w-4 h-4 text-blue-600" />
                            Sous-catégorie
                        </label>
                        <select
                            required
                            name="subcategory"
                            value={formData.subcategory}
                            onChange={handleChange}
                            disabled={!formData.parentCategory}
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium appearance-none disabled:opacity-50"
                        >
                            <option value="">Sélectionner</option>
                            {(taxonomy[formData.parentCategory] || []).map(sub => (
                                <option key={sub} value={sub}>{sub}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 ml-1">
                            <AlignLeft className="w-4 h-4 text-blue-600" />
                            Description
                        </label>
                        <textarea
                            required
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Décrivez votre article (état, garantie, accessoires inclus...)"
                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium resize-none"
                        ></textarea>
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 py-4 px-6 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-[2] py-4 px-6 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Publier l'annonce</span>
                                <Sparkles className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;
