import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import IsLoading from './components/isLoading'
import { useAuth } from './hooks/useAuth'
import AuthLayout from './layout/AuthLayout'
import MainLayout from './layout/MainLayout'
import ScrollToTop from './components/ScrollToTop'
import NotFoundPage from './components/NotFoundPage'

const LoginPage = lazy(() => import('./pages/auth/login'))
const RegisterPage = lazy(() => import('./pages/auth/register'))
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage'))
const CategoriesPage = lazy(() => import('./pages/dashboard/CategoriesPage'))
const TransactionsPage = lazy(() => import('./pages/dashboard/TransactionsPage'))
const IncomePage = lazy(() => import('./pages/dashboard/IncomePage'))
const ExpensesPage = lazy(() => import('./pages/dashboard/ExpensesPage'))
const BudgetsPage = lazy(() => import('./pages/dashboard/BudgetsPage'))
const SavingsGoalsPage = lazy(() => import('./pages/dashboard/SavingsGoalsPage'))
const RecurringTransactionsPage = lazy(() => import('./pages/dashboard/RecurringTransactionsPage'))
const DebtsPage = lazy(() => import('./pages/dashboard/DebtsPage'))
const NotesPage = lazy(() => import('./pages/dashboard/NotesPage'))
const NotificationsPage = lazy(() => import('./pages/dashboard/NotificationsPage'))
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage'))

function HomeRedirect() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <IsLoading />
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

function App() {
  return (
   <>
   <ScrollToTop />
    <Suspense fallback={<IsLoading />}>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
          <Route path="/savings-goals" element={<SavingsGoalsPage />} />
          <Route path="/recurring-transactions" element={<RecurringTransactionsPage />} />
          <Route path="/debts" element={<DebtsPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
   </>
  )
}

export default App
