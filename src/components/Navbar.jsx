import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useScrolled } from '../hooks/useScrolled'
import { Search, User, ShoppingCart, Menu, X, Leaf, ChevronRight } from 'lucide-react'

const LINKS = [
  { label: 'Home', href: '/', exact: true },
  { label: 'Shop', href: '/shop' },
  { label: 'Health Benefits', href: '/health-benefits' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const SEARCH_HINTS = [
  'coconut oil',
  'groundnut oil',
  'peanut oil',
  'sesame oil',
]

const CART_COUNT = 2

/* Typewriter that cycles through phrases; static first phrase if reduced-motion. */
function useTypewriter(words, active) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [text, setText] = useState(reduced ? words[0] : '')
  const state = useRef({ i: 0, deleting: false })

  useEffect(() => {
    if (reduced || !active) return
    let timer
    const tick = () => {
      const { i, deleting } = state.current
      const word = words[i % words.length]
      if (!deleting && text === word) {
        state.current.deleting = true
        timer = setTimeout(tick, 1500)
        return
      }
      if (deleting && text === '') {
        state.current.deleting = false
        state.current.i = i + 1
        timer = setTimeout(tick, 260)
        return
      }
      setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1))
      timer = setTimeout(tick, deleting ? 34 : 66)
    }
    timer = setTimeout(tick, 400)
    return () => clearTimeout(timer)
  }, [text, words, reduced, active])

  return text
}

function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()
  const typed = useTypewriter(SEARCH_HINTS, open && !query)

  const close = () => {
    setQuery('')
    onClose()
  }

  useEffect(() => {
    if (!open) return
    const t = setTimeout(() => inputRef.current?.focus(), 80)
    document.body.classList.add('no-scroll')
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.body.classList.remove('no-scroll')
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const go = (value) => {
    const q = value.trim()
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    close()
  }

  return (
    <div
      className={`search-overlay ${open ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className="search-overlay__scrim" onClick={close} />
      <div className="search-overlay__panel">
        <div className="mx-auto w-full max-w-[720px]">
          <form
            onSubmit={(e) => { e.preventDefault(); go(query) }}
            role="search"
            className="flex items-center gap-3 border-b border-olive-300 pb-3"
          >
            <Search size={22} strokeWidth={1.8} className="shrink-0 text-olive-500" />
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
                className="w-full bg-transparent font-display text-[clamp(1.15rem,3.4vw,1.7rem)] text-olive-900 outline-none"
              />
              {!query && (
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center font-display text-[clamp(1.15rem,3.4vw,1.7rem)] text-text-mute"
                  aria-hidden="true"
                >
                  {typed}
                  <i className="nav-search__caret" />
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={close}
              className="nav-icon shrink-0"
              aria-label="Close search"
            >
              <X size={22} strokeWidth={1.8} />
            </button>
          </form>

          <div className="mt-6">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-text-mute">
              Popular searches
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SEARCH_HINTS.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => go(h)}
                  className="rounded-pill border border-olive-200 bg-paper-inset px-4 py-1.5 text-sm capitalize text-olive-800 transition-colors hover:border-olive-400 hover:bg-olive-100"
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Wordmark({ hideTaglineOnMobile = false }) {
  return (
    <Link
      className="nav-brand inline-flex shrink-0 items-center gap-2.5"
      to="/"
      aria-label="Samaha — home"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <span
        className="nav-mark grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full"
        style={{ border: '1.5px solid var(--color-olive-400)', color: 'var(--color-olive-700)' }}
        aria-hidden="true"
      >
        <Leaf size={15} strokeWidth={2} />
      </span>
      <span className="flex flex-col items-start leading-none">
        <span
          className="font-display text-[1.3rem] font-medium tracking-[-0.01em] sm:text-[1.4rem]"
          style={{ color: 'var(--color-olive-900)' }}
        >
          Samaha
        </span>
        <span
          className={`mt-[2px] whitespace-nowrap font-sans font-semibold uppercase ${
            hideTaglineOnMobile ? 'hidden sm:block' : ''
          }`}
          style={{ fontSize: '0.48rem', letterSpacing: '0.2em', color: 'var(--color-olive-500)' }}
        >
          Pure Natural Healthy
        </span>
      </span>
    </Link>
  )
}

export default function Navbar() {
  const scrolled = useScrolled(8)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen)
    return () => document.body.classList.remove('no-scroll')
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const isActive = (link) =>
    link.exact ? location.pathname === '/' : location.pathname.startsWith(link.href)

  return (
    <header className={`nav-header ${scrolled ? 'is-scrolled' : ''}`} data-open={menuOpen}>
      <div
        className={`mx-auto flex max-w-[1500px] items-center gap-3 ${
          scrolled ? 'py-2.5' : 'py-3.5'
        } sm:gap-6`}
        style={{
          paddingInline: 'clamp(1.5rem, 4vw, 3.25rem)',
          transition: 'padding var(--duration-2) var(--ease-default)',
        }}
      >
        <button
          type="button"
          className="nav-burger -ml-2 hidden h-[42px] w-[42px] place-items-center rounded-full text-olive-800 transition-colors hover:bg-olive-100 hover:text-olive-950 max-[900px]:grid"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} strokeWidth={1.8} />
        </button>

        <div className="max-[900px]:mx-auto max-[900px]:-translate-x-3">
          <Wordmark hideTaglineOnMobile />
        </div>

        <nav className="mx-auto hidden gap-7 min-[901px]:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`nav-link font-medium tracking-wide text-olive-700 hover:text-olive-950 ${
                isActive(link) ? 'is-active text-olive-950' : ''
              }`}
              style={{ fontSize: 'clamp(0.83rem, 0.8rem + 0.15vw, 0.92rem)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="-mr-2 ml-auto flex items-center gap-0.5 min-[901px]:ml-0">
          <button
            type="button"
            className="nav-icon"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} strokeWidth={1.8} />
          </button>
          <Link to="/account" className="nav-icon max-[900px]:hidden" aria-label="Account">
            <User size={20} strokeWidth={1.8} />
          </Link>
          <Link to="/cart" className="nav-icon relative" aria-label={`Cart, ${CART_COUNT} items`}>
            <ShoppingCart size={20} strokeWidth={1.8} />
            {CART_COUNT > 0 && <span className="nav-badge">{CART_COUNT}</span>}
          </Link>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile drawer */}
      <div className="nav-scrim" onClick={() => setMenuOpen(false)} />
      <aside className="nav-drawer" aria-hidden={!menuOpen}>
        <div className="flex items-center justify-between border-b border-olive-200 px-6 py-5">
          <Wordmark />
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-olive-100 text-olive-800 transition-colors hover:bg-olive-200"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <div className="px-6 pt-4">
          <button
            type="button"
            onClick={() => { setMenuOpen(false); setSearchOpen(true) }}
            className="flex w-full items-center gap-3 rounded-pill border border-olive-200 bg-paper-inset px-4 py-3 text-left text-sm text-text-mute"
          >
            <Search size={16} strokeWidth={2} className="text-olive-500" />
            Search products…
          </button>
        </div>

        <nav className="flex flex-grow flex-col px-6 py-4" aria-label="Mobile">
          {LINKS.map((link, i) => (
            <Link
              key={link.label}
              to={link.href}
              className="nav-drawer-link flex items-center justify-between border-b border-olive-100 py-4 text-olive-900 transition-colors hover:text-olive-700"
              style={{ animationDelay: `${0.12 + i * 0.06}s` }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="font-sans text-lg font-semibold tracking-tight">{link.label}</span>
              <ChevronRight size={18} strokeWidth={2} className="text-olive-400" />
            </Link>
          ))}
        </nav>

        <div className="border-t border-olive-200 px-6 pb-8 pt-4">
          <Link
            to="/account"
            onClick={() => setMenuOpen(false)}
            className="btn btn-primary w-full py-3 text-center text-sm"
          >
            Login / Register
          </Link>
        </div>
      </aside>
    </header>
  )
}
