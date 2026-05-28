"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  name,
  outOfStockLabel,
}: {
  images: string[];
  name: string;
  outOfStockLabel?: string;
}) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="lg:w-1/2">
      <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-stone-100 bg-stone-50">
        <Image
          src={images[selected]}
          alt={name}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        {outOfStockLabel && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-6 py-3 bg-stone-900 text-white font-black uppercase tracking-widest rounded-full text-sm">
              {outOfStockLabel}
            </span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4">
          {images.slice(0, 4).map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-colors ${
                selected === i
                  ? "border-orange-500"
                  : "border-stone-200 hover:border-orange-400"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
