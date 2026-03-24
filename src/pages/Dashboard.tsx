import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { io } from 'socket.io-client';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
    ShoppingBag, Store, Clock, PlusCircle, Activity,
    CheckCircle2, XCircle, Loader2, TrendingUp, DollarSign
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';
const SOCKET_URL = 'http://localhost:3001';

interface Stats {
    totalProducts: number;
    totalStores: number;
    byStore: { name: string; value: number }[];
    priceRanges: { range: string; count: number }[];
    recentlyUpdated: any[];
    scraperStatus: any[];
    addedToday: number;
    lastScrapeTime: number | null;
}

const getStoreColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash % 360);
    return `hsl(${h}, 70%, 55%)`;
};

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);

    const { data: initialStats, isLoading, isError } = useQuery({
        queryKey: ['stats'],
        queryFn: async () => {
            const response = await axios.get(`${API_URL}/products/stats`);
            return response.data;
        }
    });

    useEffect(() => {
        if (initialStats) {
            setStats(initialStats);
        }
    }, [initialStats]);

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        socket.on('stats_updated', (newStats: Stats) => {
            console.log('Stats updated via WebSocket', newStats);
            setStats(newStats);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    if (isLoading && !stats) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Chargement du tableau de bord...</p>
            </div>
        );
    }

    if (isError || !stats) {
        return (
            <div className="bg-red-50 border border-red-100 rounded-[2.5rem] p-12 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-900 mb-2">Erreur de chargement</h3>
                <p className="text-red-600">Impossible de récupérer les statistiques en temps réel.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Tableau de bord <span className="text-blue-600">BI</span></h2>
                    <p className="text-slate-500 font-medium mt-1">Analyse des prix et statut du scraper en temps réel.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-emerald-700 text-sm font-bold">Live</span>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Produits', value: stats.totalProducts, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100/50' },
                    { label: 'Magasins', value: stats.totalStores, icon: Store, color: 'text-indigo-600', bg: 'bg-indigo-100/50' },
                    { label: 'Ajoutés aujourd\'hui', value: stats.addedToday, icon: PlusCircle, color: 'text-emerald-600', bg: 'bg-emerald-100/50' },
                    { label: 'Dernier Scrape', value: stats.lastScrapeTime ? new Date(stats.lastScrapeTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Jamais', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100/50' },
                ].map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${card.bg} group-hover:scale-110 transition-transform`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <Activity className="w-4 h-4 text-slate-200" />
                        </div>
                        <p className="text-slate-500 text-sm font-bold mb-1 uppercase tracking-wider">{card.label}</p>
                        <h4 className="text-3xl font-black text-slate-900">{card.value}</h4>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart: Products per Store */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Répartition par magasin
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.byStore}
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.byStore.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getStoreColor(entry.name)} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart: Price Ranges */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-indigo-600" />
                        Distribution des prix
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.priceRanges}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Scraper Status & Recent Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Scraper Status */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-emerald-600" />
                        Statut des collecteurs
                    </h3>
                    <div className="space-y-4">
                        {stats.scraperStatus.length === 0 ? (
                            <p className="text-slate-400 text-center py-8">Aucun statut disponible.</p>
                        ) : stats.scraperStatus.map((status, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${status.status === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                        {status.status === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">{status.store}</p>
                                        <p className="text-xs text-slate-500">{new Date(status.lastScrapeTime).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${status.status === 'success' ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
                                        {status.status}
                                    </span>
                                    <p className="text-xs font-bold text-slate-400 mt-1">{status.productCount} produits</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recently Updated */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-emerald-600" />
                        Mises à jour récentes
                    </h3>
                    <div className="space-y-4">
                        {stats.recentlyUpdated.map((product, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                                <img src={product.image} alt="" className="w-12 h-12 object-contain rounded-xl bg-slate-100" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-slate-800 truncate text-sm">{product.name}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-blue-600">{product.store}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs text-slate-400">{new Date(product.lastUpdated).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-slate-900">{(product.price / 1000).toFixed(3)} DT</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
