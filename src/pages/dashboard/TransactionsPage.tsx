import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HiOutlineArrowsRightLeft,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineTag,
  HiOutlineCalendarDays,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineChevronDown,
} from 'react-icons/hi2'
import ConfirmActionButton from '../../components/ConfirmActionButton'
import EmptyState from '../../components/EmptyState'
import PageSection from '../../components/PageSection'
import { useCategories } from '../../hooks/useCategories'
import { usePreferences } from '../../hooks/usePreferences'
import { useTransactions } from '../../hooks/useTransactions'
import { filterTransactions } from '../../utils/filters'
import { formatCurrency, formatShortDate, toDateInputValue } from '../../utils/format'
type TransactionFormValues = {
  title: string
  amount: number
  type: 'expense' | 'income'
  category_id: string
  transaction_date: string
  description: string
  tagsInput: string
}

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-[50px] w-full rounded-2xl bg-[var(--color-border)]/30" />
      ))}
      <div className="h-[50px] w-full rounded-2xl bg-[var(--color-primary-soft)]/40" />
    </div>
  )
}

function TransactionSkeleton() {
  return (
    <div className="animate-pulse rounded-[24px] border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-5 w-44 rounded-lg bg-[var(--color-border)]" />
            <div className="h-5 w-16 rounded-full bg-[var(--color-border)]/60" />
          </div>
          <div className="h-3.5 w-32 rounded-lg bg-[var(--color-border)]/60" />
          <div className="h-3.5 w-48 rounded-lg bg-[var(--color-border)]/50" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-14 rounded-full bg-[var(--color-border)]/40" />
            ))}
          </div>
          <div className="flex gap-3">
            <div className="h-4 w-28 rounded-lg bg-[var(--color-border)]/60" />
            <div className="h-4 w-20 rounded-lg bg-[var(--color-border)]/60" />
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

function TransactionsPage() {
  const { categories } = useCategories()
  const { transactions, isLoading, createTransaction, updateTransaction, deleteTransaction, isCreating, isUpdating, isDeleting } = useTransactions()
  const { dateFilter, transactionSearch, t } = usePreferences()
  const transactionSchema = z.object({
    title: z.string().min(2, t('page.transactions.validation.title')),
    amount: z.number().positive(t('page.transactions.validation.amount')),
    type: z.enum(['expense', 'income']),
    category_id: z.string(),
    transaction_date: z.string().min(1, t('page.transactions.validation.date')),
    description: z.string(),
    tagsInput: z.string(),
  })
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      amount: 0,
      type: 'expense',
      category_id: '',
      transaction_date: toDateInputValue(new Date().toISOString()),
      description: '',
      tagsInput: '#family, #work',
    },
  })
  const selectedType = useWatch({ control, name: 'type' })

  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === selectedType),
    [categories, selectedType],
  )

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  )

  const categoryColorMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.color ?? '#e5a4b8'])),
    [categories],
  )

  const visibleTransactions = useMemo(
    () => filterTransactions(transactions, dateFilter, transactionSearch),
    [dateFilter, transactionSearch, transactions],
  )

  const totalIncome = useMemo(
    () =>
      visibleTransactions
        .filter((t) => t.type === 'income')
        .reduce((s, t) => s + Number(t.amount), 0),
    [visibleTransactions],
  )

  const totalExpense = useMemo(
    () =>
      visibleTransactions
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + Number(t.amount), 0),
    [visibleTransactions],
  )

  const balance = totalIncome - totalExpense

  const onSubmit = (values: TransactionFormValues) => {
    createTransaction({
      title: values.title,
      amount: values.amount,
      type: values.type,
      category_id: values.category_id || null,
      transaction_date: values.transaction_date,
      description: values.description,
      tags: values.tagsInput
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    })
    reset({
      title: '',
      amount: 0,
      type: values.type,
      category_id: '',
      transaction_date: toDateInputValue(new Date().toISOString()),
      description: '',
      tagsInput: values.tagsInput,
    })
  }

  return (
    <div className="mobile-page space-y-4 p-2 sm:space-y-5 sm:p-3 md:space-y-6 md:p-6 lg:p-8">
      {!isLoading && visibleTransactions.length > 0 && (
        <>
          <div className="mobile-surface-card overflow-hidden rounded-[28px] p-2 sm:hidden">
            {[
              {
                label: t('page.transactions.total_income'),
                value: formatCurrency(totalIncome),
                tone: 'text-[var(--color-success)]',
              },
              {
                label: t('page.transactions.total_expenses'),
                value: formatCurrency(totalExpense),
                tone: 'text-[var(--color-danger)]',
              },
              {
                label: t('page.transactions.balance'),
                value: `${balance >= 0 ? '+' : ''}${formatCurrency(balance)}`,
                tone: balance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]',
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
            <div className="rounded-[24px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
              <p className="text-sm font-semibold text-[var(--color-text-muted)]">{t('page.transactions.total_income')}</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-success)]">{formatCurrency(totalIncome)}</p>
            </div>
            <div className="rounded-[24px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
              <p className="text-sm font-semibold text-[var(--color-text-muted)]">{t('page.transactions.total_expenses')}</p>
              <p className="mt-2 text-2xl font-extrabold text-[var(--color-danger)]">{formatCurrency(totalExpense)}</p>
            </div>
            <div className="rounded-[24px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
              <p className="text-sm font-semibold text-[var(--color-text-muted)]">{t('page.transactions.balance')}</p>
              <p
                className={`mt-2 text-2xl font-extrabold ${
                  balance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                }`}
              >
                {balance >= 0 ? '+' : ''}
                {formatCurrency(balance)}
              </p>
            </div>
          </div>
        </>
      )}

      <div className="grid items-start gap-4 sm:gap-6 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
        <PageSection
          title={t('page.transactions.form_title')}
          subtitle={t('page.transactions.form_subtitle')}
          className="xl:sticky xl:top-28 xl:order-1 order-2"
        >
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Title */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineTag className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  {...register('title')}
                  placeholder={t('page.transactions.title_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
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
                  min={0}
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  placeholder="0.00"
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
                {errors.amount && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.amount.message}
                  </p>
                )}
              </div>

              {/* Type + Category row */}
              <div className="grid gap-3 sm:grid-cols-2">
                {/* Type */}
                <div className="relative">
                  <select
                    {...register('type')}
                    className="w-full appearance-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-4 pr-8 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                  >
                    <option value="expense">{t('common.expense')}</option>
                    <option value="income">{t('common.income')}</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <HiOutlineChevronDown className="text-xs text-[var(--color-text-muted)]" />
                  </div>
                </div>

                {/* Category */}
                <div className="relative">
                  <select
                    {...register('category_id')}
                    className="w-full appearance-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-4 pr-8 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                  >
                    <option value="">{t('common.no_category')}</option>
                    {filteredCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <HiOutlineChevronDown className="text-xs text-[var(--color-text-muted)]" />
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineCalendarDays className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  type="date"
                  {...register('transaction_date')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
                {errors.transaction_date && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.transaction_date.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="group relative">
                <div className="pointer-events-none absolute left-0 top-0 flex items-start pt-3.5 pl-4">
                  <HiOutlineDocumentText className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <textarea
                  {...register('description')}
                  placeholder={t('page.transactions.description_placeholder')}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
              </div>

              {/* Tags */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineTag className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  {...register('tagsInput')}
                  placeholder="#family, #work, #travel"
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
              </div>

              {/* Type hint */}
              <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-surface-soft)] px-3 py-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    selectedType === 'expense' ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-success)]'
                  }`}
                />
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                  {t('page.transactions.type_hint_prefix')}{' '}
                  <span
                    className={
                      selectedType === 'expense'
                        ? 'text-[var(--color-danger)]'
                        : 'text-[var(--color-success)]'
                    }
                  >
                    {selectedType === 'expense' ? t('page.transactions.as_expense') : t('page.transactions.as_income')}
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
                <HiOutlineArrowsRightLeft className="relative text-lg" />
                <span className="relative">
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {t('common.saving')}
                    </span>
                  ) : (
                    t('page.transactions.add')
                  )}
                </span>
              </button>
            </form>
          )}
        </PageSection>

        {/* ───── Transaction List ───── */}
        <PageSection
          title={t('page.transactions.list_title')}
          subtitle={t('page.transactions.list_subtitle')}
          className="order-1 xl:order-2"
        >
          {isLoading ? (
            <div className="mt-5 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <TransactionSkeleton key={i} />
              ))}
            </div>
          ) : visibleTransactions.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={HiOutlineArrowsRightLeft}
                title={t('page.transactions.empty_title')}
                description={t('page.transactions.empty_description')}
              />
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="mobile-summary-bar mb-5 rounded-2xl px-4 py-3">
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                  {visibleTransactions.length} {visibleTransactions.length === 1 ? t('page.transactions.transaction_singular') : t('page.transactions.transaction_plural')}
                </span>
                <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
                  <span className="text-[var(--color-success)]">
                    {visibleTransactions.filter((t) => t.type === 'income').length} {t('common.income')}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-danger)]" />
                  <span className="text-[var(--color-danger)]">
                    {visibleTransactions.filter((t) => t.type === 'expense').length} {t('common.expense')}
                  </span>
                </span>
              </div>

              {/* Transaction list */}
              <div className="space-y-3 sm:space-y-4">
                {visibleTransactions.map((transaction, index) => {
                  const categoryColor = categoryColorMap.get(transaction.category_id ?? '') ?? '#e5a4b8'
                  return (
                    <div
                      key={transaction.id}
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

                      <div className="relative flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <span
                              className="relative inline-block h-3 w-3 rounded-full shadow-sm ring-2 ring-white/60 shrink-0"
                              style={{ backgroundColor: categoryColor }}
                            >
                              <span
                                className="absolute inset-0 animate-ping rounded-full opacity-25"
                                style={{ backgroundColor: categoryColor }}
                              />
                            </span>
                            <p className="truncate text-base font-bold text-[var(--color-text)] sm:text-lg">
                              {transaction.title}
                            </p>
                            <span
                              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
                                transaction.type === 'income'
                                  ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                                  : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
                              }`}
                            >
                              {transaction.type === 'income' ? t('common.income') : t('common.expense')}
                            </span>
                          </div>

                          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                              {categoryMap.get(transaction.category_id ?? '') ?? t('common.no_category')}
                            </span>
                            <span className="text-sm text-[var(--color-text-muted)]">&middot;</span>
                            <span
                              className={`text-sm font-extrabold ${
                                transaction.type === 'income'
                                  ? 'text-[var(--color-success)]'
                                  : 'text-[var(--color-danger)]'
                              }`}
                            >
                              {transaction.type === 'income' ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </span>
                          </div>

                          {transaction.description && (
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                              {transaction.description}
                            </p>
                          )}

                          {transaction.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {transaction.tags.map((tag) => (
                                <span
                                  key={`${transaction.id}-${tag}`}
                                  className="inline-flex items-center gap-1 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary-pale)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-primary)] transition-all duration-200 hover:bg-[var(--color-primary)]/10"
                                >
                                  <HiOutlineTag className="text-[10px]" />
                                  {tag.startsWith('#') ? tag : `#${tag}`}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)]">
                            <HiOutlineCalendarDays className="text-sm" />
                            {formatShortDate(transaction.transaction_date)}
                          </div>
                        </div>

                        <div className="flex shrink-0 justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateTransaction({
                                id: transaction.id,
                                payload: {
                                  description: `${transaction.description || ''} (updated)`,
                                },
                              })
                            }
                            className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-pale)] hover:text-[var(--color-primary)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--color-border)]/70 disabled:hover:bg-transparent disabled:hover:text-[var(--color-text-muted)]"
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </button>
                          <ConfirmActionButton
                            icon={HiOutlineTrash}
                            label={t('page.transactions.delete_label')}
                            confirmTitle={t('page.transactions.delete_title')}
                            confirmText={t('page.transactions.delete_text', { title: transaction.title })}
                            onConfirm={() => deleteTransaction(transaction.id)}
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

export default TransactionsPage
