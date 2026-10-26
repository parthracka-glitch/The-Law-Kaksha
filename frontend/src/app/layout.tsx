import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { DM_Sans, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lawkaksha.in"),
  title: {
    default: "The Law Kaksha | CA Foundation Business Laws & CSEET Academy",
    template: "%s | The Law Kaksha",
  },
  description:
    "The Law Kaksha (The Law कक्षा) is India's premier digital learning platform for CA Foundation Business Laws (Paper 2) & CSEET Business Laws and Management. Access Part 1 & Part 2 Smart Revision Question Banks, chapter-wise notes, landmark case studies, mind maps, and ICAI 3-step answer writing frameworks under the latest ICAI 2026 New Scheme.",
  keywords: [
    "The Law Kaksha",
    "The Law कक्षा",
    "CA Foundation Business Law",
    "CA Foundation Paper 2",
    "CA Foundation Law Notes PDF",
    "CA Foundation Smart Question Bank",
    "CA Foundation Question Bank Part 1",
    "CA Foundation Question Bank Part 2",
    "ICAI New Scheme 2026 Business Laws",
    "Indian Contract Act 1872 notes",
    "Companies Act 2013 CA Foundation",
    "Sale of Goods Act 1930 notes",
    "Indian Partnership Act 1932 CA Foundation",
    "Limited Liability Partnership Act 2008",
    "Negotiable Instruments Act 1881 CA Foundation",
    "Mohoribibee v Dharmodas Ghose case study",
    "Salomon v Salomon & Co Ltd case law",
    "Carlill v Carbolic Smoke Ball Co general offer",
    "CSEET Business Laws and Management",
    "CSEET Legal Aptitude and Logical Reasoning",
    "CSEET Business Communication notes",
    "CSEET Business Environment",
    "ICAI 3 step law answer writing framework",
    "ICAI Model Answers Business Law",
    "Last Day Revision LDR Business Laws",
    "CA Foundation Law soft copy PDF",
    "Best CA Foundation Law revision notes",
  ],
  authors: [{ name: "The Law Kaksha Faculty & Academic Council", url: "https://lawkaksha.in/about" }],
  creator: "The Law Kaksha",
  publisher: "The Law Kaksha Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "education",
  classification: "Chartered Accountancy & Company Secretary Legal Education",
  alternates: {
    canonical: "https://lawkaksha.in",
    languages: {
      "en-IN": "https://lawkaksha.in",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "The Law Kaksha | CA Foundation Business Laws & CSEET Smart Revision",
    description:
      "Master CA Foundation Paper 2 Business Laws & CSEET with Part 1 & Part 2 Smart Question Banks, in-browser digital codex, landmark case studies, and ICAI model answer techniques.",
    url: "https://lawkaksha.in",
    siteName: "The Law Kaksha",
    images: [
      {
        url: "/images/hero_legal_codex_books.jpg",
        width: 1200,
        height: 630,
        alt: "The Law Kaksha - CA Foundation Business Laws Smart Question Bank",
      },
      {
        url: "/images/logo.png",
        width: 849,
        height: 517,
        alt: "The Law Kaksha Official Emblem",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Law Kaksha | CA Foundation Business Laws & CSEET Academy",
    description:
      "Instant access to CA Foundation Paper 2 Smart Question Banks, chapter-wise notes, and weekly case studies under the latest ICAI New Scheme.",
    images: ["/images/hero_legal_codex_books.jpg"],
    creator: "@thelawkaksha",
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://lawkaksha.in/#organization",
      "name": "The Law Kaksha",
      "alternateName": ["The Law कक्षा", "Law Kaksha Academy"],
      "url": "https://lawkaksha.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lawkaksha.in/images/logo.png",
        "width": 849,
        "height": 517
      },
      "image": "https://lawkaksha.in/images/hero_legal_codex_books.jpg",
      "description":
        "Premier Indian legal education platform dedicated to CA Foundation Paper 2 Business Laws and CSEET Business Laws & Management examinations.",
      "foundingDate": "2024",
      "email": "thelawkaksha@gmail.com",
      "sameAs": [
        "https://www.instagram.com/thelawkaksha",
        "https://t.me/thelawkaksha",
        "https://www.youtube.com/@thelawkaksha"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "knowsAbout": [
        "CA Foundation Paper 2 Business Laws",
        "ICAI New Scheme 2026",
        "The Indian Contract Act 1872",
        "The Sale of Goods Act 1930",
        "The Indian Partnership Act 1932",
        "The Limited Liability Partnership Act 2008",
        "The Companies Act 2013",
        "The Negotiable Instruments Act 1881",
        "CSEET Legal Aptitude and Logical Reasoning",
        "CSEET Business Communication",
        "CSEET Business Environment",
        "ICAI 3-Step Answer Writing Method",
        "Case Law Analysis and Landmark Precedents"
      ]
    },
    {
      "@type": "WebSite",
      "@id": "https://lawkaksha.in/#website",
      "url": "https://lawkaksha.in",
      "name": "The Law Kaksha",
      "description": "Smart Question Banks & Digital Learning Platform for CA Foundation and CSEET Business Laws.",
      "publisher": {
        "@id": "https://lawkaksha.in/#organization"
      },
      "inLanguage": "en-IN",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://lawkaksha.in/courses?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Course",
      "@id": "https://lawkaksha.in/#ca-foundation-course",
      "name": "CA Foundation Paper 2: Business Laws Master Preparation",
      "courseCode": "CA-FOUNDATION-PAPER-2",
      "educationalCredentialAwarded": "Chartered Accountancy Foundation Examination Preparedness",
      "description":
        "Comprehensive statutory curriculum for CA Foundation Paper 2 covering The Indian Contract Act 1872, The Sale of Goods Act 1930, The Indian Partnership Act 1932, The LLP Act 2008, The Companies Act 2013, The Negotiable Instruments Act 1881, and Regulatory Framework with chapter-wise questions, past papers, RTPs, and ICAI model answers.",
      "provider": {
        "@id": "https://lawkaksha.in/#organization"
      },
      "educationalLevel": "Professional Certification Entry Level",
      "inLanguage": "en-IN",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "courseWorkload": "PT120H"
      },
      "offers": {
        "@type": "Offer",
        "price": "99",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": "https://lawkaksha.in/#subscriptions",
        "validFrom": "2026-01-01"
      }
    },
    {
      "@type": "Course",
      "@id": "https://lawkaksha.in/#cseet-course",
      "name": "CSEET: Business Laws and Management Preparation",
      "courseCode": "CSEET-PAPER-2",
      "educationalCredentialAwarded": "Company Secretary Executive Entrance Test Preparedness",
      "description":
        "Structured learning series for CSEET candidates covering Legal Aptitude, Business Communication, Business Environment, and legal reasoning with mind maps and mock drills.",
      "provider": {
        "@id": "https://lawkaksha.in/#organization"
      },
      "educationalLevel": "Professional Certification Entry Level",
      "inLanguage": "en-IN",
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online"
      },
      "offers": {
        "@type": "Offer",
        "price": "99",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": "https://lawkaksha.in/#subscriptions"
      }
    },
    {
      "@type": "Product",
      "@id": "https://lawkaksha.in/#product-qbank-part1",
      "name": "CA Foundation Business Laws Smart Question Bank - Part 1",
      "image": "https://lawkaksha.in/images/hero_legal_codex_books.jpg",
      "description": "Curated chapter-wise question bank covering The Indian Regulatory Framework, The Indian Contract Act 1872, and The Sale of Goods Act 1930 with 3-step ICAI model answers.",
      "brand": {
        "@id": "https://lawkaksha.in/#organization"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1240",
        "bestRating": "5",
        "worstRating": "1"
      },
      "offers": {
        "@type": "Offer",
        "price": "99",
        "priceCurrency": "INR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "url": "https://lawkaksha.in/courses"
      }
    },
    {
      "@type": "Product",
      "@id": "https://lawkaksha.in/#product-qbank-part2",
      "name": "CA Foundation Business Laws Smart Question Bank - Part 2",
      "image": "https://lawkaksha.in/images/hero_legal_codex_books.jpg",
      "description": "Comprehensive question bank covering The Indian Partnership Act 1932, The Limited Liability Partnership Act 2008, The Companies Act 2013, and The Negotiable Instruments Act 1881.",
      "brand": {
        "@id": "https://lawkaksha.in/#organization"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "980",
        "bestRating": "5",
        "worstRating": "1"
      },
      "offers": {
        "@type": "Offer",
        "price": "99",
        "priceCurrency": "INR",
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "url": "https://lawkaksha.in/courses"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://lawkaksha.in/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is The Law कक्षा?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The Law कक्षा is an online learning and revision platform that brings study notes, practice questions, previous-year paper analysis, flowcharts, revision resources, and application-based case studies together in one place for CA Foundation Paper 2 Business Laws and CSEET."
          }
        },
        {
          "@type": "Question",
          "name": "How much does a subscription cost on The Law Kaksha?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "A subscription costs just ₹99 per month, making structured, exam-focused law preparation accessible and affordable for every student across India."
          }
        },
        {
          "@type": "Question",
          "name": "What resources are available for CA Foundation students?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our CA Foundation Business Laws resources include detailed statutory notes, smart question banks Part 1 & 2, previous-year paper analysis, Last Day Revision (LDR) topics, mind maps, flowcharts, and three weekly application-based case studies (Monster Monday, Midweek Law Madness, Final Boss Friday)."
          }
        },
        {
          "@type": "Question",
          "name": "Which Acts are covered in CA Foundation Business Laws on The Law Kaksha?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All 7 legislative units under the ICAI New Scheme are covered: 1. Indian Regulatory Framework, 2. The Indian Contract Act, 1872, 3. The Sale of Goods Act, 1930, 4. The Indian Partnership Act, 1932, 5. The Limited Liability Partnership Act, 2008, 6. The Companies Act, 2013, and 7. The Negotiable Instruments Act, 1881."
          }
        },
        {
          "@type": "Question",
          "name": "What is the ICAI 3-Step Law Answer Writing Framework?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The 3-Step Answer Writing Method taught by The Law Kaksha helps students score 60+ marks by structuring every descriptive law answer into: Step 1 — Applicable Statutory Provision (citing section and Act), Step 2 — Analysis of Facts & Relevant Precedents, and Step 3 — Logical Conclusion."
          }
        },
        {
          "@type": "Question",
          "name": "Are the study materials and Question Banks downloadable?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Subscription resources and digital Question Banks are protected by in-browser DRM with dynamic student watermarking to prevent piracy and are accessible for online reading across desktop and mobile devices."
          }
        },
        {
          "@type": "Question",
          "name": "Can I purchase a physical printed copy of the Question Bank?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. If you prefer a printed copy of our Question Bank, contact our team at thelawkaksha@gmail.com or via Instagram (@thelawkaksha) for doorstep courier delivery details."
          }
        },
        {
          "@type": "Question",
          "name": "When will CSEET Business Laws and Management resources be available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "CSEET Business Laws and Management resources are scheduled for rollout in November 2026. Pre-registration and course outlines are accessible on the platform."
          }
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${inter.variable} ${playfair.variable} font-sans scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://checkout.razorpay.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="preconnect" href="https://api.razorpay.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.razorpay.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-screen bg-white text-[#0A192F] antialiased overflow-x-hidden selection:bg-[#DBEAFE] selection:text-[#0A192F]">
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
