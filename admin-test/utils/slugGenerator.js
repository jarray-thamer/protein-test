// utils/slugGenerator.js

/**
 * Converts a string to a URL-friendly slug
 * @param {string} str - The string to convert to a slug
 * @returns {string} The slugified string
 */
const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and dashes)
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscore with single dash
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
};

/**
 * Generates a unique slug for any model
 * @param {string} text - The text to generate slug from
 * @param {Model} model - The Mongoose model to check against
 * @param {string} [existingId] - The ID of the existing document (for updates)
 * @returns {Promise<string>} A unique slug
 */
const generateUniqueSlug = async (text, model, existingId = null) => {
  let slug = slugify(text);
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    // Build query to check for existing slugs
    const query = { slug: uniqueSlug };
    if (existingId) {
      query._id = { $ne: existingId }; // Exclude current document when updating
    }

    const existingDocument = await model.findOne(query);

    if (!existingDocument) {
      return uniqueSlug;
    }

    // If slug exists, add counter and try again
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
};

/**
 * Creates or updates a slug for a document
 * @param {Object} document - The document being saved
 * @param {string} fieldName - The field name to generate slug from
 * @param {Model} model - The Mongoose model
 * @returns {Promise<string>} The generated slug
 */
const handleSlug = async (document, fieldName, model) => {
  // Check if the field value exists
  if (!document[fieldName]) {
    throw new Error(`${fieldName} is required to generate slug`);
  }

  // Generate new slug if:
  // 1. Document is new (no slug exists)
  // 2. The field value has changed
  if (!document.slug || document.isModified(fieldName)) {
    return generateUniqueSlug(document[fieldName], model, document._id);
  }

  // Return existing slug if no changes
  return document.slug;
};

module.exports = {
  slugify,
  generateUniqueSlug,
  handleSlug,
};
