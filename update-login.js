const fs = require('fs');
const content = `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useStore } from '@/store/useStore';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showOtp, setShowOtp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
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
      
      if (data.requiresVerification) {
        setShowOtp(true);
        toast.success(data.message);
        setLoading(false);
        return;
      }
      
      setUser(data.user);
      toast.success(isLogin ? t('welcomeBack') : t('accountCreated'));
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || t('error'));
    } finally {
      if (!showOtp) setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/verify-email', { email, otp });
      setUser(data.user);
      toast.success('Email verified successfully!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/auth/resend-otp', { email });
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/google', { token: credentialResponse.credential });
      setUser(data.user);
      toast.success('Successfully logged in with Google!');
      router.push('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-stone-50 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-200">
        <div className="bg-stone-900 py-8 px-4 text-center">
             <h2 className="text-3xl font-black text-white italic tracking-tighter">Spicylon</h2>
             <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mt-2">
                {showOtp ? 'Verification Required' : (isLogin ? t('loginTitle') : t('registerTitle'))}
             </p>
        </div>

        {showOtp ? (
          <form onSubmit={handleVerifyOtp} className="p-8 space-y-6">
            <div className="text-center text-sm font-medium text-stone-600 mb-6">
              We sent a 6-digit verification code to <span className="font-bold text-stone-900">{email}</span>.
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-orange-500 transition-all outline-none text-center text-xl font-bold tracking-[0.5em]"
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl transition-all shadow-lg shadow-orange-100 disabled:opacity-50 mt-4"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
            <div className="text-center pt-4 flex flex-col space-y-3">
              <button
                type="button"
                className="text-stone-500 hover:text-orange-600 font-bold text-sm underline"
                onClick={handleResendOtp}
                disabled={loading}
              >
                Resend Code
              </button>
              <button
                type="button"
                className="text-stone-500 hover:text-orange-600 font-bold text-sm"
                onClick={() => setShowOtp(false)}
              >
                Back to Login
              </button>
            </div>
          </form>
        ) : (
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
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl transition-all shadow-lg shadow-orange-100 disabled:opacity-50 mt-4"
            >
              {loading ? (isLogin ? t('signingIn') : t('signingUp')) : (isLogin ? t('signInBtn') : t('signUpBtn'))}
            </button>

            <div className="relative flex items-center py-5">
              <div className="flex-grow border-t border-stone-200"></div>
              <span className="flex-shrink-0 mx-4 text-stone-400 text-sm font-bold uppercase">or continue with</span>
              <div className="flex-grow border-t border-stone-200"></div>
            </div>
            
            <div className="flex justify-center -mt-2 mb-4">
               <GoogleLogin
                 onSuccess={handleGoogleSuccess}
                 onError={() => toast.error('Google login failed')}
                 useOneTap
                 theme="filled_black"
                 shape="pill"
                 size="large"
               />
            </div>

            <div className="text-center pt-2 flex flex-col space-y-4">
              <button
                type="button"
                className="text-stone-500 hover:text-orange-600 font-bold text-sm"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? \`\${t('noAccount')} \${t('switchRegister')}\` : \`\${t('hasAccount')} \${t('switchLogin')}\`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
    </GoogleOAuthProvider>
  );
}
`;
fs.writeFileSync('src/app/login/page.tsx', content);
