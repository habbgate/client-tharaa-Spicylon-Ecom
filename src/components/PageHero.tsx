import type { ReactNode } from "react";
import Image from "@/components/ProgressiveImage";

type PageHeroProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  image?: string;
  compact?: boolean;
  contextual?: boolean;
};

export default function PageHero({ title, subtitle, eyebrow = "SPICYLON · CEYLON SPICES", image = "/images/spice-table.webp", compact = false, contextual = false }: PageHeroProps) {
  const Heading = contextual ? "h2" : "h1";
  return (
    <section className={`page-hero ${compact ? "page-hero-compact" : ""}`}>
      <div className="page-hero-inner">
        <div className="page-hero-content">
          <span className="page-hero-eyebrow">{eyebrow}</span>
          <Heading>{title}</Heading>
          {subtitle && <div className="page-hero-description">{subtitle}</div>}
        </div>
        <div className="page-hero-media"><Image src={image} alt="" fill priority sizes="(max-width: 767px) 100vw, 45vw" className="object-cover" /></div>
      </div>
    </section>
  );
}
