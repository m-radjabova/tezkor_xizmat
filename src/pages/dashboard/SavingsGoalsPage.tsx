import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HiOutlineFlag,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
  HiOutlineCheck,
  HiOutlineTrophy,
  HiOutlineSparkles,
} from 'react-icons/hi2'
import ConfirmActionButton from '../../components/ConfirmActionButton'
import EmptyState from '../../components/EmptyState'
import PageSection from '../../components/PageSection'
import { useSavingsGoals } from '../../hooks/useSavingsGoals'
import { usePreferences } from '../../hooks/usePreferences'
import { formatCurrency, formatShortDate } from '../../utils/format'
type SavingsGoalFormValues = {
  title: string
  target_amount: number
  current_amount: number
  deadline: string
}

const GOAL_COLORS = [
  '#b08ad9', '#e5a4b8', '#5d8f75', '#d39a62',
  '#79c49f', '#f4a6a6', '#a6c4d9', '#d9a6c4',
]

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-[50px] w-full rounded-2xl bg-[var(--color-border)]/30" />
      ))}
      <div className="h-[50px] w-full rounded-2xl bg-[var(--color-primary-soft)]/40" />
    </div>
  )
}

function GoalSkeleton() {
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

function SavingsGoalsPage() {
  const { t } = usePreferences()
  const { savingsGoals, isLoading, createSavingsGoal, updateSavingsGoal, deleteSavingsGoal, isCreating, isUpdating, isDeleting } = useSavingsGoals()
  const savingsGoalSchema = z.object({
    title: z.string().min(2, t('page.savings.validation.title')),
    target_amount: z.number().positive(t('page.savings.validation.target')),
    current_amount: z.number().min(0, t('page.savings.validation.current')),
    deadline: z.string(),
  })
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SavingsGoalFormValues>({
    resolver: zodResolver(savingsGoalSchema),
    defaultValues: {
      title: '',
      target_amount: 0,
      current_amount: 0,
      deadline: '',
    },
  })

  const watchedTarget = useWatch({ control, name: 'target_amount' })
  const watchedCurrent = useWatch({ control, name: 'current_amount' })

  const liveProgress = useMemo(() => {
    if (watchedTarget > 0) {
      return Math.min(100, Math.round((watchedCurrent / watchedTarget) * 100))
    }
    return 0
  }, [watchedTarget, watchedCurrent])

  const totalSaved = useMemo(
    () => savingsGoals.reduce((s, g) => s + Number(g.current_amount), 0),
    [savingsGoals],
  )

  const totalTarget = useMemo(
    () => savingsGoals.reduce((s, g) => s + Number(g.target_amount), 0),
    [savingsGoals],
  )

  const overallProgress = useMemo(
    () => (totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0),
    [totalSaved, totalTarget],
  )

  const completedGoals = useMemo(
    () => savingsGoals.filter((g) => Number(g.current_amount) >= Number(g.target_amount)).length,
    [savingsGoals],
  )

  const onSubmit = (values: SavingsGoalFormValues) => {
    createSavingsGoal({
      title: values.title,
      target_amount: values.target_amount,
      current_amount: values.current_amount,
      deadline: values.deadline || null,
    })
    reset()
  }

  return (
    <div className="mobile-page space-y-4 p-2 sm:space-y-5 sm:p-3 md:space-y-6 md:p-6 lg:p-8">
      

      {/* Summary cards */}
      {isLoading ? (
        <SummarySkeleton />
      ) : savingsGoals.length > 0 ? (
        <>
          <div className="mobile-surface-card overflow-hidden rounded-[28px] p-2 md:hidden">
            {[
              { label: t('page.savings.total_saved'), value: formatCurrency(totalSaved), tone: 'text-[var(--color-purple)]' },
              { label: t('page.savings.active_goals'), value: String(savingsGoals.length), tone: 'text-[var(--color-primary)]' },
              { label: t('page.savings.completed'), value: String(completedGoals), tone: 'text-[var(--color-success)]' },
            ].map((item, index, list) => (
              <div key={item.label} className={`px-3 py-3 ${index < list.length - 1 ? 'border-b border-[var(--color-border)]/70' : ''}`}>
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{item.label}</p>
                <p className={`mt-1 text-xl font-extrabold tracking-tight ${item.tone}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-purple)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.savings.total_saved')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-purple)]">
              {formatCurrency(totalSaved)}
            </p>
            <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-soft)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-purple-soft)] transition-all duration-700 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="relative mt-1.5 text-xs font-semibold text-[var(--color-text-muted)]">
              {t('page.savings.target_progress', { percent: overallProgress, target: formatCurrency(totalTarget) })}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-primary)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.savings.active_goals')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-primary)]">
              {savingsGoals.length}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-success)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.savings.completed')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-success)]">
              {completedGoals}
            </p>
          </div>
          </div>
        </>
      ) : null}

      <div className="grid items-start gap-4 sm:gap-6 lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
        {/* ───── Form ───── */}
        <PageSection title={t('page.savings.form_title')} subtitle={t('page.savings.form_subtitle')}>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Title */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineFlag className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  {...register('title')}
                  placeholder={t('page.savings.title_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
                {errors.title && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Target amount */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineCurrencyDollar className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  {...register('target_amount', { valueAsNumber: true })}
                  placeholder={t('page.savings.target_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
                {errors.target_amount && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.target_amount.message}
                  </p>
                )}
              </div>

              {/* Current amount */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineSparkles className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  {...register('current_amount', { valueAsNumber: true })}
                  placeholder={t('page.savings.current_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
                {errors.current_amount && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.current_amount.message}
                  </p>
                )}
              </div>

              {/* Deadline */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineCalendarDays className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  type="date"
                  {...register('deadline')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
              </div>

              {/* Live progress preview */}
              {watchedTarget > 0 && (
                <div className="rounded-2xl bg-[var(--color-purple-soft)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--color-purple)]">{t('page.savings.preview')}</span>
                    <span className="text-xs font-bold text-[var(--color-purple)]">{liveProgress}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/60">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-purple-soft)] transition-all duration-500 ease-out"
                      style={{ width: `${liveProgress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] font-medium text-[var(--color-purple)]">
                    {t('page.savings.preview_amount', { current: formatCurrency(watchedCurrent || 0), target: formatCurrency(watchedTarget) })}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isCreating}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--color-purple)] px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--color-purple-soft)] hover:text-[var(--color-purple)] hover:shadow-lg hover:shadow-[var(--color-purple)]/20 disabled:opacity-70 disabled:hover:shadow-none"
              >
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <HiOutlineFlag className="relative text-lg" />
                <span className="relative">
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {t('common.saving')}
                    </span>
                  ) : (
                    t('page.savings.add')
                  )}
                </span>
              </button>
            </form>
          )}
        </PageSection>

        {/* ───── Goals List ───── */}
        <PageSection title={t('page.savings.list_title')} subtitle={t('page.savings.list_subtitle')}>
          {isLoading ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <GoalSkeleton key={i} />
              ))}
            </div>
          ) : savingsGoals.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={HiOutlineFlag}
                title={t('page.savings.empty_title')}
                description={t('page.savings.empty_description')}
              />
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="mobile-summary-bar mb-5 rounded-2xl px-4 py-3">
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                  {savingsGoals.length} {savingsGoals.length === 1 ? t('page.savings.goal_singular') : t('page.savings.goal_plural')}
                </span>
                <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <HiOutlineCurrencyDollar className="text-sm text-[var(--color-purple)]" />
                  <span className="text-[var(--color-purple)]">{formatCurrency(totalSaved)} {t('common.saved')}</span>
                </span>
                {completedGoals > 0 && (
                  <>
                    <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      <HiOutlineTrophy className="text-sm text-[var(--color-success)]" />
                      <span className="text-[var(--color-success)]">{completedGoals} {t('common.completed')}</span>
                    </span>
                  </>
                )}
              </div>

              {/* Goals grid */}
              <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
                {savingsGoals.map((goal, index) => {
                  const target = Number(goal.target_amount)
                  const current = Number(goal.current_amount)
                  const progress = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0
                  const isCompleted = current >= target
                  const remaining = Math.max(0, target - current)
                  const goalColor = GOAL_COLORS[index % GOAL_COLORS.length]

                  return (
                    <div
                      key={goal.id}
                      className={`group relative overflow-hidden rounded-[26px] border p-4 shadow-sm transition-all duration-300 hover:shadow-[var(--shadow-card)] sm:p-5 ${
                        isCompleted
                          ? 'border-[var(--color-success)]/50 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-success-soft)]'
                          : 'border-[var(--color-border)]/70 bg-[var(--color-surface)] hover:border-[var(--color-border-strong)]/70'
                      }`}
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {/* Gradient accent */}
                      <div
                        className="absolute inset-x-0 top-0 h-0.5 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: `linear-gradient(90deg, ${goalColor}, ${goalColor}88, transparent)`,
                        }}
                      />

                      {/* Completed badge */}
                      {isCompleted && (
                        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[var(--color-success)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                          <HiOutlineCheck className="text-xs" />
                          {t('common.done')}
                        </div>
                      )}

                      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        {/* Left */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                              style={{ backgroundColor: `${goalColor}20` }}
                            >
                              <HiOutlineFlag className="text-lg" style={{ color: goalColor }} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-base font-bold text-[var(--color-text)] sm:text-lg">
                                {goal.title}
                              </p>
                              <p className="text-sm text-[var(--color-text-muted)]">
                                {formatCurrency(current)} / {formatCurrency(target)}
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
                                  background: isCompleted
                                    ? 'linear-gradient(90deg, var(--color-success), var(--color-success-soft))'
                                    : `linear-gradient(90deg, ${goalColor}, ${goalColor}bb)`,
                                }}
                              />
                            </div>
                            <div className="mt-1.5 flex items-center justify-between">
                              <span className="text-xs font-bold" style={{ color: goalColor }}>
                                {progress}%
                              </span>
                              {!isCompleted && (
                                <span className="text-[11px] font-medium text-[var(--color-text-muted)]">
                                  {formatCurrency(remaining)} {t('common.left')}
                                </span>
                              )}
                              {isCompleted && (
                                <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-success)]">
                                  <HiOutlineTrophy className="text-xs" />
                                  {t('page.savings.goal_achieved')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Deadline */}
                          {goal.deadline && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-muted)]">
                              <HiOutlineCalendarDays className="text-sm" />
                              {t('common.due')} {formatShortDate(goal.deadline)}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 justify-end gap-1.5 xl:flex-col">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateSavingsGoal({
                                id: goal.id,
                                payload: { current_amount: current + 100 },
                              })
                            }
                            className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-all duration-200 hover:border-[var(--color-purple)] hover:bg-[var(--color-purple-soft)] hover:text-[var(--color-purple)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </button>
                          <ConfirmActionButton
                            icon={HiOutlineTrash}
                            label={t('page.savings.delete_label')}
                            confirmTitle={t('page.savings.delete_title')}
                            confirmText={t('page.savings.delete_text', { title: goal.title })}
                            onConfirm={() => deleteSavingsGoal(goal.id)}
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

export default SavingsGoalsPage
