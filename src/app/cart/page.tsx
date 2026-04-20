'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineMinus, HiOutlineArrowRight } from 'react-icons/hi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, user, currency } = useStore();
  const t = useTranslations('Cart');

  const [deliveryAmount, setDeliveryAmount] = useState(0);
  const [shipping, setShipping] = useState({ fullName: '', address: '', city: '', postalCode: '', country: '', phone: '' });

  useEffect(() => {
    axios.get('/api/settings').then(({data}) => {
      const dm = data.find((s: any) => s.key === 'deliveryCost_' + currency);
      if(dm) setDeliveryAmount(Number(dm.value));
    }).catch(console.error);

    if (user) {
      setShipping({
        fullName: user.name || '',
        address: user.address?.address || '',
        city: user.address?.city || '',
        postalCode: user.address?.postalCode || '',
        country: user.address?.country || '',
        phone: user.address?.phone || ''
      });
    }
  }, [user, currency]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      toast.error(t('loginReq'));
      return;
    }

    if (!shipping.fullName || !shipping.address || !shipping.city || !shipping.phone) {
      toast.error('Please fill out all required delivery details.');
      return;
    }

    try {
      // First, create the order in MongoDB
      const orderRes = await axios.post('/api/orders', {
        orderItems: cart.map(i => ({ name: i.name, quantity: i.quantity, image: i.image, price: i.price, product: i.id })),
        shippingAddress: shipping,
        paymentMethod: 'Stripe',
        itemsPrice: total,
        shippingPrice: deliveryAmount,
        totalPrice: total + deliveryAmount,
        userId: user._id || user.id,
        currency: currency
      });

      // Pass the created orderId to Stripe checkout
      const { data } = await axios.post('/api/checkout', {
        items: cart,
        email: user.email,
        currency: currency,
        orderId: orderRes.data._id,
        deliveryAmount
      });

      if (data.url) {
        window.location.href = data.url;
      } else if (data.message) {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('errorCheck'));
      console.error(error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="text-8xl mb-8">🛒</div>
        <h2 className="text-4xl font-black mb-4 tracking-tighter">{t('emptyHeading')}</h2>
        <p className="text-stone-500 mb-8">{t('emptySub')}</p>
        <Link href="/products" className="px-10 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all">
          {t('browseBtn')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-5xl font-black mb-12 tracking-tighter italic">{t('title')} <span className="text-orange-600">{t('titleSpan')}</span></h1>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="lg:w-2/3 space-y-6">
          {cart.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-32 w-32 rounded-2xl overflow-hidden flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                <p className="text-stone-500 font-bold mb-4">{currency} {item.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-stone-100 rounded-xl p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <HiOutlineMinus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                    >
                      <HiOutlinePlus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <HiOutlineTrash className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-stone-900">
                  {currency} {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
            <h2 className="text-2xl font-black mb-6">Delivery Details</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Full Name *</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-orange-500 outline-none" required value={shipping.fullName} onChange={(e) => setShipping({...shipping, fullName: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-stone-700 mb-1">Address *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-orange-500 outline-none" required value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">City *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-orange-500 outline-none" required value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Postal Code</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-orange-500 outline-none" value={shipping.postalCode} onChange={(e) => setShipping({...shipping, postalCode: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Country</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-orange-500 outline-none" value={shipping.country} onChange={(e) => setShipping({...shipping, country: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-stone-700 mb-1">Phone *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-orange-500 outline-none" required value={shipping.phone} onChange={(e) => setShipping({...shipping, phone: e.target.value})} />
                </div>
              </div>
            </form>
          </div>

          <div className="bg-stone-900 rounded-[3rem] p-10 text-white sticky top-24 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <h2 className="text-3xl font-black mb-8 italic">{t('summary')}</h2>
            
            <div className="space-y-4 mb-10 border-b border-stone-800 pb-8">
              <div className="flex justify-between text-stone-400 font-medium">
                <span>{t('subtotal')}</span>
                <span>{currency} {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400 font-medium">
                <span>{t('shipping')}</span>
                <span>{currency} {(deliveryAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-black pt-4 text-white">
                <span>{t('total')}</span>
                <span className="text-orange-500">{currency} {(total + deliveryAmount).toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
            >
              {t('checkoutBtn')}
              <HiOutlineArrowRight className="h-6 w-6" />
            </button>
            
            <p className="mt-8 text-center text-xs text-stone-500 font-medium uppercase tracking-widest">
              {t('secure')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
