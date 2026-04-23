import ProductCard from '@/components/ProductCard';
import { cookies } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { Pagination } from '@/components/Pagination';
import { redirect } from 'next/navigation';
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

export default async function ProductsPage({ searchParams }: { searchParams: { page?: string } }) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const ITEMS_PER_PAGE = 8;

  const products = await getProducts();
  const cookieStore = await cookies();
  const currency = cookieStore.get('currency')?.value || 'USD';
  const t = await getTranslations('Products');

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  
  if (currentPage > totalPages && totalItems > 0) {
      redirect(`/products?page=${totalPages}`);
  }

  const paginatedProducts = products.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
          {paginatedProducts.map((product: any) => (
            <ProductCard key={product._id} product={product} currency={currency} />
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-stone-700">No products found</h3>
            <p className="text-stone-500 mt-2">Please check back later.</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="mt-12 flex justify-center">
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
