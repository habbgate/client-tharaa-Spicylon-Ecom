import { cookies } from "next/headers";
import AddToCartButton from "@/components/AddToCartButton";
import ProductGallery from "@/components/ProductGallery";
import ReviewSection from "@/components/ReviewSection";
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineRefresh,
  HiStar,
  HiOutlineHome,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { getTranslations } from "next-intl/server";
import dbConnect from "@/lib/db";
import { Product } from "@/models";
import Link from "next/link";

async function getProduct(id: string) {
  try {
    await dbConnect();
    const product = await Product.findById(id).lean();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);
  const cookieStore = await cookies();
  const currency = cookieStore.get("currency")?.value || "USD";
  const t = await getTranslations("Product");

  if (!product)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-stone-700 mb-2">
          {t("notFound")}
        </h2>
        <Link
          href="/products"
          className="mt-4 px-6 py-2.5 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-500 transition-all text-sm"
        >
          Browse Products
        </Link>
      </div>
    );

  const price = product.price[currency];
  const rating = product.rating || 0;
  const numReviews = product.numReviews || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 sm:py-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-stone-400 mb-10">
        <Link
          href="/"
          className="hover:text-orange-500 transition-colors flex items-center gap-1"
        >
          <HiOutlineHome className="w-4 h-4" />
          Home
        </Link>
        <HiOutlineChevronRight className="w-3.5 h-3.5" />
        <Link
          href="/products"
          className="hover:text-orange-500 transition-colors"
        >
          Products
        </Link>
        <HiOutlineChevronRight className="w-3.5 h-3.5" />
        <span className="text-stone-600 font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Gallery */}
        <ProductGallery
          images={product.images}
          name={product.name}
          outOfStockLabel={product.stock <= 0 ? t("outOfStock") : undefined}
        />

        {/* Info */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              {product.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-stone-900 mb-4 tracking-tighter leading-tight">
              {product.name}
            </h1>

            {/* Reviews Summary */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <HiStar
                    key={i}
                    className={`w-5 h-5 ${i < Math.round(rating) ? "text-orange-400" : "text-stone-200"}`}
                  />
                ))}
              </div>
              <span className="text-stone-500 font-medium text-sm">
                {rating > 0 ? rating.toFixed(1) : "—"} ({numReviews}{" "}
                {numReviews === 1 ? t("review") : t("reviewMultiple")})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-black text-stone-900">
                {currency} {price.toFixed(2)}
              </span>
              {product.stock > 0 && (
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                  In Stock
                </span>
              )}
            </div>
          </div>

          <blockquote className="text-stone-600 text-lg leading-relaxed mb-10 border-l-4 border-orange-500 pl-5 italic bg-orange-50/50 py-3 pr-4 rounded-r-xl">
            {product.description}
          </blockquote>

          <div className="mb-10">
            <AddToCartButton product={product} price={price} />
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-stone-100">
            {[
              {
                icon: <HiOutlineShieldCheck className="h-7 w-7" />,
                label: t("feat1"),
              },
              {
                icon: <HiOutlineTruck className="h-7 w-7" />,
                label: t("feat2"),
              },
              {
                icon: <HiOutlineRefresh className="h-7 w-7" />,
                label: t("feat3"),
              },
            ].map((badge, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-stone-50 border border-stone-100"
              >
                <div className="text-orange-500">{badge.icon}</div>
                <span className="text-[10px] font-bold uppercase text-stone-500 tracking-wider leading-tight">
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection
        productId={product._id}
        initialReviews={product.reviews || []}
      />
    </div>
  );
}
