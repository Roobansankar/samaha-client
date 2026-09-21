/**
 * Content for the "Auto feed template" button on the Add-product form.
 *
 * These are only form defaults: clicking the button types them into the form so an
 * admin can review and edit before saving — the storefront still reads everything
 * from the database. Wording follows the site's existing product pages, without
 * health or cosmetic claims.
 *
 * A value of `null` means "nothing honest to fill here" and the field is left alone.
 * Never filled, on purpose:
 *   - GTIN / MPN     real codes only; an invented barcode gets products rejected by Google
 *   - images         need the real product photo (the shop shows the standard oil photo until then)
 *   - robots         the default (index, follow) is the right one
 *
 * canonical_url and og_image are filled with values that MIRROR the page itself — its own
 * address (/shop/{slug}) and its first photo. They are relative on purpose: the server turns
 * them into full URLs for whichever domain it runs on. The form and ProductController keep
 * them in step when the slug or the first photo changes.
 */

/* Same patterns the form falls back to when the name fields are left empty. */
export const displayNameFor = (oil, sizeLong) => `Samaha Unrefined Cold-Pressed ${oil} (Chekku) — ${sizeLong}`
export const shortNameFor = (oil, sizeLong) => `Cold-Pressed ${oil} — ${sizeLong}`
export const suggestMrp = (price) => (price ? Math.round((Number(price) * 1.34) / 5) * 5 : '')

/** Every form field the template can fill (also used to tell auto-filled text from typed text). */
export const TEMPLATE_KEYS = [
  'name', 'short_name', 'sku', 'blurb', 'badge', 'tagline', 'description',
  'price', 'mrp', 'stock',
  'meta_title', 'meta_description', 'canonical_url', 'og_title', 'og_description', 'og_image', 'seo_content',
]

const OIL_COPY = {
  'Coconut Oil': {
    image: '/products/coconut-oil.webp', // the standard photo the shop already uses for this oil
    badge: 'Best seller',
    blurb: 'Cold Pressed | Own-farm coconuts',
    tagline: 'Cold-pressed from fresh white kernel — mild, clean and versatile.',
    description:
      'Pressed within hours of cracking, from the white kernel of single-estate coconuts grown in the Velliangiri Hills. Nothing is heated hard, bleached or deodorised — what goes in the bottle is what came out of the press.\n\nMild and faintly sweet, it moves easily through everyday cooking and baking.',
    seo: 'Unrefined oil from Velliangiri Hills coconuts, filled by hand in Coimbatore.',
    process:
      'It is unrefined, unfiltered and unbleached, with no solvents and no deodorising. Every bottle is filled by hand and stamped with its pressing date.',
  },
  'Groundnut Oil': {
    image: '/products/groundnut-oil.webp',
    badge: '',
    blurb: 'Wood Pressed | Small batch',
    tagline: 'Wood-pressed the slow way — deep, warm and nutty.',
    description:
      'Sun-dried groundnuts, slow-pressed in a wooden chekku so the oil never overheats. The result is a full, toasty aroma and the deep gold colour that only unrefined groundnut oil has.\n\nBuilt for heat — deep frying, sautéing and tempering — where it stays clean and carries flavour without turning.',
    seo: 'Unrefined oil from sun-dried groundnuts, wood-pressed in small batches in Coimbatore.',
    process:
      'It is unrefined and unfiltered, pressed in small batches in a wooden chekku and bottled by hand in short runs that carry the pressing date.',
  },
  'Sesame Oil': {
    image: '/products/sesame-oil.webp',
    badge: '',
    blurb: 'Stone Ground | Cold Pressed',
    tagline: 'Rich, aromatic and deeply nutty — the finishing oil of choice.',
    description:
      'Stone-ground from whole, unhulled sesame seeds and cold-pressed to preserve the deep, roasted aroma that makes sesame oil irreplaceable in Asian and Indian kitchens.\n\nA little goes a long way — drizzle over finished dishes, use in marinades, or add depth to stir-fries and dressings.',
    seo: 'Unrefined oil from stone-ground whole sesame seeds, pressed in small lots in Coimbatore.',
    process: 'It is unrefined, pressed in small, dated lots and bottled by hand.',
  },
}

/* Standard list prices (₹) by pack size. Sizes not listed here get no price. */
const LIST_PRICE = {
  'Coconut Oil': { '500 ml': 100, '1 Litre': 180, '5 Litres': 830, '16 Litre Tin': 2520 },
  'Groundnut Oil': { '500 ml': 120, '1 Litre': 220, '5 Litres': 1010, '16 Litre Tin': 3080 },
  'Sesame Oil': { '500 ml': 160, '1 Litre': 290, '5 Litres': 1340, '16 Litre Tin': 4080 },
}

/* Starter stock (the launch quantities) and a one-line pack description. */
const SIZE_INFO = {
  '500 ml': { stock: 120, line: 'The 500 ml bottle is a handy size to try Samaha or for a small kitchen.' },
  '1 Litre': { stock: 90, line: 'The 1 litre bottle is our everyday size for regular cooking.' },
  '5 Litres': { stock: 45, line: 'The 5 litre pack suits kitchens that cook in larger quantities.' },
  '16 Litre Tin': { stock: 18, line: 'The 16 litre tin is our largest pack, for bulk buying.' },
}
const DEFAULT_STOCK = 50

/**
 * @param oil       trimmed oil name, e.g. "Coconut Oil" (custom oils are fine)
 * @param sizeLong  trimmed pack size, e.g. "1 Litre" (custom sizes are fine)
 * @param slug      the product slug the form derives from oil + size (SKU and canonical)
 * @param firstImage the first product photo already uploaded in the form, if any (share image)
 * @returns { known, values } — `known` is false for a custom oil (no ready-made copy);
 *          `values` has every key in TEMPLATE_KEYS, `null` where there is nothing to fill.
 */
export function buildTemplate({ oil, sizeLong, slug, firstImage = '' }) {
  const copy = OIL_COPY[oil] ?? null
  const size = SIZE_INFO[sizeLong] ?? null
  const price = LIST_PRICE[oil]?.[sizeLong] ?? null
  const short = shortNameFor(oil, sizeLong)
  const longTitle = `${short} | Buy Online | Samaha`

  return {
    known: Boolean(copy),
    values: {
      name: displayNameFor(oil, sizeLong),
      short_name: short,
      sku: `SAM-${slug.toUpperCase()}`.slice(0, 80), // internal code, derived from the slug
      blurb: copy?.blurb ?? null,
      badge: copy ? (sizeLong === '16 Litre Tin' ? 'Best value' : copy.badge) : null,
      tagline: copy?.tagline ?? null,
      description: copy?.description ?? null,
      price,
      mrp: price !== null ? suggestMrp(price) : null,
      stock: size?.stock ?? DEFAULT_STOCK,
      meta_title: longTitle.length <= 60 ? longTitle : `${short} | Samaha`,
      meta_description: copy ? `Buy ${short} online from Samaha. ${copy.seo}` : `Buy ${short} online from Samaha.`,
      canonical_url: `/shop/${slug}`,
      og_title: short,
      og_description: copy?.tagline ?? null,
      og_image: firstImage || copy?.image || null,
      seo_content: copy ? [size?.line, copy.process].filter(Boolean).join('\n\n') : null,
    },
  }
}
