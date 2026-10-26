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

    const searchDirs = [
      path.join(process.cwd(), "public", "notes"),
      path.join(process.cwd(), "public", "samples"),
      path.join(process.cwd(), "frontend", "public", "notes"),
      path.join(process.cwd(), "frontend", "public", "samples"),
      path.join(process.cwd(), "..", "frontend", "public", "notes"),
      path.join(process.cwd(), "..", "frontend", "public", "samples"),
      path.join(process.cwd(), "backend", "uploads"),
      path.join(process.cwd(), "..", "backend", "uploads"),
      path.join(process.cwd(), "free resources"),
      path.join(process.cwd(), "..", "free resources"),
      path.join(process.cwd(), "public"),
      path.join(process.cwd(), "public", "uploads"),
      path.join(process.cwd(), "uploads"),
    ];

    // 1. Direct exact filename check in all search directories
    const possiblePaths: string[] = [];
    for (const d of searchDirs) {
      possiblePaths.push(path.join(d, safeFilename));
    }

    // 2. Well-known slug aliases to exact physical files
    const KNOWN_SLUG_MAP: Record<string, string> = {
      "sale-of-goods-unit-1.pdf": "SOGA Unit 1 .pdf",
      "sale-of-goods-unit-2.pdf": "SOGA Unit 2.pdf",
      "sale-of-goods-unit-3.pdf": "SOGA Unit 3.pdf",
      "sale-of-goods-unit-4.pdf": "SOGA Unit 4.pdf",
      "the-sale-of-goods-act-1930.pdf": "SOGA Unit 1 .pdf",
      "the-indian-contract-act-1872.pdf": "Unit 1 - Nature of Contracts.pdf",
      "the-indian-partnership-act-1932.pdf": "UNIT 1 GENERAL NATURE OF PARTNERSHIP.pdf",
      "unit-1-general-nature-of-partnership.pdf": "UNIT 1 GENERAL NATURE OF PARTNERSHIP.pdf",
      "unit-2-relations-of-partners.pdf": "Unit 2 RELATIONS OF PARTNERS.pdf",
      "unit-3-registration-and-dissolution-of-firm.pdf": "Unit 3 REGISTRATION AND DISSOLUTION OF FIRM.pdf",
      "the-limited-liability-partnership-act-2008.pdf": "THE LIMITED LIABILITY PARTNERSHIP ACT, 2008.pdf",
      "the-companies-act-2013.pdf": "Unit 1 - Nature of Contracts.pdf",
      "cseet-business-management.pdf": "Lesson 7 Introduction to Management (Comprehensive Notes).pdf",
      "cseet-management-full.pdf": "Lesson 7 Introduction to Management (Comprehensive Notes).pdf",
      "cseet-business-law-full.pdf": "Lesson 10 Management Knowledge for CS.pdf",
      "cseet-legal-aptitude.pdf": "Lesson 10 Management Knowledge for CS.pdf",
      "partnership-ldr-charts.pdf": "Partnership LDR Charts.pdf",
      "partnership-infographics.pdf": "Partnership Infogarphics.pdf",
      "indian-partnership-act-practice-questions.pdf": "Indian Partnership Practice Questions_Law Kaksha.pdf",
      "smart-revision-question-bank-part-1.pdf": "Question Bank_Part1 Final Copy.pdf",
      "smart-revision-question-bank-part-2.pdf": "Question Bank Part 2_Final Copy.pdf",
      "qbank-part1-sample.pdf": "Question Bank Part 1- Sample Copy.pdf",
      "qbank-part2-sample.pdf": "Part 2_Sample Copy.pdf",
    };

    const mappedTarget = KNOWN_SLUG_MAP[lowerName];
    if (mappedTarget) {
      for (const d of searchDirs) {
        possiblePaths.push(path.join(d, mappedTarget));
      }
    }

    // 3. Try to find direct or mapped file
    let filePath = possiblePaths.find((p) => fs.existsSync(p));

    // 4. Smart fuzzy directory scan if still not resolved
    if (!filePath) {
      const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
      const targetNorm = normalize(safeFilename.replace(/\.pdf$/i, ""));

      for (const d of searchDirs) {
        if (!fs.existsSync(d)) continue;
        try {
          const files = fs.readdirSync(d);
          const match = files.find((f) => {
            if (!f.toLowerCase().endsWith(".pdf")) return false;
            const fNorm = normalize(f.replace(/\.pdf$/i, ""));
            return fNorm === targetNorm || (targetNorm.length > 5 && (fNorm.includes(targetNorm) || targetNorm.includes(fNorm)));
          });
          if (match) {
            filePath = path.join(d, match);
            break;
          }
        } catch {}
      }
    }

    // 5. Subject-aware fallbacks for sample requests (ensuring Contract NEVER serves SOGA)
    if (!filePath && isSampleFile) {
      const subjectFallbacks: string[] = [];
      if (lowerName.includes("contract")) {
        subjectFallbacks.push("Unit 1 - Nature of Contracts.pdf", "Question Bank Part 1- Sample Copy.pdf");
      } else if (lowerName.includes("soga") || lowerName.includes("sale-of-goods") || lowerName.includes("sale of goods")) {
        subjectFallbacks.push("SOGA Unit 1 .pdf", "sale-of-goods-unit-1.pdf");
      } else if (lowerName.includes("partnership")) {
        subjectFallbacks.push("UNIT 1 GENERAL NATURE OF PARTNERSHIP.pdf", "Partnership LDR Charts.pdf");
      } else if (lowerName.includes("llp")) {
        subjectFallbacks.push("THE LIMITED LIABILITY PARTNERSHIP ACT, 2008.pdf", "LDR_Flowchart_Book.pdf");
      } else if (lowerName.includes("cseet") || lowerName.includes("management")) {
        subjectFallbacks.push("Lesson 7 Introduction to Management (Comprehensive Notes).pdf");
      } else {
        subjectFallbacks.push("Unit 1 - Nature of Contracts.pdf", "Question Bank Part 1- Sample Copy.pdf");
      }

      for (const fallback of subjectFallbacks) {
        for (const d of searchDirs) {
          const testP = path.join(d, fallback);
          if (fs.existsSync(testP)) {
            filePath = testP;
            break;
          }
        }
        if (filePath) break;
      }
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
