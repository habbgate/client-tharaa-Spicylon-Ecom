'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { useTranslations } from 'next-intl';

const ProductCard = ({ product, currency }: { product: any, currency: string }) => {
    const addToCart = useStore((state) => state.addToCart);
    const t = useTranslations('Product');
    const price = product.price[currency];

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-2xl transition-all duration-300 group">
            <Link href={`/products/${product._id}`} className="block relative h-64 overflow-hidden">
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-x-0 bottom-0 py-2 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="ml-4 text-xs font-bold text-orange-300 uppercase tracking-widest">{product.category}</span>
                </div>
            </Link>

            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold group-hover:text-orange-600 transition-colors">{product.name}</h3>
                </div>

                <p className="text-stone-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {product.description}
                </p>

                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-black text-stone-900">
                            {currency} {price.toFixed(2)}
                        </span>
                    </div>
                    <button
                        disabled={product.stock <= 0}
                        onClick={() => addToCart(product, price)}
                        className={`px-6 py-2.5 font-bold rounded-xl transition-all shadow-lg text-sm ${
                            product.stock <= 0 
                            ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none' 
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200'
                        }`}
                    >
                        {product.stock <= 0 ? t('outOfStock') : t('addToCart')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
