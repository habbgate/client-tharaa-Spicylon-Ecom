import Link from "next/link";

const faqs = [
  {
    category: "Orders & Payments",
    items: [
      {
        q: "How do I place an order?",
        a: "Browse our products, add items to your cart, and proceed to checkout. You can pay securely via credit/debit card through Stripe.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit and debit cards (Visa, Mastercard, Amex) processed securely via Stripe. We do not store your card details.",
      },
      {
        q: "Can I change or cancel my order after placing it?",
        a: "Orders can be cancelled before they are dispatched. Please contact us immediately at support@spicylon.com if you need to make a change.",
      },
      {
        q: "Will I receive an invoice for my order?",
        a: "Yes. A PDF invoice is automatically generated for every order and can be downloaded from your profile under Order History.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship worldwide. Delivery times and shipping costs vary by destination and are calculated at checkout.",
      },
      {
        q: "How long does delivery take?",
        a: "Domestic orders typically arrive within 3–5 business days. International orders take 7–14 business days depending on the destination.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order is dispatched, you will receive a confirmation email. You can also view your order status from your profile page.",
      },
    ],
  },
  {
    category: "Products",
    items: [
      {
        q: "Where do your spices come from?",
        a: "All our spices are sourced directly from farms in Sri Lanka (Ceylon). We work with local growers to bring you authentic, high-quality products.",
      },
      {
        q: "Are your spices organic?",
        a: "Many of our products are naturally grown without pesticides. Individual product pages will indicate whether a product is certified organic.",
      },
      {
        q: "How should I store my spices?",
        a: "Store spices in a cool, dry place away from direct sunlight and heat. Keep lids tightly sealed to preserve freshness and potency.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "If your order arrives damaged or incorrect, please contact us within 7 days of receipt with a photo of the item and we will arrange a replacement or refund.",
      },
      {
        q: "Can I return an opened product?",
        a: "For hygiene and safety reasons, we cannot accept returns on opened food products unless they are defective or incorrectly sent.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <section className="bg-stone-950 text-white py-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #f97316 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block text-orange-400 text-xs font-bold uppercase tracking-[0.25em] border border-orange-500/30 rounded-full px-3 py-1 bg-orange-500/5 mb-5">
            FAQ
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-5">
            Frequently Asked <span className="text-orange-400">Questions</span>
          </h1>
          <p className="text-stone-400 text-lg leading-relaxed max-w-xl mx-auto">
            Everything you need to know about our products, orders, and
            delivery. Can't find an answer?{" "}
            <Link
              href="/contact"
              className="text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-2"
            >
              Contact us.
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        {faqs.map((section) => (
          <div key={section.category}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-orange-500 rounded-full" />
              <h2 className="text-lg font-black text-stone-900 uppercase tracking-wide">
                {section.category}
              </h2>
            </div>
            <div className="space-y-3">
              {section.items.map((item) => (
                <details
                  key={item.q}
                  className="group bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none font-bold text-stone-800 text-sm hover:text-orange-600 transition-colors">
                    {item.q}
                    <svg
                      className="w-4 h-4 text-stone-400 flex-shrink-0 group-open:rotate-180 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="px-6 pb-5 text-stone-500 text-sm leading-relaxed border-t border-stone-50 pt-4">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="bg-stone-900 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-black mb-2">Still have questions?</h3>
          <p className="text-stone-400 text-sm mb-6">
            Our team is happy to help. Reach out and we'll get back to you
            within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all text-sm shadow-md"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
