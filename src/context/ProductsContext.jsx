import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchProducts } from '../lib/api'

const ProductsContext = createContext(null)

/* ---- helpers to transform flat API rows into the shapes components need ---- */

const SIZE_IMG = {
  'coconut-oil': '/products/coconut-oil.webp',
  'groundnut-oil': '/products/groundnut-oil.webp',
  'sesame-oil': '/products/sesame-oil.webp',
}

function normalize(p) {
  const image = p.images?.[0] || SIZE_IMG[p.oil_slug] || null
  const desc = p.description
  return {
    ...p,
    oilSlug: p.oil_slug,
    sizeLong: p.size_long,
    shortName: p.short_name || `Cold-Pressed ${p.oil} — ${p.size_long}`,
    image,
    images: p.images?.length ? p.images : image ? [image] : [],
    description: typeof desc === 'string' ? desc.split('\n\n').filter(Boolean) : Array.isArray(desc) ? desc : [],
    save: Math.max(0, (p.mrp ?? p.price) - p.price),
  }
}

function groupByOil(products) {
  const map = new Map()
  for (const p of products) {
    const key = p.oil_slug
    if (!map.has(key)) {
      map.set(key, {
        name: p.oil,
        slug: p.oil_slug,
        tag: p.tag,
        tint: p.tint,
        blurb: p.blurb || 'Cold Pressed | Unrefined',
        tagline: p.tagline,
        description: typeof p.description === 'string' ? p.description.split('\n\n').filter(Boolean) : Array.isArray(p.description) ? p.description : [],
        specs: p.specs || [],
        rating: p.rating,
        reviews: p.reviews,
        badge: p.badge,
        _variants: [],
      })
    }
    map.get(key)._variants.push(p)
  }
  return [...map.values()].map((oil) => ({
    ...oil,
    variants: oil._variants.map((v) => ({
      id: v.slug,
      slug: v.slug,
      oil: v.oil,
      oilSlug: v.oil_slug,
      tag: v.tag,
      size: v.size,
      sizeLong: v.size_long,
      title: v.name,
      shortName: v.short_name,
      blurb: v.blurb || oil.blurb,
      tagline: v.tagline || oil.tagline,
      description: typeof v.description === 'string' ? v.description.split('\n\n').filter(Boolean) : Array.isArray(v.description) ? v.description : oil.description,
      specs: v.specs || oil.specs,
      images: v.images?.length ? v.images : oil.images || [],
      image: v.images?.[0] || oil.image || null,
      tint: v.tint || oil.tint,
      rating: v.rating ?? oil.rating,
      reviews: v.reviews ?? oil.reviews,
      badge: v.badge,
      price: v.price,
      mrp: v.mrp ?? Math.round((v.price * 1.34) / 5) * 5,
      save: Math.max(0, (v.mrp ?? Math.round((v.price * 1.34) / 5) * 5) - v.price),
      stock: v.stock,
    })),
    _variants: undefined,
  }))
}

/* ---- provider ---- */

export function ProductsProvider({ children }) {
  const [raw, setRaw] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = () => {
    setLoading(true)
    setError(null)
    fetchProducts()
      .then((list) => {
        setRaw(Array.isArray(list) ? list.map(normalize) : [])
      })
      .catch((e) => {
        setRaw([])
        setError(e.message || 'Could not load products.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const products = raw

  const oilGroups = useMemo(() => groupByOil(raw), [raw])

  const variantMap = useMemo(() => {
    const m = new Map()
    for (const p of raw) m.set(p.slug, p)
    return m
  }, [raw])

  const oilMap = useMemo(() => {
    const m = new Map()
    for (const g of oilGroups) m.set(g.slug, g)
    return m
  }, [oilGroups])

  const getVariant = (slug) => variantMap.get(slug) || null
  const getProduct = (slug) => oilMap.get(slug) || null
  const firstVariantSlug = (oilSlug) => {
    const group = oilMap.get(oilSlug)
    return group?.variants?.[0]?.slug || null
  }

  const value = useMemo(() => ({
    products,
    oilGroups,
    loading,
    error,
    getVariant,
    getProduct,
    firstVariantSlug,
    reload: load,
  }), [products, oilGroups, loading, error])

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
