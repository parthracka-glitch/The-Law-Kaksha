import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Portal Login | The Law Kaksha",
  description:
    "Log in to The Law Kaksha student dashboard to access CA Foundation Business Laws and CSEET smart question banks, reading streaks, and study notes.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://lawkaksha.in/login",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
