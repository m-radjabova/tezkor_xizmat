import { NavLink } from 'react-router-dom'
import { HiBars3 } from 'react-icons/hi2'
import { usePreferences } from '../hooks/usePreferences'
import plannerIcon from '../assets/icons/planner.png'
import { sidebarItems } from './navigationItems'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onNavigate?: () => void
}

function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const { t } = usePreferences()

  return (
    <aside
      className={`relative flex h-full w-full flex-col overflow-hidden border-r border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.94))] py-4 shadow-[0_24px_50px_rgba(15,23,42,0.14)] backdrop-blur-3xl transition-all duration-300 lg:h-[100dvh] ${
        collapsed ? 'items-center px-2.5' : 'px-3 sm:px-4'
      }`}
    >
      {/* Close button for mobile */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-2xl border border-white/70 bg-[var(--color-surface)] text-[var(--color-text-muted)] shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-colors hover:text-[var(--color-text)] lg:hidden"
        aria-label={t('accessibility.close_sidebar')}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.09),transparent_68%)]" />
      <div className="pointer-events-none absolute left-[-2rem] top-28 h-40 w-40 rounded-full bg-[rgba(16,185,129,0.08)] blur-3xl" />

      <div
        className={`relative flex w-full border-b border-[var(--color-border)]/70 pb-5 pr-10 lg:pr-0 ${
          collapsed ? 'flex-col items-center gap-3' : 'items-center gap-4 px-2'
        }`}
      >
        <div className="flex shrink-0 items-center justify-center">
          <div className="flex h-13 w-13 items-center justify-center ">
            <img
              src={plannerIcon}
              alt={t('app_logo_alt')}
              className="h-8 w-8 object-contain drop-shadow-[0_8px_18px_rgba(255,255,255,0.28)]"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className={`hidden h-11 cursor-pointer w-11 shrink-0 items-center justify-center rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)]/85 text-[var(--color-text-muted)] shadow-[0_10px_25px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary-pale)] hover:text-[var(--color-primary)] active:scale-95 lg:flex ${
            collapsed ? '' : 'order-2 ml-auto'
          }`}
          aria-label={collapsed ? t('open_sidebar') : t('collapse_sidebar')}
        >
          <HiBars3 className="text-xl" />
        </button>

        {!collapsed && (
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold tracking-tight text-[var(--color-text)]">
              {t('app_name')}
            </h2>
          </div>
        )}

        {collapsed && (
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            {t('menu')}
          </span>
        )}
      </div>

      <nav aria-label="Primary" className={`app-scrollbar relative mt-5 min-h-0 flex-1 overflow-y-auto ${collapsed ? 'w-full' : ''}`}>
        <div
          className={
            collapsed
              ? 'mx-auto w-[68px] space-y-2 rounded-[30px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-strong)_88%,transparent)] p-2.5 shadow-[var(--shadow-soft)] backdrop-blur-xl'
              : 'space-y-1.5 px-1'
          }
        >
          {sidebarItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? t(item.labelKey) : undefined}
                onClick={onNavigate}
              >
                {({ isActive }) => (
                  <div
                    className={`group relative flex items-center text-sm font-semibold transition-all duration-200 ${
                      collapsed
                        ? `justify-center rounded-[20px] py-3 ${
                            isActive
                              ? 'bg-gradient-to-br from-[var(--color-primary-pale)] via-[var(--color-surface)] to-[var(--color-surface-soft)] text-[var(--color-primary)] shadow-[0_14px_30px_rgba(79,70,229,0.14)]'
                              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]'
                          }`
                        : isActive
                          ? 'rounded-[22px] border border-[var(--color-primary)]/10 bg-gradient-to-r from-[var(--color-primary-pale)] via-white to-transparent text-[var(--color-primary)] shadow-[0_10px_24px_rgba(79,70,229,0.08)]'
                          : 'rounded-[22px] border border-transparent text-[var(--color-text-muted)] hover:bg-white/75 hover:text-[var(--color-text)]'
                    }`}
                  >
                    {isActive && !collapsed && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[var(--color-primary)]" />
                    )}

                    <div className={`flex w-full items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-4 py-3'}`}>
                      <Icon
                        className={`shrink-0 text-xl transition-all duration-200 ${
                          collapsed
                            ? isActive
                              ? 'scale-110'
                              : 'group-hover:scale-105'
                            : 'group-hover:scale-110'
                        }`}
                      />
                      {!collapsed && (
                        <span className="truncate text-[15px] font-semibold">{t(item.labelKey)}</span>
                      )}
                    </div>
                  </div>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
