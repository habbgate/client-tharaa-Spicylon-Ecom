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

          <footer className="bg-stone-950 text-white pt-10 pb-5 border-t border-stone-800 relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-stone-800/20 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-6 mb-10 items-start">

                {/* Brand & Mission */}
                <div className="col-span-1 md:col-span-12 lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left">

                  <div className="mb-3">
                    <Image
                      src="/logo.png"
                      alt="Spicylon"
                      width={380}
                      height={120}
                      className="h-24 lg:h-28 w-auto object-contain"
                    />
                  </div>

                  <p className="text-stone-400 mb-5 max-w-sm leading-relaxed text-base">
                    Authentic flavors, directly from Sri Lankan plantations. We
                    celebrate the rich heritage of the ancient Ceylon spice
                    trade by bringing you pure, unadulterated spices.
                  </p>

                  {/* Social Icons */}
                  <div className="flex gap-3">

                    <a
                      href="https://www.facebook.com/spicylon"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-stone-800 bg-stone-900/50 flex items-center justify-center text-stone-400 hover:text-white hover:border-orange-500 hover:bg-orange-600 transition-all group"
                    >
                      <FaFacebookF className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>

                    <a
                      href="https://www.instagram.com/spicylon.official"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-stone-800 bg-stone-900/50 flex items-center justify-center text-stone-400 hover:text-white hover:border-orange-500 hover:bg-orange-600 transition-all group"
                    >
                      <FaInstagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </a>

                  </div>
                </div>

                {/* Quick Links */}
                <div className="col-span-1 md:col-span-4 lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">

                  <h4 className="text-lg font-black mb-4 text-stone-100 tracking-wide uppercase text-sm">
                    Explore
                  </h4>

                  <ul className="space-y-3 text-stone-400">

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

                {/* Contact Info */}
                <div className="col-span-1 md:col-span-4 lg:col-span-3 flex flex-col items-center lg:items-start text-center lg:text-left">

                  <h4 className="text-lg font-black mb-4 text-stone-100 tracking-wide uppercase text-sm">
                    Get In Touch
                  </h4>

                  <ul className="space-y-3 text-stone-400">

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
                        T & T ketheeswaran <br />Sole Proprietorship (Einzelunternehmen)
                        <br />
                        Am Platz 6
                        <br />
                        7310 Bad Ragaz
                        <br />
                        <span className="text-sm text-stone-500">Reg: CHE-394.479.338</span>
                      </span>
                    </li>

                  </ul>
                </div>

                {/* Payment Methods */}
                <div className="col-span-1 md:col-span-4 lg:col-span-2 flex flex-col items-center lg:items-start text-center lg:text-left">

                  <h4 className="text-lg font-black mb-4 text-stone-100 tracking-wide uppercase text-sm">
                    Payment Methods
                  </h4>

                  <div className="flex flex-row flex-wrap gap-2 items-center justify-center lg:justify-start max-w-[180px]">

                    {[
                      { img: "6e15aec17f1a1974593c294359295cd7.png", alt: "Visa" },
                      { img: "pngwing.com (23).png", alt: "Mastercard" },
                      { img: "pngwing.com (24).png", alt: "Apple Pay" },
                      { img: "pngwing.com (25).png", alt: "American Express" },
                      { img: "pngwing.com (27).png", alt: "PayPal" },
                      { img: "twint-logo.svg", alt: "TWINT" },
                      { img: "postfinance-logo.png", alt: "PostFinance" }
                    ].map(({ img, alt }) => (

                      <div
                        key={img}
                        aria-label={alt}
                        className="bg-white rounded overflow-hidden flex items-center justify-center border border-stone-200"
                        style={{ width: "40px", height: "26px" }}
                      >
                        <div className="relative w-full h-full p-[2px]">
                          <Image
                            src={`/paymenttypes/${img}`}
                            alt={alt}
                            fill
                            sizes="40px"
                            className="object-contain p-[2px]"
                          />
                        </div>
                      </div>

                    ))}

                  </div>
                </div>

              </div>

              {/* Bottom Copyright Bar */}
              <div className="border-t border-stone-800/80 pt-5 flex flex-col md:flex-row justify-between items-center gap-3 text-stone-500 text-sm font-medium">

                <div className="flex flex-col md:flex-row w-full justify-between items-center gap-3 px-2">

                  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 order-3 md:order-1">

                    <span className="text-stone-400">
                      &copy; {new Date().getFullYear()} Spicylon. All rights reserved.
                    </span>

                    <span className="hidden md:inline-block text-stone-600">|</span>

                    <span className="flex items-center gap-1.5 text-stone-300 text-xs text-opacity-80">

                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="12" r="12" fill="currentColor" />
                        <text
                          x="12"
                          y="17"
                          textAnchor="middle"
                          fontSize="13"
                          fill="#1c1917"
                          fontFamily="Arial, Helvetica, sans-serif"
                          fontWeight="bold"
                        >
                          H
                        </text>
                      </svg>

                      Developed by
                      <span className="text-white font-medium">
                        HABB PVT LTD
                      </span>

                      <a
                        href="https://www.habb.lk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-stone-400 hover:text-white transition-colors"
                      >
                        www.habb.lk
                      </a>

                    </span>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 order-1 md:order-3">

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
