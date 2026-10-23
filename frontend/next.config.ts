import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/students",
        destination: "/student",
        permanent: true,
      },
      {
        source: "/students/:path*",
        destination: "/student/:path*",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/student",
        permanent: false,
      },
      {
        source: "/portal",
        destination: "/student",
        permanent: false,
      },
      {
        source: "/student-portal",
        destination: "/student",
        permanent: false,
      },
      {
        source: "/student-dashboard",
        destination: "/student",
        permanent: false,
      },
      {
        source: "/admin-dashboard",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/admin-portal",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/admin-console",
        destination: "/admin",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.BACKEND_URL ||
      (process.env.NODE_ENV === "production" || process.env.VERCEL
        ? "https://the-law-kaksha.onrender.com"
        : "http://127.0.0.1:5000");
    return [
      {
        source: "/api/pdf/:path*",
        destination: "/api/pdf/:path*",
      },
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
