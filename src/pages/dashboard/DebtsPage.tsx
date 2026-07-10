import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HiOutlineCreditCard,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineFlag,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineSparkles,
} from 'react-icons/hi2'
import ConfirmActionButton from '../../components/ConfirmActionButton'
import EmptyState from '../../components/EmptyState'
import PageSection from '../../components/PageSection'
import { useDebts } from '../../hooks/useDebts'
import { usePreferences } from '../../hooks/usePreferences'
import { formatCurrency, formatShortDate } from '../../utils/format'
type DebtFormValues = {
  title: string
  total_amount: number
  paid_amount: number
  minimum_payment: number
  due_date: string
}

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-[50px] w-full rounded-2xl bg-[var(--color-border)]/30" />
      ))}
      <div className="h-[50px] w-full rounded-2xl bg-[var(--color-danger-soft)]/40" />
    </div>
  )
}

function DebtSkeleton() {
  return (
    <div className="animate-pulse rounded-[24px] border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[var(--color-border)]/40" />
            <div className="flex-1 space-y-1.5">
              <div className="h-5 w-36 rounded-lg bg-[var(--color-border)]" />
              <div className="h-3.5 w-28 rounded-lg bg-[var(--color-border)]/60" />
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-[var(--color-border)]/30" />
          <div className="flex justify-between">
            <div className="h-3 w-20 rounded-lg bg-[var(--color-border)]/50" />
            <div className="h-3 w-16 rounded-lg bg-[var(--color-border)]/50" />
          </div>
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

function DebtsPage() {
  const { t } = usePreferences()
  const { debts, isLoading, createDebt, updateDebt, deleteDebt, isCreating, isUpdating, isDeleting } = useDebts()
  const debtSchema = z.object({
    title: z.string().min(2, t('page.debts.validation.title')),
    total_amount: z.number().positive(t('page.debts.validation.total')),
    paid_amount: z.number().min(0, t('page.debts.validation.paid')),
    minimum_payment: z.number().min(0, t('page.debts.validation.minimum')),
    due_date: z.string(),
  })
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      title: '',
      total_amount: 0,
      paid_amount: 0,
      minimum_payment: 0,
      due_date: '',
    },
  })

  const watchedTotal = useWatch({ control, name: 'total_amount' })
  const watchedPaid = useWatch({ control, name: 'paid_amount' })

  const liveProgress = useMemo(() => {
    if (watchedTotal > 0) {
      return Math.min(100, Math.round((watchedPaid / watchedTotal) * 100))
    }
    return 0
  }, [watchedTotal, watchedPaid])

  const totalDebt = useMemo(
    () => debts.reduce((sum, d) => sum + Number(d.total_amount), 0),
    [debts],
  )

  const totalPaid = useMemo(
    () => debts.reduce((sum, d) => sum + Number(d.paid_amount), 0),
    [debts],
  )

  const overallProgress = useMemo(
    () => (totalDebt > 0 ? Math.min(100, Math.round((totalPaid / totalDebt) * 100)) : 0),
    [totalDebt, totalPaid],
  )

  const activeDebts = useMemo(
    () => debts.filter((d) => d.status === 'active').length,
    [debts],
  )

  const paidDebts = useMemo(
    () => debts.filter((d) => d.status === 'paid').length,
    [debts],
  )

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false
    const due = new Date(dueDate)
    const today = new Date()
    return due < today
  }

  const onSubmit = (values: DebtFormValues) => {
    createDebt({
      title: values.title,
      total_amount: values.total_amount,
      paid_amount: values.paid_amount,
      minimum_payment: values.minimum_payment || null,
      due_date: values.due_date || null,
      status: values.paid_amount >= values.total_amount ? 'paid' : 'active',
    })
    reset()
  }

  return (
    <div className="mobile-page space-y-4 p-2 sm:space-y-5 sm:p-3 md:space-y-6 md:p-6 lg:p-8">
      

      {/* Summary cards */}
      {isLoading ? (
        <SummarySkeleton />
      ) : debts.length > 0 ? (
        <>
          <div className="mobile-surface-card overflow-hidden rounded-[28px] p-2 md:hidden">
            {[
              { label: t('page.debts.total_debt'), value: formatCurrency(totalDebt), tone: 'text-[var(--color-danger)]' },
              { label: t('common.active'), value: String(activeDebts), tone: 'text-[var(--color-warning)]' },
              { label: t('page.debts.paid_off'), value: String(paidDebts), tone: 'text-[var(--color-success)]' },
            ].map((item, index, list) => (
              <div key={item.label} className={`px-3 py-3 ${index < list.length - 1 ? 'border-b border-[var(--color-border)]/70' : ''}`}>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{item.label}</p>
                <p className={`mt-1 text-xl font-extrabold tracking-tight ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-danger)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.debts.total_debt')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-danger)]">
              {formatCurrency(totalDebt)}
            </p>
            <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-soft)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-danger-soft)] transition-all duration-700 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="relative mt-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
              {t('page.debts.paid_progress', { paid: formatCurrency(totalPaid), percent: overallProgress })}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-warning)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('common.active')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-warning)]">
              {activeDebts}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-success)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.debts.paid_off')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-success)]">
              {paidDebts}
            </p>
          </div>
          </div>
        </>
      ) : null}

      <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
        {/* ───── Form ───── */}
        <PageSection title={t('page.debts.form_title')} subtitle={t('page.debts.form_subtitle')}>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Title */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineSparkles className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-danger)]" />
                </div>
                <input
                  {...register('title')}
                  placeholder={t('page.debts.title_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-danger)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
                />
                {errors.title && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Total amount */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineBanknotes className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-danger)]" />
                </div>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  {...register('total_amount', { valueAsNumber: true })}
                  placeholder={t('page.debts.total_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-danger)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
                />
                {errors.total_amount && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.total_amount.message}
                  </p>
                )}
              </div>

              {/* Paid amount */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineCurrencyDollar className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-danger)]" />
                </div>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  {...register('paid_amount', { valueAsNumber: true })}
                  placeholder={t('page.debts.paid_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-danger)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
                />
                {errors.paid_amount && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.paid_amount.message}
                  </p>
                )}
              </div>

              {/* Minimum payment */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineFlag className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-danger)]" />
                </div>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  {...register('minimum_payment', { valueAsNumber: true })}
                  placeholder={t('page.debts.minimum_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-danger)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
                />
                {errors.minimum_payment && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.minimum_payment.message}
                  </p>
                )}
              </div>

              {/* Due date */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineCalendarDays className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-danger)]" />
                </div>
                <input
                  type="date"
                  {...register('due_date')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-danger)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]"
                />
              </div>

              {/* Live preview */}
              {watchedTotal > 0 && (
                <div className="rounded-2xl bg-[var(--color-danger-soft)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--color-danger)]">{t('page.debts.preview')}</span>
                    <span className="text-xs font-bold text-[var(--color-danger)]">{liveProgress}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--color-danger)] to-[var(--color-danger-soft)] transition-all duration-500 ease-out"
                      style={{ width: `${liveProgress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] font-medium text-[var(--color-danger)]">
                    {t('page.debts.preview_amount', { paid: formatCurrency(watchedPaid || 0), total: formatCurrency(watchedTotal) })}
                  </p>
                  {watchedPaid >= watchedTotal && watchedTotal > 0 && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-[var(--color-success)]">
                      <HiOutlineCheckCircle className="text-xs" />
                      {t('page.debts.fully_paid')}
                    </p>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isCreating}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--color-danger)] px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)] hover:shadow-lg hover:shadow-[var(--color-danger)]/20 disabled:opacity-70 disabled:hover:shadow-none"
              >
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <HiOutlineCreditCard className="relative text-lg" />
                <span className="relative">
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {t('common.saving')}
                    </span>
                  ) : (
                    t('page.debts.add')
                  )}
                </span>
              </button>
            </form>
          )}
        </PageSection>

        {/* ───── Debt List ───── */}
        <PageSection title={t('page.debts.list_title')} subtitle={t('page.debts.list_subtitle')}>
          {isLoading ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <DebtSkeleton key={i} />
              ))}
            </div>
          ) : debts.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={HiOutlineCreditCard}
                title={t('page.debts.empty_title')}
                description={t('page.debts.empty_description')}
              />
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="mobile-summary-bar mb-5 rounded-2xl px-4 py-3">
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                  {debts.length} {debts.length === 1 ? t('page.debts.debt_singular') : t('page.debts.debt_plural')}
                </span>
                <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <HiOutlineBanknotes className="text-sm text-[var(--color-danger)]" />
                  <span className="text-[var(--color-danger)]">{formatCurrency(totalDebt)} {t('common.total')}</span>
                </span>
                <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <HiOutlineCheckCircle className="text-sm text-[var(--color-success)]" />
                  <span className="text-[var(--color-success)]">{paidDebts} {t('common.paid')}</span>
                </span>
              </div>

              {/* Debt grid */}
              <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                {debts.map((debt, index) => {
                  const total = Number(debt.total_amount)
                  const paid = Number(debt.paid_amount)
                  const progress = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0
                  const isPaid = debt.status === 'paid'
                  const remaining = Math.max(0, total - paid)
                  const overdue = !isPaid && isOverdue(debt.due_date)

                  return (
                    <div
                      key={debt.id}
                      className={`group relative overflow-hidden rounded-[26px] border p-4 shadow-sm transition-all duration-300 hover:shadow-[var(--shadow-card)] sm:p-5 ${
                        isPaid
                          ? 'border-[var(--color-success)]/50 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-success-soft)]'
                          : overdue
                            ? 'border-[var(--color-danger)]/40 bg-[var(--color-surface)] hover:border-[var(--color-danger)]/60'
                            : 'border-[var(--color-border)]/70 bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]/70'
                      }`}
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {/* Gradient accent */}
                      <div
                        className="absolute inset-x-0 top-0 h-0.5 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: isPaid
                            ? 'linear-gradient(90deg, var(--color-success), var(--color-success-soft), transparent)'
                            : overdue
                              ? 'linear-gradient(90deg, var(--color-danger), var(--color-danger-soft), transparent)'
                              : 'linear-gradient(90deg, var(--color-warning), var(--color-warning-soft), transparent)',
                        }}
                      />

                      {/* Paid badge */}
                      {isPaid && (
                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[var(--color-success)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                          <HiOutlineCheckCircle className="text-xs" />
                          {t('common.paid')}
                        </div>
                      )}

                      {/* Overdue badge */}
                      {overdue && (
                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[var(--color-danger)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                          <HiOutlineExclamationCircle className="text-xs" />
                          {t('common.overdue')}
                        </div>
                      )}

                      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        {/* Left */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                                isPaid
                                  ? 'bg-[var(--color-success-soft)]'
                                  : overdue
                                    ? 'bg-[var(--color-danger-soft)]'
                                    : 'bg-[var(--color-warning-soft)]'
                              }`}
                            >
                              <HiOutlineCreditCard
                                className={`text-lg ${
                                  isPaid
                                    ? 'text-[var(--color-success)]'
                                    : overdue
                                      ? 'text-[var(--color-danger)]'
                                      : 'text-[var(--color-warning)]'
                                }`}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-base font-bold text-[var(--color-text)] sm:text-lg">
                                {debt.title}
                              </p>
                              <p className="text-sm text-[var(--color-text-muted)]">
                                {formatCurrency(paid)} / {formatCurrency(total)}
                              </p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="mt-4">
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-soft)]">
                              <div
                                className="h-full rounded-full transition-all duration-700 ease-out"
                                style={{
                                  width: `${progress}%`,
                                  background: isPaid
                                    ? 'linear-gradient(90deg, var(--color-success), var(--color-success-soft))'
                                    : overdue
                                      ? 'linear-gradient(90deg, var(--color-danger), var(--color-danger-soft))'
                                      : 'linear-gradient(90deg, var(--color-warning), var(--color-warning-soft))',
                                }}
                              />
                            </div>
                            <div className="mt-1.5 flex items-center justify-between">
                              <span
                                className={`text-xs font-bold ${
                                  isPaid
                                    ? 'text-[var(--color-success)]'
                                    : overdue
                                      ? 'text-[var(--color-danger)]'
                                      : 'text-[var(--color-warning)]'
                                }`}
                              >
                                {progress}%
                              </span>
                              {!isPaid && (
                                <span className="text-[11px] font-medium text-[var(--color-text-muted)]">
                                  {formatCurrency(remaining)} {t('common.left')}
                                </span>
                              )}
                              {isPaid && (
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-success)]">
                                  <HiOutlineCheckCircle className="text-xs" />
                                  {t('page.debts.fully_paid')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Meta info */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {debt.minimum_payment && Number(debt.minimum_payment) > 0 && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-muted)]">
                                <HiOutlineFlag className="text-xs" />
                                {t('page.debts.min_payment')} {formatCurrency(debt.minimum_payment)}
                              </span>
                            )}
                            {debt.due_date && (
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                  overdue
                                    ? 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
                                    : 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]'
                                }`}
                              >
                                <HiOutlineCalendarDays className="text-xs" />
                                {t('common.due')} {formatShortDate(debt.due_date)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 gap-1.5 xl:flex-col">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateDebt({
                                id: debt.id,
                                payload: { paid_amount: paid + 50 },
                              })
                            }
                            className={`flex h-[42px] w-[42px] items-center justify-center rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface)] transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
                              isPaid
                                ? 'text-[var(--color-success)] hover:border-[var(--color-success)] hover:bg-[var(--color-success-soft)]'
                                : 'text-[var(--color-text-muted)] hover:border-[var(--color-warning)] hover:bg-[var(--color-warning-soft)] hover:text-[var(--color-warning)]'
                            }`}
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </button>
                          <ConfirmActionButton
                            icon={HiOutlineTrash}
                            label={t('page.debts.delete_label')}
                            confirmTitle={t('page.debts.delete_title')}
                            confirmText={t('page.debts.delete_text', { title: debt.title })}
                            onConfirm={() => deleteDebt(debt.id)}
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

export default DebtsPage
