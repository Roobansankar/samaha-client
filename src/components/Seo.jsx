import { useEffect } from 'react'
import { applySeo, claimSeo, releaseSeo } from '../lib/seo'

/**
 * Reusable head manager for a page that supplies its own values:
 *
 *   <Seo title="Page not found | Samaha" robots="noindex,follow" />
 *
 * Product / category / static pages don't need it — <RouteSeo> applies what the
 * API says about the current URL. While a <Seo> is mounted it takes priority
 * over the route data, so the two never fight over the same tags.
 */
export default function Seo({
  title,
  description = '',
  canonical = null,
  robots = 'index,follow',
  ogImage,
  ogType = 'website',
  ogTitle,
  ogDescription,
  jsonLd,
}) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : ''

  useEffect(() => {
    claimSeo()
    applySeo({
      title,
      description,
      canonical,
      robots,
      og_type: ogType,
      og_title: ogTitle || title,
      og_description: ogDescription ?? description,
      og_image: ogImage,
      jsonld: ld ? [].concat(JSON.parse(ld)) : [],
    })
    return releaseSeo
  }, [title, description, canonical, robots, ogImage, ogType, ogTitle, ogDescription, ld])

  return null
}
