import {
  HiOutlineCalendarDays,
  HiOutlineMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlinePlus,
} from 'react-icons/hi2'
import { useLocation } from 'react-router-dom'
import type { AppLanguage } from '../context/preferences-context'
import { usePreferences } from '../hooks/usePreferences'

type HeaderMeta = {
  title: string
  eyebrow?: string
  subtitle: string
  showFilter?: boolean
  showSearch?: boolean
  actionLabel?: string
  actionKind?: 'add' | 'edit'
}

const routeMeta: Record<string, HeaderMeta> = {
  '/dashboard': {
    eyebrow: 'overview',
    title: 'dashboard',
    subtitle: 'header.dashboard_subtitle',
    showFilter: true,
  },
  '/transactions': {
    title: 'transactions',
    eyebrow: 'header.money_flow',
    subtitle: 'header.transactions_subtitle',
    showFilter: true,
    showSearch: true,
    actionLabel: 'header.add_transaction',
  },
  '/analytics': {
    title: 'analytics',
    eyebrow: 'header.insights',
    subtitle: 'header.analytics_subtitle',
    showFilter: true,
    showSearch: true,
  },
  '/categories': {
    title: 'categories',
    eyebrow: 'header.structure',
    subtitle: 'header.categories_subtitle',
    actionLabel: 'header.add_category',
  },
  '/income': {
    title: 'income',
    eyebrow: 'header.cash_in',
    subtitle: 'header.income_subtitle',
    showFilter: true,
  },
  '/expenses': {
    title: 'expenses',
    eyebrow: 'header.cash_out',
    subtitle: 'header.expenses_subtitle',
    showFilter: true,
  },
  '/budgets': {
    title: 'budgets',
    eyebrow: 'header.planning',
    subtitle: 'header.budgets_subtitle',
    showFilter: true,
    actionLabel: 'header.add_budget',
  },
  '/savings-goals': {
    title: 'savings_goals',
    eyebrow: 'header.goals',
    subtitle: 'header.savings_subtitle',
    actionLabel: 'header.add_goal',
  },
  '/recurring-transactions': {
    title: 'recurring',
    eyebrow: 'header.automation',
    subtitle: 'header.recurring_subtitle',
    actionLabel: 'header.add_recurring',
  },
  '/debts': {
    title: 'debts',
    eyebrow: 'header.debt_tracker',
    subtitle: 'header.debts_subtitle',
    actionLabel: 'header.add_debt',
  },
  '/notes': {
    title: 'notes',
    eyebrow: 'header.quick_notes',
    subtitle: 'header.notes_subtitle',
    actionLabel: 'header.add_note',
  },
  '/notifications': {
    title: 'notifications',
    eyebrow: 'header.alerts',
    subtitle: 'header.notifications_subtitle',
    actionLabel: 'header.add_notification',
  },
  '/settings': {
    title: 'settings',
    eyebrow: 'header.preferences',
    subtitle: 'header.settings_subtitle',
    actionLabel: 'header.update_profile',
    actionKind: 'edit',
  },
}

function getLocale(language: AppLanguage) {
  return language === 'ru' ? 'ru-RU' : 'en-US'
}

function getWeekRangeLabel(date: Date, language: AppLanguage) {
  const locale = getLocale(language)
  const start = new Date(date)
  const day = start.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  start.setDate(start.getDate() + diffToMonday)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)

  const sameYear = start.getFullYear() === end.getFullYear()
  const sameMonth = start.getMonth() === end.getMonth()

  const startLabel = start.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
  })

  const endLabel = end.toLocaleDateString(
    locale,
    sameMonth
      ? { day: 'numeric', year: 'numeric' }
      : { month: 'short', day: 'numeric', year: 'numeric' },
  )

  if (sameMonth && sameYear) {
    return `${startLabel} - ${end.toLocaleDateString(locale, {
      day: 'numeric',
      year: 'numeric',
    })}`
  }

  return `${startLabel} - ${endLabel}`
}

function getDateFilterLabel(
  dateFilter: 'today' | 'week' | 'month' | 'year',
  language: AppLanguage,
) {
  const locale = getLocale(language)
  const today = new Date()

  if (dateFilter === 'today') {
    return today.toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (dateFilter === 'week') {
    return getWeekRangeLabel(today, language)
  }

  if (dateFilter === 'month') {
    return today.toLocaleDateString(locale, {
      month: 'long',
      year: 'numeric',
    })
  }

  return today.toLocaleDateString(locale, { year: 'numeric' })
}

function ContentHeader() {
  const location = useLocation()
  const {
    language,
    dateFilter,
    transactionSearch,
    setDateFilter,
    setTransactionSearch,
    t,
  } = usePreferences()

  const meta = routeMeta[location.pathname] ?? routeMeta['/dashboard']
  const isDashboard = location.pathname === '/dashboard'
  const title = t(meta.title)
  const showDateControls = isDashboard || meta.showFilter

  const ActionIcon = meta.actionKind === 'edit' ? HiOutlinePencilSquare : HiOutlinePlus

  const handlePrimaryAction = () => {
    const firstForm = document.querySelector('form')

    if (firstForm instanceof HTMLElement) {
      firstForm.scrollIntoView({ behavior: 'smooth', block: 'start' })

      const firstInput = firstForm.querySelector(
        'input, textarea, select, button',
      ) as HTMLElement | null

      firstInput?.focus()
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="px-3 pb-3 pt-3 sm:px-4 md:px-5 md:py-4 lg:pl-5">
      {/* ─── MOBILE ─── */}
      <div className="soft-enter lg:hidden">
        <div className="relative overflow-hidden rounded-[24px] border border-[var(--color-border)]/80 bg-gradient-to-br from-[var(--color-surface-strong)] to-[var(--color-surface)] shadow-[0_12px_28px_rgba(15,23,42,0.06)] backdrop-blur-2xl">
          {/* Decorative gradient orbs */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-bl from-[#4f46e5]/8 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-gradient-to-tr from-[#10b981]/6 to-transparent blur-3xl" />

          {/* Inner highlight */}
          <div className="pointer-events-none absolute inset-0 rounded-[24px] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]" />

          {/* Gradient accent bar */}
          <div className="relative h-1 w-full bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#818cf8]" />

          <div className="relative px-4 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                {meta.eyebrow && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--color-primary-pale)] to-[var(--color-primary-pale)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
                    {t(meta.eyebrow)}
                  </span>
                )}

                <div className={meta.eyebrow ? 'mt-2.5' : ''}>
                  <h1
                    id="page-title"
                    className="text-[1.9rem] font-extrabold tracking-[-0.05em] text-[var(--color-text)]"
                  >
                    {title}
                  </h1>
                  <p className="mt-1.5 max-w-[19rem] text-[13px] leading-6 text-[var(--color-text-muted)]">
                    {t(meta.subtitle)}
                  </p>
                </div>
              </div>

              {meta.actionLabel && !isDashboard && (
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="tap-highlight flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#7b83ff] text-white shadow-[0_12px_24px_rgba(79,70,229,0.22)] transition-all duration-200 hover:shadow-[0_16px_32px_rgba(79,70,229,0.32)] active:scale-95"
                  aria-label={t(meta.actionLabel)}
                >
                  <ActionIcon className="text-lg" />
                </button>
              )}
            </div>
          </div>
        </div>

        {(showDateControls || (!isDashboard && meta.showSearch)) && (
          <div className="mt-3 space-y-2">
            {showDateControls && (
              <div className="relative overflow-hidden rounded-[24px] border border-[var(--color-border)]/80 bg-gradient-to-br from-[var(--color-surface-strong)] to-[var(--color-surface-muted)] px-2 py-2 shadow-[var(--shadow-soft)] backdrop-blur-2xl">
                {/* Decorative orb */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-gradient-to-bl from-[#4f46e5]/6 to-transparent blur-2xl" />

                {/* Inner highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-[24px] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" />

                <div className="relative flex items-center gap-2 rounded-[18px] bg-gradient-to-br from-[var(--color-surface-soft)] to-white/80 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                  <span className="mobile-icon-chip h-9 w-9 rounded-2xl bg-gradient-to-br from-[var(--color-primary-pale)] to-[var(--color-primary-pale)] text-[var(--color-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_18px_rgba(15,23,42,0.08)]">
                    <HiOutlineCalendarDays className="text-base" />
                  </span>
                  <p className="truncate text-sm font-bold tracking-tight text-[var(--color-text)]">
                    {getDateFilterLabel(dateFilter, language)}
                  </p>
                </div>

                <div className="relative mt-2 flex gap-2 overflow-x-auto px-1 pb-1 app-scrollbar">
                  {(['today', 'week', 'month', 'year'] as const).map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setDateFilter(item)}
                      className={`tap-highlight min-h-[44px] shrink-0 rounded-[16px] px-4 text-sm font-bold transition-all duration-200 ${
                        dateFilter === item
                          ? 'bg-gradient-to-br from-[#4f46e5] to-[#7b83ff] text-white shadow-[0_10px_20px_rgba(87,83,246,0.24)]'
                          : 'border border-[var(--color-border)]/80 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-soft)] text-[var(--color-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]'
                      }`}
                    >
                      {t(item)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!isDashboard && meta.showSearch && (
              <label className="group relative overflow-hidden rounded-[22px] border border-[var(--color-border)]/80 bg-gradient-to-br from-[var(--color-surface-strong)] to-[var(--color-surface-muted)] px-4 py-3 shadow-[var(--shadow-soft)] backdrop-blur-2xl transition-all duration-200 focus-within:border-[var(--color-primary)]/60 focus-within:shadow-[0_0_0_4px_rgba(87,83,246,0.08)]">
                {/* Decorative orb */}
                <div className="pointer-events-none absolute -right-6 -top-6 h-16 w-16 rounded-full bg-gradient-to-bl from-[#4f46e5]/5 to-transparent blur-xl" />

                {/* Inner highlight */}
                <div className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" />

                <div className="relative flex items-center gap-3">
                  <span className="mobile-icon-chip flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-surface-soft)] to-white text-[var(--color-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_18px_rgba(15,23,42,0.08)] transition-colors duration-200 group-focus-within:text-[var(--color-primary)]">
                    <HiOutlineMagnifyingGlass className="text-base" />
                  </span>
                  <input
                    value={transactionSearch}
                    onChange={(event) => setTransactionSearch(event.target.value)}
                    placeholder={t('search_placeholder')}
                    className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/70 outline-none"
                  />
                </div>
              </label>
            )}
          </div>
        )}
      </div>

      {/* ─── DESKTOP ─── */}
      <div className="soft-enter relative hidden overflow-hidden rounded-[24px] border border-[var(--color-border)]/80 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-muted)] shadow-[var(--shadow-card)] lg:block">
        {/* Decorative gradient blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-bl from-[#4f46e5]/6 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gradient-to-tr from-[#10b981]/5 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/4 h-24 w-24 rounded-full bg-gradient-to-bl from-[#8b5cf6]/4 to-transparent blur-2xl" />

        {/* Inner highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-[24px] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]" />

        {/* Gradient accent bar */}
        <div className="relative h-1 w-full bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#818cf8]" />

        <div className="relative overflow-hidden px-5 py-6 md:px-8 md:py-8">
          <div className="relative flex flex-col gap-4 sm:gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              {meta.eyebrow && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[var(--color-primary-pale)] to-[var(--color-primary-pale)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--color-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:gap-2 sm:px-4 sm:py-1.5 sm:tracking-[0.3em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)] sm:h-2 sm:w-2" />
                  {t(meta.eyebrow)}
                </span>
              )}

              <h1
                id="page-title"
                className={`${
                  meta.eyebrow ? 'mt-2 sm:mt-4' : 'mt-1'
                } text-2xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-3xl md:text-4xl lg:text-5xl`}
              >
                {title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-muted)] sm:mt-3 sm:text-base sm:leading-7">
                {t(meta.subtitle)}
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:gap-3 xl:min-w-[440px] xl:w-auto xl:items-end">
              {isDashboard ? (
                <>
                  <div className="inline-flex w-full items-center justify-center gap-2 rounded-[16px] border border-[var(--color-border)]/80 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-soft)] px-3 py-2 text-[var(--color-text-muted)] shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:w-auto sm:justify-start sm:gap-3 sm:rounded-[18px] sm:px-5 sm:py-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary-pale)] to-[var(--color-primary-pale)] text-[var(--color-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                      <HiOutlineCalendarDays className="text-base sm:text-lg" />
                    </span>
                    <span className="text-sm font-semibold tracking-tight text-[var(--color-text)] sm:text-base">
                      {getDateFilterLabel(dateFilter, language)}
                    </span>
                  </div>

                  <div className="grid w-full grid-cols-2 gap-1 rounded-[14px] border border-[var(--color-border)]/80 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-soft)] p-1 shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-2 sm:rounded-[18px] sm:p-1">
                    {(['today', 'week', 'month', 'year'] as const).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setDateFilter(item)}
                        className={`rounded-[12px] cursor-pointer px-2.5 py-1.5 text-xs font-semibold tracking-tight transition-all duration-200 sm:rounded-[14px] sm:px-4 sm:py-2.5 sm:text-sm ${
                          dateFilter === item
                            ? 'bg-gradient-to-br from-[#4f46e5] to-[#7b83ff] text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)]'
                            : 'text-[var(--color-text-muted)] hover:bg-gradient-to-br hover:from-[var(--color-primary-pale)] hover:to-[var(--color-primary-pale)] hover:text-[var(--color-primary)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]'
                        }`}
                      >
                        {t(item)}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {meta.actionLabel && (
                    <button
                      type="button"
                      onClick={handlePrimaryAction}
                      className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-[14px] bg-gradient-to-br from-[#4f46e5] to-[#7b83ff] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(79,70,229,0.22)] transition-all duration-200 hover:shadow-[0_16px_32px_rgba(79,70,229,0.32)] hover:opacity-90 active:scale-[0.97] sm:w-auto sm:gap-2 sm:rounded-[16px] sm:px-5 sm:py-3 sm:text-sm"
                    >
                      <ActionIcon className="text-base sm:text-lg" />
                      {t(meta.actionLabel)}
                    </button>
                  )}

                  {meta.showFilter && (
                    <div className="grid w-full grid-cols-2 gap-1 rounded-[14px] border border-[var(--color-border)]/80 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-soft)] p-1 shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-2 sm:rounded-[18px] sm:p-1">
                      {(['today', 'week', 'month', 'year'] as const).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setDateFilter(item)}
                          className={`rounded-[12px] cursor-pointer px-2.5 py-1.5 text-xs font-semibold tracking-tight transition-all duration-200 sm:rounded-[14px] sm:px-4 sm:py-2.5 sm:text-sm ${
                            dateFilter === item
                              ? 'bg-gradient-to-br from-[#4f46e5] to-[#7b83ff] text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)]'
                              : 'text-[var(--color-text-muted)] hover:bg-gradient-to-br hover:from-[var(--color-primary-pale)] hover:to-[var(--color-primary-pale)] hover:text-[var(--color-primary)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]'
                          }`}
                        >
                          {t(item)}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {!isDashboard && meta.showSearch && (
          <div className="border-t border-[var(--color-border)]/60 bg-gradient-to-br from-[var(--color-surface-muted)] to-[var(--color-bg)] px-4 py-4 md:px-8">
            <div className="relative max-w-md">
              {/* Decorative orb */}
              <div className="pointer-events-none absolute -left-4 -top-4 h-12 w-12 rounded-full bg-gradient-to-br from-[#4f46e5]/5 to-transparent blur-xl" />

              <label className="group relative flex items-center gap-3 rounded-[16px] border border-[var(--color-border)]/80 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-soft)] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-200 focus-within:border-[var(--color-primary)]/60 focus-within:shadow-[0_0_0_4px_rgba(87,83,246,0.08)]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-surface-soft)] to-white text-[var(--color-text-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_18px_rgba(15,23,42,0.08)] transition-colors duration-200 group-focus-within:text-[var(--color-primary)]">
                  <HiOutlineMagnifyingGlass className="text-base" />
                </span>
                <input
                  value={transactionSearch}
                  onChange={(event) => setTransactionSearch(event.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/70 outline-none"
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default ContentHeader