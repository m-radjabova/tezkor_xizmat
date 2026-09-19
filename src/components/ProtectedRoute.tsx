import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import IsLoading from './isLoading'
import useContextPro from '../hooks/useContextPro'
import type { UserRole } from '../types'

interface ProtectedRouteProps {
  children: ReactNode
  roles?: UserRole[]
}

function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useContextPro()
  const location = useLocation()

  if (isLoading) {
    return <IsLoading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles?.length && user && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/provider'} replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
