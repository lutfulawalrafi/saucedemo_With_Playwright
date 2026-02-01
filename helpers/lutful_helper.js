export function extractPrice(text) {
  const match = text.match(/\$[\d.]+/);
  return match ? match[0] : null;
}

