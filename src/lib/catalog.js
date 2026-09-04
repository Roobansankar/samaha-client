import { useCallback, useEffect, useState } from 'react'

/**
 * Storefront visibility. The pages render from the bundled catalogue, but the
 * admin can hide a product (Active → off). This hook asks the API which
 * products are live and returns a predicate.
 *
 *   cache === undefined  → not fetched yet          → show everything
 *   cache === null        → API unreachable          → show everything (fail-open)
 *   cache instanceof Set  → the live product slugs   → show only these
 */
let cache
let inflight

function fetchLiveSlugs() {
  if (inflight) return inflight
  inflight = fetch('/api/products')
    .then((r) => (r.ok ? r.json() : null))
    .then((list) => {
      cache = Array.isArray(list) && list.length ? new Set(list.map((p) => p.slug)) : null
      return cache
    })
    .catch(() => {
      cache = null
      return null
    })
  return inflight
}

export function useVisibleProducts() {
  const [slugs, setSlugs] = useState(() => cache)

  useEffect(() => {
    if (cache !== undefined) return // resolved already — initial state holds it
    let alive = true
    fetchLiveSlugs().then((s) => { if (alive) setSlugs(s) })
    return () => { alive = false }
  }, [])

  return useCallback((slug) => !slugs || slugs.has(slug), [slugs])
}
