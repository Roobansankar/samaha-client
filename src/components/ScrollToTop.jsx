import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Jump to the top of the page on every route change — the way a normal
// multi-page site behaves. Keyed on pathname only, so in-page hash links
// (e.g. #coconut-oil) still scroll to their anchor.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
