import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept any direct access or navigation to raw PDF files in /notes/ or /samples/
  if (
    pathname.toLowerCase().endsWith(".pdf") &&
    (pathname.startsWith("/notes/") || pathname.startsWith("/samples/"))
  ) {
    const rawFilename = pathname.split("/").pop() || "codex.pdf";
    const filename = decodeURIComponent(rawFilename);
    const lower = filename.toLowerCase();

    const isSample =
      pathname.startsWith("/samples/") ||
      lower.includes("sample") ||
      lower.includes("preview") ||
      lower.includes("unit-1") ||
      lower.includes("unit_1") ||
      lower.includes("part 1") ||
      lower.includes("part1");

    const sampleParam = isSample ? "&sample=true" : "";
    const redirectUrl = new URL(
      `/reader?file=${encodeURIComponent(filename)}${sampleParam}`,
      request.url
    );
    return NextResponse.redirect(redirectUrl, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notes/:path*",
    "/samples/:path*",
  ],
};
