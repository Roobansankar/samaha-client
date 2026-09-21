import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { applySeo, fetchSeo, hasManualSeo, normalizePath } from '../lib/seo'
import { trackPageView } from '../lib/analytics'

/**
 * Keeps the document <head> correct on every in-app navigation.
 * (The very first page load already has the right head — the server wrote it.)
 * Mounted once, in App.jsx, replacing the old canonical-only component.
 */
export default function RouteSeo() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const path = normalizePath(pathname)
    let alive = true

    // the admin panel is private and busy — no request needed to say "don't index this"
    if (path === '/admin' || path.startsWith('/admin/')) {
      applySeo({ title: 'Admin | Samaha', description: '', robots: 'noindex,nofollow', canonical: null, jsonld: [] })
      return undefined
    }

    fetchSeo(path, search).then((seo) => {
      if (!alive) return

      // the server says this URL has moved (legacy /products/x, renamed slug …)
      if (seo.redirect?.to) {
        navigate(seo.redirect.to, { replace: true })
        return
      }

      if (!hasManualSeo()) applySeo(seo)
      trackPageView(path, seo.title)
    })

    return () => {
      alive = false
    }
  }, [pathname, search, navigate])

  return null
}
