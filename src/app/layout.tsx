import Footer from "@/components/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import "./fonts.css";
import RouteIntro from "@/components/RouteIntro";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { FaWhatsapp } from "react-icons/fa";

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
    icon: "/favicon-mark.png",
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
      <head>
        <link rel="preload" href="/fonts/manrope-400.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/manrope-500.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body
        className="bg-stone-50 text-stone-900 font-sans"
        suppressHydrationWarning
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Toaster position="bottom-right" />
          <Navbar />
          <main><RouteIntro />{children}</main>

          {/* Floating WhatsApp Button */}
          <a
            href="https://wa.me/94757820611"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-5 right-4 lg:bottom-8 lg:right-8 z-50 bg-[#25D366] text-white p-3.5 lg:p-4 rounded-full shadow-lg hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/30 transition-all duration-300 flex items-center justify-center group"
            aria-label="Chat with us on WhatsApp"
          >
            <FaWhatsapp className="w-7 h-7 lg:w-8 lg:h-8" />
            <span className="absolute right-full mr-4 bg-white text-stone-800 text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Chat with us
            </span>
          </a>

          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
