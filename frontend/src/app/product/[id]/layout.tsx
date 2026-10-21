import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

const PRODUCT_META_MAP: Record<
  string,
  {
    title: string;
    description: string;
    price: number;
    category: string;
  }
> = {
  "course-ca-foundation-sub": {
    title: "CA Foundation Business Laws (Paper 2) Monthly Access",
    description:
      "Get all-access to CA Foundation Paper 2 Business Laws under the ICAI New Scheme. Complete 7 statutory chapters, Question Banks Part 1 & 2, weekly case studies, and 3-step model answers.",
    price: 99,
    category: "CA Foundation",
  },
  "course-cseet-sub": {
    title: "CSEET Business Laws and Management All-Access Pass",
    description:
      "Complete preparation platform for CSEET Business Laws & Management, Legal Aptitude, Business Communication, and Business Environment.",
    price: 99,
    category: "CSEET",
  },
  "combo-ca-cseet": {
    title: "Dual Mastery Pass: CA Foundation & CSEET Business Laws",
    description:
      "Combined dual subscription for CA Foundation Paper 2 and CSEET Business Laws and Management with full soft-copy codex access.",
    price: 179,
    category: "Dual Certification",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const id = resolved?.id || "";
  const info = PRODUCT_META_MAP[id] || {
    title: "CA Foundation & CSEET Study Material",
    description:
      "Smart Question Banks, digital codices, and chapter-wise law notes from The Law Kaksha.",
    price: 99,
    category: "Legal Education",
  };

  const canonicalUrl = `https://lawkaksha.in/product/${id}`;

  return {
    title: `${info.title} | The Law Kaksha`,
    description: info.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${info.title} | The Law Kaksha`,
      description: info.description,
      url: canonicalUrl,
      siteName: "The Law Kaksha",
      images: [
        {
          url: "/images/hero_legal_codex_books.jpg",
          width: 1200,
          height: 630,
          alt: info.title,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${info.title} | The Law Kaksha`,
      description: info.description,
      images: ["/images/hero_legal_codex_books.jpg"],
    },
  };
}

export default async function ProductDetailLayout({
  children,
  params,
}: Props) {
  const resolved = await params;
  const id = resolved?.id || "";
  const info = PRODUCT_META_MAP[id] || {
    title: "CA Foundation & CSEET Study Material",
    description: "Digital law codex and question bank from The Law Kaksha.",
    price: 99,
    category: "Legal Education",
  };

  const productJsonLd = {
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
            "name": "Courses & Products",
            "item": "https://lawkaksha.in/courses"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": info.title,
            "item": `https://lawkaksha.in/product/${id}`
          }
        ]
      },
      {
        "@type": "Product",
        "@id": `https://lawkaksha.in/product/${id}#product`,
        "name": info.title,
        "description": info.description,
        "image": "https://lawkaksha.in/images/hero_legal_codex_books.jpg",
        "category": info.category,
        "brand": {
          "@type": "EducationalOrganization",
          "name": "The Law Kaksha",
          "url": "https://lawkaksha.in"
        },
        "offers": {
          "@type": "Offer",
          "price": String(info.price),
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": `https://lawkaksha.in/product/${id}`
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      {children}
    </>
  );
}
