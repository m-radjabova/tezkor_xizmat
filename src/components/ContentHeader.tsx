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
    <header className="sticky top-0 z-30 px-3 py-3 md:px-5 md:py-4">
      <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
        <div className="relative overflow-hidden px-5 py-6 md:px-8 md:py-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.08),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.05),transparent_25%)]" />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0">
              {meta.eyebrow && (
                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--color-primary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                  {t(meta.eyebrow)}
                </span>
              )}

              <h1
                id="page-title"
                className={`${
                  meta.eyebrow ? 'mt-4' : 'mt-1'
                } text-3xl font-extrabold tracking-tight text-[var(--color-text)] md:text-5xl`}
              >
                {title}
              </h1>

              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--color-text-muted)]">
                {t(meta.subtitle)}
              </p>
            </div>

            <div className="flex flex-col gap-3 xl:min-w-[440px] xl:items-end">
              {isDashboard ? (
                <>
                  <div className="inline-flex items-center gap-3 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-[var(--color-text-muted)] shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                    <HiOutlineCalendarDays className="text-2xl text-[var(--color-primary)]" />
                    <span className="text-base font-semibold tracking-tight text-[var(--color-text)]">
                      {getDateFilterLabel(dateFilter, language)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                    {(['today', 'week', 'month', 'year'] as const).map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setDateFilter(item)}
                        className={`rounded-[14px] cursor-pointer px-4 py-2.5 text-sm font-semibold tracking-tight transition ${
                          dateFilter === item
                            ? 'bg-[var(--color-primary)] text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)]'
                            : 'text-[var(--color-text-muted)] hover:bg-[var(--color-primary-pale)] hover:text-[var(--color-primary)]'
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
                      className="inline-flex cursor-pointer items-center gap-2 rounded-[16px] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(79,70,229,0.22)] transition hover:opacity-90"
                    >
                      <ActionIcon className="text-lg" />
                      {t(meta.actionLabel)}
                    </button>
                  )}

                  {meta.showFilter && (
                    <div className="flex flex-wrap items-center gap-2 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                      {(['today', 'week', 'month', 'year'] as const).map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setDateFilter(item)}
                          className={`rounded-[14px] cursor-pointer px-4 py-2.5 text-sm font-semibold tracking-tight transition ${
                            dateFilter === item
                              ? 'bg-[var(--color-primary)] text-white shadow-[0_8px_20px_rgba(79,70,229,0.25)]'
                              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-primary-pale)] hover:text-[var(--color-primary)]'
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
          <div className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)] px-5 py-4 md:px-8">
            <label className="group flex max-w-md items-center gap-3 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition focus-within:border-[var(--color-primary)]">
              <HiOutlineMagnifyingGlass className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
              <input
                value={transactionSearch}
                onChange={(event) => setTransactionSearch(event.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder-[var(--color-text-muted)]/70 outline-none"
              />
            </label>
          </div>
        )}
      </div>
    </header>
  )
}

export default ContentHeader
