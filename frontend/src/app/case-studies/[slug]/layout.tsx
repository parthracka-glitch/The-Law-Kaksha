import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

const CASE_METADATA_MAP: Record<
  string,
  {
    title: string;
    description: string;
    subject: string;
    precedent: string;
    keywords: string[];
  }
> = {
  "mohoribibee-v-dharmodas-ghose": {
    title: "Mohoribibee v. Dharmodas Ghose (1903): Minor's Capacity to Contract",
    description:
      "Landmark Privy Council case analysis of Mohoribibee v Dharmodas Ghose (1903). Read full facts, legal issues, ratio decidendi under Section 11 of the Indian Contract Act 1872, restitution doctrine, and ICAI 3-step model answer.",
    subject: "The Indian Contract Act, 1872",
    precedent: "Privy Council (1903) 30 IA 114 : ILR 30 Cal 539",
    keywords: [
      "Mohoribibee v Dharmodas Ghose",
      "Minor's agreement void ab initio",
      "Section 11 Indian Contract Act",
      "Capacity to contract CA Foundation",
      "Doctrine of restitution minor contract",
      "Privy Council 1903 ruling",
      "CA Foundation law case study model answer",
    ],
  },
  "salomon-v-salomon-co-ltd": {
    title: "Salomon v. Salomon & Co. Ltd [1897]: Principle of Separate Legal Entity",
    description:
      "Foundational House of Lords ruling on corporate personality and the doctrine of separate legal entity under Company Law. Essential 5-mark case study for CA Foundation & CSEET students.",
    subject: "The Companies Act, 2013",
    precedent: "House of Lords [1897] AC 22",
    keywords: [
      "Salomon v Salomon & Co Ltd",
      "Separate legal entity principle",
      "Corporate veil doctrine",
      "Companies Act 2013 CA Foundation",
      "Aron Salomon case study summary",
      "House of Lords 1897 judgment",
    ],
  },
  "carlill-v-carbolic-smoke-ball-co": {
    title: "Carlill v. Carbolic Smoke Ball Co [1893]: General Offer & Unilateral Contracts",
    description:
      "Classic Court of Appeal decision defining general offers made to the world at large, communication of acceptance through performance of conditions, and intention to create legal relations.",
    subject: "The Indian Contract Act, 1872",
    precedent: "Court of Appeal [1893] 1 QB 256",
    keywords: [
      "Carlill v Carbolic Smoke Ball Co",
      "General offer to the world at large",
      "Section 8 Indian Contract Act",
      "Performance of condition as acceptance",
      "CA Foundation Indian Contract Act cases",
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const slug = resolved?.slug || "";
  const caseInfo = CASE_METADATA_MAP[slug] || {
    title: "CA Foundation Landmark Legal Case Study",
    description:
      "Examine judicial facts, statutory legal provisions, court rulings, and ICAI model answers for CA Foundation Paper 2 Business Laws.",
    subject: "Business Laws",
    precedent: "Judicial Precedent",
    keywords: ["CA Foundation case study", "ICAI Business Law precedent"],
  };

  const canonicalUrl = `https://lawkaksha.in/case-studies/${slug}`;

  return {
    title: caseInfo.title,
    description: caseInfo.description,
    keywords: caseInfo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${caseInfo.title} | The Law Kaksha`,
      description: caseInfo.description,
      url: canonicalUrl,
      siteName: "The Law Kaksha",
      images: [
        {
          url: "/images/hero_legal_codex_books.jpg",
          width: 1200,
          height: 630,
          alt: caseInfo.title,
        },
      ],
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${caseInfo.title} | The Law Kaksha`,
      description: caseInfo.description,
      images: ["/images/hero_legal_codex_books.jpg"],
    },
  };
}

export default async function CaseStudyDetailLayout({
  children,
  params,
}: Props) {
  const resolved = await params;
  const slug = resolved?.slug || "";
  const caseInfo = CASE_METADATA_MAP[slug] || {
    title: "CA Foundation Landmark Legal Case Study",
    description:
      "Judicial facts, statutory legal provisions, and model answers for CA Foundation Paper 2 Business Laws.",
    subject: "The Indian Contract Act, 1872",
    precedent: "Privy Council",
    keywords: [],
  };

  const articleJsonLd = {
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
            "name": "Case Studies",
            "item": "https://lawkaksha.in/case-studies"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": caseInfo.title,
            "item": `https://lawkaksha.in/case-studies/${slug}`
          }
        ]
      },
      {
        "@type": "Article",
        "@id": `https://lawkaksha.in/case-studies/${slug}#article`,
        "headline": caseInfo.title,
        "description": caseInfo.description,
        "inLanguage": "en-IN",
        "mainEntityOfPage": `https://lawkaksha.in/case-studies/${slug}`,
        "author": {
          "@type": "EducationalOrganization",
          "name": "The Law Kaksha Academic Team",
          "url": "https://lawkaksha.in/about"
        },
        "publisher": {
          "@type": "EducationalOrganization",
          "name": "The Law Kaksha",
          "url": "https://lawkaksha.in",
          "logo": {
            "@type": "ImageObject",
            "url": "https://lawkaksha.in/images/logo.png"
          }
        },
        "about": [
          {
            "@type": "Thing",
            "name": caseInfo.subject
          },
          {
            "@type": "Thing",
            "name": caseInfo.precedent
          }
        ],
        "image": "https://lawkaksha.in/images/hero_legal_codex_books.jpg"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {children}
    </>
  );
}
