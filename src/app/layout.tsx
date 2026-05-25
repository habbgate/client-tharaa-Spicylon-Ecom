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
            href="https://wa.me/41789544455"
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
                        href="https://wa.me/41789544455"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors"
                      >
                        +41 78 954 44 55
                      </a>
                    </li>
                    <li className="flex gap-3 justify-center lg:justify-start text-left">
                      <span className="text-orange-500 font-bold mt-1">A.</span>
                      <span>
                        Am Platz 6<br />
                        7310 Bad Ragaz
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
                      <div className="flex flex-wrap gap-1.5 items-center justify-center lg:justify-start">
                        {/* Dynamically show all payment type images from public/paymenttypes */}
                        {[
                          { img: "6e15aec17f1a1974593c294359295cd7.png", alt: "Visa", url: "https://www.visa.com/" },
                          { img: "pngwing.com (23).png", alt: "Mastercard", url: "https://www.mastercard.com/" },
                          { img: "pngwing.com (24).png", alt: "Apple Pay", url: "https://www.apple.com/apple-pay/" },
                          { img: "pngwing.com (25).png", alt: "American Express", url: "https://www.americanexpress.com/" },
                          { img: "pngwing.com (27).png", alt: "PayPal", url: "https://www.paypal.com/" },
                          { img: "twint-logo.svg", alt: "TWINT", url: "https://www.twint.ch/" }
                        ].map(({ img, alt, url }) => (
                          <a
                            key={img}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={alt}
                            className="inline-flex hover:opacity-80 transition-opacity"
                          >
                            <Image
                              src={`/paymenttypes/${img}`}
                              alt={alt}
                              width={36}
                              height={20}
                              className="h-6 w-auto object-contain bg-white/90 rounded-[3px] px-1 py-0.5"
                            />
                          </a>
                        ))}
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Bottom Copyright Bar */}
              <div className="border-t border-stone-800/80 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-stone-500 text-sm font-medium">
                <div className="flex flex-col md:flex-row w-full justify-between items-center gap-4">
                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 order-3 md:order-1">
                    <span className="text-stone-400">&copy; {new Date().getFullYear()} Spicylon. All rights reserved.</span>
                    <span className="hidden md:inline-block text-stone-600">|</span>
                    <span className="flex items-center gap-1.5 text-stone-300 text-xs text-opacity-80">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="12" fill="currentColor"/><text x="12" y="17" textAnchor="middle" fontSize="13" fill="#1c1917" fontFamily="Arial, Helvetica, sans-serif" fontWeight="bold">H</text></svg>
                      Developed by <span className="text-white font-medium">HABB PVT LTD</span>
                      <a href="https://www.habb.lk" target="_blank" rel="noopener noreferrer" className="ml-1 text-stone-400 hover:text-white transition-colors">www.habb.lk</a>
                    </span>
                  </div>
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
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
