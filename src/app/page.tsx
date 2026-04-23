import ProductCard from '@/components/ProductCard';
import { getTranslations } from 'next-intl/server';
import { cookies } from 'next/headers';
import Link from 'next/link';
import dbConnect from '@/lib/db';
import { Product } from '@/models';

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
  const currency = cookieStore.get('currency')?.value || 'USD';
  
  const t = await getTranslations('Home');

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/headerBanner.webp" 
            alt="Spice Rack" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <span className="inline-block text-orange-400 font-bold uppercase tracking-[0.3em] mb-4 text-xs sm:text-sm">{t('heroSub')}</span>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-4 sm:mb-6 drop-shadow-2xl italic tracking-tighter leading-tight sm:leading-none">
            {t('heroTitle1')} <span className="text-orange-500 block sm:inline">{t('heroTitle2')}</span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-200 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            {t('heroText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="px-8 py-3 sm:px-10 sm:py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-xl inline-block w-full sm:w-auto">
              {t('shopAll')}
            </Link>
            <Link href="/about" className="px-8 py-3 sm:px-10 sm:py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-stone-900 font-bold rounded-full transition-all inline-block w-full sm:w-auto mt-2 sm:mt-0">
              {t('ourJourney')}
            </Link>
          </div>
        </div>
      </section>

      {/* Information Section 1 - Core Values */}
      <section className="bg-white py-16 sm:py-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-orange-600 font-extrabold tracking-widest uppercase text-xs sm:text-sm">{t('whyChooseTitle')}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 sm:mt-4 mb-4 sm:mb-6">{t('whyChooseMain')}</h2>
            <p className="text-stone-500 max-w-2xl mx-auto text-base sm:text-lg px-2 sm:px-0">
              {t('whyChooseDesc')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center">
            <div className="p-6 sm:p-8 rounded-3xl bg-orange-50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('feat1Title')}</h3>
              <p className="text-stone-600">{t('feat1Desc')}</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-orange-50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('feat2Title')}</h3>
              <p className="text-stone-600">{t('feat2Desc')}</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-orange-50 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('feat3Title')}</h3>
              <p className="text-stone-600">{t('feat3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 mt-16 sm:mt-24">
        <div className="flex items-end justify-between mb-8 sm:mb-12 text-center sm:text-left w-full">
          <div className="w-full">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900 decoration-orange-500 underline decoration-4 line-through sm:no-underline sm:underline-offset-8">{t('featuredColl')}</h2>
            <p className="mt-3 sm:mt-4 text-stone-500 font-medium px-2 sm:px-0 text-sm sm:text-base">{t('exploreFeatured')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.slice(0, 8).map((product: any) => (
            <ProductCard key={product._id} product={product} currency={currency} />
          ))}
        </div>
      </section>

      {/* Sri Lankan Spice History & Supplier Info */}
      <section className="bg-stone-950 text-white py-16 sm:py-24 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <div className="order-2 lg:order-1 text-center sm:text-left">
            <span className="inline-block text-orange-500 font-bold uppercase tracking-[0.2em] mb-4 text-xs sm:text-sm">{t('legacyBadge')}</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 leading-tight">{t('historicRoute')}</h2>
            <p className="text-stone-300 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed px-2 sm:px-0">
              {t('historyText1')}
            </p>
            <p className="text-stone-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
              {t('historyText2')}
            </p>
            
            <div className="bg-stone-900 border border-stone-800 p-6 sm:p-8 rounded-3xl text-left">
              <span className="text-orange-500 font-semibold mb-2 block text-sm sm:text-base">{t('supplierPre')}</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">{t('supplierName')}</h3>
              <p className="text-stone-400 mb-4 text-sm sm:text-base leading-relaxed">
                {t('supplierText')}
              </p>
              <a href="https://ceylonspicegarden.com" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 font-bold flex items-center justify-start gap-2 group transition-colors text-sm sm:text-base">
                {t('visitSupplier')} 
                <svg className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </a>
            </div>
          </div>
          <div className="relative h-64 sm:h-96 lg:h-[600px] rounded-3xl sm:rounded-[3rem] overflow-hidden shadow-2xl order-1 lg:order-2">
            <img 
              src="/headerBanner.webp" 
              alt="Sri Lankan Spice Farmers" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-60 sm:opacity-80"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-100 rounded-3xl sm:rounded-[3rem] mx-4 sm:mx-auto max-w-7xl px-6 sm:px-8 py-12 sm:py-16 mt-16 sm:mt-32 mb-10 flex flex-col md:flex-row items-center gap-10 sm:gap-12 overflow-hidden relative">
        <div className="w-full md:w-1/2 z-10 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl font-black mb-4 sm:mb-6 leading-tight">{t('joinClub')}</h2>
          <p className="text-stone-600 mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base px-2 md:px-0">{t('joinDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input 
              type="email" 
              placeholder={t('emailPlace')} 
              className="px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white shadow-inner text-sm sm:text-base"
              suppressHydrationWarning
            />
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-stone-900 text-white font-bold rounded-xl sm:rounded-2xl hover:bg-stone-800 transition-all w-full sm:w-auto text-sm sm:text-base">
              {t('joinBtn')}
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 relative h-48 sm:h-64 mt-6 sm:mt-0">
            <img 
               src="/headerBanner.webp"
               className="rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl absolute -bottom-6 sm:-bottom-10 -right-4 sm:right-0 transform rotate-3 sm:rotate-6 border-4 sm:border-8 border-white object-cover w-full h-full"
               alt="Spices"
            />
        </div>
      </section>
    </div>
  );
}
