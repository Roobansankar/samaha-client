import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const SITE_URL = 'https://samahanaturals.com'

// Transactional / private pages: keep them out of search results.
// Everything else is indexable and gets a self-referencing canonical.
const NOINDEX_PREFIXES = ['/admin', '/auth/', '/auth', '/account', '/profile', '/cart', '/checkout']

function isNoIndex(pathname) {
  return NOINDEX_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function normalizePath(pathname) {
  if (!pathname || pathname.length <= 1) return '/'
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertMeta(property, content, attr = 'property') {
  let el = document.head.querySelector(`meta[${attr}="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

// Sets a self-referencing canonical on every route change:
// https://samahanaturals.com + pathname (trailing slash stripped,
// query string and hash ignored). Private routes also get
// noindex,nofollow so cart/checkout/account/admin never get indexed.
export default function SeoCanonical() {
  const { pathname } = useLocation()

  useEffect(() => {
    const clean = normalizePath(pathname)
    const canonical = `${SITE_URL}${clean}`

    upsertLink('canonical', canonical)
    upsertMeta('og:url', canonical)

    let robots = document.head.querySelector('meta[name="robots"]')
    if (isNoIndex(clean)) {
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex, nofollow')
    } else if (robots) {
      robots.remove()
    }
  }, [pathname])

  return null
}
