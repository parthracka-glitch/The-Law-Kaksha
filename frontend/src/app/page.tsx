import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FacultyCredibilityBlock } from "@/components/FacultyCredibilityBlock";
import { SubscriptionCarousel } from "@/components/SubscriptionCarousel";
import { FreeResourceModule } from "@/components/FreeResourceModule";
import { ExamCountdownsAndQOTD } from "@/components/ExamCountdownsAndQOTD";
import { Section16ComparisonBlock } from "@/components/Section16ComparisonBlock";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { FloatingWhatsAppSupport } from "@/components/FloatingWhatsAppSupport";

export const metadata: Metadata = {
  title: "The Law Kaksha | CA Foundation Business Laws & CSEET Academy",
  description:
    "India's dedicated learning platform for CA Foundation Paper 2 Business Laws and CSEET. Instant soft copy PDF access to Smart Revision Question Banks Part 1 & Part 2, chapter-wise notes, landmark case studies, and 3-step ICAI model answer writing frameworks.",
  alternates: {
    canonical: "https://lawkaksha.in",
  },
  openGraph: {
    title: "The Law Kaksha | CA Foundation Business Laws & CSEET Academy",
    description:
      "Master CA Foundation Paper 2 Business Laws & CSEET with Part 1 & Part 2 Smart Question Banks, landmark case studies, and ICAI model answer techniques.",
    url: "https://lawkaksha.in",
    siteName: "The Law Kaksha",
    images: [
      {
        url: "/images/hero_legal_codex_books.jpg",
        width: 1200,
        height: 630,
        alt: "The Law Kaksha - CA Foundation Business Laws Smart Question Bank",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "name": "The Law Kaksha",
        "url": "https://lawkaksha.in",
        "logo": "https://lawkaksha.in/favicon.ico",
        "description": "India's dedicated learning academy for CA Foundation Paper 2 Business Laws and CSEET.",
        "sameAs": ["https://wa.me/919172204870"]
      },
      {
        "@type": "Course",
        "name": "CA Foundation Paper 2: Business Laws (Comprehensive Statutory Codex & Question Bank)",
        "description": "Statutory chapter notes, LDR flowcharts, landmark judicial precedents, and ICAI model answer writing techniques.",
        "provider": {
          "@type": "EducationalOrganization",
          "name": "The Law Kaksha",
          "url": "https://lawkaksha.in"
        },
        "offers": {
          "@type": "Offer",
          "category": "Paid",
          "priceCurrency": "INR",
          "price": "99"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are the notes updated for the May/November 2026 CA Foundation examinations?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, all statutory codices, case laws, and practice modules are strictly updated for the May and November 2026 examination cycles, fully aligned with ICAI BOS publications."
            }
          },
          {
            "@type": "Question",
            "name": "Can I read the study codices on mobile and laptop?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, The Law Kaksha includes an ad-free zero-trust DRM reader that works seamlessly on all smartphones, tablets, laptops, and desktop computers."
            }
          }
        ]
      }
    ]
  };

  return (
    <main className="min-h-screen bg-white text-[#0A192F] flex flex-col antialiased selection:bg-[#DBEAFE] selection:text-[#0A192F]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 1. Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section with 3D Interactive Books & Quick Sample Reader */}
      <HeroSection />

      {/* 3. Academic Advisory & Rankholder Pedagogy Quality Block */}
      <FacultyCredibilityBlock />

      {/* 4. Top Highlights Carousel (Featured Codices) */}
      <SubscriptionCarousel />

      {/* 5. Free Resources & Sample Question Banks Module */}
      <FreeResourceModule />

      {/* 6. Streamlined Exam Countdowns & Daily High-Yield Case Scenarios */}
      <ExamCountdownsAndQOTD />

      {/* 7. ICAI Section 16(1) Model Answer Comparison */}
      <Section16ComparisonBlock />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 9. Minimalist Luxury Footer */}
      <Footer />

      {/* 10. Floating Academic Counselor Desk */}
      <FloatingWhatsAppSupport />
    </main>
  );
}
