import Link from "next/link";

export const metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Spicylon collects, uses, and protects your personal data when you shop with us.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://spicylon.com/privacy-policy' },
};

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "Account Information",
        text: "When you create an account, we collect your name, email address, and a securely hashed password. This information is used solely to manage your account and process your orders.",
      },
      {
        subtitle: "Order & Payment Information",
        text: "When you place an order, we collect your shipping address, phone number, and order details. Payment processing is handled entirely by Stripe. Spicylon does not store, access, or log any card numbers or payment credentials.",
      },
      {
        subtitle: "Usage Data",
        text: "We may collect basic, anonymised information about how you interact with our website (e.g. pages visited, browser type) to improve our service. This data is never sold or shared with third parties for advertising.",
      },
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      {
        subtitle: "Order Fulfilment",
        text: "Your name, email, and shipping address are used to process and deliver your orders and to send you transactional emails (order confirmation, dispatch notification, invoice).",
      },
      {
        subtitle: "Account Management",
        text: "Your email address is used for account verification (OTP), password resets, and essential service communications.",
      },
      {
        subtitle: "No Marketing Without Consent",
        text: "We do not send marketing emails unless you have explicitly opted in. You may unsubscribe at any time.",
      },
    ],
  },
  {
    title: "3. Data Storage & Security",
    content: [
      {
        subtitle: "Where Your Data is Stored",
        text: "Your data is stored securely in a MongoDB database hosted on MongoDB Atlas. Data is encrypted at rest and in transit using TLS/SSL.",
      },
      {
        subtitle: "Password Security",
        text: "Passwords are hashed using bcrypt before storage. We never store or transmit plain-text passwords.",
      },
      {
        subtitle: "Authentication Tokens",
        text: "Session tokens are stored in secure, HTTP-only cookies and are not accessible via JavaScript. Tokens expire automatically.",
      },
    ],
  },
  {
    title: "4. Cookies",
    content: [
      {
        subtitle: "Essential Cookies Only",
        text: "We use only essential cookies required for authentication and session management. We do not use tracking or advertising cookies.",
      },
    ],
  },
  {
    title: "5. Third-Party Services",
    content: [
      {
        subtitle: "Stripe",
        text: "We use Stripe for payment processing. Stripe has its own privacy policy and is PCI-DSS compliant. We do not receive or store your full card details.",
      },
      {
        subtitle: "Google OAuth",
        text: "If you choose to sign in with Google, we receive only your name and email address from Google. We do not access any other Google account data.",
      },
    ],
  },
  {
    title: "6. Your Rights",
    content: [
      {
        subtitle: "Access & Deletion",
        text: "You have the right to access the personal data we hold about you and to request its deletion at any time. You can delete your account directly from your Profile page under Settings, which permanently removes all your personal data from our systems.",
      },
      {
        subtitle: "Data Portability",
        text: "You may request a copy of your personal data by contacting us at support@spicylon.com.",
      },
    ],
  },
  {
    title: "7. Contact",
    content: [
      {
        subtitle: "Questions or Concerns",
        text: "If you have any questions about this Privacy Policy or how your data is handled, please contact us at support@spicylon.com.",
      },
    ],
  },
];

export default function PrivacyPolicyPage() {
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
            Privacy <span className="text-orange-400">Policy</span>
          </h1>
          <p className="text-stone-400 text-base leading-relaxed max-w-xl mx-auto">
            Last updated: April 2026. We are committed to protecting your
            personal data and being transparent about how we use it.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        {/* Intro card */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-10 flex gap-4">
          <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
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
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-stone-700 mb-1">
              Your privacy matters to us
            </p>
            <p className="text-sm text-stone-500 leading-relaxed">
              Spicylon collects only the data necessary to operate our service.
              We do not sell your data, and we do not show you targeted
              advertisements.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
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
            href="/terms-of-service"
            className="text-orange-600 hover:text-orange-700 font-semibold underline underline-offset-2"
          >
            Terms of Service
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
