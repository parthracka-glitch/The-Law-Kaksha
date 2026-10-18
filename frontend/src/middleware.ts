import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept any direct browser navigations to raw PDF files in /notes/ or /samples/
  if (
    pathname.toLowerCase().endsWith(".pdf") &&
    (pathname.startsWith("/notes/") || pathname.startsWith("/samples/"))
  ) {
    const dest = request.headers.get("sec-fetch-dest");
    const mode = request.headers.get("sec-fetch-mode");
    const accept = request.headers.get("accept") || "";

    // If accessed directly via browser navigation (address bar, new tab, direct link click),
    // redirect to the DRM-protected reader page so Edge/Chrome Save As / download is prevented.
    if (dest === "document" || mode === "navigate" || accept.includes("text/html")) {
      const filename = pathname.split("/").pop() || "codex.pdf";
      const redirectUrl = new URL(`/reader?file=${encodeURIComponent(filename)}`, request.url);
      return NextResponse.redirect(redirectUrl, 307);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/notes/:path*",
    "/samples/:path*",
  ],
};
