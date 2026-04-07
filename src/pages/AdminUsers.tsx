import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { userService, type User } from '../api/userService';
import { productService } from '../api/productService';
import { 
    Users, Shield, Store, Loader2, AlertCircle, 
    User as UserIcon, UserPlus, Trash2, X, Sparkles, Key, Mail
} from 'lucide-react';

const AdminUsers: React.FC = () => {
    const { getToken } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [stores, setStores] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // New User Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user',
        assignedStore: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = await getToken();
            if (!token) return;

            const [usersData, storesData] = await Promise.all([
                userService.getUsers(token),
                productService.getStores()
            ]);

            setUsers(usersData);
            setStores(storesData);
        } catch (err) {
            setError('Impossible de charger les utilisateurs.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, role: string, assignedStore?: string | null) => {
        setUpdating(userId);
        try {
            const token = await getToken();
            if (!token) return;

            await userService.updateUserRole(userId, { role, assignedStore }, token);
            
            // Optimistic update
            setUsers(prev => prev.map(u => 
                u.id === userId ? { ...u, role: role as any, assignedStore: assignedStore || undefined } : u
            ));
        } catch (err) {
            alert('Erreur lors de la mise à jour du rôle.');
        } finally {
            setUpdating(null);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = await getToken();
            if (!token) return;

            const newUser = await userService.createUser(formData, token);
            setUsers(prev => [...prev, newUser]);
            setShowAddModal(false);
            setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user', assignedStore: '' });
        } catch (err) {
            alert('Erreur lors de la création de l\'utilisateur.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
            return;
        }

        setUpdating(userId);
        try {
            const token = await getToken();
            if (!token) return;

            await userService.deleteUser(userId, token);
            setUsers(prev => prev.filter(u => u.id !== userId));
        } catch (err) {
            alert('Erreur lors de la suppression.');
            console.error(err);
        } finally {
            setUpdating(null);
        }
    };

    if (loading && users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium tracking-tight">Chargement des utilisateurs...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Gestion des <span className="text-blue-600">Utilisateurs</span></h2>
                    <p className="text-gray-500 font-medium mt-1">Gérez les accès et assignez des sous-admins par magasin.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-2xl border border-blue-100 font-bold text-sm">
                        <Users className="w-5 h-5" />
                        <span>{users.length} Utilisateurs</span>
                    </div>
                    <button 
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Ajouter</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-700">
                    <AlertCircle className="w-8 h-8 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold">Erreur</h4>
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                </div>
            )}

            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <th className="px-8 py-5">Utilisateur</th>
                                <th className="px-8 py-5">Email</th>
                                <th className="px-8 py-5">Rôle</th>
                                <th className="px-8 py-5">Magasin Assigné</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user) => (
                                <tr key={user.id} className="group hover:bg-gray-50/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                <UserIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800 tracking-tight">
                                                    {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Sans nom'}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-mono">{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            user.role === 'admin' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                            user.role === 'sub-admin' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                            'bg-gray-100 text-gray-600 border border-gray-200'
                                        }`}>
                                            <Shield className="w-3 h-3" />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
                                            <Store className="w-4 h-4 text-gray-300" />
                                            {user.role === 'sub-admin' ? (
                                                <span className="text-blue-600">{user.assignedStore || 'Non assigné'}</span>
                                            ) : (
                                                <span className="text-gray-300 font-medium">Auto</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {updating === user.id ? (
                                                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                            ) : (
                                                <>
                                                    <select 
                                                        className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600/10 outline-none cursor-pointer"
                                                        value={user.role}
                                                        onChange={(e) => {
                                                            const newRole = e.target.value;
                                                            handleRoleChange(user.id, newRole, newRole === 'sub-admin' ? stores[0] : null);
                                                        }}
                                                    >
                                                        <option value="user">Utilisateur</option>
                                                        <option value="sub-admin">Sub-Admin</option>
                                                        <option value="admin">Admin</option>
                                                    </select>

                                                    {user.role === 'sub-admin' && (
                                                        <select 
                                                            className="px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs font-bold text-blue-700 focus:ring-2 focus:ring-blue-600/10 outline-none cursor-pointer"
                                                            value={user.assignedStore || ''}
                                                            onChange={(e) => handleRoleChange(user.id, 'sub-admin', e.target.value)}
                                                        >
                                                            {stores.map(store => (
                                                                <option key={store} value={store}>{store}</option>
                                                            ))}
                                                        </select>
                                                    )}

                                                    <button 
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                                                        title="Supprimer l'utilisateur"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                    <UserPlus className="w-6 h-6 text-blue-600" />
                                    Nouvel Utilisateur
                                </h3>
                                <p className="text-gray-500 font-medium text-sm mt-1">Créez un compte manuellement.</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Prénom</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 outline-none font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Nom</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 outline-none font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> Email
                                </label>
                                <input 
                                    required
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 outline-none font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                    <Key className="w-3 h-3" /> Mot de passe
                                </label>
                                <input 
                                    required
                                    type="password" 
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 outline-none font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Role</label>
                                    <select 
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 outline-none font-bold"
                                    >
                                        <option value="user">User</option>
                                        <option value="sub-admin">Sub-Admin</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                {formData.role === 'sub-admin' && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Magasin</label>
                                        <select 
                                            value={formData.assignedStore}
                                            onChange={(e) => setFormData({...formData, assignedStore: e.target.value})}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600/10 outline-none font-bold"
                                        >
                                            <option value="">Sélectionner</option>
                                            {stores.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span>Créer l'utilisateur</span>
                                        <Sparkles className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;

