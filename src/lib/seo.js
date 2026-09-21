/**
 * Client half of the SEO layer.
 *
 * The server (Laravel) already writes the right <head> into the HTML it sends —
 * that is what search engines and link previews read. This module keeps the same
 * tags correct when the visitor navigates inside the app WITHOUT a page reload.
 * It only ever edits tags marked data-seo="1" or the single tag of a kind
 * (one <title>, one description, one canonical …), so pages never end up with
 * duplicates.
 *
 * All SEO copy comes from the API (`GET /api/seo`) — nothing about a product or
 * a category is hardcoded here.
 */

const API = '/api'

const cache = new Map()
const inflight = new Map()
let manualOwners = 0 // <Seo> instances currently on screen — they win over the route data

const PRIVATE_PREFIXES = ['/admin', '/account', '/profile', '/cart', '/checkout', '/auth', '/wishlist', '/login', '/register']

export const isPrivatePath = (path) => PRIVATE_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))

export const normalizePath = (pathname) => {
  if (!pathname || pathname.length <= 1) return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

export const hasManualSeo = () => manualOwners > 0
export const claimSeo = () => { manualOwners += 1 }
export const releaseSeo = () => { manualOwners = Math.max(0, manualOwners - 1) }

/* ------------------------------------------------------------------ */
/*  fetching                                                           */
/* ------------------------------------------------------------------ */

/** SEO for a path, cached for the session. Never rejects: a broken API must not break navigation. */
export function fetchSeo(pathname, search = '') {
  const path = normalizePath(pathname)
  // only the shop's filter/sort parameters change what the server says
  const qs = path === '/shop' ? search.replace(/^\?/, '') : ''
  const key = qs ? `${path}?${qs}` : path

  if (cache.has(key)) return Promise.resolve(cache.get(key))
  if (inflight.has(key)) return inflight.get(key)

  const url = `${API}/seo?path=${encodeURIComponent(path)}${qs ? `&search=${encodeURIComponent(qs)}` : ''}`

  const request = fetch(url, { headers: { Accept: 'application/json' } })
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error('seo'))))
    .then((seo) => {
      cache.set(key, seo)
      return seo
    })
    .catch(() => fallbackSeo(path))
    .finally(() => inflight.delete(key))

  inflight.set(key, request)
  return request
}

/** Minimal safe answer when /api/seo can't be reached. */
export function fallbackSeo(path) {
  if (isPrivatePath(path)) return { robots: 'noindex,nofollow', canonical: null, jsonld: [] }
  return { canonical: `${window.location.origin}${path === '/' ? '/' : path}`, jsonld: [] }
}

/* ------------------------------------------------------------------ */
/*  applying to <head>                                                 */
/* ------------------------------------------------------------------ */

function upsert(selector, create, set, value) {
  let el = document.head.querySelector(selector)

  if (value == null || value === '') {
    el?.remove()
    return
  }
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  set(el, value)
  el.setAttribute('data-seo', '1')
}

const setMeta = (attr, key, content) =>
  upsert(
    `meta[${attr}="${key}"]`,
    () => {
      const el = document.createElement('meta')
      el.setAttribute(attr, key)
      return el
    },
    (el, v) => el.setAttribute('content', v),
    content,
  )

const setLink = (rel, href) =>
  upsert(
    `link[rel="${rel}"]`,
    () => {
      const el = document.createElement('link')
      el.setAttribute('rel', rel)
      return el
    },
    (el, v) => el.setAttribute('href', v),
    href,
  )

/**
 * Apply an SEO payload (from /api/seo, or built by <Seo>) to the document.
 * Missing fields are left alone; `canonical: null` removes the canonical
 * (private pages have none).
 */
export function applySeo(seo) {
  if (!seo) return

  if (seo.title) document.title = seo.title

  if ('description' in seo) setMeta('name', 'description', seo.description)

  if (seo.robots) {
    // same string the server writes, so a reload and a navigation look identical to a crawler
    const robots = seo.robots.startsWith('index') ? `${seo.robots},max-image-preview:large,max-snippet:-1` : seo.robots
    setMeta('name', 'robots', robots)
  }

  if ('canonical' in seo) setLink('canonical', seo.canonical)

  // social tags only make sense on indexable pages that have a canonical
  const social = !!seo.canonical
  setMeta('property', 'og:type', social ? seo.og_type || 'website' : null)
  setMeta('property', 'og:title', social ? seo.og_title || seo.title : null)
  setMeta('property', 'og:description', social ? seo.og_description ?? seo.description : null)
  setMeta('property', 'og:url', social ? seo.canonical : null)
  setMeta('property', 'og:image', social ? seo.og_image : null)
  setMeta('property', 'og:image:alt', social ? seo.og_image_alt : null)
  setMeta('property', 'og:site_name', social ? seo.og_site_name || 'Samaha' : null)
  setMeta('name', 'twitter:card', social ? 'summary_large_image' : null)
  setMeta('name', 'twitter:title', social ? seo.og_title || seo.title : null)
  setMeta('name', 'twitter:description', social ? seo.og_description ?? seo.description : null)
  setMeta('name', 'twitter:image', social ? seo.og_image : null)

  // structured data: replace, never append
  document.head.querySelectorAll('script[type="application/ld+json"][data-seo]').forEach((el) => el.remove())
  for (const node of seo.jsonld || []) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute('data-seo', '1')
    script.textContent = JSON.stringify(node)
    document.head.appendChild(script)
  }
}
