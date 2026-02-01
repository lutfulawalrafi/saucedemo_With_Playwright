// src/utils/commonHelper.js
/**
 * Convert a price string like "$49.99" to a number 49.99
 */
function parsePrice(priceText) {
  if (!priceText) return 0;
  return Number(priceText.replace('$', '').trim());
}

/**
 * Extract price from text like "Item total: $49.99"
 */
function extractPriceFromLabel(text) {
  const match = text.match(/\$[\d.]+/);
  return match ? parsePrice(match[0]) : 0;
}

module.exports = {
  parsePrice,
  extractPriceFromLabel,
};
