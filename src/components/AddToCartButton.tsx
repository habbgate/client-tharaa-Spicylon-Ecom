'use client';

import { useStore } from '@/store/useStore';
import { useTranslations } from 'next-intl';

const AddToCartButton = ({ product, price }: { product: any, price: number }) => {
    const addToCart = useStore((state) => state.addToCart);
    const t = useTranslations('Product');

    return (
        <button
            onClick={() => addToCart(product, price)}
            className="w-full sm:w-auto px-12 py-5 bg-stone-900 hover:bg-stone-800 text-white font-black rounded-2xl transition-all shadow-xl active:scale-95 text-lg"
        >
            {t('addToCart')}
        </button>
    );
};

export default AddToCartButton;
