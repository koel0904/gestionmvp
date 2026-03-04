/**
 * Smart search utility – shared across all dashboard views.
 *
 * Features:
 *  • Multi-word AND search — "premium prod" matches rows containing BOTH words
 *  • Accent / diacritics insensitive — "jose" matches "José"
 *  • Case insensitive
 *  • Searches across all provided field values
 */

/** Strip diacritics and lower-case */
const norm = (s) =>
  (s ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

/**
 * Returns true when every word in `query` appears in at least one of the `fields`.
 *
 * @param {string}   query  — user's search input
 * @param {string[]} fields — array of field values to match against
 */
export function smartMatch(query, fields) {
  const q = norm(query);
  if (!q) return true; // empty search matches everything

  const words = q.split(/\s+/).filter(Boolean);
  const haystack = fields.map(norm).join(" ");

  return words.every((word) => haystack.includes(word));
}
