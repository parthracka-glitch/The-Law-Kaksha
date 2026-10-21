import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Reviews & Testimonials",
  description:
    "Read verified reviews, ranker testimonials, and success stories from CA Foundation and CSEET candidates who scored distinction marks in Business Laws with The Law Kaksha.",
  keywords: [
    "The Law Kaksha reviews",
    "CA Foundation law student testimonials",
    "CA Foundation law topper reviews",
    "Best CA Foundation law question bank reviews",
    "CSEET law preparation reviews",
    "The Law Kaksha ratings",
  ],
  alternates: {
    canonical: "https://lawkaksha.in/reviews",
  },
  openGraph: {
    title: "Student Reviews & Success Stories | The Law Kaksha",
    description:
      "Verified student feedback and exam scores from CA Foundation & CSEET candidates using The Law Kaksha.",
    url: "https://lawkaksha.in/reviews",
    siteName: "The Law Kaksha",
    images: [
      {
        url: "/images/hero_student_success_collage.png",
        width: 1200,
        height: 630,
        alt: "The Law Kaksha Student Success Stories",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Reviews & Success Stories | The Law Kaksha",
    description: "Read real student reviews and exam results for CA Foundation Business Laws.",
    images: ["/images/hero_student_success_collage.png"],
  },
};

const reviewsBreadcrumbJsonLd = {
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
          "name": "Student Reviews",
          "item": "https://lawkaksha.in/reviews"
        }
      ]
    }
  ]
};

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsBreadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
