import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Keep a position for each history entry so Back returns to the product
// the visitor was browsing. New pages still start at the top.
export default function ScrollToTop() {
  const { key, hash, state } = useLocation()
  const searchOverlay = state?.searchOverlay === true
  const navigationType = useNavigationType()
  const positions = useRef(new Map())

  useLayoutEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => { window.history.scrollRestoration = previous }
  }, [])

  useLayoutEffect(() => {
    const saved = navigationType === 'POP' ? positions.current.get(key) : null
    if (searchOverlay) {
      // Search overlays the current page without moving it.
    } else if (saved) {
      window.scrollTo({ ...saved, behavior: 'instant' })
    } else if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }

    const remember = () => {
      positions.current.set(key, { top: window.scrollY, left: window.scrollX })
    }
    remember()
    window.addEventListener('scroll', remember, { passive: true })
    return () => window.removeEventListener('scroll', remember)
  }, [key, hash, navigationType, searchOverlay])

  return null
}
