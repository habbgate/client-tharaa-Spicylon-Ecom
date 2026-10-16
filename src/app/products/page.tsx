import CatalogBrowser from "@/components/CatalogBrowser";
import PageHero from "@/components/PageHero";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "All Spices",
  description:
    "Shop our complete collection of authentic Ceylon spices. Single-origin, no fillers — cinnamon, turmeric, cardamom, pepper, cloves and more from Sri Lanka.",
  openGraph: {
    title: "All Ceylon Spices | Spicylon",
    description:
      "Browse the full Spicylon spice collection. Sourced from Sri Lankan highland farms.",
    url: "https://spicylon.com/products",
  },
  alternates: { canonical: "https://spicylon.com/products" },
};
import dbConnect from "@/lib/db";
import { Product } from "@/models";

async function getProducts() {
  try {
    await dbConnect();
    // Exclude Gift Box products — those are shown on /gift-boxes
    const products = await Product.find({ category: { $ne: "Gift Box" } }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const [params, products, cookieStore, t, studio] = await Promise.all([searchParams, getProducts(), cookies(), getTranslations("Products"), getTranslations("Studio")]);
  const currency = cookieStore.get("currency")?.value || "USD";
  const query = new URLSearchParams();
  for (const key of ["q", "sort", "stock", "max", "page"]) {
    if (typeof params[key] === "string") query.set(key, params[key] as string);
  }
  return <div className="page-shell catalog-page pb-16">
    <PageHero title={<>{t("title")} <span className="text-orange-500">{t("titleSpan")}</span></>} subtitle={studio("catalogSubtitle")} eyebrow="THE CEYLON COLLECTION" image="/images/spice-table.webp" />
    <CatalogBrowser key={`${currency}:${query}`} products={products} currency={currency} initialQuery={query.toString()} />
  </div>;
}
