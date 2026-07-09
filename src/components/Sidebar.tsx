import { NavLink } from 'react-router-dom'
import {
  HiBars3,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineArrowTrendingDown,
  HiOutlineArrowTrendingUp,
  HiOutlineBanknotes,
  HiOutlineBellAlert,
  HiOutlineChartBarSquare,
  HiOutlineChartPie,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineCreditCard,
  HiOutlineFolder,
  HiOutlineHome,
  HiOutlineArrowPathRoundedSquare,
  HiOutlineWallet,
} from 'react-icons/hi2'
import { useAuth } from '../hooks/useAuth'
import { usePreferences } from '../hooks/usePreferences'
import { formatUserRole } from '../utils/format'
import plannerIcon from '../assets/icons/planner.png'
import budgetIcon from '../assets/icons/budget.png'

const sidebarItems = [
  { to: '/dashboard', labelKey: 'dashboard', icon: HiOutlineHome },
  { to: '/analytics', labelKey: 'analytics', icon: HiOutlineChartBarSquare },
  { to: '/categories', labelKey: 'categories', icon: HiOutlineFolder },
  { to: '/transactions', labelKey: 'transactions', icon: HiOutlineBanknotes },
  { to: '/income', labelKey: 'income', icon: HiOutlineArrowTrendingUp },
  { to: '/expenses', labelKey: 'expenses', icon: HiOutlineArrowTrendingDown },
  { to: '/budgets', labelKey: 'budgets', icon: HiOutlineChartPie },
  { to: '/savings-goals', labelKey: 'savings_goals', icon: HiOutlineWallet },
  { to: '/recurring-transactions', labelKey: 'recurring', icon: HiOutlineArrowPathRoundedSquare },
  { to: '/debts', labelKey: 'debts', icon: HiOutlineCreditCard },
  { to: '/notes', labelKey: 'notes', icon: HiOutlineClipboardDocumentList },
  { to: '/notifications', labelKey: 'notifications', icon: HiOutlineBellAlert },
  { to: '/settings', labelKey: 'settings', icon: HiOutlineCog6Tooth },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth()
  const { t } = usePreferences()
  const userInitial = user?.full_name?.charAt(0) ?? 'U'

  return (
    <aside
      className={`relative flex h-full w-full flex-col overflow-hidden border-r border-[var(--color-border)] bg-[linear-gradient(180deg,var(--color-surface-strong),var(--color-surface-muted))] py-4 shadow-[var(--shadow-card)] backdrop-blur-2xl transition-all duration-300 ${
        collapsed ? 'items-center px-2.5' : 'px-3'
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.08),transparent_68%)]" />

      <div
        className={`relative flex w-full border-b border-[var(--color-border)]/70 pb-5 ${
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
          className={`flex h-11 cursor-pointer w-11 shrink-0 items-center justify-center rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)]/85 text-[var(--color-text-muted)] shadow-[0_10px_25px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary-pale)] hover:text-[var(--color-primary)] active:scale-95 ${
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
            <p className="truncate text-sm text-[var(--color-text-muted)]">
              {t('app_tagline')}
            </p>
          </div>
        )}

        {collapsed && (
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--color-text-muted)]">
            {t('menu')}
          </span>
        )}
      </div>

      <nav aria-label="Primary" className={`relative mt-5 flex-1 ${collapsed ? 'w-full' : ''}`}>
        <div
          className={
            collapsed
              ? 'mx-auto w-[68px] space-y-2 rounded-[30px] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-strong)_88%,transparent)] p-2.5 shadow-[var(--shadow-soft)] backdrop-blur-xl'
              : 'space-y-1'
          }
        >
          {sidebarItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                title={collapsed ? t(item.labelKey) : undefined}
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
                          ? 'rounded-2xl bg-gradient-to-r from-[var(--color-primary-pale)] via-[var(--color-surface)] to-transparent text-[var(--color-primary)]'
                          : 'rounded-2xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {isActive && !collapsed && (
                      <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[var(--color-primary)]" />
                    )}

                    <div className={`flex w-full items-center ${collapsed ? 'justify-center px-0' : 'gap-3 px-4 py-2.5'}`}>
                      <Icon
                        className={`shrink-0 text-xl transition-all duration-200 ${
                          collapsed
                            ? isActive
                              ? 'scale-110'
                              : 'group-hover:scale-105'
                            : 'group-hover:scale-110'
                        }`}
                      />
                      {!collapsed && <span>{t(item.labelKey)}</span>}
                    </div>
                  </div>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>

      <div
        className={`relative mt-5 overflow-hidden border border-[var(--color-border)]/80 bg-gradient-to-br from-[var(--color-surface-soft)] to-[var(--color-surface)] ${
          collapsed ? 'w-full rounded-[28px] p-2.5' : 'rounded-[24px] p-4'
        }`}
      >
        {!collapsed && (
          <img
            src={budgetIcon}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rotate-12 object-contain opacity-10"
          />
        )}

        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.full_name}
              className={`${collapsed ? 'h-11 w-11 rounded-[18px]' : 'h-12 w-12 rounded-2xl'} object-cover ring-2 ring-[var(--color-primary)]/10`}
            />
          ) : (
            <div className={`${collapsed ? 'h-11 w-11 rounded-[18px]' : 'h-12 w-12 rounded-2xl'} flex items-center justify-center bg-gradient-to-br from-[var(--color-primary-pale)] to-[var(--color-surface)] text-lg font-bold text-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/10`}>
              {userInitial}
            </div>
          )}

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[var(--color-text)]">
                {user?.full_name ?? t('guest')}
              </p>
              <p className="truncate text-xs text-[var(--color-text-muted)]">
                {user?.email ?? t('no_email')}
              </p>
              <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-primary)]">
                {formatUserRole(user?.role)}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={logout}
          title={collapsed ? t('logout') : undefined}
          className={`mt-4 flex items-center rounded-[20px] text-sm font-bold text-white shadow-sm transition-all duration-200 hover:opacity-92 active:scale-[0.97] ${
            collapsed
              ? 'mx-auto h-12 w-12 justify-center bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] shadow-[0_18px_30px_rgba(79,70,229,0.28)]'
              : 'w-full justify-center gap-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-soft)] px-4 py-3'
          }`}
        >
          <HiOutlineArrowLeftOnRectangle className="text-lg" />
          {!collapsed && <span>{t('logout')}</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
