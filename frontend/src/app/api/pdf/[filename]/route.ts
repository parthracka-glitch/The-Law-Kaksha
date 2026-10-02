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

    let filePath = possiblePaths.find((p) => fs.existsSync(p));

    // Fallback to default canonical PDF if specific name not found on disk
    if (!filePath) {
      const fallbackPaths = [
        path.join(process.cwd(), "public", "notes", "unit-1-general-nature-of-partnership.pdf"),
        path.join(process.cwd(), "public", "notes", "cseet-business-law-full.pdf"),
        path.join(process.cwd(), "public", "assets", "The_Law_Kaksha_Clean_PDF_Template.pdf"),
      ];
      filePath = fallbackPaths.find((p) => fs.existsSync(p));
    }

    if (!filePath) {
      return NextResponse.json({ error: "PDF not found" }, { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(filePath);

    // If base64 format requested, return robust JSON with raw base64 string
    if (format === "base64" || request.headers.get("accept")?.includes("application/json")) {
      return NextResponse.json({
        filename: safeFilename,
        size: fileBuffer.byteLength,
        base64: fileBuffer.toString("base64"),
      });
    }

    // Default binary streaming response
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": fileBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400, immutable",
        "Accept-Ranges": "none",
        "Content-Disposition": `inline; filename="${safeFilename}"`,
      },
    });
  } catch (error: any) {
    console.error("API PDF route error:", error);
    return NextResponse.json({ error: "Error reading PDF file" }, { status: 500 });
  }
}
