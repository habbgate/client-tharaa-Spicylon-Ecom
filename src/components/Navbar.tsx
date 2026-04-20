'use client';

import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineLogout, HiTranslate, HiOutlineMenu, HiX } from 'react-icons/hi';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
    const { cart, user, setUser } = useStore();
    const tAuth = useTranslations('Auth');
    const tNav = useTranslations('Nav');
    const router = useRouter();
    const [currentLang, setCurrentLang] = useState('en');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Read lang from document cookies
        const match = document.cookie.match(/(^| )lang=([^;]+)/);
        if (match) setCurrentLang(match[2]);
    }, []);

    const toggleLanguage = () => {
        const newLang = currentLang === 'en' ? 'de' : 'en';
        document.cookie = `lang=${newLang}; path=/; max-age=31536000`;
        setCurrentLang(newLang);
        router.refresh();
    };

    const handleLogout = () => {
        setUser(null);
        // Clear cookies? Handle on server or client
    };

    return (
        <nav className="sticky top-0 z-50 bg-stone-950 shadow-md border-b border-stone-800 shadow-stone-900/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-24">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-3xl font-extrabold tracking-tighter text-orange-500 italic drop-shadow-md">
                            Spicylon
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-12 items-center">
                        <Link href="/" className="text-stone-300 hover:text-orange-400 font-bold uppercase tracking-wider text-sm transition-colors">{tNav('home')}</Link>
                        <Link href="/products" className="text-stone-300 hover:text-orange-400 font-bold uppercase tracking-wider text-sm transition-colors">{tNav('spices')}</Link>
                        <Link href="/about" className="text-stone-300 hover:text-orange-400 font-bold uppercase tracking-wider text-sm transition-colors">{tNav('ourStory')}</Link>
                        {user?.role === 'admin' && (
                            <Link href="/admin" className="text-red-500 hover:text-red-400 font-bold uppercase tracking-wider text-sm transition-colors">Admin</Link>
                        )}
                        
                        <button 
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 text-stone-300 hover:text-orange-400 font-bold uppercase tracking-wider text-sm transition-colors bg-stone-800 px-3 py-1.5 rounded-full"
                        >
                            <HiTranslate className="w-4 h-4" />
                            {currentLang === 'en' ? 'EN' : 'DE'}
                        </button>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-6">
                        <Link href="/cart" className="relative p-2 sm:p-3 text-stone-300 hover:text-white hover:bg-stone-800 rounded-2xl transition-all">
                            <HiOutlineShoppingBag className="h-6 w-6" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 h-6 w-6 bg-orange-500 border-2 border-stone-950 text-white rounded-full flex items-center justify-center text-xs font-black">
                                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-2 sm:gap-4">
                                <Link href="/profile" className="hidden sm:block text-sm font-medium text-stone-400 hover:text-orange-400 transition-colors">
                                    {tNav('greeting')} {user.name}
                                </Link>
                                <Link href="/profile" className="sm:hidden p-2 text-stone-300 hover:text-orange-400 hover:bg-stone-800 rounded-2xl transition-all" title="Profile">
                                    <HiOutlineUser className="h-6 w-6" />
                                </Link>
                                <button onClick={handleLogout} className="p-2 sm:p-3 text-stone-300 hover:text-red-400 hover:bg-stone-800 rounded-2xl transition-all" title="Logout">
                                    <HiOutlineLogout className="h-6 w-6" />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-500 transition-all font-bold shadow-lg shadow-orange-900/20">
                                <HiOutlineUser className="h-5 w-5" />
                                <span className="hidden sm:inline">{tAuth('signInBtn')}</span>
                            </Link>
                        )}

                        <button 
                            className="md:hidden p-2 text-stone-300 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <HiX className="h-7 w-7" /> : <HiOutlineMenu className="h-7 w-7" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-stone-900 border-t border-stone-800 px-4 pt-2 pb-6 space-y-4">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-stone-300 hover:text-orange-400 font-bold uppercase tracking-wider text-sm p-3 rounded-lg hover:bg-stone-800">{tNav('home')}</Link>
                    <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="block text-stone-300 hover:text-orange-400 font-bold uppercase tracking-wider text-sm p-3 rounded-lg hover:bg-stone-800">{tNav('spices')}</Link>
                    <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block text-stone-300 hover:text-orange-400 font-bold uppercase tracking-wider text-sm p-3 rounded-lg hover:bg-stone-800">{tNav('ourStory')}</Link>
                    {user?.role === 'admin' && (
                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block text-red-500 hover:text-red-400 font-bold uppercase tracking-wider text-sm p-3 rounded-lg hover:bg-stone-800">Admin</Link>
                    )}
                    <div className="p-3">
                        <button 
                            onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                            className="flex items-center gap-2 text-stone-300 hover:text-orange-400 font-bold uppercase tracking-wider text-sm bg-stone-800 px-4 py-2 rounded-full w-fit"
                        >
                            <HiTranslate className="w-5 h-5" />
                            {currentLang === 'en' ? tNav('switchDe') : tNav('switchEn')}
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
