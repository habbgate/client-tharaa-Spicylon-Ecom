import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { Toaster } from "react-hot-toast";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaCreditCard, FaCcVisa, FaCcMastercard, FaCcAmex, FaCcApplePay } from "react-icons/fa";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://spicylon.com"),
  title: {
    default: "Spicylon | Premium Ceylon Spices",
    template: "%s | Spicylon",
  },
  description:
    "Shop authentic single-origin Ceylon spices — cinnamon, cardamom, turmeric, pepper and more — sourced directly from highland farms in Sri Lanka and shipped worldwide.",
  keywords: [
    "Ceylon spices",
    "Sri Lanka spices",
    "authentic cinnamon",
    "Ceylon cinnamon",
    "buy spices online",
    "single origin spices",
    "organic spices Sri Lanka",
    "Spicylon",
    "turmeric",
    "cardamom",
    "black pepper",
    "cloves",
  ],
  authors: [{ name: "Spicylon", url: "https://spicylon.com" }],
  creator: "Spicylon",
  publisher: "Spicylon",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://spicylon.com",
    siteName: "Spicylon",
    title: "Spicylon | Premium Ceylon Spices",
    description:
      "Authentic single-origin Ceylon spices sourced directly from Sri Lankan highland farms. Shop cinnamon, cardamom, turmeric, pepper and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Spicylon — Premium Ceylon Spices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spicylon | Premium Ceylon Spices",
    description:
      "Authentic single-origin Ceylon spices sourced directly from Sri Lankan highland farms.",
    images: ["/og-image.jpg"],
    creator: "@spicylon",
  },
  alternates: {
    canonical: "https://spicylon.com",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
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
      <body
        className={`${inter.className} bg-stone-50 text-stone-900`}
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Toaster position="bottom-right" />
          <Navbar />
          <main>{children}</main>

          {/* Floating WhatsApp Button */}
          <a
            href="https://wa.me/41764065212"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 bg-[#25D366] text-white p-3.5 lg:p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300 flex items-center justify-center group"
            aria-label="Chat with us on WhatsApp"
          >
            <FaWhatsapp className="w-7 h-7 lg:w-8 lg:h-8" />
            <span className="absolute right-full mr-4 bg-white text-stone-800 text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Chat with us
            </span>
          </a>

          <footer className="bg-stone-950 text-white pt-16 pb-8 lg:pt-24 border-t border-stone-800 relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-stone-800/20 rounded-full blur-3xl"></div>
            </div>
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
                {/* Brand & Mission */}
                <div className="col-span-1 md:col-span-12 lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="mb-6">
                    <Image
                      src="/logo.png"
                      alt="Spicylon"
                      width={380}
                      height={120}
                      className="h-36 lg:h-40 w-auto object-contain"
                    />
                  </div>
                  <p className="text-stone-400 mb-8 max-w-md leading-relaxed text-lg">
                    Authentic flavors, directly from Sri Lankan plantations. We
                    celebrate the rich heritage of the ancient Ceylon spice
                    trade by bringing you pure, unadulterated spices.
                  </p>

                  {/* Social Icons */}
                  <div className="flex gap-4 mb-8 lg:mb-0">
                    <a
                      href="https://www.facebook.com/spicylon"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border border-stone-800 bg-stone-900/50 flex items-center justify-center text-stone-400 hover:text-white hover:border-orange-500 hover:bg-orange-600 transition-all group"
                    >
                      <FaFacebookF className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                    <a
                      href="https://www.instagram.com/spicylon.official"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full border border-stone-800 bg-stone-900/50 flex items-center justify-center text-stone-400 hover:text-white hover:border-orange-500 hover:bg-orange-600 transition-all group"
                    >
                      <FaInstagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="col-span-1 md:col-span-4 lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <h4 className="text-xl font-black mb-6 text-stone-100 tracking-wide uppercase text-sm">
                    Explore
                  </h4>
                  <ul className="space-y-4 text-stone-400">
                    <li>
                      <a
                        href="/products"
                        className="hover:text-orange-500 transition-colors inline-block hover:-translate-y-0.5 duration-200"
                      >
                        Shop Spices
                      </a>
                    </li>
                    <li>
                      <a
                        href="/about"
                        className="hover:text-orange-500 transition-colors inline-block hover:-translate-y-0.5 duration-200"
                      >
                        Our Story
                      </a>
                    </li>
                    <li>
                      <a
                        href="/faq"
                        className="hover:text-orange-500 transition-colors inline-block hover:-translate-y-0.5 duration-200"
                      >
                        FAQ
                      </a>
                    </li>
                    <li>
                      <a
                        href="/contact"
                        className="hover:text-orange-500 transition-colors inline-block hover:-translate-y-0.5 duration-200"
                      >
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="/login"
                        className="hover:text-orange-500 transition-colors inline-block hover:-translate-y-0.5 duration-200"
                      >
                        My Account
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Partners */}
                <div className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <h4 className="text-xl font-black mb-6 text-stone-100 tracking-wide uppercase text-sm">
                    Partners
                  </h4>
                  <div className="bg-stone-900/80 backdrop-blur-sm border border-stone-800 p-5 rounded-2xl hover:border-orange-900/50 transition-colors group cursor-pointer inline-block w-full max-w-xs">
                    <span className="text-[10px] font-bold text-orange-600 block uppercase tracking-widest mb-2 flex items-center gap-2 justify-center lg:justify-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse"></span>
                      Official Supplier
                    </span>
                    <span className="text-stone-200 font-black block text-lg">
                      Ceylon Spice Garden
                    </span>
                    <p className="text-stone-500 text-xs mt-2 leading-relaxed">
                      Authentic Sri Lankan spices and Ayurvedic botanical
                      ingredients.
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="col-span-1 md:col-span-4 lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">
                  <h4 className="text-xl font-black mb-6 text-stone-100 tracking-wide uppercase text-sm">
                    Get In Touch
                  </h4>
                  <ul className="space-y-4 text-stone-400">
                    <li className="flex items-center gap-3 justify-center lg:justify-start">
                      <span className="text-orange-500 font-bold">E.</span>
                      <a
                        href="mailto:info@spicylon.com"
                        className="hover:text-white transition-colors"
                      >
                        info@spicylon.com
                      </a>
                    </li>
                    <li className="flex items-center gap-3 justify-center lg:justify-start">
                      <span className="text-orange-500 font-bold">T.</span>
                      <a
                        href="https://wa.me/41764065212"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        +41 76 406 52 12
                      </a>
                    </li>
                    <li className="flex gap-3 justify-center lg:justify-start text-left">
                      <span className="text-orange-500 font-bold mt-1">A.</span>
                      <span>
                        T&T Ketheeswaran<br />
                        Bad Ragaz<br />
                        Switzerland
                      </span>
                    </li>
                    <li className="pt-4">
                      <a
                        href="/contact"
                        className="text-sm font-bold text-stone-500 border-b border-stone-700 hover:text-white hover:border-orange-500 transition-all pb-1 tracking-wider uppercase"
                      >
                        Contact Support
                      </a>
                    </li>
                    <li className="pt-6 mt-6 border-t border-stone-800/80 w-full flex flex-col items-center lg:items-start gap-3">
                      <span className="text-xs uppercase tracking-wider text-stone-500 font-bold">Payment Methods</span>
                      <div className="flex flex-wrap gap-2 items-center justify-center lg:justify-start">
                        {/* TWINT Logo SVG */}
                        <div className="bg-white rounded px-2 py-1 flex items-center justify-center h-8">
                          <svg viewBox="0 0 100 30" width="40" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.92 23.3h-4.3l-1.33-4.74h-.13l-1.3 4.74H1.54L5.6 9.87h4.08l4.03 13.43zm1.6-13.43h3.5v13.43h-3.5V9.87zm12.33 13.43h-4.08l-4.14-9.61h-.1v9.61h-3.5V9.87h4.15L23.2 19.3h.1V9.87h3.5v13.43zm11.23 0h-3.5V13.12h-3.03V9.87h9.54v3.25h-3.01V23.3z" fill="#000" />
                            <path d="M43.62 14.16c-1.22-.84-2.58-1.46-4-1.78v-1.7c.94.13 1.83.47 2.62.98l1.45-3.05c-1.3-.87-2.8-1.42-4.38-1.63V4.93h-3.32v2.1c-1.52.3-2.9.96-4.06 1.94-1.12.96-1.92 2.25-2.28 3.66.42 1.9 1.45 3.55 2.92 4.67 1.25.95 2.66 1.63 4.14 1.97v1.89a9.55 9.55 0 0 1-3.23-1.2l-1.45 3.01c1.37.95 2.95 1.54 4.61 1.74v2.09h3.32v-2.09c1.64-.28 3.16-1.02 4.41-2.14 1.15-1.05 1.94-2.45 2.26-3.98-.38-2.02-1.46-3.76-3.01-4.93zm-8.32.18c-.85-.6-1.44-1.46-1.66-2.44.17-.74.6-1.39 1.21-1.81.76-.52 1.68-.84 2.64-.93v5.27c-.77-.07-1.48-.42-2.19-.09zm5.35 4.85c-.96.65-2.12 1.04-3.3 1.12v-5.59c.77.1 1.49.33 2.15.69.87.65 1.46 1.58 1.66 2.62-.16.51-.43.98-.82 1.34L40.65 19.2z" fill="#000" />
                          </svg>
                        </div>
                        <FaCcVisa className="text-white text-3xl opacity-80 hover:opacity-100 transition-opacity" />
                        <FaCcMastercard className="text-white text-3xl opacity-80 hover:opacity-100 transition-opacity" />
                        <FaCcAmex className="text-white text-3xl opacity-80 hover:opacity-100 transition-opacity" />
                        <FaCcApplePay className="text-white text-3xl opacity-80 hover:opacity-100 transition-opacity" />
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Copyright Bar */}
              <div className="border-t border-stone-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-stone-500 text-sm font-medium">
                <p className="order-3 md:order-1">
                  &copy; {new Date().getFullYear()} Spicylon. All rights
                  reserved.
                </p>

                <div className="flex flex-wrap justify-center gap-6 order-1 md:order-3">
                  <a
                    href="/privacy-policy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="/refund-policy"
                    className="hover:text-white transition-colors"
                  >
                    Refund Policy
                  </a>
                  <a
                    href="/terms-of-service"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
