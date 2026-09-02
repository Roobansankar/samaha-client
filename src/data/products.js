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
