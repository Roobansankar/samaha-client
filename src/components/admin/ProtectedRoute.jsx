import { Navigate, useLocation } from 'react-router-dom'
import { isAuthed, hasPermission, getUser } from './auth'

const PAGE_MAP = {
  '/admin': 'dashboard',
  '/admin/orders': 'orders',
  '/admin/products': 'products',
  '/admin/customers': 'customers',
  '/admin/settings': 'settings',
  '/admin/staff': 'staff',
  '/admin/messages': 'messages',
  '/admin/subscribers': 'subscribers',
  '/admin/gallery': 'gallery',
  '/admin/reviews': 'reviews',
  '/admin/banners': 'banners',
  '/admin/expenses': 'expenses',
}

const FIRST_PAGE_BY_PERMISSION = {
  dashboard: '/admin',
  orders: '/admin/orders',
  products: '/admin/products',
  customers: '/admin/customers',
  settings: '/admin/settings',
  staff: '/admin/staff',
  expenses: '/admin/expenses',
  gallery: '/admin/gallery',
  reviews: '/admin/reviews',
  messages: '/admin/messages',
  banners: '/admin/banners',
  subscribers: '/admin/subscribers',
}

function getDefaultPage() {
  const user = getUser()
  if (!user) return '/admin'
  if (user.role === 'admin') return '/admin'
  const perms = user.permissions || []
  for (const key of Object.keys(FIRST_PAGE_BY_PERMISSION)) {
    if (perms.includes(key)) return FIRST_PAGE_BY_PERMISSION[key]
  }
  return '/admin/login'
}

export default function ProtectedRoute({ children }) {
  const location = useLocation()

  if (!isAuthed()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  const path = location.pathname.replace(/\/+$/, '')
  const page = PAGE_MAP[path] || Object.entries(PAGE_MAP).find(([prefix]) => prefix !== '/admin' && path.startsWith(`${prefix}/`))?.[1]
  if (page && !hasPermission(page)) {
    return <Navigate to={getDefaultPage()} replace />
  }

  return children
}
