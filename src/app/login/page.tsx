'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useStore((state) => state.setUser);
  const t = useTranslations('Auth');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      
      const { data } = await axios.post(endpoint, payload);
      setUser(data.user);
      toast.success(isLogin ? t('welcomeBack') : t('accountCreated'));
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200">
        <div className="bg-stone-900 py-8 px-4 text-center">
             <h2 className="text-3xl font-black text-white italic tracking-tighter">Spicylon</h2>
             <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mt-2">
                {isLogin ? t('loginTitle') : t('registerTitle')}
             </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">{t('nameLabel')}</label>
              <input
                type="text"
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">{t('emailLabel')}</label>
            <input
              type="email"
              required
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-2">{t('passwordLabel')}</label>
            <input
              type="password"
              required
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 transition-all outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
          >
            {loading ? (isLogin ? t('signingIn') : t('signingUp')) : (isLogin ? t('signInBtn') : t('signUpBtn'))}
          </button>

          <div className="text-center pt-4">
            <button
              type="button"
              className="text-stone-500 hover:text-orange-600 font-bold text-sm"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? `${t('noAccount')} ${t('switchRegister')}` : `${t('hasAccount')} ${t('switchLogin')}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
