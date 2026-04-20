'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { HiCheckCircle, HiDownload } from 'react-icons/hi';
import { useTranslations } from 'next-intl';
import axios from 'axios';
import { generateInvoice } from '@/lib/generateInvoice';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('orderId');
  const { clearCart } = useStore();
  const t = useTranslations('OrderSuccess');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
    
    const finalizeOrder = async () => {
      if (orderId) {
        try {
          const { data } = await axios.put(`/api/orders/${orderId}/pay`);
          setOrder(data);
        } catch (error) {
          console.error(error);
        }
      }
    };
    
    finalizeOrder();
  }, [sessionId, orderId, clearCart]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <HiCheckCircle className="h-32 w-32 text-orange-500 mb-8" />
      <h1 className="text-5xl font-black mb-4 tracking-tighter">{t('title')}</h1>
      <p className="text-stone-500 text-lg mb-8 max-w-lg text-center leading-relaxed">
        {t('message')}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className="px-8 py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all inline-block shadow-lg shadow-stone-900/20 text-center">
          {t('homeBtn')}
        </Link>
        <Link href="/products" className="px-8 py-3 bg-orange-100 text-orange-700 font-bold rounded-xl hover:bg-orange-200 transition-all inline-block text-center">
          Order More Spices
        </Link>
        {order && (
          <button 
            onClick={() => generateInvoice(order)}
            className="px-8 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20"
          >
            <HiDownload className="text-xl" />
            Download Invoice
          </button>
        )}
      </div>
    </div>
  );
}