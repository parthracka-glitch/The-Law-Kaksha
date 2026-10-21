import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CA Foundation Landmark Judgments & Legal Case Studies",
  description:
    "Master CA Foundation Paper 2 case studies and landmark legal precedents. Explore in-depth facts, judicial ratios, statutory provisions, and ICAI 3-step model answers for Mohoribibee v Dharmodas Ghose, Salomon v Salomon, Carlill v Carbolic Smoke Ball, and more.",
  keywords: [
    "CA Foundation case studies",
    "CA Foundation landmark judgments",
    "Mohoribibee v Dharmodas Ghose minor contract",
    "Salomon v Salomon & Co Ltd separate legal entity",
    "Carlill v Carbolic Smoke Ball Co general offer",
    "ICAI law case study model answers",
    "Indian Contract Act landmark cases",
    "Companies Act 2013 case laws CA Foundation",
    "CA Foundation Paper 2 practical case scenarios",
    "3 step law answer format ICAI",
  ],
  alternates: {
    canonical: "https://lawkaksha.in/case-studies",
  },
  openGraph: {
    title: "CA Foundation Landmark Judgments & Case Studies | The Law Kaksha",
    description:
      "Judicial precedents, ratios, and 3-step model answers for CA Foundation Business Laws.",
    url: "https://lawkaksha.in/case-studies",
    siteName: "The Law Kaksha",
    images: [
      {
        url: "/images/hero_legal_codex_books.jpg",
        width: 1200,
        height: 630,
        alt: "CA Foundation Landmark Legal Case Studies - The Law Kaksha",
      },
    ],
    locale: "en_IN",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "CA Foundation Landmark Judgments & Case Studies | The Law Kaksha",
    description:
      "Read landmark legal precedents with facts, judicial ratios, and model answers formatted for CA Foundation exams.",
    images: ["/images/hero_legal_codex_books.jpg"],
  },
};

const caseStudiesBreadcrumbJsonLd = {
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
          "name": "Case Studies & Landmark Judgments",
          "item": "https://lawkaksha.in/case-studies"
        }
      ]
    },
    {
      "@type": "ItemList",
      "@id": "https://lawkaksha.in/case-studies#list",
      "name": "CA Foundation High-Yield Landmark Judgments",
      "description": "Essential legal precedents required for CA Foundation Paper 2: Business Laws.",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "https://lawkaksha.in/case-studies/mohoribibee-v-dharmodas-ghose",
          "name": "Mohoribibee v. Dharmodas Ghose (1903): Minor's Capacity to Contract"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url": "https://lawkaksha.in/case-studies/salomon-v-salomon-co-ltd",
          "name": "Salomon v. Salomon & Co. Ltd [1897]: The Principle of Separate Legal Entity"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url": "https://lawkaksha.in/case-studies/carlill-v-carbolic-smoke-ball-co",
          "name": "Carlill v. Carbolic Smoke Ball Co [1893]: General Offer & Unilateral Contracts"
        }
      ]
    }
  ]
};

export default function CaseStudiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudiesBreadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
