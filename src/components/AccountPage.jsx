import { Navigate, useSearchParams } from 'react-router-dom'
import LoginPage from './LoginPage'
import { useAccount } from '../lib/account'

export default function AccountPage() {
  const user = useAccount()
  const [params] = useSearchParams()
  if (user) return <Navigate to={params.get('redirect') || '/profile'} replace />
  return <LoginPage />
}
