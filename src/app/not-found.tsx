import Link from "next/link";
import PageHero from "@/components/PageHero";

export default function NotFound() {
  return <div className="page-shell">
    <PageHero title="A little off the spice trail." subtitle="This page may have moved. Let’s find something full of flavour instead." eyebrow="404 · PAGE NOT FOUND" />
    <div className="shop-section flex flex-wrap gap-6">
      <Link href="/" className="shop-button">Back to home</Link>
      <Link href="/products" className="shop-text-link">Explore the collection →</Link>
    </div>
  </div>;
}
