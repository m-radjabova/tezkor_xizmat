import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
  HiOutlineTag,
  HiOutlineRectangleGroup,
  HiOutlineChevronDown,
  HiOutlineBanknotes,
  HiOutlineChartBar,
} from 'react-icons/hi2'
import ConfirmActionButton from '../../components/ConfirmActionButton'
import EmptyState from '../../components/EmptyState'
import PageSection from '../../components/PageSection'
import { useBudgets } from '../../hooks/useBudgets'
import { useCategories } from '../../hooks/useCategories'
import { usePreferences } from '../../hooks/usePreferences'
import { formatCurrency, formatMonthYear } from '../../utils/format'

type BudgetFormValues = {
  month: number
  year: number
  limit_amount: number
  category_id: string
}

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-[50px] w-full rounded-2xl bg-[var(--color-border)]/30" />
      ))}
      <div className="h-[130px] w-full rounded-2xl bg-[var(--color-primary-pale)]/40" />
      <div className="h-[50px] w-full rounded-2xl bg-[var(--color-primary-soft)]/40" />
    </div>
  )
}

function BudgetSkeleton() {
  return (
    <div className="animate-pulse rounded-[24px] border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-5 w-36 rounded-lg bg-[var(--color-border)]" />
          <div className="h-3.5 w-48 rounded-lg bg-[var(--color-border)]/60" />
          <div className="h-3.5 w-24 rounded-lg bg-[var(--color-border)]/60" />
          <div className="h-2 w-full rounded-full bg-[var(--color-border)]/30" />
        </div>
        <div className="flex gap-2">
          <div className="h-11 w-36 rounded-2xl bg-[var(--color-border)]/40" />
          <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/40" />
        </div>
      </div>
    </div>
  )
}

function SummarySkeleton() {
  return (
    <div className="animate-pulse grid gap-4 sm:grid-cols-3">
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

function BudgetsPage() {
  const { t } = usePreferences()
  const { budgets, isLoading, createBudget, updateBudget, deleteBudget, isCreating, isUpdating, isDeleting } = useBudgets()
  const { categories } = useCategories()
  const budgetSchema = z.object({
    month: z.number().min(1, t('page.budgets.validation.month')).max(12, t('page.budgets.validation.month')),
    year: z.number().min(2024, t('page.budgets.validation.year_min')).max(2100, t('page.budgets.validation.year_max')),
    limit_amount: z.number().positive(t('page.budgets.validation.limit')),
    category_id: z.string(),
  })
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      limit_amount: 500,
      category_id: '',
    },
  })

  const selectedMonth = watch('month')
  const selectedYear = watch('year')

  const expenseCategories = useMemo(
    () => categories.filter((category) => category.type === 'expense'),
    [categories],
  )

  const categoryColorMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.color ?? '#e5a4b8'])),
    [categories],
  )

  const categoryNameMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories],
  )

  const totalBudget = useMemo(
    () => budgets.reduce((total, item) => total + Number(item.limit_amount), 0),
    [budgets],
  )

  const categoriesCovered = useMemo(
    () => new Set(budgets.map((b) => b.category_id).filter(Boolean)).size,
    [budgets],
  )

  const averageBudget = useMemo(
    () => (budgets.length > 0 ? totalBudget / budgets.length : 0),
    [budgets, totalBudget],
  )

  const onSubmit = (values: BudgetFormValues) => {
    createBudget({
      month: values.month,
      year: values.year,
      limit_amount: values.limit_amount,
      category_id: values.category_id || null,
    })
    reset({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      limit_amount: 500,
      category_id: '',
    })
  }

  return (
    <div className="mobile-page space-y-4 p-2 sm:space-y-5 sm:p-3 md:space-y-6 md:p-6 lg:p-8">
      {isLoading ? (
        <SummarySkeleton />
      ) : budgets.length > 0 ? (
        <>
          <div className="mobile-surface-card overflow-hidden rounded-[28px] p-2 sm:hidden">
            {[
              {
                label: t('page.budgets.total_budgets'),
                value: formatCurrency(totalBudget),
                tone: 'text-[var(--color-primary)]',
              },
              {
                label: t('page.budgets.categories_covered'),
                value: `${categoriesCovered} / ${expenseCategories.length || 1}`,
                tone: 'text-[var(--color-success)]',
              },
              {
                label: t('page.budgets.active_budgets'),
                value: String(budgets.length),
                tone: 'text-[var(--color-purple)]',
              },
            ].map((item, index, list) => (
              <div
                key={item.label}
                className={`px-3 py-3 ${index < list.length - 1 ? 'border-b border-[var(--color-border)]/70' : ''}`}
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                  {item.label}
                </p>
                <p className={`mt-1 text-xl font-extrabold tracking-tight ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3">
            <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-primary)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
              <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.budgets.total_budgets')}</p>
              <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-primary)]">
                {formatCurrency(totalBudget)}
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-success)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
              <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.budgets.categories_covered')}</p>
              <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-success)]">
                {categoriesCovered} <span className="text-base font-semibold text-[var(--color-text-muted)]">/ {expenseCategories.length || 1}</span>
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-purple)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
              <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.budgets.active_budgets')}</p>
              <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-purple)]">
                {budgets.length}
              </p>
            </div>
          </div>
        </>
      ) : null}

      <div className="grid items-start gap-4 sm:gap-6 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
        <PageSection
          title={t('page.budgets.form_title')}
          subtitle={t('page.budgets.form_subtitle')}
          className="order-2 xl:order-1 xl:sticky xl:top-28"
        >
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Month */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineCalendarDays className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  type="number"
                  min={1}
                  max={12}
                  {...register('month', { valueAsNumber: true })}
                  placeholder={t('page.budgets.month_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
                {errors.month && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.month.message}
                  </p>
                )}
              </div>

              {/* Year */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineChartBar className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  type="number"
                  min={2024}
                  max={2100}
                  {...register('year', { valueAsNumber: true })}
                  placeholder={t('page.budgets.year_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
                {errors.year && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.year.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineTag className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <select
                  {...register('category_id')}
                  className="w-full appearance-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-10 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                >
                  <option value="">{t('common.no_category')}</option>
                  {expenseCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <HiOutlineChevronDown className="text-sm text-[var(--color-text-muted)]" />
                </div>
              </div>

              {/* Limit amount */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineCurrencyDollar className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  {...register('limit_amount', { valueAsNumber: true })}
                  placeholder={t('page.budgets.limit_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
                {errors.limit_amount && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.limit_amount.message}
                  </p>
                )}
              </div>

              {/* Month/Year preview */}
              <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-surface-soft)] px-3 py-2">
                <HiOutlineCalendarDays className="text-sm text-[var(--color-text-muted)]" />
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                  {t('page.budgets.budget_for')}{' '}
                  <span className="text-[var(--color-primary)]">
                    {formatMonthYear(selectedMonth || 1, selectedYear || 2026)}
                  </span>
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isCreating}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--color-primary)] px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--color-primary-soft)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 disabled:opacity-70 disabled:hover:shadow-none"
              >
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <HiOutlinePlus className="relative text-lg" />
                <span className="relative">
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {t('common.saving')}
                    </span>
                  ) : (
                    t('page.budgets.add')
                  )}
                </span>
              </button>
            </form>
          )}
        </PageSection>

        <PageSection
          title={t('page.budgets.list_title')}
          subtitle={t('page.budgets.list_subtitle')}
          className="order-1 xl:order-2"
        >
          {isLoading ? (
            <div className="mt-5 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <BudgetSkeleton key={i} />
              ))}
            </div>
          ) : budgets.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={HiOutlinePlus}
                title={t('page.budgets.empty_title')}
                description={t('page.budgets.empty_description')}
              />
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="mobile-summary-bar mb-5 rounded-2xl px-4 py-3">
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                  {budgets.length} {budgets.length === 1 ? t('page.budgets.budget_singular') : t('page.budgets.budget_plural')}
                </span>
                <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <HiOutlineBanknotes className="text-sm text-[var(--color-primary)]" />
                  <span className="text-[var(--color-primary)]">{formatCurrency(totalBudget)} {t('common.total')}</span>
                </span>
                {budgets.length > 1 && (
                  <>
                    <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-muted)]">
                      {t('common.average_short')} {formatCurrency(averageBudget)}
                    </span>
                  </>
                )}
              </div>

              {/* Budget list */}
              <div className="space-y-3 sm:space-y-4">
                {budgets.map((budget, index) => {
                  const categoryColor = categoryColorMap.get(budget.category_id ?? '') ?? '#e5a4b8'
                  const categoryName = categoryNameMap.get(budget.category_id ?? '')
                  const budgetNumber = Number(budget.limit_amount)
                  const percentageOfTotal = totalBudget > 0 ? (budgetNumber / totalBudget) * 100 : 0

                  return (
                    <div
                      key={budget.id}
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

                      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Left content */}
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
                              {formatMonthYear(budget.month, budget.year)}
                            </p>
                          </div>

                          <div className="mt-2.5 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                              <HiOutlineCurrencyDollar className="text-xs" />
                              {t('page.budgets.limit_label')}: {formatCurrency(budget.limit_amount)}
                            </span>
                            {categoryName && (
                              <span
                                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-pale)] px-2.5 py-1 text-xs font-medium"
                                style={{ color: categoryColor }}
                              >
                                <HiOutlineRectangleGroup className="text-xs" />
                                {categoryName}
                              </span>
                            )}
                            {!categoryName && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                                <HiOutlineTag className="text-xs" />
                                {t('common.no_category')}
                              </span>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div className="mt-3 flex items-center gap-3">
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-soft)]">
                              <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                  width: `${percentageOfTotal}%`,
                                  background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}bb)`,
                                }}
                              />
                            </div>
                            <span className="shrink-0 text-[11px] font-semibold text-[var(--color-text-muted)]">
                              {t('page.budgets.percent_of_total', { percent: percentageOfTotal.toFixed(1) })}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateBudget({
                                id: budget.id,
                                payload: { limit_amount: Number(budget.limit_amount) + 50 },
                              })
                            }
                            disabled={isUpdating}
                            className="flex items-center gap-2 rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] transition-all duration-200 hover:border-[var(--color-success)] hover:bg-[var(--color-success-soft)] hover:text-[var(--color-success)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <HiOutlinePencilSquare className="text-base" />
                            +$50
                          </button>
                          <ConfirmActionButton
                            icon={HiOutlineTrash}
                            label={t('page.budgets.delete_label')}
                            confirmTitle={t('page.budgets.delete_title')}
                            confirmText={t('page.budgets.delete_text')}
                            onConfirm={() => deleteBudget(budget.id)}
                            disabled={isDeleting}
                          />
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
    </div>
  )
}

export default BudgetsPage
