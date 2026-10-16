"use client";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import PageHero from "./PageHero";

const titles: Record<string, [string, string]> = {
  "/admin": ["The Spicylon workspace.", "Der Spicylon-Arbeitsbereich."],
  "/cart": ["Your bag. Your next great meal.", "Ihr Warenkorb. Ihr nächstes Lieblingsgericht."],
  "/login": ["A little more flavour starts here.", "Hier beginnt mehr Geschmack."],
  "/forgot-password": ["Back to your kitchen.", "Zurück in Ihre Küche."],
  "/profile": ["Your corner of Spicylon.", "Ihr Platz bei Spicylon."],
  "/order-success": ["Good things are on their way.", "Gute Dinge sind unterwegs."],
  "/refund-policy": ["Shop with peace of mind.", "Mit gutem Gefühl einkaufen."],
};

export default function RouteIntro() {
  const path = usePathname();
  const locale = useLocale();
  const title = titles[path] || (path.startsWith("/products/") ? ["One origin. So much character.", "Eine Herkunft. Viel Charakter."] : undefined);
  if (!title) return null;
  return <PageHero title={title[locale === "de" ? 1 : 0]} compact contextual image={path === "/profile" ? "/images/ceylon-origin.webp" : undefined} />;
}
