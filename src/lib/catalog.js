import { useCallback } from 'react'
import { useProducts } from '../context/ProductsContext'

/**
 * Returns a predicate `isVisible(slug)` that checks whether a product slug
 * is in the live product list fetched by ProductsContext.
 *
 * If the context is still loading or the API is unreachable, everything is
 * considered visible (fail-open) so the UI isn't blanked out prematurely.
 */
export function useVisibleProducts() {
  const { products, loading } = useProducts()

  const visibleSet = loading ? null : new Set(products.map((p) => p.slug))

  return useCallback(
    (slug) => !visibleSet || visibleSet.has(slug),
    [visibleSet],
  )
}
