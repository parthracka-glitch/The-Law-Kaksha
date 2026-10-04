import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { DM_Sans, Playfair_Display } from "next/font/google";
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
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thelawkaksha.com"),
  title: "The Law Kaksha | CA Foundation Business Law Smart Question Bank",
  description:
    "The Law Kaksha is a dedicated CA Foundation Business Law platform offering Part 1 & Part 2 Smart Revision Question Banks in instant soft copy PDF format, covering all 7 legislative units under the latest ICAI New Scheme.",
  keywords: [
    "The Law Kaksha",
    "CA Foundation Business Law",
    "CA Foundation Paper 2",
    "Indian Contract Act 1872",
    "Companies Act 2013 CA Foundation",
    "Sale of Goods Act 1930",
    "Indian Partnership Act 1932",
    "LLP Act 2008",
    "Negotiable Instruments Act 1881",
    "ICAI New Scheme 2026",
  ],
  authors: [{ name: "The Law Kaksha" }],
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
    title: "The Law Kaksha | CA Foundation Business Law Smart Question Bank",
    description:
      "Part 1 & Part 2 Smart Revision Question Banks in instant soft copy PDF format for CA Foundation Paper 2: Business Laws.",
    url: "https://thelawkaksha.com",
    siteName: "The Law Kaksha",
    images: [
      {
        url: "/images/logo.png",
        width: 849,
        height: 517,
        alt: "The Law Kaksha - CA Foundation Business Law",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Law Kaksha | CA Foundation Business Law",
    description: "Master CA Foundation Paper 2 with our Smart Question Bank PDFs.",
    images: ["/images/logo.png"],
  },
};

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": "https://thelawkaksha.com/#organization",
      "name": "The Law Kaksha",
      "url": "https://thelawkaksha.com",
      "logo": "https://thelawkaksha.com/logo.png",
      "description":
        "Dedicated educational learning platform for CA Foundation Business Law examinations in India.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Mumbai",
        "addressRegion": "Maharashtra",
        "postalCode": "400001",
        "addressCountry": "IN"
      }
    },
    {
      "@type": "Course",
      "@id": "https://thelawkaksha.com/#ca-foundation-course",
      "name": "CA Foundation Business Law Smart Question Bank",
      "description":
        "Complete 7 statutory acts syllabus for CA Foundation Paper 2 with chapter-wise questions, past papers, RTPs & ICAI model answer framework.",
      "provider": {
        "@type": "EducationalOrganization",
        "name": "The Law Kaksha"
      },
      "offers": {
        "@type": "Offer",
        "price": "99",
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
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} font-sans scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="min-h-screen bg-white text-slate-900 antialiased overflow-x-hidden">
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
