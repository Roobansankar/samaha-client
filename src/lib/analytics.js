/**
 * Google Analytics 4 — e-commerce events.
 *
 * Does nothing until a measurement ID is set at build time:
 *
 *     client/.env.production   →   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 *
 * With no ID there is no script, no cookie and no network request.
 *
 * Privacy: events carry product ids/names/prices, order id and totals only — never
 * names, emails, phone numbers, addresses or anything typed into a form. Page paths
 * are sent without their query string. The admin panel is never tracked.
 *
 * Product data comes from the same catalogue the storefront already loaded
 * (setCatalog is called by ProductsProvider), so nothing is duplicated or hardcoded.
 * `item_id` is the product slug — use the same value as the `id` column in the
 * Google Merchant Center feed so GA4 and Shopping line up.
 */

const ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const CURRENCY = 'INR'
const BRAND = 'Samaha'

const catalog = new Map()

export const analyticsEnabled = () => Boolean(ID)

export function initAnalytics() {
  if (!ID || typeof window === 'undefined' || window.__gaInit) return
  window.__gaInit = true

  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  // page views are sent by hand (single-page app), so the automatic one is off
  window.gtag('config', ID, { send_page_view: false })

  // load the library once the page is idle so it can never delay the first paint
  const load = () => {
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ID)}`
    document.head.appendChild(s)
  }
  if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 4000 })
  else setTimeout(load, 2000)
}

/** Remember product details by slug (called with the API product list). */
export function setCatalog(products) {
  catalog.clear()
  for (const p of products || []) catalog.set(p.slug, p)
}

function track(name, params) {
  if (!ID || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}

const item = (slug, extra = {}) => {
  const p = catalog.get(slug)
  if (!p) return null
  return {
    item_id: p.slug,
    item_name: p.short_name || p.name,
    item_brand: BRAND,
    item_category: p.oil,
    item_variant: p.size_long,
    price: p.price,
    ...extra,
  }
}

const items = (rows) => rows.map(({ slug, qty = 1 }, index) => item(slug, { quantity: qty, index })).filter(Boolean)
const sum = (list) => list.reduce((t, i) => t + i.price * (i.quantity ?? 1), 0)

/* ---- page views ---- */

export function trackPageView(pathname, title) {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return
  track('page_view', {
    page_title: title || document.title,
    page_location: `${window.location.origin}${pathname}`, // no query string
    page_path: pathname,
  })
}

/* ---- browsing ---- */

export function trackViewItem(slug) {
  const i = item(slug)
  if (i) track('view_item', { currency: CURRENCY, value: i.price, items: [i] })
}

export function trackViewItemList(listName, slugs) {
  const list = items(slugs.map((slug) => ({ slug })))
  if (list.length) track('view_item_list', { item_list_id: listName.toLowerCase().replace(/\s+/g, '-'), item_list_name: listName, items: list })
}

export function trackSearch(term) {
  const t = String(term || '').trim().slice(0, 100)
  if (t) track('search', { search_term: t })
}

/* ---- cart ---- */

export function trackAddToCart(slug, qty = 1) {
  const list = items([{ slug, qty }])
  if (list.length) track('add_to_cart', { currency: CURRENCY, value: sum(list), items: list })
}

export function trackRemoveFromCart(slug, qty = 1) {
  const list = items([{ slug, qty }])
  if (list.length) track('remove_from_cart', { currency: CURRENCY, value: sum(list), items: list })
}

/* ---- checkout ---- */

export function trackBeginCheckout(cartRows) {
  const list = items(cartRows)
  if (list.length) track('begin_checkout', { currency: CURRENCY, value: sum(list), items: list })
}

export function trackAddPaymentInfo(cartRows) {
  const list = items(cartRows)
  if (list.length) track('add_payment_info', { currency: CURRENCY, value: sum(list), payment_type: 'Razorpay', items: list })
}

/** Fire once, after payment is verified. `value` is the confirmed order total in rupees. */
export function trackPurchase({ orderId, value, cartRows }) {
  const list = items(cartRows)
  if (!orderId || !list.length) return
  track('purchase', { transaction_id: String(orderId), currency: CURRENCY, value: Number(value) || sum(list), items: list })
}
