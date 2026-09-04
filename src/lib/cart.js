import { useSyncExternalStore } from 'react'
import { getToken, getUser } from './account'
import { getVariant } from '../data/products'

const GUEST_KEY = 'samahaCart'
const MAX = 99

/* ------------------------------------------------------------------ */
/*  module state — one cart, many subscribers                          */
/* ------------------------------------------------------------------ */

let raw = []           // [{ slug, qty }]
let loading = false
let boundUserId = null

/* immutable snapshot for useSyncExternalStore — new object on every change */
let snapshot = { raw, loading }
const subs = new Set()
const emit = () => {
  snapshot = { raw, loading }
  subs.forEach((fn) => fn())
}
const subscribe = (fn) => {
  subs.add(fn)
  return () => subs.delete(fn)
}

/* collapse any accidental duplicates and drop junk rows */
const clean = (list) => {
  const byslug = new Map()
  for (const it of Array.isArray(list) ? list : []) {
    const slug = it?.slug
    const qty = Number(it?.qty) || 0
    if (!slug || qty <= 0) continue
    byslug.set(slug, { slug, qty: Math.min(MAX, (byslug.get(slug)?.qty || 0) + qty) })
  }
  return [...byslug.values()]
}

const readGuest = () => {
  try { return clean(JSON.parse(localStorage.getItem(GUEST_KEY))) } catch { return [] }
}
const writeGuest = () => {
  try { localStorage.setItem(GUEST_KEY, JSON.stringify(raw)) } catch { /* ignore */ }
}

async function api(path, method = 'GET', body) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error('cart request failed')
  return res.json()
}

const fromServer = (rows) => clean(rows.map((r) => ({ slug: r.product_slug, qty: r.qty })))

/* ------------------------------------------------------------------ */
/*  sync — called on mount and whenever auth changes                   */
/* ------------------------------------------------------------------ */

export async function initCart() {
  const user = getUser()

  if (user) {
    if (boundUserId !== user.id) {
      boundUserId = user.id
      const guest = readGuest()
      if (guest.length) {
        try {
          await api('/cart/merge', 'POST', {
            items: guest.map((g) => ({ product_slug: g.slug, qty: g.qty })),
          })
        } catch { /* ignore — will still load the server cart */ }
        localStorage.removeItem(GUEST_KEY)
      }
    }
    loading = true
    emit()
    try {
      raw = fromServer(await api('/cart'))
    } catch { /* keep what we have */ }
    loading = false
    emit()
  } else {
    boundUserId = null
    raw = readGuest()
    emit()
  }
}

/* ------------------------------------------------------------------ */
/*  mutations — optimistic, then sync to the right store               */
/* ------------------------------------------------------------------ */

/* run a server mutation for signed-in users; guests just save locally */
function sync(request) {
  if (getUser()) {
    request()
      .then((rows) => { raw = fromServer(rows); emit() })
      .catch(() => { initCart() })
  } else {
    writeGuest()
  }
}

export function addToCart(slug, qty = 1) {
  const existing = raw.find((i) => i.slug === slug)
  raw = existing
    ? raw.map((i) => (i.slug === slug ? { ...i, qty: Math.min(MAX, i.qty + qty) } : i))
    : [...raw, { slug, qty }]
  emit()
  sync(() => api('/cart', 'POST', { product_slug: slug, qty }))
}

export function setCartQty(slug, qty) {
  qty = Math.max(0, Math.min(MAX, qty))
  raw = qty === 0
    ? raw.filter((i) => i.slug !== slug)
    : raw.map((i) => (i.slug === slug ? { ...i, qty } : i))
  emit()
  sync(() => api(`/cart/${slug}`, 'PUT', { qty }))
}

export function removeFromCart(slug) {
  raw = raw.filter((i) => i.slug !== slug)
  emit()
  sync(() => api(`/cart/${slug}`, 'DELETE'))
}

export function clearCart() {
  raw = []
  emit()
  if (getUser()) { api('/cart', 'DELETE').catch(() => {}) } else { writeGuest() }
}

if (typeof window !== 'undefined') {
  window.addEventListener('samaha:auth', () => { initCart() })
  window.addEventListener('storage', (e) => {
    if (e.key === GUEST_KEY && !getUser()) { raw = readGuest(); emit() }
  })
}

/* ------------------------------------------------------------------ */
/*  hook                                                               */
/* ------------------------------------------------------------------ */

export function useCart() {
  const s = useSyncExternalStore(subscribe, () => snapshot, () => snapshot)

  const items = s.raw
    .map((i) => ({ slug: i.slug, qty: i.qty, product: getVariant(i.slug) }))
    .filter((i) => i.product)

  const count = items.reduce((n, i) => n + i.qty, 0)
  const uniqueCount = items.length
  const subtotal = items.reduce((n, i) => n + i.qty * i.product.price, 0)
  const mrpTotal = items.reduce((n, i) => n + i.qty * i.product.mrp, 0)

  return {
    items,
    count,
    uniqueCount,
    subtotal,
    savings: Math.max(0, mrpTotal - subtotal),
    loading: s.loading,
    add: addToCart,
    setQty: setCartQty,
    remove: removeFromCart,
    clear: clearCart,
  }
}
