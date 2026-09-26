/**
 * The Law Kaksha - Product Catalog & Reviews Routes
 */

const express = require("express");
const Database = require("../db/database");

const router = express.Router();

// 1. GET /api/catalog — List products with search, filter, and sorting
router.get("/catalog", (req, res) => {
  try {
    const { category, type, search, sort } = req.query;
    const productsTable = Database.table("products");

    let products = productsTable.find((p) => p.status === "published");

    // Filter by type (book, mcq, video, evaluation)
    if (type && type !== "all") {
      products = products.filter((p) => p.type === type.toLowerCase());
    }

    // Filter by category
    if (category && category !== "all") {
      products = products.filter((p) =>
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }

    // Live search query matching title, subtitle, or highlights
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (Array.isArray(p.highlights) &&
            p.highlights.some((h) => h.toLowerCase().includes(q)))
      );
    }

    // Sorting: price-asc, price-desc, popular
    if (sort === "price-asc") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      products.sort((a, b) => b.price - a.price);
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      items: products,
      products,
    });
  } catch (err) {
    console.error("[Catalog] List error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 2. GET /api/catalog/:idOrSlug — Get complete product details with syllabus and reviews
router.get("/catalog/:idOrSlug", (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const productsTable = Database.table("products");
    const reviewsTable = Database.table("reviews");

    const product = productsTable.findOne(
      (p) => p.id === idOrSlug || p.slug === idOrSlug
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Attach approved reviews for this product
    const productReviews = reviewsTable.find(
      (r) => r.product_id === product.id && r.is_approved === 1
    );

    return res.status(200).json({
      success: true,
      item: {
        ...product,
        reviews: productReviews,
      },
      product: {
        ...product,
        reviews: productReviews,
      },
    });
  } catch (err) {
    console.error("[Catalog] Detail error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 3. GET /api/catalog/:id/preview — Fetch public 2-3 page watermarked sample preview
router.get("/catalog/:id/preview", (req, res) => {
  try {
    const { id } = req.params;
    const productsTable = Database.table("products");
    const product = productsTable.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    return res.status(200).json({
      success: true,
      productId: product.id,
      title: product.title,
      previewFile: product.preview_file,
      totalPages: 6,
      samplePages: [
        {
          pageNumber: 1,
          label: "Cover & Bare Act Preamble",
          content: "THE LAW KAKSHA — CA LAW ACADEMY\nVolume 1: Companies Act 2013 Statutory Codex (2026-2027 Scheme)\nAuthentic Bare Act Sections with Judicial Precedents",
        },
        {
          pageNumber: 2,
          label: "Chapter 1: Preliminary & Core Definitions",
          content: "Section 2(20) 'Company' & Section 2(71) 'Public Company'\nAnalysis: A company means a company incorporated under this Act or any previous company law.",
        },
        {
          pageNumber: 3,
          label: "Section 96: Annual General Meeting (AGM) Rules",
          content: "Every company other than an OPC shall hold in each year an AGM.\nTime Gap: Not more than 15 months shall elapse between the date of one AGM and the next.",
        },
      ],
      watermark: "SAMPLE PREVIEW — THE LAW KAKSHA",
    });
  } catch (err) {
    console.error("[Catalog] Preview error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// 4. GET /api/reviews — Get all verified student reviews
router.get("/reviews", (req, res) => {
  try {
    const reviewsTable = Database.table("reviews");
    const reviews = reviewsTable.find((r) => r.is_approved === 1);
    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (err) {
    console.error("[Reviews] List error:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

module.exports = router;
