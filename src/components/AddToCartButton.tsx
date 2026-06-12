'use client';

import { useStore } from '@/store/useStore';
import { useTranslations } from 'next-intl';
import { toast } from 'react-hot-toast';

const AddToCartButton = ({ product, price }: { product: any, price: number }) => {
    const addToCart = useStore((state) => state.addToCart);
    const t = useTranslations('Product');
    const outOfStock = product.stock <= 0;

    return (
        <button
            onClick={() => {
                addToCart(product, price);
                toast.success("Product added to cart", {
                    icon: '🛒',
                    style: {
                      borderRadius: '10px',
                      background: '#333',
                      color: '#fff',
                    },
                });
            }}
            disabled={outOfStock}
            className={`w-full sm:w-auto px-12 py-5 font-black rounded-2xl transition-all shadow-xl active:scale-95 text-lg ${
                outOfStock 
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed shadow-none'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
        >
            {outOfStock ? t('outOfStock') : t('addToCart')}
        </button>
    );
};

export default AddToCartButton;
