import ProductCard from '@/components/ProductCard';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';

async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();
  const cookieStore = await cookies();
  const currency = cookieStore.get('currency')?.value || 'USD';
  const t = await getTranslations('Products');

  return (
    <div className="pb-20">
      {/* Header Section */}
      <section className="bg-stone-900 text-white py-20 px-4 mb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 italic tracking-tighter">
            {t('title')} <span className="text-orange-500">{t('titleSpan')}</span>
          </h1>
          <p className="text-xl text-stone-300 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} currency={currency} />
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-stone-700">No products found</h3>
            <p className="text-stone-500 mt-2">Please check back later.</p>
          </div>
        )}
      </section>
    </div>
  );
}
