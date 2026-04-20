'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { HiCheckCircle } from 'react-icons/hi';
import { useTranslations } from 'next-intl';
import axios from 'axios';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('orderId');
  const { clearCart } = useStore();
  const t = useTranslations('OrderSuccess');

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
    if (orderId) {
      axios.put(`/api/orders/${orderId}/pay`).catch(console.error);
    }
  }, [sessionId, orderId, clearCart]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <HiCheckCircle className="h-32 w-32 text-orange-500 mb-8" />
      <h1 className="text-5xl font-black mb-4 tracking-tighter">{t('title')}</h1>
      <p className="text-stone-500 text-lg mb-8 max-w-lg text-center leading-relaxed">
        {t('message')}
      </p>
      
      <div className="space-x-4">
        <Link href="/" className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all inline-block shadow-lg shadow-stone-900/20">
          {t('homeBtn')}
        </Link>
        <Link href="/products" className="px-8 py-3 bg-orange-100 text-orange-700 font-bold rounded-xl hover:bg-orange-200 transition-all inline-block">
          Order More Spices
        </Link>
      </div>
    </div>
  );
}