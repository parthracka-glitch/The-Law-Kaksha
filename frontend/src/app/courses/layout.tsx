import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CA Foundation Business Law Notes & Smart Question Banks",
  description:
    "Explore CA Foundation Paper 2 Business Laws Smart Question Banks Part 1 & 2, soft-copy digital codices, chapter-wise revision notes, and CSEET preparation modules under the latest ICAI New Scheme.",
  keywords: [
    "CA Foundation Business Law notes",
    "CA Foundation Paper 2 Question Bank",
    "CA Foundation Law Soft Copy PDF",
    "Indian Contract Act 1872 study material",
    "Sale of Goods Act 1930 notes",
    "Indian Partnership Act 1932 notes",
    "LLP Act 2008 CA Foundation",
    "Companies Act 2013 CA Foundation",
    "Negotiable Instruments Act 1881 CA Foundation",
    "CSEET Business Laws and Management",
    "ICAI Business Law sample questions",
  ],
  alternates: {
    canonical: "https://lawkaksha.in/courses",
  },
  openGraph: {
    title: "CA Foundation Business Law Notes & Smart Question Banks | The Law Kaksha",
    description:
      "Instant soft-copy access to CA Foundation Paper 2 Smart Question Banks, in-browser digital codex, and chapter-wise study materials.",
    url: "https://lawkaksha.in/courses",
    siteName: "The Law Kaksha",
    images: [
      {
        url: "/images/hero_legal_codex_books.jpg",
        width: 1200,
        height: 630,
        alt: "CA Foundation Business Laws Smart Question Banks - The Law Kaksha",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CA Foundation Business Law Notes & Smart Question Banks | The Law Kaksha",
    description:
      "Prepare for CA Foundation Paper 2 with Part 1 & Part 2 Smart Question Banks and chapter-wise statutory notes.",
    images: ["/images/hero_legal_codex_books.jpg"],
  },
};

const coursesBreadcrumbJsonLd = {
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
          "name": "Courses & Question Banks",
          "item": "https://lawkaksha.in/courses"
        }
      ]
    },
    {
      "@type": "CollectionPage",
      "@id": "https://lawkaksha.in/courses#collection",
      "name": "CA Foundation & CSEET Business Laws Study Material Catalog",
      "url": "https://lawkaksha.in/courses",
      "description":
        "Digital codices, chapter-wise revision notes, and smart question banks for CA Foundation Paper 2 and CSEET candidates.",
      "publisher": {
        "@type": "EducationalOrganization",
        "name": "The Law Kaksha",
        "url": "https://lawkaksha.in"
      }
    }
  ]
};

export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesBreadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
