import ProductCard from "@/components/ProductCard";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import { Pagination } from "@/components/Pagination";
import { redirect } from "next/navigation";

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
    const products = await Product.find({}).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const ITEMS_PER_PAGE = 8;

  const products = await getProducts();
  const cookieStore = await cookies();
  const currency = cookieStore.get("currency")?.value || "USD";
  const t = await getTranslations("Products");

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  if (currentPage > totalPages && totalItems > 0) {
    redirect(`/products?page=${totalPages}`);
  }

  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="pb-20">
      {/* Header Section */}
      <section className="relative bg-stone-950 text-white py-20 px-4 mb-16 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/4 w-96 h-96 bg-orange-600/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-orange-400 font-bold uppercase tracking-[0.3em] mb-4 text-xs sm:text-sm">
            <span className="w-6 h-px bg-orange-400/50" />
            {t("subtitle")}
            <span className="w-6 h-px bg-orange-400/50" />
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-4 italic tracking-tighter leading-none">
            {t("title")}{" "}
            <span className="text-orange-500">{t("titleSpan")}</span>
          </h1>
          <p className="text-stone-400 max-w-xl mx-auto mt-4">
            {totalItems} premium spices — authentically sourced from Sri Lanka
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4">
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {paginatedProducts.map((product: any, i: number) => (
              <div
                key={product._id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <ProductCard product={product} currency={currency} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-28 flex flex-col items-center">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-stone-700 mb-2">
              No products found
            </h3>
            <p className="text-stone-500">Please check back later.</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="mt-14 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              pageRoute="/products?page="
            />
          </div>
        )}
      </section>
    </div>
  );
}
