import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

interface PdfTokenPayload {
  id?: string;
  email?: string;
  role?: string;
  student_id?: string;
  drm_access?: boolean;
  exp?: number;
}

function verifyJwtToken(token: string, secret: string): PdfTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(`${headerB64}.${payloadB64}`)
      .digest("base64url");

    const sigBuf = Buffer.from(sigB64);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }

    const payload: PdfTokenPayload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8")
    );
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    const url = new URL(request.url);
    
    // Sanitize filename to prevent directory traversal and decode URL components
    const decodedFilename = decodeURIComponent(filename);
    const safeFilename = path.basename(decodedFilename);
    const lowerName = safeFilename.toLowerCase();

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

    // Check sample status (via query param, filename, or known sample units)
    const isSampleParam =
      url.searchParams.get("sample") === "true" ||
      url.searchParams.get("sample") === "1" ||
      url.searchParams.get("preview") === "true";

    const isSampleFile =
      isSampleParam ||
      lowerName.includes("sample") ||
      lowerName.includes("preview") ||
      lowerName.includes("infographic") ||
      lowerName.includes("infogarphic") ||
      lowerName.includes("unit-1") ||
      lowerName.includes("unit_1") ||
      lowerName.includes("unit 1") ||
      lowerName.includes("unit-2") ||
      lowerName.includes("unit_2") ||
      lowerName.includes("unit 2") ||
      lowerName.includes("unit-3") ||
      lowerName.includes("unit_3") ||
      lowerName.includes("unit 3") ||
      lowerName.includes("part 1") ||
      lowerName.includes("part1") ||
      lowerName.includes("part 2") ||
      lowerName.includes("part2") ||
      lowerName.includes("general nature") ||
      lowerName.includes("framework") ||
      lowerName.includes("smart revision") ||
      lowerName.includes("paper analysis") ||
      lowerName.includes("practice questions");

    // Authenticate request via Bearer header, URL query token, or cookie (SEC-06)
    const authHeader = request.headers.get("authorization") || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : "";
    const queryToken = url.searchParams.get("token") || "";
    const cookieToken =
      request.cookies.get("lawkaksha_token")?.value ||
      request.cookies.get("token")?.value ||
      "";
    const rawToken = bearerToken || queryToken || cookieToken;

    const jwtSecret =
      process.env.JWT_SECRET ||
      (process.env.NODE_ENV !== "production" ? "the_law_kaksha_secure_jwt_secret_key_2026" : null);

    if (!jwtSecret && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Server authentication misconfigured (JWT_SECRET missing)." },
        { status: 500 }
      );
    }

    if (!rawToken) {
      if (!isSampleFile) {
        return NextResponse.json(
          {
            error: "Authentication required to access DRM-protected codex material.",
            code: "UNAUTHORIZED_DRM",
          },
          { status: 401 }
        );
      }
    } else if (jwtSecret) {
      const decodedUser = verifyJwtToken(rawToken, jwtSecret);
      if (!decodedUser) {
        if (!isSampleFile) {
          return NextResponse.json(
            { error: "Invalid or expired DRM authorization token.", code: "INVALID_TOKEN" },
            { status: 401 }
          );
        }
      } else {
        const isAdmin = decodedUser.role === "admin";
        const hasDrmAccess = decodedUser.drm_access !== false;
        if (!isAdmin && !hasDrmAccess) {
          return NextResponse.json(
            { error: "Active enrollment / DRM access pass required.", code: "DRM_ACCESS_REVOKED" },
            { status: 403 }
          );
        }
      }
    }

    const possiblePaths = [
      path.join(process.cwd(), "public", "notes", safeFilename),
      path.join(process.cwd(), "public", "samples", safeFilename),
      path.join(process.cwd(), "frontend", "public", "notes", safeFilename),
      path.join(process.cwd(), "frontend", "public", "samples", safeFilename),
      path.join(process.cwd(), "..", "frontend", "public", "notes", safeFilename),
      path.join(process.cwd(), "..", "frontend", "public", "samples", safeFilename),
      path.join(process.cwd(), "backend", "uploads", safeFilename),
      path.join(process.cwd(), "..", "backend", "uploads", safeFilename),
      path.join(process.cwd(), "free resources", safeFilename),
      path.join(process.cwd(), "..", "free resources", safeFilename),
      path.join(process.cwd(), "public", safeFilename),
      path.join(process.cwd(), "public", "uploads", safeFilename),
      path.join(process.cwd(), "uploads", safeFilename),
    ];

    // Canonical aliases for specific units
    if (lowerName.includes("part 1") || lowerName.includes("part1") || lowerName.includes("contract")) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "samples", "Question Bank Part 1- Sample Copy.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "samples", "Question Bank Part 1- Sample Copy.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "qbank-part1-sample.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "smart-revision-question-bank-part-1.pdf"));
    }
    if (lowerName.includes("part 2") || lowerName.includes("part2")) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "samples", "Part 2_Sample Copy.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "samples", "Part 2_Sample Copy.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "qbank-part2-sample.pdf"));
    }
    if (lowerName.includes("infographic") || lowerName.includes("infogarphic")) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "partnership-infographics.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "partnership-infographics.pdf"));
    }
    if (lowerName.includes("ldr") && lowerName.includes("chart")) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "partnership-ldr-charts.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "partnership-ldr-charts.pdf"));
    }
    if (lowerName.includes("paper analysis") || lowerName.includes("september 2026") || lowerName.includes("september-2026")) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "september-2026-paper-analysis.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "september-2026-paper-analysis.pdf"));
    }
    if (lowerName.includes("smart revision") || (lowerName.includes("question bank") && lowerName.includes("part 1"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "smart-revision-question-bank-part-1.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "smart-revision-question-bank-part-1.pdf"));
    }
    if (lowerName.includes("partnership") && (lowerName.includes("practice") || lowerName.includes("question"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "indian-partnership-act-practice-questions.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "indian-partnership-act-practice-questions.pdf"));
    }
    if (lowerName.includes("partnership") && (lowerName.includes("unit 1") || lowerName.includes("unit_1") || lowerName.includes("unit-1") || lowerName.includes("general nature"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "unit-1-general-nature-of-partnership.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "unit-1-general-nature-of-partnership.pdf"));
    }
    if (lowerName.includes("partnership") && (lowerName.includes("unit 2") || lowerName.includes("unit_2") || lowerName.includes("unit-2") || lowerName.includes("relations of partners"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "unit-2-relations-of-partners.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "unit-2-relations-of-partners.pdf"));
    }
    if (lowerName.includes("partnership") && (lowerName.includes("unit 3") || lowerName.includes("unit_3") || lowerName.includes("unit-3") || lowerName.includes("dissolution"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "unit-3-registration-and-dissolution-of-firm.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "unit-3-registration-and-dissolution-of-firm.pdf"));
    }
    if ((lowerName.includes("soga") || lowerName.includes("sale-of-goods") || lowerName.includes("sale of goods")) && (lowerName.includes("1") || lowerName.includes("unit 1") || lowerName.includes("unit_1") || lowerName.includes("unit-1"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "sale-of-goods-unit-1.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "sale-of-goods-unit-1.pdf"));
    }
    if ((lowerName.includes("soga") || lowerName.includes("sale-of-goods") || lowerName.includes("sale of goods")) && (lowerName.includes("2") || lowerName.includes("unit 2") || lowerName.includes("unit_2") || lowerName.includes("unit-2"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "sale-of-goods-unit-2.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "sale-of-goods-unit-2.pdf"));
    }
    if (lowerName.includes("cseet") && (lowerName.includes("management") || lowerName.includes("mgmt"))) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "cseet-management-full.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "cseet-management-full.pdf"));
    }
    if (lowerName.includes("cseet") && lowerName.includes("law")) {
      possiblePaths.unshift(path.join(process.cwd(), "public", "notes", "cseet-business-law-full.pdf"));
      possiblePaths.unshift(path.join(process.cwd(), "frontend", "public", "notes", "cseet-business-law-full.pdf"));
    }

    let filePath = possiblePaths.find((p) => fs.existsSync(p));

    // For free samples: If specific file not found on disk, fallback to an existing sample PDF so browser viewing never fails
    if (!filePath && isSampleFile) {
      const fallbackCandidates = [
        path.join(process.cwd(), "public", "notes", "sale-of-goods-unit-1.pdf"),
        path.join(process.cwd(), "frontend", "public", "notes", "sale-of-goods-unit-1.pdf"),
        path.join(process.cwd(), "public", "notes", "unit-1-general-nature-of-partnership.pdf"),
        path.join(process.cwd(), "frontend", "public", "notes", "unit-1-general-nature-of-partnership.pdf"),
        path.join(process.cwd(), "public", "samples", "Question Bank Part 1- Sample Copy.pdf"),
        path.join(process.cwd(), "frontend", "public", "samples", "Question Bank Part 1- Sample Copy.pdf"),
      ];
      filePath = fallbackCandidates.find((p) => fs.existsSync(p));
    }

    // Fail closed with 404 if file does not exist on disk (no silent leaks of other paid PDFs)
    if (!filePath) {
      return NextResponse.json({ error: "PDF resource not found." }, { status: 404 });
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
            "Cache-Control": "private, no-store, no-cache, must-revalidate",
            "Pragma": "no-cache",
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
        "Cache-Control": "private, no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Disposition": `inline; filename="lk-protected-${safeFilename}"`,
      },
    });
  } catch (error: unknown) {
    console.error("API PDF route error:", error);
    return NextResponse.json({ error: "Error reading PDF file" }, { status: 500 });
  }
}
