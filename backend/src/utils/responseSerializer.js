/**
 * The Law Kaksha — Zero-Trust API Response Whitelist Serializer
 * Phase P3: Prevents data leaks of raw Cloudinary URLs, private cloudinaryPublicId,
 * and direct filesystem paths in public and student-facing endpoints.
 */

/**
 * Whitelist serializer for ContentItem
 * @param {Object} item - ContentItem or Resource document
 * @param {Object} options - { isAdmin: boolean, forEdit: boolean }
 */
function serializeContentItem(item, options = {}) {
  if (!item) return null;

  const serialized = {
    id: item.id || item._id,
    unitId: item.unitId || null,
    actId: item.actId || null,
    courseId: item.courseId || item.course || null,
    type: item.type || "notes",
    title: item.title,
    description: item.description || "",
    isSample: Boolean(item.isSample),
    sampleFromPage: item.sampleFromPage || 1,
    sampleToPage: item.sampleToPage || 5,
    isPublished: item.isPublished !== false && item.status !== "Draft",
    publishedAt: item.publishedAt || item.createdAt || null,
    order: item.order || 0,
    fileSize: item.fileSize || 0,
    fileName: item.fileName || "study-codex.pdf",
    // Canonical protected file access gateway
    fileUrl: `/api/content/${item.id}/file`,
    // If it's a sample or has a sample preview
    ...(item.isSample || item.samplePublicId
      ? { sampleUrl: `/api/content/${item.id}/file?sample=true` }
      : {}),
  };

  // Only authorized administrators in edit mode receive private asset IDs
  if (options.isAdmin && options.forEdit) {
    serialized.cloudinaryPublicId = item.cloudinaryPublicId || "";
    serialized.samplePublicId = item.samplePublicId || "";
  }

  return serialized;
}

/**
 * Whitelist serializer for Courses
 * @param {Object} course - Course document
 */
function serializeCourse(course) {
  if (!course) return null;

  return {
    id: course.id || course._id,
    title: course.title,
    slug: course.slug,
    availability: course.availability || "live",
    price: course.price !== undefined ? course.price : 99,
    mrp: course.mrp || 0,
    accessDays: course.accessDays || 30,
    description: course.description || "",
    thumbnail: course.thumbnail || "/assets/ca-cs-hero-books-sharp.png",
    kind: course.kind || "core",
    is_active: course.is_active !== false,
    order: course.order || 0,
    display_order: course.display_order || 0,
    exam_body: course.exam_body || "ICAI",
    units_count: course.units_count || 0,
  };
}

/**
 * Whitelist serializer for legacy Products in catalog
 * @param {Object} product - Product document
 */
function serializeProduct(product) {
  if (!product) return null;

  const isSample = Boolean(product.isSample);
  const cleanId = product.id || product._id;

  return {
    id: cleanId,
    title: product.title,
    subtitle: product.subtitle || "",
    category: product.category || "CA Foundation",
    format: product.format || "Digital Codex",
    price: product.price !== undefined ? product.price : 99,
    original_price: product.originalPrice || product.original_price || 299,
    badge: `₹${product.price !== undefined ? product.price : 99}`,
    pages: product.pages || "Study Codex",
    status: product.status || "Active",
    description: product.description || "",
    units: product.units || [],
    highlights: product.highlights || [],
    cover_image: product.cover_image || "/assets/ca-cs-hero-books-sharp.png",
    isSample,
    // Strictly route through protected file gateway; NEVER leak raw Cloudinary or static paths
    fileUrl: `/api/content/${cleanId}/file`,
    ...(isSample ? { sampleUrl: `/api/content/${cleanId}/file?sample=true` } : {}),
  };
}

/**
 * Whitelist serializer for Resource items
 * @param {Object} resource - Resource document
 * @param {Object} options - { isAdmin: boolean }
 */
function serializeResource(resource, options = {}) {
  if (!resource) return null;

  const isSample = Boolean(resource.isSample);
  const cleanId = resource.id || resource._id;

  const serialized = {
    id: cleanId,
    course: resource.course,
    actName: resource.actName,
    chapterNumber: resource.chapterNumber,
    type: resource.type,
    title: resource.title,
    description: resource.description || "",
    isSample,
    status: resource.status || "Published",
    order: resource.order || 0,
    pages: resource.pages || "",
    // Strictly route through protected file gateway; NEVER leak raw Cloudinary or static paths
    fileUrl: `/api/content/${cleanId}/file`,
    ...(isSample ? { sampleUrl: `/api/content/${cleanId}/file?sample=true` } : {}),
  };

  if (options.isAdmin && options.forEdit) {
    serialized.cloudinaryPublicId = resource.cloudinaryPublicId || "";
  }

  return serialized;
}

module.exports = {
  serializeContentItem,
  serializeCourse,
  serializeProduct,
  serializeResource,
};
