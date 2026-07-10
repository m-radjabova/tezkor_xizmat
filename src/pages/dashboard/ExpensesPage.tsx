import { useMemo } from 'react'
import {
  HiOutlineArrowTrendingDown,
  HiOutlineCalendarDays,
  HiOutlineTag,
  HiOutlineBanknotes,
  HiOutlineFire,
} from 'react-icons/hi2'
import EmptyState from '../../components/EmptyState'
import PageSection from '../../components/PageSection'
import { useCategories } from '../../hooks/useCategories'
import { usePreferences } from '../../hooks/usePreferences'
import { useTransactions } from '../../hooks/useTransactions'
import { formatCurrency, formatShortDate } from '../../utils/format'

function ExpenseSkeleton() {
  return (
    <div className="animate-pulse rounded-[24px] border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-5 w-40 rounded-lg bg-[var(--color-border)]" />
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-4 rounded bg-[var(--color-border)]/60" />
            <div className="h-3.5 w-28 rounded-lg bg-[var(--color-border)]/60" />
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-[var(--color-border)]/40" />
            <div className="h-5 w-20 rounded-full bg-[var(--color-border)]/40" />
          </div>
        </div>
        <div className="h-7 w-24 rounded-lg bg-[var(--color-border)]/60" />
      </div>
    </div>
  )
}

function SummarySkeleton() {
  return (
    <div className="animate-pulse grid gap-4 md:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-[28px] border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-6 shadow-sm"
        >
          <div className="h-3.5 w-24 rounded-lg bg-[var(--color-border)]/60" />
          <div className="mt-4 h-8 w-28 rounded-lg bg-[var(--color-border)]/50" />
        </div>
      ))}
    </div>
  )
}

function CategoryCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[24px] border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-[var(--color-border)]/40" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 rounded-lg bg-[var(--color-border)]/60" />
          <div className="h-6 w-20 rounded-lg bg-[var(--color-border)]/50" />
        </div>
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-[var(--color-border)]/30" />
    </div>
  )
}

function ExpensesPage() {
  const { transactions, isLoading } = useTransactions()
  const { categories } = useCategories()
  const { t } = usePreferences()

  const categoryColorMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.color ?? '#e5a4b8'])),
    [categories],
  )

  const categoryNameMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  const expenses = useMemo(
    () => transactions.filter((transaction) => transaction.type === 'expense'),
    [transactions],
  )

  const totalExpense = useMemo(
    () => expenses.reduce((total, transaction) => total + Number(transaction.amount), 0),
    [expenses],
  )

  const averageExpense = useMemo(
    () => (expenses.length > 0 ? totalExpense / expenses.length : 0),
    [expenses, totalExpense],
  )

  const totalsByCategory = useMemo(() => {
    const totals = new Map<string, { amount: number; color: string }>()

    expenses.forEach((expense) => {
      const categoryName = categoryNameMap.get(expense.category_id ?? '') ?? t('common.no_category')
      const categoryColor = categoryColorMap.get(expense.category_id ?? '') ?? '#d87289'
      const current = totals.get(categoryName)
      totals.set(categoryName, {
        amount: (current?.amount ?? 0) + Number(expense.amount),
        color: current?.color ?? categoryColor,
      })
    })

    return Array.from(totals.entries()).map(([label, { amount, color }]) => ({
      label,
      amount,
      color,
    }))
  }, [expenses, categoryNameMap, categoryColorMap, t])

  const biggestCategory = useMemo(
    () =>
      totalsByCategory.length > 0
        ? totalsByCategory.reduce((max, item) => (item.amount > max.amount ? item : max))
        : null,
    [totalsByCategory],
  )

  const maxCategoryAmount = useMemo(
    () => (totalsByCategory.length > 0 ? Math.max(...totalsByCategory.map((c) => c.amount)) : 0),
    [totalsByCategory],
  )

  return (
    <div className="mobile-page space-y-4 p-2 sm:space-y-5 sm:p-3 md:space-y-6 md:p-6 lg:p-8">
      {isLoading ? (
        <SummarySkeleton />
      ) : (
        <>
        <div className="mobile-surface-card overflow-hidden rounded-[28px] p-2 sm:hidden">
          {[
            { label: t('page.expenses.total_expenses'), value: formatCurrency(totalExpense), tone: 'text-[var(--color-danger)]' },
            { label: t('page.expenses.transactions'), value: String(expenses.length), tone: 'text-[var(--color-text)]' },
            { label: t('page.expenses.categories_used'), value: String(totalsByCategory.length), tone: 'text-[var(--color-purple)]' },
            { label: t('page.expenses.average_expense'), value: expenses.length > 0 ? formatCurrency(averageExpense) : formatCurrency(0), tone: 'text-[var(--color-warning)]' },
          ].map((item, index, list) => (
            <div key={item.label} className={`px-3 py-3 ${index < list.length - 1 ? 'border-b border-[var(--color-border)]/70' : ''}`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{item.label}</p>
              <p className={`mt-1 text-xl font-extrabold tracking-tight ${item.tone}`}>{item.value}</p>
            </div>
          ))}
        </div>

        <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4">
          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-danger)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.expenses.total_expenses')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-danger)]">
              {formatCurrency(totalExpense)}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-primary)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.expenses.transactions')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-text)]">
              {expenses.length}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-purple)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.expenses.categories_used')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-purple)]">
              {totalsByCategory.length}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-warning)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.expenses.average_expense')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-warning)]">
              {expenses.length > 0 ? formatCurrency(averageExpense) : formatCurrency(0)}
            </p>
          </div>
        </div>
        </>
      )}

      {/* Category breakdown */}
      <PageSection title={t('page.expenses.by_category_title')} subtitle={t('page.expenses.by_category_subtitle')}>
        {isLoading ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <CategoryCardSkeleton key={i} />
            ))}
          </div>
        ) : totalsByCategory.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              icon={HiOutlineArrowTrendingDown}
              title={t('page.expenses.empty_title')}
              description={t('page.expenses.empty_description')}
            />
          </div>
        ) : (
          <>
            {/* Summary bar */}
            <div className="mobile-summary-bar mb-5 rounded-2xl px-4 py-3">
              <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                {totalsByCategory.length} {totalsByCategory.length === 1 ? t('page.categories.category_singular') : t('page.categories.category_plural')}
              </span>
              <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <HiOutlineBanknotes className="text-sm text-[var(--color-danger)]" />
                <span className="text-[var(--color-danger)]">{formatCurrency(totalExpense)} {t('common.total')}</span>
              </span>
              {biggestCategory && (
                <>
                  <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-muted)]">
                    <HiOutlineFire className="text-sm text-[var(--color-warning)]" />
                    {t('page.expenses.most_spent')}: {biggestCategory.label}
                  </span>
                </>
              )}
            </div>

            {/* Category grid */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 sm:gap-4">
              {totalsByCategory.map((expense) => {
                const percentage = maxCategoryAmount > 0 ? (expense.amount / maxCategoryAmount) * 100 : 0
                return (
                  <div
                    key={expense.label}
                    className="group relative overflow-hidden rounded-[24px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:border-[var(--color-border-strong)]/70"
                  >
                    {/* Gradient accent */}
                    <div
                      className="absolute inset-x-0 top-0 h-0.5 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(90deg, ${expense.color}, ${expense.color}88, transparent)`,
                      }}
                    />

                    <div className="relative">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                          style={{ backgroundColor: `${expense.color}20` }}
                        >
                          <HiOutlineArrowTrendingDown
                            className="text-lg"
                            style={{ color: expense.color }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[var(--color-text-muted)]">
                            {expense.label}
                          </p>
                          <p
                            className="mt-1 text-2xl font-extrabold"
                            style={{ color: expense.color }}
                          >
                            {formatCurrency(expense.amount)}
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-soft)]">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${percentage}%`,
                            background: `linear-gradient(90deg, ${expense.color}, ${expense.color}bb)`,
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-right text-[11px] font-semibold text-[var(--color-text-muted)]">
                        {t('page.expenses.percent_of_highest', { percent: percentage.toFixed(0) })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </PageSection>

      {/* Recent expense transactions */}
      <PageSection title={t('page.expenses.recent_title')} subtitle={t('page.expenses.recent_subtitle')}>
        {isLoading ? (
          <div className="mt-5 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <ExpenseSkeleton key={i} />
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              icon={HiOutlineArrowTrendingDown}
              title={t('page.expenses.empty_title')}
              description={t('page.expenses.recent_empty_description')}
            />
          </div>
        ) : (
          <>
            {/* Summary bar */}
            <div className="mobile-summary-bar mb-5 rounded-2xl px-4 py-3">
              <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                {expenses.length} {expenses.length === 1 ? t('page.transactions.transaction_singular') : t('page.transactions.transaction_plural')}
              </span>
              <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <HiOutlineBanknotes className="text-sm text-[var(--color-danger)]" />
                <span className="text-[var(--color-danger)]">{formatCurrency(totalExpense)} {t('common.total')}</span>
              </span>
              {expenses.length > 1 && (
                <>
                  <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-muted)]">
                    {t('common.average_short')} {formatCurrency(averageExpense)}
                  </span>
                </>
              )}
            </div>

            {/* List */}
            <div className="space-y-3 sm:space-y-4">
              {expenses.map((expense, index) => {
                const categoryColor = categoryColorMap.get(expense.category_id ?? '') ?? '#d87289'
                const categoryName = categoryNameMap.get(expense.category_id ?? '')
                return (
                  <div
                    key={expense.id}
                    className="group relative overflow-hidden rounded-[24px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-4 shadow-sm transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:border-[var(--color-border-strong)]/70 sm:p-5"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {/* Gradient accent */}
                    <div
                      className="absolute inset-x-0 top-0 h-0.5 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}88, transparent)`,
                      }}
                    />

                    <div className="relative flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      {/* Left side */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <span
                            className="relative inline-block h-3 w-3 shrink-0 rounded-full shadow-sm ring-2 ring-white/60"
                            style={{ backgroundColor: categoryColor }}
                          >
                            <span
                              className="absolute inset-0 animate-ping rounded-full opacity-25"
                              style={{ backgroundColor: categoryColor }}
                            />
                          </span>
                          <p className="truncate text-base font-bold text-[var(--color-text)] sm:text-lg">
                            {expense.title}
                          </p>
                        </div>

                        {/* Meta row */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                            <HiOutlineCalendarDays className="text-xs" />
                            {formatShortDate(expense.transaction_date)}
                          </span>
                          {categoryName && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-danger-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-danger)]">
                              <HiOutlineTag className="text-xs" />
                              {categoryName}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {expense.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                            {expense.description}
                          </p>
                        )}

                        {/* Tags */}
                        {expense.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {expense.tags.map((tag) => (
                              <span
                                key={`${expense.id}-${tag}`}
                                className="inline-flex items-center gap-1 rounded-full border border-[var(--color-danger)]/20 bg-[var(--color-danger-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-danger)] transition-all duration-200 hover:bg-[var(--color-danger)]/10"
                              >
                                <HiOutlineTag className="text-[10px]" />
                                {tag.startsWith('#') ? tag : `#${tag}`}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="flex shrink-0 items-center justify-end gap-3">
                        <p className="text-xl font-extrabold text-[var(--color-danger)] sm:text-2xl">
                          -{formatCurrency(expense.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </PageSection>
    </div>
  )
}

export default ExpensesPage
