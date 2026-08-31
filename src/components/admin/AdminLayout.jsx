import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Sun,
  Moon,
  Leaf,
  ExternalLink,
} from 'lucide-react'
import { signOut } from './auth'
import { AdminThemeContext } from './theme'

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('adminTheme') || 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('adminTheme', theme)
    } catch { /* ignore */ }
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const closeDrawer = () => setDrawerOpen(false)
  const current = NAV.find((n) =>
    n.end ? location.pathname === n.to : location.pathname.startsWith(n.to),
  )

  const handleSignOut = () => {
    signOut()
    navigate('/admin/login', { replace: true })
  }

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-[7px] px-3 py-2 text-[0.86rem] font-medium transition-colors ${
      isActive ? '' : 'a-dim hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]'
    }`
  const navLinkStyle = ({ isActive }) =>
    isActive ? { background: 'var(--a-accent-soft)', color: 'var(--a-accent)' } : undefined

  return (
    <AdminThemeContext.Provider value={{ theme, toggle }}>
      <div className={`admin ${theme === 'dark' ? 'theme-dark' : ''} min-h-screen`}>
        <div className="flex">
          {drawerOpen && (
            <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={closeDrawer} />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
              drawerOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{ background: 'var(--a-surface)', borderRight: '1px solid var(--a-border)' }}
          >
            <div className="flex h-14 items-center justify-between px-4">
              <Link to="/admin" onClick={closeDrawer} className="flex items-center gap-2.5">
                <span
                  className="grid h-8 w-8 place-items-center rounded-lg text-[var(--a-accent)]"
                  style={{ background: 'var(--a-accent-soft)' }}
                >
                  <Leaf size={16} />
                </span>
                <span className="text-[0.95rem] font-semibold tracking-tight">
                  Samaha<span className="ml-1.5 a-mute font-normal">Admin</span>
                </span>
              </Link>
              <button className="a-iconbtn lg:hidden" onClick={closeDrawer} aria-label="Close menu">
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
              <p className="px-3 pb-1.5 pt-2 text-[0.68rem] font-semibold uppercase tracking-wider a-mute">
                Manage
              </p>
              {NAV.map(({ to, end, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={closeDrawer}
                  className={navLinkClass}
                  style={navLinkStyle}
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="border-t p-3" style={{ borderColor: 'var(--a-border)' }}>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="mb-1 flex items-center gap-3 rounded-[7px] px-3 py-2 text-[0.86rem] font-medium a-dim transition-colors hover:bg-[var(--a-surface-2)] hover:text-[var(--a-text)]"
              >
                <ExternalLink size={17} /> View store
              </a>
              <div className="flex items-center gap-2.5 rounded-[7px] px-2 py-2">
                <span className="a-avatar h-8 w-8 text-[0.72rem]">SA</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.82rem] font-semibold">Store Admin</p>
                  <p className="truncate text-[0.72rem] a-mute">admin@samaha.com</p>
                </div>
                <button className="a-iconbtn" onClick={handleSignOut} aria-label="Sign out" title="Sign out">
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex min-w-0 flex-1 flex-col">
            <header
              className="sticky top-0 z-30 flex h-14 items-center gap-3 px-4 lg:px-6"
              style={{
                background: 'color-mix(in srgb, var(--a-bg) 82%, transparent)',
                borderBottom: '1px solid var(--a-border)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <button className="a-iconbtn lg:hidden" onClick={() => setDrawerOpen(true)} aria-label="Open menu">
                <Menu size={18} />
              </button>

              <div className="hidden items-center gap-1.5 text-sm sm:flex">
                <span className="a-mute">Samaha</span>
                <span className="a-mute">/</span>
                <span className="font-medium">{current?.label ?? 'Admin'}</span>
              </div>

              <div className="flex-1" />

              <div className="a-input-wrap hidden w-56 md:block">
                <Search size={15} />
                <input className="a-input h-9 text-[0.82rem]" placeholder="Search…" />
              </div>
              <button className="a-iconbtn relative" aria-label="Notifications">
                <Bell size={17} />
                <span
                  className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--a-accent)' }}
                />
              </button>
              <button className="a-iconbtn" onClick={toggle} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            </header>

            <main className="mx-auto w-full max-w-[1180px] flex-1 px-4 py-6 lg:px-6 lg:py-8">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </AdminThemeContext.Provider>
  )
}
