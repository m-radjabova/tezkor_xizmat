import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HiOutlineArrowPathRoundedSquare,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
  HiOutlineTag,
  HiOutlineChevronDown,
  HiOutlineBanknotes,
  HiOutlineClock,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'
import ConfirmActionButton from '../../components/ConfirmActionButton'
import EmptyState from '../../components/EmptyState'
import PageSection from '../../components/PageSection'
import { useCategories } from '../../hooks/useCategories'
import { usePreferences } from '../../hooks/usePreferences'
import { useRecurringTransactions } from '../../hooks/useRecurringTransactions'
import { formatCurrency, toDateInputValue } from '../../utils/format'
type RecurringFormValues = {
  title: string
  amount: number
  type: 'expense' | 'income'
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  category_id: string
  start_date: string
  end_date: string
}

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div key={i} className="h-[50px] w-full rounded-2xl bg-[var(--color-border)]/30" />
      ))}
      <div className="h-[50px] w-full rounded-2xl bg-[var(--color-primary-soft)]/40" />
    </div>
  )
}

function ItemSkeleton() {
  return (
    <div className="animate-pulse rounded-[24px] border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-5 w-40 rounded-lg bg-[var(--color-border)]" />
            <div className="h-6 w-16 rounded-full bg-[var(--color-border)]/40" />
          </div>
          <div className="h-3.5 w-36 rounded-lg bg-[var(--color-border)]/60" />
          <div className="h-4 w-24 rounded-lg bg-[var(--color-border)]/50" />
        </div>
        <div className="flex gap-2">
          <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/40" />
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

function RecurringTransactionsPage() {
  const { t } = usePreferences()
  const { categories } = useCategories()
  const { recurringTransactions, isLoading, createRecurringTransaction, updateRecurringTransaction, deleteRecurringTransaction, isCreating, isUpdating, isDeleting } = useRecurringTransactions()
  const recurringSchema = z.object({
    title: z.string().min(2, t('page.recurring.validation.title')),
    amount: z.number().positive(t('page.recurring.validation.amount')),
    type: z.enum(['expense', 'income']),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    category_id: z.string(),
    start_date: z.string().min(1, t('page.recurring.validation.start_date')),
    end_date: z.string(),
  })
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RecurringFormValues>({
    resolver: zodResolver(recurringSchema),
    defaultValues: {
      title: '',
      amount: 0,
      type: 'expense',
      frequency: 'monthly',
      category_id: '',
      start_date: toDateInputValue(new Date().toISOString()),
      end_date: '',
    },
  })
  const selectedType = useWatch({ control, name: 'type' })
  const watchedAmount = useWatch({ control, name: 'amount' })
  const watchedFrequency = useWatch({ control, name: 'frequency' })

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === selectedType),
    [categories, selectedType],
  )

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  )

  const activeCount = useMemo(
    () => recurringTransactions.filter((item) => item.is_active).length,
    [recurringTransactions],
  )

  const totalMonthly = useMemo(() => {
    return recurringTransactions.reduce((sum, item) => {
      const amount = Number(item.amount)
      if (!item.is_active) return sum
      switch (item.frequency) {
        case 'daily': return sum + amount * 30
        case 'weekly': return sum + amount * 4.33
        case 'monthly': return sum + amount
        case 'yearly': return sum + amount / 12
        default: return sum
      }
    }, 0)
  }, [recurringTransactions])

  const onSubmit = (values: RecurringFormValues) => {
    createRecurringTransaction({
      title: values.title,
      amount: values.amount,
      type: values.type,
      frequency: values.frequency,
      category_id: values.category_id || null,
      start_date: values.start_date,
      end_date: values.end_date || null,
      is_active: true,
    })
    reset({
      title: '',
      amount: 0,
      type: values.type,
      frequency: values.frequency,
      category_id: '',
      start_date: toDateInputValue(new Date().toISOString()),
      end_date: '',
    })
  }

  return (
    <div className="space-y-6 p-3 md:p-5">
      

      {/* Summary cards */}
      {isLoading ? (
        <SummarySkeleton />
      ) : recurringTransactions.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-primary)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.recurring.total_recurring')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-primary)]">
              {recurringTransactions.length}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-success)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('common.active')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-success)]">
              {activeCount} <span className="text-base font-semibold text-[var(--color-text-muted)]">/ {recurringTransactions.length}</span>
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-purple)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.recurring.monthly_total')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-purple)]">
              {formatCurrency(totalMonthly)}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* ───── Form ───── */}
        <PageSection title={t('page.recurring.form_title')} subtitle={t('page.recurring.form_subtitle')}>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Title */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineSparkles className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  {...register('title')}
                  placeholder={t('page.recurring.title_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                />
                {errors.title && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineCurrencyDollar className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  placeholder={t('page.recurring.amount_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                />
                {errors.amount && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Type */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineBanknotes className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <select
                  {...register('type')}
                  className="w-full appearance-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-10 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                >
                  <option value="expense">{t('common.expense')}</option>
                  <option value="income">{t('common.income')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <HiOutlineChevronDown className="text-sm text-[var(--color-text-muted)]" />
                </div>
              </div>

              {/* Frequency */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineClock className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <select
                  {...register('frequency')}
                  className="w-full appearance-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-10 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                >
                  <option value="daily">{t('common.daily')}</option>
                  <option value="weekly">{t('common.weekly')}</option>
                  <option value="monthly">{t('common.monthly')}</option>
                  <option value="yearly">{t('common.yearly')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <HiOutlineChevronDown className="text-sm text-[var(--color-text-muted)]" />
                </div>
              </div>

              {/* Category */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineTag className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <select
                  {...register('category_id')}
                  className="w-full appearance-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-10 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                >
                  <option value="">{t('common.no_category')}</option>
                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <HiOutlineChevronDown className="text-sm text-[var(--color-text-muted)]" />
                </div>
              </div>

              {/* Start date */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineCalendarDays className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  type="date"
                  {...register('start_date')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                />
                {errors.start_date && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.start_date.message}
                  </p>
                )}
              </div>

              {/* End date */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineCalendarDays className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  type="date"
                  {...register('end_date')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                />
              </div>

              {/* Live preview */}
              {watchedAmount > 0 && (
                <div className="rounded-2xl bg-[var(--color-primary-pale)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--color-primary)]">{t('page.recurring.preview')}</span>
                    <span className="text-xs font-bold text-[var(--color-primary)]">
                      {watchedFrequency === 'daily' && t('page.recurring.every_day')}
                      {watchedFrequency === 'weekly' && t('page.recurring.every_week')}
                      {watchedFrequency === 'monthly' && t('page.recurring.every_month')}
                      {watchedFrequency === 'yearly' && t('page.recurring.every_year')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-[var(--color-primary)]">
                    {formatCurrency(watchedAmount || 0)} / {watchedFrequency}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-[var(--color-primary)]/70">
                    {selectedType === 'expense' ? t('common.expense') : t('common.income')} &middot;{' '}
                    ~{formatCurrency(
                      watchedFrequency === 'daily' ? (watchedAmount || 0) * 30 :
                      watchedFrequency === 'weekly' ? (watchedAmount || 0) * 4.33 :
                      watchedFrequency === 'yearly' ? (watchedAmount || 0) / 12 :
                      (watchedAmount || 0)
                    )} / {t('common.month_lc')}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isCreating}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--color-primary)] px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--color-primary-soft)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 disabled:opacity-70 disabled:hover:shadow-none"
              >
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <HiOutlineArrowPathRoundedSquare className="relative text-lg" />
                <span className="relative">
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {t('common.saving')}
                    </span>
                  ) : (
                    t('page.recurring.add')
                  )}
                </span>
              </button>
            </form>
          )}
        </PageSection>

        {/* ───── Recurring List ───── */}
        <PageSection title={t('page.recurring.list_title')} subtitle={t('page.recurring.list_subtitle')}>
          {isLoading ? (
            <div className="mt-5 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <ItemSkeleton key={i} />
              ))}
            </div>
          ) : recurringTransactions.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={HiOutlineArrowPathRoundedSquare}
                title={t('page.recurring.empty_title')}
                description={t('page.recurring.empty_description')}
              />
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--color-surface-soft)] px-4 py-3">
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                  {recurringTransactions.length} {recurringTransactions.length === 1 ? t('common.item') : t('common.items')}
                </span>
                <span className="h-3 w-px bg-[var(--color-border)]" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <HiOutlineCheckCircle className="text-sm text-[var(--color-success)]" />
                  <span className="text-[var(--color-success)]">{activeCount} {t('common.active_lc')}</span>
                </span>
                <span className="h-3 w-px bg-[var(--color-border)]" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <HiOutlineBanknotes className="text-sm text-[var(--color-purple)]" />
                  <span className="text-[var(--color-purple)]">{formatCurrency(totalMonthly)} / {t('common.month_lc')}</span>
                </span>
              </div>

              {/* Recurring list */}
              <div className="space-y-4">
                {recurringTransactions.map((item, index) => {
                  const isExpense = item.type === 'expense'
                  const accentColor = isExpense ? 'var(--color-danger)' : 'var(--color-success)'
                  const accentSoft = isExpense ? 'var(--color-danger-soft)' : 'var(--color-success-soft)'

                  return (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-[24px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:border-[var(--color-border-strong)]/70"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {/* Gradient accent */}
                      <div
                        className="absolute inset-x-0 top-0 h-0.5 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88, transparent)`,
                        }}
                      />

                      <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        {/* Left content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <p className="truncate text-lg font-bold text-[var(--color-text)]">{item.title}</p>
                            <span
                              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                                item.is_active
                                  ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                                  : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
                              }`}
                            >
                              <span
                                className={`inline-block h-1.5 w-1.5 rounded-full ${
                                  item.is_active ? 'bg-[var(--color-success)]' : 'bg-[var(--color-danger)]'
                                }`}
                              />
                              {item.is_active ? t('common.active') : t('common.inactive')}
                            </span>
                          </div>

                          <div className="mt-2.5 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                              <HiOutlineCurrencyDollar className="text-xs" />
                              {formatCurrency(item.amount)}
                            </span>
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: accentSoft,
                                color: accentColor,
                              }}
                            >
                              <HiOutlineBanknotes className="text-xs" />
                              {item.type === 'expense' ? t('common.expense') : t('common.income')}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                              <HiOutlineClock className="text-xs" />
                              {t(`common.${item.frequency}`)}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-pale)] px-2.5 py-1 text-xs font-medium text-[var(--color-primary)]">
                              <HiOutlineTag className="text-xs" />
                              {categoryMap.get(item.category_id ?? '') ?? t('common.no_category')}
                            </span>
                          </div>

                          {/* Dates */}
                          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-[var(--color-text-muted)]">
                            <span className="flex items-center gap-1">
                              <HiOutlineCalendarDays className="text-sm" />
                              {t('common.from')} {item.start_date}
                            </span>
                            {item.end_date && (
                              <span className="flex items-center gap-1">
                                <HiOutlineCalendarDays className="text-sm" />
                                {t('common.to')} {item.end_date}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => updateRecurringTransaction({ id: item.id, payload: { is_active: !item.is_active } })}
                            className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
                              item.is_active
                                ? 'border-[var(--color-border)]/70 bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)]'
                                : 'border-[var(--color-success)]/30 bg-[var(--color-success-soft)] text-[var(--color-success)] hover:bg-[var(--color-success)] hover:text-white'
                            }`}
                          >
                            <HiOutlinePencilSquare className="text-base" />
                            {item.is_active ? t('common.deactivate') : t('common.activate')}
                          </button>
                          <ConfirmActionButton
                            icon={HiOutlineTrash}
                            label={t('page.recurring.delete_label')}
                            confirmTitle={t('page.recurring.delete_title')}
                            confirmText={t('page.recurring.delete_text', { title: item.title })}
                            onConfirm={() => deleteRecurringTransaction(item.id)}
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

export default RecurringTransactionsPage
