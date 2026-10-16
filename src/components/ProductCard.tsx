"use client";

import Image from "@/components/ProgressiveImage";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useTranslations } from "next-intl";
import { HiStar, HiOutlinePlus } from "react-icons/hi";
import { toast } from "react-hot-toast";

export default function ProductCard({ product, currency }: { product: any; currency: string }) {
  const addToCart = useStore(state => state.addToCart);
  const t = useTranslations("Product");
  const price = Number(product.price[currency]);
  const available = product.stock > 0 && Number.isFinite(price);
  return <article className="refined-product product-tile">
    <Link href={`/products/${product._id}`} className="product-tile-image">
      <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 767px) 50vw, (max-width: 1100px) 40vw, 25vw" className="object-contain" />
      {!available && <span className="product-tile-unavailable">{t("outOfStock")}</span>}
    </Link>
    <div className="product-tile-content">
      <div className="product-tile-meta"><span>{product.category}</span>{product.numReviews > 0 && <span className="product-tile-rating"><HiStar aria-hidden="true" />{Number(product.rating || 0).toFixed(1)} <small>({product.numReviews})</small></span>}</div>
      <h3><Link href={`/products/${product._id}`}>{product.name}</Link></h3>
      <div className="product-tile-price"><span>{currency}</span>{Number.isFinite(price) ? price.toFixed(2) : "—"}</div>
      <button className="product-tile-add" disabled={!available} aria-label={`${t("addToCart")}: ${product.name}`} onClick={() => { addToCart(product, price); toast.success("Product added to cart"); }}><span>{available ? t("addToCart") : t("outOfStock")}</span>{available && <HiOutlinePlus aria-hidden="true" />}</button>
    </div>
  </article>;
}
