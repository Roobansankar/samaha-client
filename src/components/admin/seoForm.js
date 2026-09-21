/** The SEO fields shared by products and categories (same names as the database columns). */
export const SEO_FIELDS = [
  'meta_title', 'meta_description', 'canonical_url',
  'og_title', 'og_description', 'og_image', 'robots', 'seo_content',
]

/** API row -> form state ('' instead of null so inputs stay controlled) */
export const seoFromApi = (row = {}) =>
  Object.fromEntries(SEO_FIELDS.map((k) => [k, row[k] ?? '']))

/** form state -> API payload (empty string becomes null = "use the generated fallback") */
export const seoToApi = (values) =>
  Object.fromEntries(SEO_FIELDS.map((k) => [k, String(values[k] ?? '').trim() || null]))
