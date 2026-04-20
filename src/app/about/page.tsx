import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <div className="pb-12 sm:pb-20">
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/headerBanner.webp" 
            alt="Spicylon Origins" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4 mt-8 sm:mt-0">
          <span className="inline-block text-orange-400 font-bold uppercase tracking-[0.3em] mb-3 sm:mb-4 text-xs sm:text-sm">{t('title')}</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 sm:mb-6 drop-shadow-2xl italic tracking-tighter leading-none">
            {t('historyTitle')}
          </h1>
          <p className="text-sm sm:text-xl text-stone-200 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Narrative Section 1 */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          <div className="text-center sm:text-left">
            <span className="text-orange-600 font-extrabold tracking-widest uppercase text-xs sm:text-sm">{t('historyTitle')}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 sm:mt-4 mb-4 sm:mb-6 text-stone-900 leading-tight">{t('title')}</h2>
            <p className="text-stone-600 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed text-left">
              {t('historyP1')}
            </p>
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed text-left">
              {t('historyP2')}
            </p>
          </div>
          <div className="relative h-64 sm:h-96 rounded-3xl sm:rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-stone-900 flex items-center justify-center text-stone-700">
              <img src="/headerBanner.webp" alt="Sri Lankan Highlands" className="w-full h-full object-cover opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* The Ceylon Spice Garden Partnership */}
      <section className="bg-stone-950 text-white py-16 sm:py-24 border-y border-stone-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block text-orange-500 font-bold uppercase tracking-[0.2em] mb-3 sm:mb-4 text-xs sm:text-sm">{t('partnerTitle')}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 sm:mb-10 leading-tight">{t('partnerHeading')} <br/><span className="text-orange-500 italic block mt-2 sm:inline sm:mt-0">Ceylon Spice Garden</span></h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-stone-300 text-base sm:text-lg md:text-xl mb-8 leading-relaxed px-2 sm:px-0">
              {t('partnerDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left mt-8 sm:mt-12">
              <div className="bg-stone-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 hover:-translate-y-1 transition-transform">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-orange-400">{t('ayurvedaTitle')}</h3>
                <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                  {t('ayurvedaDesc')}
                </p>
              </div>
              <div className="bg-stone-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 hover:-translate-y-1 transition-transform">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-orange-400">{t('organicTitle')}</h3>
                <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                  {t('organicDesc')}
                </p>
              </div>
              <div className="bg-stone-900 p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-stone-800 hover:-translate-y-1 transition-transform">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-orange-400">{t('fairTradeTitle')}</h3>
                <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
                  {t('fairTradeDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Conclusion */}
      <section className="max-w-4xl mx-auto px-4 mt-16 sm:mt-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-6 sm:mb-8">{t('qualityTitle')}</h2>
        <p className="text-stone-600 text-base sm:text-xl leading-relaxed mb-8 sm:mb-12 text-justify sm:text-center">
          {t('qualityDesc')}
        </p>
        <a href="/products" className="inline-block px-8 py-3 sm:px-10 sm:py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-xl text-base sm:text-lg w-full sm:w-auto">
          {t('exploreBtn')}
        </a>
      </section>
    </div>
  );
}
