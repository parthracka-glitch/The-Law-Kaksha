import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://lawkaksha.in").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/courses",
          "/about",
          "/case-studies",
          "/case-studies/*",
          "/offers",
          "/reviews",
          "/contact",
          "/privacy",
          "/terms",
          "/refund",
          "/cookies",
          "/images/*",
          "/assets/*",
          "/samples/*",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/student",
          "/student/*",
          "/reader",
          "/reader/*",
          "/checkout",
          "/checkout/*",
          "/api/",
          "/api/*",
          "/_next/",
          "/_next/*",
        ],
      },
      // Allow Generative Engine & AI Crawlers to crawl and cite educational content (AEO & GEO)
      {
        userAgent: ["Google-Extended", "GPTBot", "PerplexityBot", "ClaudeBot", "Applebot"],
        allow: [
          "/",
          "/courses",
          "/about",
          "/case-studies",
          "/case-studies/*",
          "/offers",
          "/reviews",
        ],
        disallow: [
          "/admin",
          "/student",
          "/reader",
          "/checkout",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
