import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import IsLoading from './components/isLoading'
import AuthLayout from './layout/AuthLayout'
import ScrollToTop from './components/ScrollToTop'
import NotFoundPage from './components/NotFoundPage'
import Seo from './components/Seo'

const LoginPage = lazy(() => import('./pages/auth/login'))
const RegisterPage = lazy(() => import('./pages/auth/register'))
const ProviderCabinetPage = lazy(() => import('./pages/provider_pages/ProviderCabinet'))
const ProviderBusinessesPage = lazy(() => import('./pages/provider_pages/ProviderBusinesses'))
const ProviderStatisticsPage = lazy(() => import('./pages/provider_pages/ProviderStatistics'))
const ProviderProfilePage = lazy(() => import('./pages/provider_pages/ProviderProfile'))
const ProviderReviewsPage = lazy(() => import('./pages/provider_pages/ProviderReviews'))
const AdminPage = lazy(() => import('./pages/Admin'))
const AdminLayoutPage = lazy(() => import('./pages/admin_pages/AdminLayout'))
const AdminServicesPage = lazy(() => import('./pages/admin_pages/AdminServices'))
const AdminCategoriesPage = lazy(() => import('./pages/admin_pages/AdminCategories'))
const AdminProvidersPage = lazy(() => import('./pages/admin_pages/AdminProviders'))
const AdminCustomersPage = lazy(() => import('./pages/admin_pages/AdminCustomers'))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const BusinessDetailPage = lazy(() => import('./pages/BusinessDetailPage'))

function getRouteTitle(pathname: string) {
  if (pathname === '/login') return 'Kirish'
  if (pathname === '/register') return "Ro'yxatdan o'tish"
  if (pathname.startsWith('/admin')) return 'Admin paneli'
  if (pathname.startsWith('/provider')) return 'Provider kabineti'
  return undefined
}

function App() {
  const { pathname } = useLocation()
  const isPrivateRoute = pathname.startsWith('/provider') || pathname.startsWith('/admin') || pathname === '/login' || pathname === '/register' || pathname === '/dashboard'

  return (
   <>
  <Seo title={getRouteTitle(pathname)} noindex={isPrivateRoute} canonicalPath={pathname} />
   <ScrollToTop />
    <Suspense fallback={<IsLoading />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/businesses/:id" element={<BusinessDetailPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route
          path="/provider"
          element={
            <ProtectedRoute roles={['provider']}>
              <ProviderCabinetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminLayoutPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="providers" element={<AdminProvidersPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
        </Route>

        <Route
          path="/provider/services"
          element={
            <ProtectedRoute roles={['provider']}>
              <ProviderBusinessesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/statistics"
          element={
            <ProtectedRoute roles={['provider']}>
              <ProviderStatisticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/profile"
          element={
            <ProtectedRoute roles={['provider']}>
              <ProviderProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/reviews"
          element={
            <ProtectedRoute roles={['provider']}>
              <ProviderReviewsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/provider/settings" element={<Navigate to="/provider/profile" replace />} />

        <Route path="/dashboard" element={<Navigate to="/provider" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
   </>
  )
}

export default App
