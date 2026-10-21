import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Student Support",
  description:
    "Get in touch with The Law Kaksha academic and support team for CA Foundation & CSEET inquiries, printed question bank delivery, subscription support, or feedback.",
  keywords: [
    "The Law Kaksha contact",
    "thelawkaksha@gmail.com",
    "CA Foundation law student support",
    "Printed question bank order inquiry",
    "The Law Kaksha helpline",
  ],
  alternates: {
    canonical: "https://lawkaksha.in/contact",
  },
  openGraph: {
    title: "Contact The Law Kaksha | Academic & Technical Support",
    description: "Reach our student support team via email, contact form, or social channels.",
    url: "https://lawkaksha.in/contact",
    siteName: "The Law Kaksha",
    images: [
      {
        url: "/images/hero_legal_codex_books.jpg",
        width: 1200,
        height: 630,
        alt: "Contact The Law Kaksha",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact The Law Kaksha | Student Support",
    description: "Get assistance from The Law Kaksha academic and technical team.",
    images: ["/images/hero_legal_codex_books.jpg"],
  },
};

const contactBreadcrumbJsonLd = {
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
          "name": "Contact Support",
          "item": "https://lawkaksha.in/contact"
        }
      ]
    },
    {
      "@type": "ContactPage",
      "@id": "https://lawkaksha.in/contact#contact",
      "name": "The Law Kaksha Contact & Academic Helpdesk",
      "url": "https://lawkaksha.in/contact",
      "description": "Customer and academic support channel for The Law Kaksha candidates.",
      "mainEntity": {
        "@type": "EducationalOrganization",
        "name": "The Law Kaksha",
        "email": "thelawkaksha@gmail.com",
        "url": "https://lawkaksha.in"
      }
    }
  ]
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactBreadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
