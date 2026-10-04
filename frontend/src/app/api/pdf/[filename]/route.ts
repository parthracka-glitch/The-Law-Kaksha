import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    const url = new URL(request.url);
    const format = url.searchParams.get("format");
    
    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(filename);
    const possiblePaths = [
      path.join(process.cwd(), "public", "notes", safeFilename),
      path.join(process.cwd(), "..", "backend", "uploads", safeFilename),
      path.join(process.cwd(), "public", safeFilename),
      path.join(process.cwd(), "public", "uploads", safeFilename),
      path.join(process.cwd(), "uploads", safeFilename),
    ];

    // Aliases for SOGA units if accessed via original name
    if (safeFilename.toLowerCase().includes("soga") && (safeFilename.includes("1") || safeFilename.toLowerCase().includes("unit 1") || safeFilename.toLowerCase().includes("unit_1"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "sale-of-goods-unit-1.pdf"));
    }
    if (safeFilename.toLowerCase().includes("soga") && (safeFilename.includes("2") || safeFilename.toLowerCase().includes("unit 2") || safeFilename.toLowerCase().includes("unit_2"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "sale-of-goods-unit-2.pdf"));
    }

    let filePath = possiblePaths.find((p) => fs.existsSync(p));

    // Fallback to default canonical PDF if specific name not found on disk
    if (!filePath) {
      const fallbackPaths = [
        path.join(process.cwd(), "public", "notes", "sale-of-goods-unit-1.pdf"),
        path.join(process.cwd(), "public", "notes", "sale-of-goods-unit-2.pdf"),
        path.join(process.cwd(), "public", "notes", "unit-1-general-nature-of-partnership.pdf"),
        path.join(process.cwd(), "public", "notes", "cseet-management-full.pdf"),
        path.join(process.cwd(), "public", "notes", "cseet-business-law-full.pdf"),
      ];
      filePath = fallbackPaths.find((p) => fs.existsSync(p));
    }

    if (!filePath) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    // SECURITY DRM: Prevent direct browser file download / Save As.
    // If accessed as a browser navigation (new tab, address bar, or standard link click),
    // redirect directly to the in-portal DRM Protected Reader where downloading is disabled.
    const dest = request.headers.get("sec-fetch-dest");
    const mode = request.headers.get("sec-fetch-mode");
    const accept = request.headers.get("accept") || "";

    if (dest === "document" || mode === "navigate" || accept.includes("text/html")) {
      return NextResponse.redirect(
        new URL(`/reader?file=${encodeURIComponent(safeFilename)}`, request.url),
        307
      );
    }

    const fileBuffer = await fs.promises.readFile(filePath);

    // If base64 format requested, return robust JSON with raw base64 string for Canvas PDF.js renderer
    if (format === "base64" || request.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json({
        filename: safeFilename,
        size: fileBuffer.byteLength,
        base64: fileBuffer.toString("base64"),
      });
    }

    // Default binary streaming response (protected for in-app PDF.js fetch)
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": fileBuffer.byteLength.toString(),
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Accept-Ranges": "none",
        "Content-Disposition": `inline; filename="lk-protected-${safeFilename}"`,
      },
    });
  } catch (error: any) {
    console.error("API PDF route error:", error);
    return NextResponse.json({ error: "Error reading PDF file" }, { status: 500 });
  }
}
