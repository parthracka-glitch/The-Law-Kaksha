import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join The Law Kaksha | Create Student Account",
  description:
    "Register for The Law Kaksha to prepare for CA Foundation Paper 2 Business Laws and CSEET with soft copy question banks, weekly case studies, and reading streaks.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://lawkaksha.in/register",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
