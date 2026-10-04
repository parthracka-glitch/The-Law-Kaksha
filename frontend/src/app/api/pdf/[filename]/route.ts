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
    
    // Sanitize filename to prevent directory traversal and decode URL components
    const decodedFilename = decodeURIComponent(filename);
    const safeFilename = path.basename(decodedFilename);
    const possiblePaths = [
      path.join(process.cwd(), "public", "notes", safeFilename),
      path.join(process.cwd(), "..", "backend", "uploads", safeFilename),
      path.join(process.cwd(), "public", safeFilename),
      path.join(process.cwd(), "public", "uploads", safeFilename),
      path.join(process.cwd(), "uploads", safeFilename),
      path.join(process.cwd(), "public", "notes", path.basename(filename)),
      path.join(process.cwd(), "..", "backend", "uploads", path.basename(filename)),
    ];

    // Aliases for Indian Partnership Act & SOGA units if accessed via canonical or original names
    const lowerName = safeFilename.toLowerCase();
    if (lowerName.includes("infographic") || lowerName.includes("infogarphic")) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "partnership-infographics.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "Partnership Infogarphics.pdf"));
    }
    if (lowerName.includes("ldr") && lowerName.includes("chart")) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "partnership-ldr-charts.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "Partnership LDR Charts.pdf"));
    }
    if (lowerName.includes("paper analysis") || lowerName.includes("september 2026") || lowerName.includes("september-2026")) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "september-2026-paper-analysis.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "September 2026 Paper Analysis.pdf"));
    }
    if (lowerName.includes("smart revision") || (lowerName.includes("question bank") && lowerName.includes("part 1"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "smart-revision-question-bank-part-1.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "Smart Revision Question Bank Part 1.pdf"));
    }
    if (lowerName.includes("partnership") && (lowerName.includes("practice") || lowerName.includes("question"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "indian-partnership-act-practice-questions.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "Indian Partnership Act_Practice Questions.pdf"));
    }
    if (lowerName.includes("partnership") && (lowerName.includes("unit 1") || lowerName.includes("unit_1") || lowerName.includes("general nature"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "unit-1-general-nature-of-partnership.pdf"));
    }
    if (lowerName.includes("partnership") && (lowerName.includes("unit 2") || lowerName.includes("unit_2") || lowerName.includes("relations of partners"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "unit-2-relations-of-partners.pdf"));
    }
    if (lowerName.includes("partnership") && (lowerName.includes("unit 3") || lowerName.includes("unit_3") || lowerName.includes("dissolution"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "unit-3-registration-and-dissolution-of-firm.pdf"));
    }
    if (lowerName.includes("soga") && (lowerName.includes("1") || lowerName.includes("unit 1") || lowerName.includes("unit_1"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "sale-of-goods-unit-1.pdf"));
    }
    if (lowerName.includes("soga") && (lowerName.includes("2") || lowerName.includes("unit 2") || lowerName.includes("unit_2"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "sale-of-goods-unit-2.pdf"));
    }

    let filePath = possiblePaths.find((p) => fs.existsSync(p));

    // Fallback to default canonical PDF if specific name not found on disk
    if (!filePath) {
      const fallbackPaths = [
        path.join(process.cwd(), "public", "notes", "unit-1-general-nature-of-partnership.pdf"),
        path.join(process.cwd(), "public", "notes", "sale-of-goods-unit-1.pdf"),
        path.join(process.cwd(), "public", "notes", "sale-of-goods-unit-2.pdf"),
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

    const stat = await fs.promises.stat(filePath);
    const fileSize = stat.size;

    const rangeHeader = request.headers.get("range");

    if (rangeHeader) {
      // Support HTTP Range requests so PDF.js can load pages on-demand
      const match = rangeHeader.match(/bytes=(\d+)-(\d*)/);
      if (match) {
        const start = parseInt(match[1], 10);
        const end = match[2] ? parseInt(match[2], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const fileStream = fs.createReadStream(filePath, { start, end });
        const chunks: Buffer[] = [];
        for await (const chunk of fileStream) {
          chunks.push(chunk as Buffer);
        }
        const buffer = Buffer.concat(chunks);

        return new NextResponse(buffer, {
          status: 206,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Content-Length": chunkSize.toString(),
            "Accept-Ranges": "bytes",
            "Cache-Control": "private, max-age=3600",
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "SAMEORIGIN",
            "Content-Disposition": `inline; filename="lk-protected-${safeFilename}"`,
          },
        });
      }
    }

    // Full file response with range support enabled
    const fileBuffer = await fs.promises.readFile(filePath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": fileSize.toString(),
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Disposition": `inline; filename="lk-protected-${safeFilename}"`,
      },
    });
  } catch (error: any) {
    console.error("API PDF route error:", error);
    return NextResponse.json({ error: "Error reading PDF file" }, { status: 500 });
  }
}
