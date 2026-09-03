import { Navigate } from 'react-router-dom'
import LoginPage from './LoginPage'
import { useAccount } from '../lib/account'

export default function AccountPage() {
  const user = useAccount()
  if (user) return <Navigate to="/profile" replace />
  return <LoginPage />
}
