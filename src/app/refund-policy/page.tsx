import Link from "next/link";

export const metadata = {
  title: "Refund Policy",
  description:
    "Learn about Spicylon's return, exchange, and refund policies.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://spicylon.com/refund-policy" },
};

const sections = [
  {
    title: "1. Return Window",
    content: [
      {
        subtitle: "Eligibility",
        text: "You have 14 days from the date of delivery to request a return or exchange for eligible items.",
      },
      {
        subtitle: "Return Condition",
        text: "To be eligible for a return, the item must be unused, in its original packaging, and in the same condition that you received it. Spices, herbs, and other perishable goods cannot be returned if opened.",
      },
    ],
  },
  {
    title: "2. Refund Process",
    content: [
      {
        subtitle: "Initiating a Return",
        text: "To initiate a return, please contact our support team at support@spicylon.com with your order number and reason for return.",
      },
      {
        subtitle: "Processing Time",
        text: "Once we receive and inspect your returned item, we will notify you of the approval or rejection of your refund. If approved, the refund will be processed back to your original payment method within 5-7 business days.",
      },
    ],
  },
  {
    title: "3. Non-Refundable Items",
    content: [
      {
        subtitle: "Exclusions",
        text: "Gift cards, opened perishable items (such as spices), and sale items are non-refundable unless they arrived damaged or defective.",
      },
    ],
  },
  {
    title: "4. Damaged or Incorrect Items",
    content: [
      {
        subtitle: "Reporting Issues",
        text: "If you receive a damaged or incorrect item, please contact us immediately upon delivery with photos of the product and packaging. We will arrange a replacement or full refund as quickly as possible.",
      },
    ],
  },
  {
    title: "5. Return Shipping",
    content: [
      {
        subtitle: "Shipping Costs",
        text: "You are responsible for paying the shipping costs for returning your item unless the return is due to our error (e.g., damaged or incorrect item). Original shipping costs are non-refundable.",
      },
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8">
      <section className="max-w-3xl mx-auto bg-white border border-stone-200 shadow-sm rounded-lg p-8 sm:p-12">
        <header className="mb-10 text-center sm:text-left border-b border-stone-100 pb-8">
          <p className="text-orange-600 font-bold tracking-widest text-xs uppercase mb-2">
            Spicylon Customer Care
          </p>
          <h1 className="text-3xl font-black text-stone-900 mb-4 tracking-tight">
            Refund Policy
          </h1>
          <p className="text-stone-500 text-sm max-w-xl leading-relaxed">
            Thank you for shopping at Spicylon. If you are not entirely satisfied with your purchase, we're here to help. Please review our policies regarding returns and refunds below.
          </p>
        </header>

        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="border border-stone-200 rounded-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-stone-50 bg-stone-50/50">
                <h2 className="text-base font-black text-stone-900">
                  {section.title}
                </h2>
              </div>
              <div className="px-6 py-5 space-y-5">
                {section.content.map((item) => (
                  <div key={item.subtitle}>
                    <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1.5">
                      {item.subtitle}
                    </p>
                    <p className="text-stone-500 text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-stone-200 text-sm">
          <Link
            href="/privacy-policy"
            className="text-stone-500 hover:text-stone-700 font-medium"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-stone-500 hover:text-stone-700 font-medium"
          >
            Terms of Service
          </Link>
          <Link
            href="/contact"
            className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
