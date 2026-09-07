import { useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useProducts } from '../context/ProductsContext'
import ProductPage from './ProductPage'
import CategoryPage from './CategoryPage'
import NotFound from './NotFound'

/**
 * /shop/:slug serves two things:
 *   coconut-oil-500ml  → a single product        → <ProductPage>
 *   coconut-oil        → all sizes of that oil    → <CategoryPage>
 */
export default function ShopSlug() {
  const { slug } = useParams()
  const { getVariant, getProduct, loading } = useProducts()

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={24} className="animate-spin text-olive-700/40" />
          <p className="text-sm text-text-mute">Loading product…</p>
        </div>
      </div>
    )
  }

  if (getVariant(slug)) return <ProductPage />
  if (getProduct(slug)) return <CategoryPage key={slug} />
  return <NotFound />
}
