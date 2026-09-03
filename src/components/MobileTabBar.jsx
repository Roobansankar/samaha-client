import { Link, useLocation } from 'react-router-dom'
import { Home, Store, Search, Heart, User } from 'lucide-react'

const TABS = [
  { label: 'Home', to: '/', Icon: Home, exact: true },
  { label: 'Shop', to: '/shop', Icon: Store },
  { label: 'Search', Icon: Search, action: 'search' },
  { label: 'Wishlist', to: '/wishlist', Icon: Heart },
  { label: 'Account', to: '/account', Icon: User },
]

export default function MobileTabBar() {
  const { pathname } = useLocation()
  const isActive = (t) => !!t.to && (t.exact ? pathname === t.to : pathname.startsWith(t.to))

  return (
    <nav className="tabbar min-[901px]:hidden" aria-label="Quick navigation">
      <div className="tabbar__bar">
        {TABS.map((t) => {
          const { Icon } = t
          const inner = (
            <>
              <span className="tabbar__icon">
                <Icon size={20} strokeWidth={2} />
              </span>
              {t.label}
            </>
          )

          if (t.action === 'search') {
            return (
              <button
                key={t.label}
                type="button"
                className="tabbar__tab"
                aria-label="Search products"
                onClick={() => window.dispatchEvent(new CustomEvent('samaha:search'))}
              >
                {inner}
              </button>
            )
          }

          const active = isActive(t)
          return (
            <Link
              key={t.label}
              to={t.to}
              className={`tabbar__tab ${active ? 'is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {inner}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
