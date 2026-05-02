"use client";

import Link from "next/link";
import Image from "next/image";
import { useStore } from "@/store/useStore";
import {
  HiOutlineShoppingBag,
  HiOutlineUser,
  HiOutlineLogout,
  HiTranslate,
  HiOutlineMenu,
  HiX,
} from "react-icons/hi";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { cart, user, setUser, setCurrency } = useStore();
  const tAuth = useTranslations("Auth");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState("en");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Read lang from document cookies
    const match = document.cookie.match(/(^| )lang=([^;]+)/);
    if (match) setCurrentLang(match[2]);

    // Always detect currency from IP on every mount so VPN changes are picked
    // up immediately. Only refresh the page if the detected currency differs
    // from what is currently stored (avoids unnecessary flicker).
    fetch("/api/currency")
      .then((r) => r.json())
      .then(({ currency: detected }) => {
        if (!detected) return;
        const existing = document.cookie.match(/(^| )currency=([^;]+)/)?.[2];
        // Store with a 1-hour expiry so stale values don't linger
        document.cookie = `currency=${detected}; path=/; max-age=3600`;
        setCurrency(detected);
        if (existing !== detected) {
          router.refresh();
        }
      })
      .catch(() => {
        /* silently ignore */
      });

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = currentLang === "en" ? "de" : "en";
    document.cookie = `lang=${newLang}; path=/; max-age=31536000`;
    setCurrentLang(newLang);
    router.refresh();
  };

  const handleLogout = () => {
    setUser(null);
    // Clear cookies? Handle on server or client
  };

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-orange-600 text-white text-center text-xs font-bold py-2 px-4 tracking-widest uppercase">
        🌿 Pure Ceylon. No Fillers. No Compromise.
      </div>
      <nav
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "bg-stone-950/90 backdrop-blur-md shadow-lg shadow-stone-950/30 border-stone-800/60"
            : "bg-stone-950 shadow-md border-stone-800 shadow-stone-900/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Spicylon"
                  width={180}
                  height={60}
                  className="h-16 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            <div className="hidden md:flex space-x-10 items-center">
              {[
                { href: "/", label: tNav("home") },
                { href: "/products", label: tNav("spices") },
                { href: "/about", label: tNav("ourStory") },
                { href: "/contact", label: tNav("contact") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative font-bold uppercase tracking-wider text-sm transition-colors group ${
                    pathname === link.href
                      ? "text-orange-400"
                      : "text-stone-300 hover:text-orange-400"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300 ${pathname === link.href ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </Link>
              ))}
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="text-red-500 hover:text-red-400 font-bold uppercase tracking-wider text-sm transition-colors"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-stone-300 hover:text-orange-400 font-bold uppercase tracking-wider text-sm transition-colors bg-stone-800 hover:bg-stone-700 px-3 py-1.5 rounded-full"
              >
                <HiTranslate className="w-4 h-4" />
                {currentLang === "en" ? "EN" : "DE"}
              </button>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/cart"
                className="relative p-2 sm:p-2.5 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-all"
              >
                <HiOutlineShoppingBag className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-orange-500 border-2 border-stone-950 text-white rounded-full flex items-center justify-center text-[10px] font-black animate-scale-in">
                    {cart.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link
                    href="/profile"
                    className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-orange-400 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-black group-hover:bg-orange-500 transition-colors">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.name.split(" ")[0]}</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="sm:hidden p-2 text-stone-300 hover:text-orange-400 hover:bg-stone-800 rounded-xl transition-all"
                    title="Profile"
                  >
                    <HiOutlineUser className="h-6 w-6" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-stone-400 hover:text-red-400 hover:bg-stone-800 rounded-xl transition-all"
                    title="Logout"
                  >
                    <HiOutlineLogout className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-500 transition-all font-bold shadow-lg shadow-orange-900/30 text-sm"
                >
                  <HiOutlineUser className="h-4 w-4" />
                  <span className="hidden sm:inline">{tAuth("signInBtn")}</span>
                </Link>
              )}

              <button
                className="md:hidden p-2 text-stone-300 hover:text-white hover:bg-stone-800 rounded-xl transition-all"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiOutlineMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-stone-900/95 backdrop-blur-md border-t border-stone-800 px-4 pt-4 pb-6 space-y-1 animate-slide-down">
            {[
              { href: "/", label: tNav("home") },
              { href: "/products", label: tNav("spices") },
              { href: "/about", label: tNav("ourStory") },
              { href: "/contact", label: tNav("contact") },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 font-bold uppercase tracking-wider text-sm p-3 rounded-xl transition-all ${pathname === link.href ? "bg-orange-600/20 text-orange-400" : "text-stone-300 hover:text-orange-400 hover:bg-stone-800"}`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-red-500 hover:text-red-400 font-bold uppercase tracking-wider text-sm p-3 rounded-xl hover:bg-stone-800"
              >
                Admin
              </Link>
            )}
            <div className="pt-2">
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 text-stone-300 hover:text-orange-400 font-bold uppercase tracking-wider text-sm bg-stone-800 hover:bg-stone-700 px-4 py-2.5 rounded-xl w-full transition-all"
              >
                <HiTranslate className="w-5 h-5" />
                {currentLang === "en" ? tNav("switchDe") : tNav("switchEn")}
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
