import Image from "next/image";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const metadata = {
  title: "Our Story",
  description:
    "Learn about Spicylon — our mission to bring authentic single-origin Ceylon spices from Sri Lankan highland farms to kitchens around the world.",
  openGraph: {
    title: "Our Story | Spicylon",
    description:
      "The story behind Spicylon — authentic Ceylon spices, sourced with purpose.",
    url: "https://spicylon.com/about",
  },
  alternates: { canonical: "https://spicylon.com/about" },
};

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <div className="pb-12 sm:pb-20">
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/headerBanner.webp"
            alt="Spicylon Origins"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/50 to-stone-950/80" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4 mt-8 sm:mt-0">
          <span className="inline-flex items-center gap-2 text-orange-400 font-bold uppercase tracking-[0.3em] mb-4 text-xs sm:text-sm">
            <span className="w-6 h-px bg-orange-400/60" />
            {t("title")}
            <span className="w-6 h-px bg-orange-400/60" />
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl italic tracking-tighter leading-none">
            {t("historyTitle")}
          </h1>
          <p className="text-base sm:text-xl text-stone-200/90 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Timeline / Narrative Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-20 items-center">
          <div>
            <span className="section-badge">{t("historyTitle")}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 mb-6 text-stone-900 leading-tight">
              {t("title")}
            </h2>
            <p className="text-stone-600 mb-5 text-base sm:text-lg leading-relaxed">
              {t("historyP1")}
            </p>
            <p className="text-stone-500 text-base sm:text-lg leading-relaxed">
              {t("historyP2")}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { value: "2000+", label: "Years of Heritage" },
                { value: "30+", label: "Spice Varieties" },
                { value: "100%", label: "Organic" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-2xl bg-orange-50 border border-orange-100"
                >
                  <div className="text-2xl font-black text-orange-600">
                    {stat.value}
                  </div>
                  <div className="text-xs text-stone-500 font-bold uppercase tracking-wide mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative h-72 sm:h-[480px] rounded-3xl sm:rounded-[3rem] overflow-hidden shadow-2xl">
            <img
              src="/headerBanner.webp"
              alt="Sri Lankan Highlands"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Partnership Section */}
      <section className="bg-stone-950 text-white py-16 sm:py-28 border-y border-stone-800 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <span className="inline-block text-orange-500 font-bold uppercase tracking-[0.2em] mb-4 text-xs sm:text-sm">
            {t("partnerTitle")}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black mb-8 leading-tight">
            {t("partnerHeading")} <br />
            <span className="text-orange-500 italic">Ceylon Spice Garden</span>
          </h2>

          <p className="text-stone-300 text-base sm:text-lg max-w-3xl mx-auto mb-14 leading-relaxed px-2 sm:px-0">
            {t("partnerDesc")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-left">
            {[
              {
                title: t("ayurvedaTitle"),
                desc: t("ayurvedaDesc"),
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                title: t("organicTitle"),
                desc: t("organicDesc"),
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
              },
              {
                title: t("fairTradeTitle"),
                desc: t("fairTradeDesc"),
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-stone-900/60 border border-stone-800 hover:border-orange-500/40 p-6 sm:p-8 rounded-3xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-5">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold mb-3 text-orange-400 group-hover:text-orange-300 transition-colors">
                  {card.title}
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values / CTA */}
      <section className="max-w-4xl mx-auto px-4 mt-20 sm:mt-28 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-6 tracking-tight">
          {t("qualityTitle")}
        </h2>
        <p className="text-stone-500 text-base sm:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          {t("qualityDesc")}
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-3 px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-xl shadow-orange-200 text-base"
        >
          {t("exploreBtn")}
          <svg
            className="w-5 h-5"
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
      </section>
    </div>
  );
}
