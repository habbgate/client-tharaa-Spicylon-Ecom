import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description:
    "Read the terms and conditions that govern your use of Spicylon, including orders, shipping, returns, and your rights as a customer.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://spicylon.com/terms-of-service" },
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      {
        text: "By accessing or using the Spicylon website and placing orders through our platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.",
      },
    ],
  },
  {
    title: "2. Use of the Service",
    content: [
      {
        subtitle: "Eligibility",
        text: "You must be at least 18 years of age to create an account and place orders on Spicylon. By using our service, you confirm that you meet this requirement.",
      },
      {
        subtitle: "Account Responsibility",
        text: "You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at support@spicylon.com if you suspect unauthorised access.",
      },
      {
        subtitle: "Prohibited Conduct",
        text: "You agree not to misuse our platform, including attempting to gain unauthorised access to our systems, submitting false or fraudulent orders, or engaging in any activity that disrupts the service.",
      },
    ],
  },
  {
    title: "3. Orders & Pricing",
    content: [
      {
        subtitle: "Order Confirmation",
        text: "An order is confirmed only after successful payment processing. We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraud, in which case a full refund will be issued.",
      },
      {
        subtitle: "Pricing",
        text: "All prices are displayed in the currency selected at checkout. Prices are subject to change without notice. The price charged will be the price displayed at the time of checkout.",
      },
      {
        subtitle: "Taxes & Duties",
        text: "International orders may be subject to import duties, taxes, or customs fees imposed by the destination country. These charges are the sole responsibility of the buyer and are not included in our prices.",
      },
    ],
  },
  {
    title: "4. Shipping & Delivery",
    content: [
      {
        subtitle: "Delivery Estimates",
        text: "Estimated delivery times are provided in good faith but are not guaranteed. Spicylon is not liable for delays caused by postal services, customs, or events outside our control.",
      },
      {
        subtitle: "Risk of Loss",
        text: "Risk of loss and title for products pass to you upon our transfer of the products to the carrier.",
      },
    ],
  },
  {
    title: "5. Returns & Refunds",
    content: [
      {
        subtitle: "Damaged or Incorrect Items",
        text: "If your order arrives damaged or you receive an incorrect item, contact us within 7 days of delivery with photographic evidence. We will arrange a replacement or full refund at our discretion.",
      },
      {
        subtitle: "Opened Products",
        text: "For food safety and hygiene reasons, we do not accept returns on opened products unless they are defective.",
      },
      {
        subtitle: "Refund Timeline",
        text: "Approved refunds are processed within 5–10 business days and returned to your original payment method.",
      },
    ],
  },
  {
    title: "6. Intellectual Property",
    content: [
      {
        text: "All content on the Spicylon website — including text, images, logos, and design — is the property of Spicylon and is protected by applicable copyright and intellectual property laws. You may not reproduce, distribute, or use any content without express written permission.",
      },
    ],
  },
  {
    title: "7. Limitation of Liability",
    content: [
      {
        text: "To the fullest extent permitted by law, Spicylon shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our service or products. Our total liability for any claim shall not exceed the amount paid by you for the order in question.",
      },
    ],
  },
  {
    title: "8. Governing Law",
    content: [
      {
        text: "These Terms of Service are governed by the laws of Sri Lanka. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.",
      },
    ],
  },
  {
    title: "9. Changes to These Terms",
    content: [
      {
        text: "We reserve the right to update these Terms of Service at any time. Changes will be posted on this page with an updated date. Continued use of the service after changes constitutes acceptance of the revised terms.",
      },
    ],
  },
  {
    title: "10. Contact",
    content: [
      {
        text: "For any questions about these Terms of Service, please contact us at support@spicylon.com.",
      },
    ],
  },
];

export default function TermsOfServicePage() {
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
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block text-orange-400 text-xs font-bold uppercase tracking-[0.25em] border border-orange-500/30 rounded-full px-3 py-1 bg-orange-500/5 mb-5">
            Legal
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-5">
            Terms of <span className="text-orange-400">Service</span>
          </h1>
          <p className="text-stone-400 text-base leading-relaxed max-w-xl mx-auto">
            Last updated: April 2026. Please read these terms carefully before
            using Spicylon.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        {/* Intro card */}
        <div className="bg-stone-900 text-white border border-stone-800 rounded-2xl p-6 mb-10 flex gap-4">
          <div className="w-10 h-10 bg-stone-800 text-orange-400 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white mb-1">Summary</p>
            <p className="text-sm text-stone-400 leading-relaxed">
              These terms govern your use of Spicylon. By placing an order or
              creating an account, you agree to these terms. If you have any
              questions,{" "}
              <Link
                href="/contact"
                className="text-orange-400 underline underline-offset-2 hover:text-orange-300"
              >
                contact us
              </Link>{" "}
              before proceeding.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-stone-50 bg-stone-50/50">
                <h2 className="text-base font-black text-stone-900">
                  {section.title}
                </h2>
              </div>
              <div className="px-6 py-5 space-y-5">
                {section.content.map((item, i) => (
                  <div key={i}>
                    {"subtitle" in item && item.subtitle && (
                      <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1.5">
                        {item.subtitle}
                      </p>
                    )}
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
            className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2"
          >
            Privacy Policy
          </Link>
          <Link
            href="/contact"
            className="text-stone-500 hover:text-stone-700 font-medium"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
