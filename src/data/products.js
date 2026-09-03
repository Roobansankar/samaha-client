// Central product catalogue. Detail pages, the shop grid and the home strip all
// read from here. Sizes: 1/2 L, 1 L, 5 L and 16 L tins.

const withImages = (slug, data) => ({
  slug,
  // First image is the existing product cut-out; 2–5 are optional extra angles.
  // Any that 404 fall back to a placeholder in the gallery.
  images: [
    `/products/${slug}.webp`,
    `/products/${slug}-2.webp`,
    `/products/${slug}-3.webp`,
    `/products/${slug}-4.webp`,
    `/products/${slug}-5.webp`,
  ],
  ...data,
})

export const PRODUCTS = [
  withImages('coconut-oil', {
    name: 'Coconut Oil',
    tag: 'Coconut',
    tagline: 'Cold-pressed from fresh white kernel — mild, clean and versatile.',
    tint: '#e6e1d4',
    rating: 4.9,
    reviews: 214,
    badge: 'Best seller',
    description: [
      'Pressed within hours of cracking, from the white kernel of single-estate coconuts grown in the Velliangiri Hills. Nothing is heated hard, bleached or deodorised — what goes in the bottle is what came out of the press.',
      'Mild and faintly sweet, it is the one oil that moves easily between the kitchen and the bathroom shelf: everyday cooking and baking, or straight onto skin and hair.',
    ],
    sizes: [
      { label: '1/2 L', price: 100 },
      { label: '1 L', price: 180 },
      { label: '5 L', price: 830 },
      { label: '16 L tin', price: 2520 },
    ],
    specs: [
      ['Extraction', 'Chekku cold-pressed'],
      ['Pressed at', 'Below 27°C'],
      ['Filtering', 'Unfiltered, naturally settled'],
      ['Smoke point', '~177°C'],
      ['Best for', 'Everyday cooking, baking, skin & hair'],
      ['Shelf life', '12 months from pressing'],
    ],
  }),
  withImages('groundnut-oil', {
    name: 'Groundnut Oil',
    tag: 'Groundnut',
    tagline: 'Wood-pressed the slow way — deep, warm and nutty.',
    tint: '#e8d8ba',
    rating: 4.8,
    reviews: 156,
    description: [
      'Sun-dried groundnuts, slow-pressed in a wooden chekku so the oil never overheats. The result is a full, toasty aroma and the deep gold colour that only unrefined groundnut oil has.',
      'Built for heat — deep frying, sautéing and tempering — where it stays clean and carries flavour without turning.',
    ],
    sizes: [
      { label: '1/2 L', price: 120 },
      { label: '1 L', price: 220 },
      { label: '5 L', price: 1010 },
      { label: '16 L tin', price: 3080 },
    ],
    specs: [
      ['Extraction', 'Wood-pressed (chekku)'],
      ['Pressed at', 'Below 40°C'],
      ['Filtering', 'Lightly settled, unrefined'],
      ['Smoke point', '~230°C'],
      ['Best for', 'Deep frying, sautéing, tempering'],
      ['Shelf life', '9 months from pressing'],
    ],
  }),
  withImages('sesame-oil', {
    name: 'Sesame Oil',
    tag: 'Sesame',
    tagline: 'Rich, aromatic and deeply nutty — the finishing oil of choice.',
    tint: '#d4b896',
    rating: 4.8,
    reviews: 87,
    description: [
      'Stone-ground from whole, unhulled sesame seeds and cold-pressed to preserve the deep, roasted aroma that makes sesame oil irreplaceable in Asian and Indian kitchens.',
      'A little goes a long way — drizzle over finished dishes, use in marinades, or add depth to stir-fries and dressings.',
    ],
    sizes: [
      { label: '1/2 L', price: 160 },
      { label: '1 L', price: 290 },
      { label: '5 L', price: 1340 },
      { label: '16 L tin', price: 4080 },
    ],
    specs: [
      ['Extraction', 'Stone-ground, cold-pressed'],
      ['Pressed at', 'Below 30°C'],
      ['Filtering', 'Unrefined, naturally settled'],
      ['Smoke point', '~210°C'],
      ['Best for', 'Finishing, marinades, stir-fries, dressings'],
      ['Shelf life', '12 months from pressing'],
    ],
  }),
]

export const HIGHLIGHTS = [
  'Single-estate sourced',
  'Cold-pressed & unrefined',
  'No preservatives or sulphur',
  'Bottled by hand in dated lots',
]

export const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug)
export const fromPrice = (p) => Math.min(...p.sizes.map((s) => s.price))

/* ------------------------------------------------------------------ */
/*  Individual size SKUs (1/2 L, 1 L, 5 L, 16 L tin) per oil.          */
/*  Static "list price" (mrp) so cards can show a saving. Images are   */
/*  placeholders for now — <VariantCard> draws a bottle silhouette.    */
/* ------------------------------------------------------------------ */

const VARIANT_BLURB = {
  'coconut-oil': 'Cold Pressed | Own-farm coconuts',
  'groundnut-oil': 'Wood Pressed | Small batch',
  'sesame-oil': 'Stone Ground | Cold Pressed',
}

const SIZE_LONG = {
  '1/2 L': '500 ml',
  '1 L': '1 Litre',
  '5 L': '5 Litres',
  '16 L tin': '16 Litre Tin',
}

const SIZE_SLUG = {
  '1/2 L': '500ml',
  '1 L': '1l',
  '5 L': '5l',
  '16 L tin': '16l',
}

const OIL_IMG = {
  'coconut-oil': '/products/coconut-oil.webp',
  'groundnut-oil': '/products/groundnut-oil.webp',
  'sesame-oil': '/products/sesame-oil.webp',
}

/* Every size is its own product with its own detail page. */
export const VARIANT_PRODUCTS = PRODUCTS.flatMap((p) =>
  p.sizes.map((s) => {
    const mrp = Math.round((s.price * 1.34) / 5) * 5
    const sizeLong = SIZE_LONG[s.label] ?? s.label
    const image = OIL_IMG[p.slug]
    return {
      slug: `${p.slug}-${SIZE_SLUG[s.label] ?? s.label.replace(/[\s/]+/g, '').toLowerCase()}`,
      oilSlug: p.slug,
      oil: p.name,
      tag: p.tag,
      size: s.label,
      sizeLong,
      name: `Samaha Unrefined Cold-Pressed ${p.name} (Chekku) — ${sizeLong}`,
      shortName: `Cold-Pressed ${p.name} — ${sizeLong}`,
      blurb: VARIANT_BLURB[p.slug] ?? 'Cold Pressed | Unrefined',
      tagline: p.tagline,
      description: p.description,
      specs: [['Pack size', sizeLong], ...p.specs],
      images: [image],
      image,
      tint: p.tint,
      rating: p.rating,
      reviews: p.reviews,
      badge: s.label === p.sizes[p.sizes.length - 1].label ? 'Best value' : p.badge || null,
      price: s.price,
      mrp,
      save: mrp - s.price,
    }
  }),
)

export const getVariant = (slug) => VARIANT_PRODUCTS.find((v) => v.slug === slug)
export const firstVariantSlug = (oilSlug) =>
  VARIANT_PRODUCTS.find((v) => v.oilSlug === oilSlug)?.slug

/* Grouped for the "shop by size" sections. */
export const OIL_VARIANTS = PRODUCTS.map((p) => ({
  name: p.name,
  slug: p.slug,
  tag: p.tag,
  tint: p.tint,
  blurb: VARIANT_BLURB[p.slug] ?? 'Cold Pressed | Unrefined',
  variants: VARIANT_PRODUCTS.filter((v) => v.oilSlug === p.slug).map((v) => ({
    id: v.slug,
    slug: v.slug,
    oil: v.oil,
    size: v.size,
    sizeLong: v.sizeLong,
    title: v.name,
    image: v.image,
    price: v.price,
    mrp: v.mrp,
    save: v.save,
  })),
}))
