import { useMemo } from 'react'
import {
  HiOutlineArrowTrendingUp,
  HiOutlineCalendarDays,
  HiOutlineTag,
  HiOutlineBanknotes,
} from 'react-icons/hi2'
import EmptyState from '../../components/EmptyState'
import PageSection from '../../components/PageSection'
import { useCategories } from '../../hooks/useCategories'
import { usePreferences } from '../../hooks/usePreferences'
import { useTransactions } from '../../hooks/useTransactions'
import { formatCurrency, formatShortDate } from '../../utils/format'

function IncomeSkeleton() {
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
    <div className="animate-pulse grid gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-[28px] border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-6 shadow-sm"
        >
          <div className="h-3.5 w-24 rounded-lg bg-[var(--color-border)]/60" />
          <div className="mt-4 h-8 w-32 rounded-lg bg-[var(--color-border)]/50" />
        </div>
      ))}
    </div>
  )
}

function IncomePage() {
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

  const incomes = useMemo(
    () => transactions.filter((transaction) => transaction.type === 'income'),
    [transactions],
  )

  const totalIncome = useMemo(
    () => incomes.reduce((total, transaction) => total + Number(transaction.amount), 0),
    [incomes],
  )

  const averageIncome = useMemo(
    () => (incomes.length > 0 ? totalIncome / incomes.length : 0),
    [incomes, totalIncome],
  )

  return (
    <div className="mobile-page space-y-4 p-2 sm:space-y-5 sm:p-3 md:space-y-6 md:p-6 lg:p-8">
      {isLoading ? (
        <SummarySkeleton />
      ) : (
        <>
          <div className="mobile-surface-card overflow-hidden rounded-[28px] p-2 sm:hidden">
            {[
              { label: t('page.income.total_income'), value: formatCurrency(totalIncome), tone: 'text-[var(--color-success)]' },
              { label: t('page.income.income_transactions'), value: String(incomes.length), tone: 'text-[var(--color-text)]' },
              { label: t('page.income.average_income'), value: incomes.length > 0 ? formatCurrency(averageIncome) : formatCurrency(0), tone: 'text-[var(--color-purple)]' },
            ].map((item, index, list) => (
              <div key={item.label} className={`px-3 py-3 ${index < list.length - 1 ? 'border-b border-[var(--color-border)]/70' : ''}`}>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{item.label}</p>
                <p className={`mt-1 text-xl font-extrabold tracking-tight ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>
          <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3">
            <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-success)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
              <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.income.total_income')}</p>
              <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-success)]">
                {formatCurrency(totalIncome)}
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-primary)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
              <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.income.income_transactions')}</p>
              <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-text)]">{incomes.length}</p>
            </div>
            <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-purple)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
              <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.income.average_income')}</p>
              <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-purple)]">{incomes.length > 0 ? formatCurrency(averageIncome) : formatCurrency(0)}</p>
            </div>
          </div>
        </>
      )}

      {/* Income list */}
      <PageSection title={t('page.income.list_title')} subtitle={t('page.income.list_subtitle')}>
        {isLoading ? (
          <div className="mt-5 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <IncomeSkeleton key={i} />
            ))}
          </div>
        ) : incomes.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              icon={HiOutlineArrowTrendingUp}
              title={t('page.income.empty_title')}
              description={t('page.income.empty_description')}
            />
          </div>
        ) : (
          <>
            {/* Summary bar */}
            <div className="mobile-summary-bar mb-5 rounded-2xl px-4 py-3">
              <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                {incomes.length} {incomes.length === 1 ? t('page.income.record_singular') : t('page.income.record_plural')}
              </span>
              <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <HiOutlineBanknotes className="text-sm text-[var(--color-success)]" />
                <span className="text-[var(--color-success)]">{formatCurrency(totalIncome)} {t('common.total')}</span>
              </span>
              {incomes.length > 1 && (
                <>
                  <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-muted)]">
                    {t('common.average_short')} {formatCurrency(averageIncome)}
                  </span>
                </>
              )}
            </div>

            {/* List */}
            <div className="space-y-3 sm:space-y-4">
              {incomes.map((income, index) => {
                const categoryColor = categoryColorMap.get(income.category_id ?? '') ?? '#5d8f75'
                const categoryName = categoryNameMap.get(income.category_id ?? '')
                return (
                  <div
                    key={income.id}
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
                            {income.title}
                          </p>
                        </div>

                        {/* Meta row */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                            <HiOutlineCalendarDays className="text-xs" />
                            {formatShortDate(income.transaction_date)}
                          </span>
                          {categoryName && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-success-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-success)]">
                              <HiOutlineTag className="text-xs" />
                              {categoryName}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        {income.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                            {income.description}
                          </p>
                        )}

                        {/* Tags */}
                        {income.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {income.tags.map((tag) => (
                              <span
                                key={`${income.id}-${tag}`}
                                className="inline-flex items-center gap-1 rounded-full border border-[var(--color-success)]/20 bg-[var(--color-success-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-success)] transition-all duration-200 hover:bg-[var(--color-success)]/10"
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
                        <p className="text-xl font-extrabold text-[var(--color-success)] sm:text-2xl">
                          +{formatCurrency(income.amount)}
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

export default IncomePage
