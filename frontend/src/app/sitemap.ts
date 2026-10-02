import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thelawkaksha.com";
  const now = new Date();

  const routes = [
    "",
    "/courses",
    "/about",
    "/reviews",
    "/contact",
    "/login",
    "/register",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/courses" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/courses" ? 0.9 : 0.7,
  }));
}
