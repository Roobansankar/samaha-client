import { useParams } from 'react-router-dom'
import { getVariant, getProduct } from '../data/products'
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

  if (getVariant(slug)) return <ProductPage />
  if (getProduct(slug)) return <CategoryPage key={slug} />
  return <NotFound />
}
