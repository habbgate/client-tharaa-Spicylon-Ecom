import Image from 'next/image';
import { cookies } from 'next/headers';
import AddToCartButton from '@/components/AddToCartButton';
import ReviewSection from '@/components/ReviewSection';
import { HiOutlineShieldCheck, HiOutlineTruck, HiOutlineRefresh, HiStar } from 'react-icons/hi';
import { getTranslations } from 'next-intl/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models';

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

export default async function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  const cookieStore = await cookies();
  const currency = cookieStore.get('currency')?.value || 'USD';
  const t = await getTranslations('Product');

  if (!product) return <div className="text-center py-20">{t('notFound')}</div>;

  const price = product.price[currency];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Gallery */}
        <div className="lg:w-1/2">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-stone-200">
            <Image 
              src={product.images[0]} 
              alt={product.name} 
              fill 
              className="object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="lg:w-1/2 flex flex-col">
          <div className="mb-8">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
              {product.category}
            </span>
            <h1 className="text-5xl font-black text-stone-900 mb-4 tracking-tighter">{product.name}</h1>
            
            {/* Reviews Summary */}
            <div className="flex items-center gap-2 mb-4">
               <div className="flex text-orange-500">
                 {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? 'text-orange-500' : 'text-stone-200'}`} />
                 ))}
               </div>
               <span className="text-stone-500 font-medium text-sm">
                 ({product.numReviews || 0} {(product.numReviews || 0) === 1 ? t('review') : t('reviewMultiple')})
               </span>
            </div>

            <div className="flex items-center gap-4 text-3xl font-black text-orange-600">
              {currency} {price.toFixed(2)}
            </div>
          </div>

          <p className="text-stone-600 text-lg leading-relaxed mb-10 border-l-4 border-orange-500 pl-6 italic">
            {product.description}
          </p>

          <div className="mb-12">
             <AddToCartButton product={product} price={price} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-stone-200">
            <div className="flex flex-col items-center text-center">
               <HiOutlineShieldCheck className="h-8 w-8 text-stone-400 mb-2" />
               <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">{t('feat1')}</span>
            </div>
            <div className="flex flex-col items-center text-center">
               <HiOutlineTruck className="h-8 w-8 text-stone-400 mb-2" />
               <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">{t('feat2')}</span>
            </div>
            <div className="flex flex-col items-center text-center">
               <HiOutlineRefresh className="h-8 w-8 text-stone-400 mb-2" />
               <span className="text-xs font-bold uppercase text-stone-500 tracking-wider">{t('feat3')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection productId={product._id} initialReviews={product.reviews || []} />
    </div>
  );
}
