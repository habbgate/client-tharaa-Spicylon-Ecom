import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Spicylon team. We're here to help with questions about orders, products, shipping, or anything else.",
  openGraph: {
    title: "Contact Spicylon",
    description: "Reach out to our team — we'd love to hear from you.",
    url: "https://spicylon.com/contact",
  },
  alternates: { canonical: "https://spicylon.com/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
