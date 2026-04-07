import React from 'react';
import { Search, Bell, ShoppingBag } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import Chatbot from './Chatbot';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === 'admin';

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-800 transition-colors duration-300">
            <header className="sticky top-0 z-50 glass border-b">
                <div className="max-w-7xl mx-auto px-8 w-full">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                <ShoppingBag className="text-white w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight gradient-text">ChoufPrix</h1>
                        </div>

                        <div className="hidden md:flex items-center gap-6">
                            <nav className="flex gap-4">
                                <a href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Browse</a>
                                <a href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Dashboard</a>
                                <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Tracked Items</a>
                            </nav>
                            <div className="h-6 w-px bg-gray-200" />
                            <div className="flex items-center gap-3">
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-all">
                                    <Search className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-all relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-white" />
                                </button>

                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg shadow-lg hover:opacity-90 transition-all">
                                            Se connecter
                                        </button>
                                    </SignInButton>
                                </SignedOut>
                                <SignedIn>
                                    <div className="flex items-center gap-3">
                                        {isAdmin && (
                                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-lg border border-amber-200">
                                                👑 Admin
                                            </span>
                                        )}
                                        <UserButton afterSignOutUrl="/" />
                                    </div>
                                </SignedIn>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {children}
            </main>

            <footer className="bg-gray-50 border-t border-gray-200 py-8 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} ChoufPrix - Meilleurs prix en Tunisie
                </div>
            </footer>
            <Chatbot />
        </div>
    );
};

export default Layout;
