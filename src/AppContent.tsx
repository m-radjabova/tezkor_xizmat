import { ToastContainer } from 'react-toastify'
import App from './App'
import { usePreferences } from './hooks/usePreferences'
import RouteSeo from './seo/RouteSeo'

function AppContent() {
  const { themeMode } = usePreferences()

  return (
    <>
      <RouteSeo />
      <App />
      <ToastContainer
        position="top-right"
        autoClose={2600}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme={themeMode === 'dark' ? 'dark' : 'light'}
        toastClassName={() =>
          'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-[var(--shadow-card)]'
        }
      />
    </>
  )
}

export default AppContent
