"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useTranslations } from "next-intl";
import { HiStar, HiOutlineShoppingCart, HiOutlineEye } from "react-icons/hi";
import { toast } from "react-hot-toast";

const ProductCard = ({
  product,
  currency,
}: {
  product: any;
  currency: string;
}) => {
  const addToCart = useStore((state) => state.addToCart);
  const t = useTranslations("Product");
  const price = product.price[currency];
  const rating = product.rating || 0;
  const numReviews = product.numReviews || 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 group flex flex-col">
      {/* Image */}
      <Link
        href={`/products/${product._id}`}
        className="block relative h-60 overflow-hidden bg-stone-50 flex-shrink-0"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-stone-900/80 backdrop-blur-sm text-orange-300 text-[10px] font-black uppercase tracking-widest rounded-full">
            {product.category}
          </span>
        </div>
        {/* Stock badge */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-stone-900 text-white text-xs font-black uppercase tracking-widest rounded-full">
              {t("outOfStock")}
            </span>
          </div>
        )}
        {/* Quick View overlay */}
        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <span className="flex items-center gap-1.5 bg-white text-stone-900 font-bold text-xs px-3 py-1.5 rounded-full shadow-lg">
              <HiOutlineEye className="w-3.5 h-3.5" />
              Quick View
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-grow">
        {/* Rating */}
        {numReviews > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <HiStar
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "text-orange-400" : "text-stone-200"}`}
                />
              ))}
            </div>
            <span className="text-stone-400 text-xs font-medium">
              ({numReviews})
            </span>
          </div>
        )}

        <h3 className="text-base font-bold text-stone-900 group-hover:text-orange-600 transition-colors mb-1 line-clamp-1">
          {product.name}
        </h3>

        <p className="text-stone-400 text-xs line-clamp-2 mb-4 leading-relaxed flex-grow">
          {product.description}
        </p>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-100">
          <div>
            <span className="text-xl font-black text-stone-900">
              {currency} {price.toFixed(2)}
            </span>
          </div>
          <button
            disabled={product.stock <= 0}
            onClick={() => {
              addToCart(product, price);
              toast.success("Product added to cart", {
                icon: '🛒',
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
              });
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-bold rounded-xl transition-all text-sm ${
              product.stock <= 0
                ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : "bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-200 hover:shadow-orange-300 active:scale-95"
            }`}
          >
            <HiOutlineShoppingCart className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">
              {product.stock <= 0 ? t("outOfStock") : t("addToCart")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
