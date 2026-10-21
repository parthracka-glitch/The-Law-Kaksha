import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AboutInteractiveView } from "@/components/AboutInteractiveView";
import { Sparkles } from "lucide-react";
import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | The Law कक्षा - Educational Mission & Methodology",
  description:
    "Learn about the mission, pedagogical methodology, 3-step answer writing blueprint, and academic standards behind The Law कक्षा for CA Foundation Business Laws and CSEET.",
  keywords: [
    "About The Law Kaksha",
    "About The Law कक्षा",
    "CA Foundation law faculty methodology",
    "3-step law answer writing framework",
    "CA Foundation Business Laws mission",
    "Chartered Accountancy law education India",
  ],
  alternates: {
    canonical: "https://lawkaksha.in/about",
  },
  openGraph: {
    title: "About Us | The Law कक्षा - Learn. Practise. Excel.",
    description:
      "Educational pedagogy, 3-step answer writing blueprint, and statutory breakdown for CA Foundation & CSEET.",
    url: "https://lawkaksha.in/about",
    siteName: "The Law Kaksha",
    images: [
      {
        url: "/images/hero_student_success_collage.png",
        width: 1200,
        height: 630,
        alt: "About The Law Kaksha",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About The Law Kaksha | Legal Education Pedagogy",
    description: "Discover how The Law Kaksha simplifies CA Foundation Paper 2 Business Laws.",
    images: ["/images/hero_student_success_collage.png"],
  },
};

const aboutJsonLd = {
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
          "name": "About Us",
          "item": "https://lawkaksha.in/about"
        }
      ]
    },
    {
      "@type": "AboutPage",
      "@id": "https://lawkaksha.in/about#about",
      "name": "About The Law Kaksha Academy",
      "url": "https://lawkaksha.in/about",
      "description":
        "Pedagogical framework and academic vision of The Law Kaksha for CA Foundation & CSEET Business Laws.",
      "mainEntity": {
        "@type": "EducationalOrganization",
        "name": "The Law Kaksha",
        "url": "https://lawkaksha.in"
      }
    }
  ]
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF]/50 via-white to-[#F0F7FF]/30 flex flex-col justify-between text-[#0A192F] font-sans selection:bg-[#005A9C] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Floating breadcrumb / badge */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#005A9C] transition-colors"
          >
            ← Back to Home
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-[#005A9C] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Guide</span>
          </div>
        </div>

        {/* The Premium Interactive About View */}
        <AboutInteractiveView />
      </main>

      <Footer />
    </div>
  );
}

