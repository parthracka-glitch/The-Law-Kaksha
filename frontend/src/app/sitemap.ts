import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://lawkaksha.in").replace(/\/$/, "");
  const now = new Date();

  const routes: Array<{
    path: string;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: number;
  }> = [
    { path: "", changeFrequency: "daily", priority: 1.0 },
    { path: "/courses", changeFrequency: "daily", priority: 0.95 },
    { path: "/case-studies", changeFrequency: "weekly", priority: 0.9 },
    { path: "/case-studies/mohoribibee-v-dharmodas-ghose", changeFrequency: "monthly", priority: 0.85 },
    { path: "/case-studies/salomon-v-salomon-co-ltd", changeFrequency: "monthly", priority: 0.85 },
    { path: "/case-studies/carlill-v-carbolic-smoke-ball-co", changeFrequency: "monthly", priority: 0.85 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/offers", changeFrequency: "daily", priority: 0.85 },
    { path: "/reviews", changeFrequency: "weekly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/privacy", changeFrequency: "monthly", priority: 0.4 },
    { path: "/terms", changeFrequency: "monthly", priority: 0.4 },
    { path: "/refund", changeFrequency: "monthly", priority: 0.4 },
    { path: "/cookies", changeFrequency: "monthly", priority: 0.4 },
  ];

  return routes.map((r) => ({
    url: `${baseUrl}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
