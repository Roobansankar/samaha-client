import { Navigate, useLocation } from 'react-router-dom'
import { isAuthed } from './auth'

export default function ProtectedRoute({ children }) {
  const location = useLocation()

  if (!isAuthed()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}
