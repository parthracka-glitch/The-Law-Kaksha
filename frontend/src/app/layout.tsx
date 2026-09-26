import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thelawkaksha.com"),
  title: "The Law Kaksha | Premier CA Law Academy • CA Foundation, Inter & Final",
  description:
    "The Law Kaksha is India's premier CA law preparation platform offering 2-Volume Flagship Books, solved RTPs/MTPs/PYPs, case scenario MCQs, and complete video course subscriptions for CA Foundation (Business Law), CA Intermediate (Corporate & Other Laws), and CA Final (Corporate & Economic Laws).",
  keywords: [
    "CA Law Kaksha",
    "CA Foundation Business Law",
    "CA Intermediate Paper 2 Corporate and Other Laws",
    "CA Final Corporate and Economic Laws",
    "ICAI Law Reviewer",
    "Companies Act 2013 CA Inter",
    "IBC 2016 CA Final",
    "CA Law RTP MTP Solved",
    "ICAI New Scheme 2026",
  ],
  authors: [{ name: "The Law Kaksha CA Academy" }],
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
  openGraph: {
    title: "The Law Kaksha | Premier CA Law Academy",
    description:
      "2-Volume Flagship Law Books, 9-Attempt Solved RTPs/MTPs & Video Subscriptions for CA Foundation, Inter & Final.",
    url: "https://thelawkaksha.com",
    siteName: "The Law Kaksha",
    images: [
      {
        url: "/images/logo.png",
        width: 849,
        height: 517,
        alt: "The Law कक्षा - Premier CA Law Academy",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Law Kaksha | CA Law Academy",
    description: "Master CA Law & Regulations with Supreme Precision.",
    images: ["/images/logo.png"],
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://thelawkaksha.com/#organization",
      "name": "The Law Kaksha CA Academy",
      "url": "https://thelawkaksha.com",
      "logo": "https://thelawkaksha.com/logo.png",
      "description":
        "Premier academic publishing house and mentorship academy for Chartered Accountancy law examinations in India.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mumbai",
        "addressRegion": "Maharashtra",
        "postalCode": "400021",
        "addressCountry": "IN"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "3840",
        "bestRating": "5",
        "worstRating": "1"
      }
    },
    {
      "@type": "Course",
      "@id": "https://thelawkaksha.com/#ca-course",
      "name": "CA Business Law Main Notes & Video Masterclass",
      "description":
        "Complete 5 statutory acts syllabus for CA Intermediate & Foundation with solved past RTPs, MTPs & case scenario question bank.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "The Law Kaksha"
      },
      "offers": {
        "@type": "Offer",
        "price": "1999",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} font-sans scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
