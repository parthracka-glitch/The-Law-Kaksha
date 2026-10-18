/**
 * The Law Kaksha — PDF Sample Generator
 * Extracts the first N pages from a PDF to generate a trimmed public sample.
 */

const { PDFDocument } = require("pdf-lib");

/**
 * Trims a PDF buffer down to the specified page range.
 * @param {Buffer|Uint8Array} pdfBuffer - Full PDF file buffer
 * @param {number} startPage - 1-based start page (default: 1)
 * @param {number} endPage - 1-based end page (default: 5)
 * @returns {Promise<Buffer>} Trimmed PDF buffer
 */
async function extractSamplePages(pdfBuffer, startPage = 1, endPage = 5) {
  try {
    const srcDoc = await PDFDocument.load(pdfBuffer, { ignoreEncryption: true });
    const totalPages = srcDoc.getPageCount();

    if (totalPages === 0) {
      throw new Error("Source PDF contains no pages.");
    }

    const destDoc = await PDFDocument.create();

    const startIdx = Math.max(0, startPage - 1);
    const endIdx = Math.min(totalPages - 1, endPage - 1);

    const pageIndices = [];
    for (let i = startIdx; i <= endIdx; i++) {
      pageIndices.push(i);
    }

    const copiedPages = await destDoc.copyPages(srcDoc, pageIndices);
    for (const page of copiedPages) {
      destDoc.addPage(page);
    }

    destDoc.setTitle("The Law Kaksha • Free Sample Preview");
    destDoc.setSubject("Law Kaksha Statutory Law Study Codex Preview");
    destDoc.setAuthor("The Law Kaksha");

    const pdfBytes = await destDoc.save();
    return Buffer.from(pdfBytes);
  } catch (err) {
    console.error("[SampleGenerator] Error extracting sample pages:", err.message);
    throw err;
  }
}

/**
 * Generates a minimal placeholder PDF buffer for testing or missing files.
 * @param {string} title
 * @returns {Promise<Buffer>}
 */
async function generateMinimalPdf(title = "The Law Kaksha Study Codex") {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  page.drawText(title, {
    x: 50,
    y: 750,
    size: 20,
  });
  page.drawText("Protected Statutory Learning Codex • The Law Kaksha", {
    x: 50,
    y: 720,
    size: 12,
  });
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

module.exports = {
  extractSamplePages,
  generateMinimalPdf,
};
