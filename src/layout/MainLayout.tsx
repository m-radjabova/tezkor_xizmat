import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import ContentHeader from '../components/ContentHeader'
import Sidebar from '../components/Sidebar'
import { mobileMoreNavIcon, mobilePrimaryNav } from '../components/navigationItems'
import { usePreferences } from '../hooks/usePreferences'

function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const location = useLocation()
  const { t } = usePreferences()
  const MoreIcon = mobileMoreNavIcon

  return (
    <div className="mobile-app-shell min-h-screen lg:h-[100dvh]">
      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div
        className="grid min-h-screen gap-0 transition-[grid-template-columns] duration-300 lg:h-[100dvh] lg:min-h-0 lg:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]"
        style={{ ['--sidebar-width' as string]: isSidebarCollapsed ? '108px' : '296px' }}
      >
        {/* Mobile sidebar - slides in from left */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-[min(88vw,320px)] max-w-full transform transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-[100dvh] lg:w-auto lg:transform-none ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <Sidebar
            collapsed={isSidebarCollapsed}
            onNavigate={() => setIsMobileSidebarOpen(false)}
            onToggle={() => {
              if (window.innerWidth < 1024) {
                setIsMobileSidebarOpen(false)
              } else {
                setIsSidebarCollapsed((value) => !value)
              }
            }}
          />
        </div>

        <main className="app-scrollbar soft-enter min-h-screen overflow-x-hidden overflow-y-auto bg-[var(--color-overlay)] pb-[calc(6rem+env(safe-area-inset-bottom))] lg:h-[100dvh] lg:min-h-0 lg:pb-0">
          <ContentHeader />
          <Outlet />
        </main>
      </div>

      <nav className="mobile-bottom-bar lg:hidden" aria-label={t('accessibility.mobile_primary')}>
        <div className="mx-auto flex w-[min(100%-1rem,34rem)] items-center justify-between gap-1 rounded-[30px] border border-white/70 bg-[color-mix(in_srgb,var(--color-surface)_78%,transparent)] px-2 py-2 shadow-[0_22px_44px_rgba(15,23,42,0.14)] backdrop-blur-3xl">
          {mobilePrimaryNav.map((item) => {
            const Icon = item.icon
            const isActive =
              location.pathname === item.to ||
              (item.to !== '/dashboard' && location.pathname.startsWith(item.to))

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={`tap-highlight flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[22px] px-2 py-2.5 text-center transition-all duration-200 ${
                  isActive
                    ? 'bg-[linear-gradient(135deg,#5b58f6_0%,#7b83ff_100%)] !text-white shadow-[0_14px_28px_rgba(87,83,246,0.28)]'
                    : 'text-[var(--color-text-muted)] hover:bg-white/60 hover:text-[var(--color-text)]'
                }`}
              >
                <Icon className={`text-[1.2rem] transition-transform duration-200 ${isActive ? 'scale-105 !text-white' : ''}`} />
                <span className={`truncate text-[10px] font-bold tracking-[0.02em] ${isActive ? '!text-white' : ''}`}>{t(item.labelKey)}</span>
              </NavLink>
            )
          })}

          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className={`tap-highlight flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[22px] px-2 py-2.5 text-center text-[var(--color-text-muted)] transition-all duration-200 ${
              isMobileSidebarOpen
                ? 'bg-[var(--color-surface-soft)] text-[var(--color-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]'
                : 'hover:bg-white/60 hover:text-[var(--color-text)]'
            }`}
            aria-label={t('menu')}
          >
            <MoreIcon className="text-[1.2rem]" />
            <span className="truncate text-[10px] font-bold tracking-[0.02em]">{t('menu')}</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default MainLayout
