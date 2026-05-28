import ProductCard from "@/components/ProductCard";
import NewsletterForm from "@/components/NewsletterForm";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";
import dbConnect from "@/lib/db";

export const metadata = {
  title: "Shop Authentic Ceylon Spices",
  description:
    "Browse our full range of single-origin Ceylon spices — cinnamon, cardamom, turmeric, black pepper, cloves and more. Sourced directly from Sri Lankan highland farms.",
  openGraph: {
    title: "Spicylon | Shop Ceylon Spices",
    description:
      "Authentic single-origin spices from Sri Lanka, shipped worldwide.",
    url: "https://spicylon.com",
  },
  alternates: { canonical: "https://spicylon.com" },
};
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

export default async function Home() {
  const products = await getProducts();
  const cookieStore = await cookies();
  const currency = cookieStore.get("currency")?.value || "USD";

  const t = await getTranslations("Home");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://spicylon.com/#organization",
        name: "Spicylon",
        url: "https://spicylon.com",
        logo: {
          "@type": "ImageObject",
          url: "https://spicylon.com/logo.png",
        },
        description:
          "Authentic single-origin Ceylon spices sourced directly from highland farms in Sri Lanka.",
        address: {
          "@type": "PostalAddress",
          addressCountry: "LK",
        },
        sameAs: [
          "https://www.facebook.com/spicylon",
          "https://www.instagram.com/spicylon",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://spicylon.com/#website",
        url: "https://spicylon.com",
        name: "Spicylon",
        publisher: { "@id": "https://spicylon.com/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://spicylon.com/products?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <div className="pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="relative h-[88vh] min-h-[560px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/headerBanner.webp"
            alt="Spice Rack"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/50 to-stone-950/90" />
        </div>

        {/* Decorative floating dots */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-orange-400/40 animate-float"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute top-1/3 right-16 w-3 h-3 rounded-full bg-orange-500/30 animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-1/3 left-1/4 w-2 h-2 rounded-full bg-orange-300/30 animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative z-10 text-center max-w-5xl px-4">
          <span className="inline-flex items-center gap-2 text-orange-400 font-bold uppercase tracking-[0.3em] mb-6 text-xs sm:text-sm animate-fade-in">
            <span className="w-8 h-px bg-orange-400/60" />
            {t("heroSub")}
            <span className="w-8 h-px bg-orange-400/60" />
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl italic tracking-tighter leading-[0.9] animate-slide-up">
            {t("heroTitle1")} <br />
            <span className="text-orange-500">{t("heroTitle2")}</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-200/90 mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0 animate-slide-up delay-200">
            {t("heroText")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
            <Link
              href="/products"
              className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-full transition-all transform hover:scale-105 shadow-2xl shadow-orange-900/50 inline-block w-full sm:w-auto text-base"
            >
              {t("shopAll")}
            </Link>
            <Link
              href="/about"
              className="px-10 py-4 glass text-white hover:bg-white/10 font-bold rounded-full transition-all inline-block w-full sm:w-auto text-base mt-0"
            >
              {t("ourJourney")}
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-pulse-slow">
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/60 rounded-full animate-float" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-orange-600 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-white">
            {[
              { value: "100%", label: "Authentic Ceylon" },
              { value: "50+", label: "Premium Spices" },
              { value: "10K+", label: "Happy Customers" },
              { value: "Farm", label: "Direct Sourcing" },
            ].map((stat) => (
              <div key={stat.label} className="py-2">
                <div className="text-2xl sm:text-3xl font-black tracking-tighter">
                  {stat.value}
                </div>
                <div className="text-orange-100 text-xs font-bold uppercase tracking-widest mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Information Section 1 - Core Values */}
      <section className="bg-white py-16 sm:py-24 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <span className="section-badge">{t("whyChooseTitle")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 mb-5 tracking-tight">
              {t("whyChooseMain")}
            </h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-base sm:text-lg px-2 sm:px-0">
              {t("whyChooseDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                ),
                title: t("feat1Title"),
                desc: t("feat1Desc"),
                delay: "",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                ),
                title: t("feat2Title"),
                desc: t("feat2Desc"),
                delay: "delay-100",
              },
              {
                icon: (
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                ),
                title: t("feat3Title"),
                desc: t("feat3Desc"),
                delay: "delay-200",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-3xl bg-stone-50 border border-stone-100 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-50 hover:-translate-y-2 transition-all duration-300 group ${feat.delay}`}
              >
                <div className="absolute top-6 right-6 text-[80px] font-black text-stone-100 group-hover:text-orange-50 transition-colors select-none leading-none">
                  {i + 1}
                </div>
                <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-stone-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 mt-16 sm:mt-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-badge">{t("featuredColl")}</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 mt-2">
              {t("featuredColl")}
            </h2>
            <p className="mt-2 text-stone-500 font-medium text-sm sm:text-base">
              {t("exploreFeatured")}
            </p>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-orange-600 hover:text-orange-500 font-bold text-sm transition-colors group"
          >
            View All
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {products.slice(0, 8).map((product: any) => (
            <ProductCard
              key={product._id}
              product={product}
              currency={currency}
            />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-stone-900 text-stone-900 font-bold rounded-full hover:bg-stone-900 hover:text-white transition-all"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* Sri Lankan Spice History & Supplier Info */}
      <section className="bg-stone-950 text-white py-16 sm:py-28 mt-16 sm:mt-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20 items-center relative z-10">
          <div className="order-2 lg:order-1 text-center sm:text-left">
            <span className="inline-block text-orange-500 font-bold uppercase tracking-[0.2em] mb-4 text-xs sm:text-sm">
              {t("legacyBadge")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight">
              {t("historicRoute")}
            </h2>
            <p className="text-stone-300 text-base sm:text-lg mb-5 leading-relaxed px-2 sm:px-0">
              {t("historyText1")}
            </p>
            <p className="text-stone-400 text-base sm:text-lg mb-10 leading-relaxed px-2 sm:px-0">
              {t("historyText2")}
            </p>


          </div>
          <div className="relative h-72 sm:h-[500px] lg:h-[600px] rounded-3xl sm:rounded-[3rem] overflow-hidden shadow-2xl order-1 lg:order-2">
            <img
              src="/headerBanner.webp"
              alt="Sri Lankan Spice Farmers"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-70"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="glass rounded-2xl p-4">
                <p className="text-white text-sm font-bold">
                  Grown in the highlands of Sri Lanka
                </p>
                <p className="text-stone-300 text-xs mt-1">
                  Elevation: 1,500–2,500m above sea level
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-3xl sm:rounded-[3rem] mx-4 sm:mx-auto max-w-7xl px-6 sm:px-12 py-14 sm:py-20 mt-16 sm:mt-32 mb-10 flex flex-col md:flex-row items-center gap-10 sm:gap-16 overflow-hidden relative border border-orange-200/50">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-orange-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-orange-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="w-full md:w-1/2 z-10 text-center md:text-left">
          <span className="section-badge mb-4 block">Newsletter</span>
          <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
            {t("joinClub")}
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed text-sm sm:text-base px-2 md:px-0">
            {t("joinDesc")}
          </p>
          <NewsletterForm
            placeholder={t("emailPlace")}
            buttonLabel={t("joinBtn")}
          />
          <p className="text-stone-400 text-xs mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>
        <div className="w-full md:w-1/2 relative h-52 sm:h-72 mt-4 md:mt-0">
          <img
            src="/headerBanner.webp"
            className="rounded-2xl sm:rounded-3xl shadow-2xl absolute inset-0 w-full h-full object-cover transform rotate-2 border-4 sm:border-8 border-white"
            alt="Spices"
          />
        </div>
      </section>
    </div>
  );
}
