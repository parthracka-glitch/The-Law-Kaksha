import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
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
    ];
  },
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
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
