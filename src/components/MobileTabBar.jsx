import { Link, useLocation } from 'react-router-dom'
import { Home, Store, Search, Heart, User } from 'lucide-react'

const LEFT = [
  { label: 'Home', to: '/', Icon: Home, exact: true },
  { label: 'Shop', to: '/shop', Icon: Store },
]

const RIGHT = [
  { label: 'Wishlist', to: '/wishlist', Icon: Heart },
  { label: 'Account', to: '/account', Icon: User },
]

function Tab({ tab, active }) {
  const { Icon, badge } = tab
  return (
    <Link
      to={tab.to}
      className={`tabbar__tab ${active ? 'is-active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <span className="tabbar__icon">
        <Icon size={20} strokeWidth={2} />
        {badge ? <span className="tabbar__badge">{badge}</span> : null}
      </span>
      {tab.label}
    </Link>
  )
}

export default function MobileTabBar() {
  const { pathname } = useLocation()
  const isActive = (t) => (t.exact ? pathname === t.to : pathname.startsWith(t.to))

  return (
    <nav className="tabbar min-[901px]:hidden" aria-label="Quick navigation">
      <div className="tabbar__bar">
        {LEFT.map((t) => (
          <Tab key={t.label} tab={t} active={isActive(t)} />
        ))}

        <span className="tabbar__gap" aria-hidden="true" />

        {RIGHT.map((t) => (
          <Tab key={t.label} tab={t} active={isActive(t)} />
        ))}

        <button
          type="button"
          className="tabbar__fab"
          aria-label="Search products"
          onClick={() => window.dispatchEvent(new CustomEvent('samaha:search'))}
        >
          <Search size={21} strokeWidth={2.2} />
        </button>
      </div>
    </nav>
  )
}
