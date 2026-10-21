import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Special Student Offers & Discount Coupons",
  description:
    "Save on CA Foundation Business Laws Smart Question Banks, in-browser digital codices, and monthly All-Access Passes. Check active coupon codes and introductory pricing from ₹99/month.",
  keywords: [
    "The Law Kaksha coupon code",
    "CA Foundation law discount offers",
    "LAUNCH99 coupon code",
    "CA Foundation Paper 2 offers",
    "The Law Kaksha subscription discount",
    "CA Law study material offers",
  ],
  alternates: {
    canonical: "https://lawkaksha.in/offers",
  },
  openGraph: {
    title: "Special Student Offers & Discounts | The Law Kaksha",
    description:
      "Active student discount coupons and introductory subscription packages for CA Foundation & CSEET Business Laws.",
    url: "https://lawkaksha.in/offers",
    siteName: "The Law Kaksha",
    images: [
      {
        url: "/images/hero_legal_codex_books.jpg",
        width: 1200,
        height: 630,
        alt: "The Law Kaksha Student Discounts and Offers",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Special Student Offers & Discounts | The Law Kaksha",
    description: "Save on CA Foundation Business Laws Smart Question Banks and Passes.",
    images: ["/images/hero_legal_codex_books.jpg"],
  },
};

const offersBreadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://lawkaksha.in"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Student Offers & Discounts",
          "item": "https://lawkaksha.in/offers"
        }
      ]
    }
  ]
};

export default function OffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersBreadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
