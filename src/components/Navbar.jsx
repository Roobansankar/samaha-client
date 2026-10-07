import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useScrolled } from '../hooks/useScrolled'
import { useAccount } from '../lib/account'
import { useCart } from '../lib/cart'
import { Search, UserRound, Handbag, Menu, X, ChevronRight } from 'lucide-react'
import { trackSearch } from '../lib/analytics'

const initialOf = (name) => (name || '').trim().charAt(0).toUpperCase() || 'U'

const LINKS = [
  { label: 'Home', href: '/', exact: true },
  { label: 'Shop', href: '/shop', exact: true },
    { label: 'Gallery', href: '/gallery', exact: true },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const SEARCH_HINTS = [
  'coconut oil',
  'groundnut oil',
  'sesame oil',
]

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

      setText(
        deleting
          ? word.slice(0, text.length - 1)
          : word.slice(0, text.length + 1),
      )

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

    if (q) trackSearch(q)

    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop')
    close()
  }

  return (
    <div
      className={`search-full ${open ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
    >
      <div className="search-full__inner mx-auto w-full max-w-[1180px] px-[var(--spacing-gutter)]">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            go(query)
          }}
          role="search"
          className="flex items-center gap-4 pt-[clamp(2.5rem,11vh,6rem)]"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
              className="search-full__input w-full bg-transparent outline-none"
            />

            {!query && (
              <span className="search-full__ghost" aria-hidden="true">
                {typed || 'Search for products'}
                <i className="nav-search__caret" />
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={close}
            className="search-full__close"
            aria-label="Close search"
          >
            <X size={28} strokeWidth={1.6} />
          </button>
        </form>

        <span className="search-full__rule" />

        <p className="search-full__hint">
          {query
            ? `Press Enter to search “${query}”`
            : 'Start typing, or pick a popular search below.'}
        </p>

        {!query && (
          <div className="mt-6 flex flex-wrap gap-2">
            {SEARCH_HINTS.map((h) => (
              <button
                key={h}
                type="button"
                onClick={() => go(h)}
                className="rounded-pill border border-line px-4 py-1.5 text-sm capitalize text-olive-800 transition-colors hover:border-olive-400 hover:bg-olive-100"
              >
                {h}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Wordmark({ className = 'h-11 sm:h-[52px]' }) {
  return (
    <Link
      className="nav-brand inline-flex shrink-0 items-center"
      to="/"
      aria-label="Samaha — home"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <img
        src="/samahalogo.png"
        alt="Samaha"
        width="220"
        height="220"
        className={`w-auto object-contain mix-blend-multiply ${className}`}
      />
    </Link>
  )
}

export default function Navbar() {
  const scrolled = useScrolled(8)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const location = useLocation()
  const account = useAccount()
  const { uniqueCount } = useCart(null)

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen)

    return () => document.body.classList.remove('no-scroll')
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  /* The mobile tab bar's search button opens the full-page overlay via this event. */
  useEffect(() => {
    const open = () => setSearchOpen(true)

    window.addEventListener('samaha:search', open)

    return () => window.removeEventListener('samaha:search', open)
  }, [])

  const isActive = (link) =>
    link.exact
      ? location.pathname === link.href
      : location.pathname.startsWith(link.href)

  return (
    <header
      className={`nav-header ${scrolled ? 'is-scrolled' : ''}`}
      data-open={menuOpen}
    >
      <div
        className={`mx-auto flex max-w-[1500px] items-center gap-3 ${
          scrolled ? 'py-2' : 'py-2.5'
        } sm:gap-6`}
        style={{
          paddingInline: 'clamp(1.75rem, 5vw, 5rem)',
          transition: 'padding var(--duration-2) var(--ease-default)',
        }}
      >
        <button
          type="button"
          className="nav-burger -ml-2 hidden h-[38px] w-[38px] place-items-center rounded-full text-olive-800 transition-colors hover:bg-olive-100 hover:text-olive-950 max-[900px]:grid"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} strokeWidth={1.8} />
        </button>

        <div className="max-[900px]:absolute max-[900px]:left-1/2 max-[900px]:-translate-x-1/2">
          <Wordmark className="h-9 sm:h-11" />
        </div>

        <nav
          className="mx-auto hidden items-center gap-x-5 min-[1180px]:gap-x-7 min-[901px]:flex"
          aria-label="Primary"
        >
          {LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`nav-link font-semibold tracking-wide text-olive-800 hover:text-olive-950 ${
                isActive(link) ? 'is-active text-olive-950' : ''
              }`}
              style={{
                fontSize: 'clamp(0.9rem, 0.86rem + 0.2vw, 1rem)',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="-mr-2 ml-auto flex items-center gap-0.5 min-[901px]:ml-0">
          <button
            type="button"
            className="nav-icon max-[900px]:hidden"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={20} strokeWidth={1.8} />
          </button>

          <Link
            to={account ? '/profile' : '/account'}
            className="nav-icon max-[900px]:hidden"
            aria-label={account ? 'My account' : 'Sign in'}
          >
            {!account ? (
              <UserRound size={20} strokeWidth={1.8} />
            ) : account.avatar ? (
              <img
                src={account.avatar}
                alt=""
                referrerPolicy="no-referrer"
                className="h-[26px] w-[26px] rounded-full object-cover"
              />
            ) : (
              <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-olive-900 text-[0.72rem] font-semibold text-paper">
                {initialOf(account.name)}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="nav-icon relative"
            aria-label={`Cart, ${uniqueCount} ${
              uniqueCount === 1 ? 'item' : 'items'
            }`}
          >
            <Handbag size={20} strokeWidth={1.8} />

            {uniqueCount > 0 && (
              <span className="nav-badge">
                {uniqueCount > 99 ? '99+' : uniqueCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        className="nav-scrim"
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className="nav-drawer"
        aria-hidden={!menuOpen}
      >
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

        <nav
          className="flex flex-grow flex-col px-6 py-6"
          aria-label="Mobile"
        >
          {LINKS.map((link, i) => (
            <Link
              key={link.label}
              to={link.href}
              className="nav-drawer-link flex items-center justify-between border-b border-olive-100 py-4 text-olive-900 transition-colors hover:text-olive-700"
              style={{
                animationDelay: `${0.12 + i * 0.06}s`,
              }}
              onClick={() => setMenuOpen(false)}
            >
              <span className="font-sans text-lg font-semibold tracking-tight">
                {link.label}
              </span>

              <ChevronRight
                size={18}
                strokeWidth={2}
                className="text-olive-400"
              />
            </Link>
          ))}

          <Link
            to={account ? '/profile' : '/account'}
            onClick={() => setMenuOpen(false)}
            className="nav-drawer-link mt-6 flex items-center justify-between gap-3 rounded-xl bg-olive-900 px-4 py-3.5 text-on-olive transition-colors hover:bg-olive-800"
            style={{
              animationDelay: `${0.12 + LINKS.length * 0.06}s`,
            }}
          >
            <span className="flex items-center gap-2.5">
              {!account ? (
                <UserRound size={18} strokeWidth={2} />
              ) : account.avatar ? (
                <img
                  src={account.avatar}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-on-olive/15 text-[0.7rem] font-semibold">
                  {initialOf(account.name)}
                </span>
              )}

              <span className="font-sans text-base font-semibold tracking-tight">
                {account ? 'My account' : 'Login / Register'}
              </span>
            </span>

            <ChevronRight
              size={16}
              strokeWidth={2}
              className="text-on-olive-soft"
            />
          </Link>
        </nav>
      </aside>
    </header>
  )
}
