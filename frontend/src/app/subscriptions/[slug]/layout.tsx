import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const slug = resolved?.slug || "";
  const title = slug.includes("cseet")
    ? "CSEET Business Laws Subscription Plan"
    : "CA Foundation Business Laws All-Access Subscription";
  const description =
    "Subscribe to The Law Kaksha for instant access to CA Foundation and CSEET Business Laws Smart Question Banks, chapter notes, case studies, and reading streaks.";

  const canonicalUrl = `https://lawkaksha.in/subscriptions/${slug}`;

  return {
    title: `${title} | The Law Kaksha`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | The Law Kaksha`,
      description,
      url: canonicalUrl,
      siteName: "The Law Kaksha",
      images: ["/images/hero_legal_codex_books.jpg"],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | The Law Kaksha`,
      description,
      images: ["/images/hero_legal_codex_books.jpg"],
    },
  };
}

export default function SubscriptionSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
