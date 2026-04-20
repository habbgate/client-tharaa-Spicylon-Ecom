import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Spicylon | Premium Ceylon Spices',
  description: 'Authentic spices from the heart of Sri Lanka.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} bg-stone-50 text-stone-900`} suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Toaster position="bottom-right" />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-stone-950 text-white pt-16 pb-8 lg:pt-24 mt-16 sm:mt-20 border-t border-stone-800 relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
               <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl"></div>
               <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-stone-800/20 rounded-full blur-3xl"></div>
            </div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
                {/* Brand & Mission */}
                <div className="col-span-1 md:col-span-12 lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <h3 className="text-4xl font-extrabold text-orange-500 mb-6 tracking-tighter italic">Spicylon</h3>
                  <p className="text-stone-400 mb-8 max-w-md leading-relaxed text-lg">
                    Authentic flavors, directly from Sri Lankan plantations. We celebrate the rich heritage of the ancient Ceylon spice trade by bringing you pure, unadulterated spices.
                  </p>
                  
                  {/* Social Icons */}
                  <div className="flex gap-4 mb-8 lg:mb-0">
                    <a href="#" className="w-12 h-12 rounded-full border border-stone-800 bg-stone-900/50 flex items-center justify-center text-stone-400 hover:text-white hover:border-orange-500 hover:bg-orange-600 transition-all group">
                      <FaFacebookF className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full border border-stone-800 bg-stone-900/50 flex items-center justify-center text-stone-400 hover:text-white hover:border-orange-500 hover:bg-orange-600 transition-all group">
                      <FaInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full border border-stone-800 bg-stone-900/50 flex items-center justify-center text-stone-400 hover:text-white hover:border-orange-500 hover:bg-orange-600 transition-all group">
                      <FaTwitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full border border-stone-800 bg-stone-900/50 flex items-center justify-center text-stone-400 hover:text-white hover:border-orange-500 hover:bg-orange-600 transition-all group">
                      <FaYoutube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="col-span-1 md:col-span-4 lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <h4 className="text-xl font-black mb-6 text-stone-100 tracking-wide uppercase text-sm">Explore</h4>
                  <ul className="space-y-4 text-stone-400">
                    <li><a href="/products" className="hover:text-orange-500 transition-colors inline-block hover:-translate-y-0.5 duration-200">Shop Spices</a></li>
                    <li><a href="/about" className="hover:text-orange-500 transition-colors inline-block hover:-translate-y-0.5 duration-200">Our History</a></li>
                    <li><a href="/login" className="hover:text-orange-500 transition-colors inline-block hover:-translate-y-0.5 duration-200">My Account</a></li>
                    <li><a href="#" className="hover:text-orange-500 transition-colors inline-block hover:-translate-y-0.5 duration-200">Track Order</a></li>
                  </ul>
                </div>

                {/* Partners */}
                <div className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <h4 className="text-xl font-black mb-6 text-stone-100 tracking-wide uppercase text-sm">Partners</h4>
                  <div className="bg-stone-900/80 backdrop-blur-sm border border-stone-800 p-5 rounded-2xl hover:border-orange-900/50 transition-colors group cursor-pointer inline-block w-full max-w-xs">
                    <span className="text-[10px] font-bold text-orange-600 block uppercase tracking-widest mb-2 flex items-center gap-2 justify-center lg:justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse"></span>
                      Official Supplier
                    </span>
                    <a href="https://ceylonspicegarden.com" target="_blank" rel="noopener noreferrer" className="text-stone-200 group-hover:text-orange-400 font-black block text-lg transition-colors">Ceylon Spice Garden</a>
                    <p className="text-stone-500 text-xs mt-2 leading-relaxed">Authentic Sri Lankan spices and Ayurvedic botanical ingredients.</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="col-span-1 md:col-span-4 lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <h4 className="text-xl font-black mb-6 text-stone-100 tracking-wide uppercase text-sm">Get In Touch</h4>
                  <ul className="space-y-4 text-stone-400">
                    <li className="flex items-center gap-3 justify-center lg:justify-start">
                      <span className="text-orange-500 font-bold">E.</span> 
                      <a href="mailto:info@spicylon.com" className="hover:text-white transition-colors">info@spicylon.com</a>
                    </li>
                    <li className="flex items-center gap-3 justify-center lg:justify-start">
                      <span className="text-orange-500 font-bold">T.</span> 
                      <span className="hover:text-white transition-colors">+94 11 234 5678</span>
                    </li>
                    <li className="pt-4">
                      <a href="#" className="text-sm font-bold text-stone-500 border-b border-stone-700 hover:text-white hover:border-orange-500 transition-all pb-1 tracking-wider uppercase">Contact Support</a>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Copyright Bar */}
              <div className="border-t border-stone-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-stone-500 text-sm font-medium">
                <p>&copy; {new Date().getFullYear()} Spicylon. All rights reserved.</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
