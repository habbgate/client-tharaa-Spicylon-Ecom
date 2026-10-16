import Link from "next/link";
import Image from "next/image";
import { getLocale } from "next-intl/server";
import BrandLogo from "./BrandLogo";
import CompanyAddress from "./CompanyAddress";

export default async function Footer() {
  const de = (await getLocale()) === "de";
  const explore = [["/products", de ? "Gewürzkollektion" : "The spice collection"], ["/gift-boxes", de ? "Geschenkboxen" : "Gift collections"], ["/about", de ? "Unsere Geschichte" : "Our story"]];
  const support = [["/contact", de ? "Kontakt" : "Contact us"], ["/faq", de ? "Fragen & Antworten" : "Questions & answers"], ["/refund-policy", de ? "Rückgaben & Erstattungen" : "Returns & refunds"], ["/profile", de ? "Ihr Konto" : "Your account"]];
  return <footer className="pro-footer">
    <div className="pro-footer-grid">
      <div className="pro-footer-brand"><Link href="/" aria-label="Spicylon home"><BrandLogo className="footer-brand-artwork" /></Link><p>{de ? "Ein wenig Sri Lanka für Ihre Küche. Ceylon-Gewürze für die Mahlzeiten, die Sie lieben." : "A little Sri Lanka for your kitchen. Ceylon spices for the meals you love to make."}</p><div className="pro-footer-social"><a href="https://www.instagram.com/spicylon.official" target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href="https://www.facebook.com/spicylon" target="_blank" rel="noopener noreferrer">Facebook ↗</a></div></div>
      <div><h3>{de ? "Entdecken" : "Discover"}</h3><div className="pro-footer-links">{explore.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}</div></div>
      <div><h3>{de ? "Wir helfen gerne" : "Here to help"}</h3><div className="pro-footer-links">{support.map(([href,label])=><Link key={href} href={href}>{label}</Link>)}</div></div>
      <div><h3>{de ? "Sagen Sie Hallo" : "Say hello"}</h3><div className="pro-footer-links"><a href="mailto:info@spicylon.com">info@spicylon.com</a><a href="https://wa.me/41789544455">+41 78 954 44 55</a></div><div className="pro-footer-address"><CompanyAddress /></div><div className="footer-payments">{[{file:"6e15aec17f1a1974593c294359295cd7.png",label:"Visa"},{file:"pngwing.com (23).png",label:"Mastercard"},{file:"pngwing.com (24).png",label:"Apple Pay"},{file:"twint-logo.svg",label:"TWINT"}].map(item=><span key={item.label}><Image src={`/paymenttypes/${item.file}`} alt={item.label} width={36} height={24} className="object-contain" /></span>)}</div></div>
    </div>
    <div className="pro-footer-bottom"><span>© {new Date().getFullYear()} Spicylon</span><div><Link href="/privacy-policy">{de ? "Datenschutz" : "Privacy"}</Link><Link href="/terms-of-service">{de ? "AGB" : "Terms"}</Link><span>Developed by <a href="https://www.habb.lk" className="text-stone-300">HABB PVT LTD</a></span></div></div>
  </footer>;
}
