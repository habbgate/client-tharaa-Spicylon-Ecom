import { HiOutlineArrowRight, HiOutlineGlobeAlt, HiOutlineLocationMarker, HiOutlineShieldCheck } from "react-icons/hi";
import Image from "@/components/ProgressiveImage";
import ProductCard from "@/components/ProductCard";
import NewsletterForm from "@/components/NewsletterForm";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";
import dbConnect from "@/lib/db";

export const metadata = {
  title: "Shop Authentic Ceylon Spices",
  description:
    "Browse our full range of single-origin Ceylon spices — cinnamon, cardamom, turmeric, black pepper, cloves and more. Sourced directly from Sri Lankan highland farms.",
  openGraph: {
    title: "Spicylon | Shop Ceylon Spices",
    description:
      "Authentic single-origin spices from Sri Lanka, shipped worldwide.",
    url: "https://spicylon.com",
  },
  alternates: { canonical: "https://spicylon.com" },
};
import { Product } from "@/models";

async function getProducts() {
  try {
    await dbConnect();
    // Exclude Gift Box products from the featured spices section
    const products = await Product.find({ category: { $ne: "Gift Box" } }).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function getGiftBoxes() {
  try {
    await dbConnect();
    const giftBoxes = await Product.find({ category: "Gift Box" }).limit(4).lean();
    return JSON.parse(JSON.stringify(giftBoxes));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export default async function Home() {
  const [products, giftBoxes] = await Promise.all([getProducts(), getGiftBoxes()]);
  const cookieStore = await cookies();
  const currency = cookieStore.get("currency")?.value || "USD";

  const t = await getTranslations("Studio");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://spicylon.com/#organization",
        name: "Spicylon",
        url: "https://spicylon.com",
        logo: {
          "@type": "ImageObject",
          url: "https://spicylon.com/logo.png",
        },
        description:
          "Authentic single-origin Ceylon spices sourced directly from highland farms in Sri Lanka.",
        address: {
          "@type": "PostalAddress",
          addressCountry: "LK",
        },
        sameAs: [
          "https://www.facebook.com/spicylon",
          "https://www.instagram.com/spicyloncom",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://spicylon.com/#website",
        url: "https://spicylon.com",
        name: "Spicylon",
        publisher: { "@id": "https://spicylon.com/#organization" },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate:
              "https://spicylon.com/products?search={search_term_string}",
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <div className="storefront">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="campaign-hero">
        <div className="campaign-inner">
          <div className="campaign-copy">
            <span className="shop-eyebrow">{t("eyebrow")}</span>
            <h1>{t("heroLine1")}<br /><em>{t("heroLine2")}</em></h1>
            <p>{t("heroDescription")}</p>
            <Link href="/products" className="shop-button">{t("shop")}<HiOutlineArrowRight aria-hidden="true" /></Link>
            <Link href="/about" className="campaign-story-link">{t("story")}<HiOutlineArrowRight aria-hidden="true" /></Link>
            <div className="campaign-origin"><span className="origin-dot" />{t("origin")}</div>
          </div>
          <div className="campaign-photo">
            <Image src="/images/spice-table.webp" alt="A ceramic platter of Ceylon spices on charcoal stone" fill priority sizes="(max-width: 767px) 100vw, 55vw" className="object-cover" />
            <div className="campaign-photo-caption"><span>01 / CEYLON</span><span>{t("photoNote")}</span></div>
          </div>
        </div>
      </section>
      <div className="shop-assurances"><span><HiOutlineLocationMarker aria-hidden="true" />{t("assuranceOrigin")}</span><span><HiOutlineGlobeAlt aria-hidden="true" />{t("assuranceShipping")}</span><span><HiOutlineShieldCheck aria-hidden="true" />{t("assuranceCheckout")}</span></div>
      <section className="shop-section collection-section">
        <div className="shop-section-heading"><div><span className="shop-eyebrow">{t("collectionLabel")}</span><h2>{t("collectionTitle")}</h2><p>{t("collectionText")}</p></div><Link href="/products" className="shop-text-link">{t("allProducts")}<HiOutlineArrowRight aria-hidden="true" /></Link></div>
        <div className="shop-product-grid">{products.slice(0,4).map((product:any)=><ProductCard key={product._id} product={product} currency={currency} />)}</div>
        {products.length === 0 && <div className="shop-empty">{t("empty")} <Link href="/products">{t("allProducts")} →</Link></div>}
      </section>
      <section className="discovery-section shop-section">
        <div className="shop-section-heading"><div><span className="shop-eyebrow">{t("discover")}</span><h2>{t("discoverTitle")}</h2></div></div>
        <div className="discovery-grid">
          {[{href:"/products",image:"spice-table",label:t("spicesLabel"),title:t("spicesTitle"),alt:"An arrangement of whole and ground spices"},{href:"#the-kitchen",image:"kitchen-ritual",label:t("cookingLabel"),title:t("cookingTitle"),alt:"Turmeric being added to a bowl of dhal"},{href:"/gift-boxes",image:"gift-ritual",label:t("giftLabel"),title:t("giftTitle"),alt:"An editorial arrangement of spice jars in a presentation box"}].map(item=><Link key={item.href} href={item.href} className="discovery-card"><div className="discovery-image"><Image src={`/images/${item.image}.webp`} alt={item.alt} fill sizes="(max-width: 767px) 85vw, 33vw" className="object-cover" /></div><div className="discovery-caption"><div><span className="shop-eyebrow">{item.label}</span><h3>{item.title}</h3></div><HiOutlineArrowRight aria-hidden="true" /></div></Link>)}
        </div>
      </section>
      <section className="editorial-feature" id="the-kitchen"><div className="editorial-feature-image"><Image src="/images/kitchen-ritual.webp" alt="A cook seasoning Sri Lankan dhal with turmeric" fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" /></div><div className="editorial-feature-copy"><span className="shop-eyebrow">{t("kitchenLabel")}</span><h2>{t("kitchenTitle")}</h2><p>{t("kitchenText")}</p><Link href="/products" className="shop-text-link">{t("kitchenAction")}<HiOutlineArrowRight aria-hidden="true" /></Link></div></section>
      <section className="shop-section gift-feature"><div className="gift-feature-copy"><span className="shop-eyebrow">{t("giftLabel")}</span><h2>{t("giftTitle")}</h2><p>{t("giftText")}</p><Link href="/gift-boxes" className="shop-button">{t("giftAction")}<HiOutlineArrowRight aria-hidden="true" /></Link></div><div className="gift-feature-image"><Image src="/images/gift-ritual.webp" alt="Spice jars in a charcoal presentation box with natural tissue paper" fill sizes="(max-width: 767px) 100vw, 60vw" className="object-cover" /></div></section>
      {giftBoxes.length>0 && <section className="shop-section gift-products"><div className="shop-product-grid">{giftBoxes.map((product:any)=><ProductCard key={product._id} product={product} currency={currency}/>)}</div></section>}
      <section className="origin-feature"><Image src="/images/ceylon-landscape.webp" alt="A tropical Sri Lankan spice garden in warm morning light" fill sizes="100vw" className="object-cover" /><div className="origin-feature-shade" /><div className="origin-feature-copy"><span className="shop-eyebrow">{t("storyLabel")}</span><h2>{t("storyTitle")}</h2><p>{t("storyText")}</p><Link href="/about" className="shop-text-link">{t("storyAction")}<HiOutlineArrowRight aria-hidden="true" /></Link></div></section>
      <section className="shop-newsletter"><div><span className="shop-eyebrow">{t("newsletterLabel")}</span><h2>{t("newsletterTitle")}</h2><p>{t("newsletterText")}</p></div><div><NewsletterForm placeholder={t("newsletterPlaceholder")} buttonLabel={t("newsletterButton")} /><small>{t("newsletterPrivacy")}</small></div></section>
    </div>
  );
}
