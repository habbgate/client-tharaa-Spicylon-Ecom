import Image from "next/image";

export default function BrandLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-artwork ${className}`}>
      <Image
        src="/logo.png"
        alt="Spicylon"
        width={4500}
        height={4500}
        sizes="300px"
        priority
        className="brand-artwork-image"
      />
    </span>
  );
}
