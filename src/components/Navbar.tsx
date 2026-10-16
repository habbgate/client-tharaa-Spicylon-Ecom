"use client";
import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineMenuAlt4, HiX, HiOutlineArrowRight } from "react-icons/hi";
import { useStore } from "@/store/useStore";
import { useLocale, useTranslations } from "next-intl";

export default function Navbar() {
  const { cart, user, setUser, setCurrency } = useStore();
  const pathname = usePathname(); const router = useRouter(); const t = useTranslations("Nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false); const [lang, setLang] = useState(locale);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setLang(document.cookie.match(/(^| )lang=([^;]+)/)?.[2] || "en");
    fetch("/api/currency").then(r => r.json()).then(({currency}) => { if (!currency) return; const previous = document.cookie.match(/(^| )currency=([^;]+)/)?.[2]; document.cookie = `currency=${currency}; path=/; max-age=3600`; setCurrency(currency); if(previous !== currency) router.refresh(); }).catch(() => {});
  }, [router, setCurrency]);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { if(!open) return; const close = (e: KeyboardEvent) => { if(e.key === "Escape") {setOpen(false); menuButton.current?.focus();} }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, [open]);
  const links = [["/",t("home")],["/products",t("spices")],["/gift-boxes",lang === "de" ? "Geschenkboxen" : "Gift boxes"],["/about",t("ourStory")],["/contact",t("contact")]];
  const toggleLanguage = () => { const next = lang === "en" ? "de" : "en"; document.cookie = `lang=${next}; path=/; max-age=31536000`; setLang(next); router.refresh(); };
  const quantity = cart.reduce((sum,item) => sum + item.quantity,0);
  return <>
    <div className="announcement" aria-label={lang === "de" ? "Herkunft und Versand" : "Origin and delivery"}>
      <span className="announcement-origin">{lang === "de" ? "Ceylon-Gewürze aus Sri Lanka" : "Ceylon spices, from Sri Lanka"}</span>
      <span className="announcement-divider" aria-hidden="true" />
      <span className="announcement-delivery">{lang === "de" ? "Weltweiter Versand" : "Worldwide delivery"}</span>
    </div>
    <header className="site-header">
    <div className="nav-wrap"><nav className="floating-nav" aria-label="Main navigation">
      <Link href="/" className="brand-logo" aria-label="Spicylon home"><BrandLogo /></Link>
      <div className="desktop-links">{links.map(([href,label]) => <Link href={href} key={href} aria-current={(href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "page" : undefined}>{label}</Link>)}{user?.role === "admin" && <Link href="/admin">Admin</Link>}</div>
      <div className="nav-actions"><button className="language-button" onClick={toggleLanguage} aria-label="Change language">{lang.toUpperCase()}</button><Link className="nav-icon account-icon" href={user ? "/profile" : "/login"} aria-label="Your account"><HiOutlineUser /></Link><Link href="/cart" className="nav-icon bag-icon" aria-label={`Shopping bag, ${quantity} items`}><HiOutlineShoppingBag /><span>{quantity}</span></Link><button ref={menuButton} className="nav-icon menu-toggle" onClick={()=>setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu">{open ? <HiX /> : <HiOutlineMenuAlt4 />}</button></div>
    </nav>{open && <div id="mobile-menu" className="mobile-menu"><span className="eyebrow">A TASTE OF CEYLON</span>{[...links,...(user?.role === "admin" ? [["/admin","Admin"]] : [])].map(([href,label])=><Link onClick={()=>setOpen(false)} href={href} key={href} aria-current={pathname===href ? "page" : undefined}>{label}<HiOutlineArrowRight /></Link>)}<div className="mobile-menu-bottom"><Link href={user ? "/profile" : "/login"}>{user ? "Your account" : "Sign in"}</Link>{user && <button onClick={()=>{setUser(null);setOpen(false);}}>Sign out</button>}<button onClick={toggleLanguage}>{lang === "en" ? "Deutsch" : "English"}</button></div></div>}</div>
  </header></>;
}
