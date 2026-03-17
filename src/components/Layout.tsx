import React from 'react';
import { Search, Bell, ShoppingBag } from 'lucide-react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="sticky top-0 z-50 glass border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                <ShoppingBag className="text-white w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight gradient-text">ChoufPrix</h1>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <nav className="flex gap-4">
                                <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Dashboard</a>
                                <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Tracked Items</a>
                                <a href="#" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Stores</a>
                            </nav>
                            <div className="h-6 w-px bg-slate-200" />
                            <div className="flex items-center gap-3">
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                                    <Search className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                                </button>
                                <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>

            <footer className="bg-white border-t border-slate-200 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
                    © {new Date().getFullYear()} ChoufPrix - Meilleurs prix en Tunisie
                </div>
            </footer>
        </div>
    );
};

export default Layout;
