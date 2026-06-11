import ProductCard from "@/components/ProductCard";
import { cookies } from "next/headers";
import { Pagination } from "@/components/Pagination";
import { redirect } from "next/navigation";
import Link from "next/link";
import dbConnect from "@/lib/db";
import { Product } from "@/models";

export const metadata = {
  title: "Gift Boxes — Spicylon",
  description:
    "Discover our curated Ceylon spice gift boxes — perfect for every occasion. Hand-packed with premium single-origin spices from the highlands of Sri Lanka.",
  openGraph: {
    title: "Spice Gift Boxes | Spicylon",
    description:
      "Beautifully curated Ceylon spice gift boxes, sourced directly from Sri Lankan farms. The perfect gift for food lovers.",
    url: "https://spicylon.com/gift-boxes",
  },
  alternates: { canonical: "https://spicylon.com/gift-boxes" },
};

async function getGiftBoxes() {
  try {
    await dbConnect();
    const products = await Product.find({ category: "Gift Box" }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function GiftBoxesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const ITEMS_PER_PAGE = 8;

  const giftBoxes = await getGiftBoxes();
  const cookieStore = await cookies();
  const currency = cookieStore.get("currency")?.value || "USD";

  const totalItems = giftBoxes.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

  if (currentPage > totalPages && totalItems > 0) {
    redirect(`/gift-boxes?page=${totalPages}`);
  }

  const paginated = giftBoxes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative bg-stone-950 text-white py-20 px-4 mb-16 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-amber-500/8 rounded-full blur-3xl" />
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
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center text-5xl shadow-2xl shadow-orange-900/30">
              🎁
            </div>
          </div>

          <span className="inline-flex items-center gap-2 text-orange-400 font-bold uppercase tracking-[0.3em] mb-4 text-xs sm:text-sm">
            <span className="w-6 h-px bg-orange-400/50" />
            Curated Collections
            <span className="w-6 h-px bg-orange-400/50" />
          </span>

          <h1 className="text-5xl md:text-7xl font-black mb-4 italic tracking-tighter leading-none">
            Spice{" "}
            <span className="text-orange-500">Gift Boxes</span>
          </h1>

          <p className="text-stone-400 max-w-xl mx-auto mt-4 text-base leading-relaxed">
            {totalItems > 0
              ? `${totalItems} curated gift set${totalItems === 1 ? "" : "s"} — beautifully hand-packed with authentic Ceylon spices`
              : "Beautifully hand-packed collections of authentic Ceylon spices — the perfect gift for any occasion"}
          </p>
        </div>
      </section>

      {/* Gift Boxes Grid */}
      <section className="max-w-7xl mx-auto px-4">
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {paginated.map((product: any, i: number) => (
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
          /* Empty state */
          <div className="text-center py-28 flex flex-col items-center">
            <div className="w-24 h-24 bg-orange-50 border-2 border-orange-100 rounded-3xl flex items-center justify-center mb-6 text-5xl">
              🎁
            </div>
            <h3 className="text-2xl font-black text-stone-800 mb-2">
              Gift Boxes Coming Soon
            </h3>
            <p className="text-stone-500 mb-8 max-w-sm leading-relaxed">
              We're putting the finishing touches on our curated Ceylon spice
              gift collections. Check back soon!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-500 transition-all shadow-lg shadow-orange-200"
            >
              Browse All Spices →
            </Link>
          </div>
        )}

        {totalItems > 0 && (
          <div className="mt-14 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={ITEMS_PER_PAGE}
              pageRoute="/gift-boxes?page="
            />
          </div>
        )}
      </section>

      {/* Why Gift Spices section */}
      {totalItems > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-24">
          <div className="bg-gradient-to-br from-stone-950 to-stone-900 rounded-3xl p-10 sm:p-16 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 text-center">
              <span className="inline-flex items-center gap-2 text-orange-400 font-bold uppercase tracking-[0.3em] mb-4 text-xs">
                <span className="w-6 h-px bg-orange-400/50" />
                The Perfect Gift
                <span className="w-6 h-px bg-orange-400/50" />
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">
                Why Gift{" "}
                <span className="text-orange-500 italic">Ceylon Spices?</span>
              </h2>
              <p className="text-stone-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                Each gift box is a culinary journey — hand-selected spices from
                the highlands of Sri Lanka, packed with love and shipped
                worldwide.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  {
                    emoji: "🏔️",
                    title: "Highland Sourced",
                    desc: "Grown at 1,500–2,500m elevation in Sri Lanka's central highlands",
                  },
                  {
                    emoji: "🎀",
                    title: "Gift Ready",
                    desc: "Premium packaging designed to impress — ready to give straight from the box",
                  },
                  {
                    emoji: "✈️",
                    title: "Ships Worldwide",
                    desc: "Delivered to your door or directly to your recipient anywhere in the world",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-stone-800/50 border border-stone-700/50 rounded-2xl p-6 text-center hover:border-orange-500/30 transition-colors"
                  >
                    <div className="text-4xl mb-3">{item.emoji}</div>
                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-stone-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
