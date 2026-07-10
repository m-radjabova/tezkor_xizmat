import { useMemo, useEffect, useRef, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import {
  HiOutlineArrowTrendingDown,
  HiOutlineArrowTrendingUp,
  HiOutlineBellAlert,
  HiOutlineBanknotes,
  HiOutlineBars3,
  HiOutlineChartBarSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineChevronRight,
  HiOutlineSparkles,
  HiOutlineWallet,
  HiOutlineFire,
  HiOutlineShieldCheck,
  HiOutlineReceiptPercent,
} from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/EmptyState'
import StatCard from '../../components/StatCard'
import { useBudgets } from '../../hooks/useBudgets'
import { useCategories } from '../../hooks/useCategories'
import { useDebts } from '../../hooks/useDebts'
import { useNotes } from '../../hooks/useNotes'
import { useAuth } from '../../hooks/useAuth'
import { useSavingsGoals } from '../../hooks/useSavingsGoals'
import { useTransactions } from '../../hooks/useTransactions'
import { usePreferences } from '../../hooks/usePreferences'
import { filterTransactions } from '../../utils/filters'
import { formatCurrency, formatShortDate, formatMonthYear } from '../../utils/format'

const chartColors = [
  '#4f46e5',
  '#22c55e',
  '#f59e0b',
  '#8b5cf6',
  '#06b6d4',
  '#ef4444',
  '#14b8a6',
  '#64748b',
]

function formatTooltipCurrency(value: number | string | readonly (number | string)[] | undefined) {
  const normalized = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)
  return formatCurrency(normalized)
}

function GlassCard({
  children,
  className = '',
  gradient = 'from-[var(--color-surface-strong)] to-[var(--color-surface-muted)]',
}: {
  children: React.ReactNode
  className?: string
  gradient?: string
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-gradient-to-br ${gradient} p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] ${className}`}
    >
      {children}
    </div>
  )
}

function AnimatedProgressBar({
  progress,
  color,
  className = '',
}: {
  progress: number
  color: string
  className?: string
}) {
  const [width, setWidth] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(progress), 200)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className={`h-3 rounded-full bg-[var(--color-border)]/50 p-0.5 ${className}`}>
      <div
        ref={barRef}
        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

function GradientBadge({ label, gradient }: { label: string; gradient: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gradient-to-r ${gradient} px-3 py-1 text-xs font-bold text-white shadow-sm`}
    >
      {label}
    </span>
  )
}

function getLocale(language: 'en' | 'ru') {
  return language === 'ru' ? 'ru-RU' : 'en-US'
}

function HomeHero({
  greeting,
  dateLabel,
  balance,
  notesCount,
  alertsCount,
  balanceLabel,
  t,
}: {
  greeting: string
  dateLabel: string
  balance: string
  notesCount: number
  alertsCount: number
  balanceLabel: string
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  return (
    <div className="mobile-surface-card overflow-hidden rounded-[30px] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {greeting}
          </p>
          <div className="mt-1 inline-flex items-center gap-2 text-xs font-medium text-[var(--color-text-muted)]">
            <span>{dateLabel}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--color-border-strong)]" />
            <span>{t('page.dashboard.notes_count', { count: notesCount })}</span>
          </div>
        </div>

        <Link
          to="/notifications"
          aria-label={t('page.dashboard.open_notifications')}
          className="tap-highlight mobile-icon-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary-pale)] text-[var(--color-primary)]"
        >
          <HiOutlineBellAlert className="text-lg" />
        </Link>
      </div>

      <div className="mt-4 rounded-[24px] bg-[linear-gradient(135deg,#5b58f6_0%,#7b83ff_100%)] px-4 py-4 text-white shadow-[0_18px_34px_rgba(87,83,246,0.26)]">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/75">
          {balanceLabel}
        </p>
        <p className="mt-2 text-[1.9rem] font-extrabold tracking-[-0.05em]">{balance}</p>
        <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/80">
          <HiOutlineSparkles className="text-sm" />
          <span>{t('page.dashboard.active_alerts', { count: alertsCount })}</span>
        </div>
      </div>
    </div>
  )
}

function QuickAction({
  to,
  label,
  icon: Icon,
  tone,
}: {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  tone: string
}) {
  return (
    <Link
      to={to}
      className="group flex min-h-[92px] flex-col justify-between rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-4 shadow-[var(--shadow-soft)] transition-all duration-200 active:scale-[0.98]"
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}>
        <Icon className="text-xl" />
      </span>
      <span className="mt-4 text-sm font-bold leading-5 text-[var(--color-text)]">{label}</span>
    </Link>
  )
}

function MobileSectionHeading({
  title,
  to,
  t,
}: {
  title: string
  to?: string
  t: (key: string, params?: Record<string, string | number>) => string
}) {
  return (
    <div className="mb-3 flex items-center justify-between px-1">
      <h3 className="text-[15px] font-extrabold tracking-tight text-[var(--color-text)]">
        {title}
      </h3>
      {to ? (
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)]"
        >
          {t('common.view_all')}
          <HiOutlineChevronRight className="text-sm" />
        </Link>
      ) : null}
    </div>
  )
}

/* ───── Skeleton Components ───── */

function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[24px] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface-strong)] to-[var(--color-surface-muted)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-[var(--color-border)]/50" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 rounded-lg bg-[var(--color-border)]/50" />
          <div className="h-7 w-32 rounded-lg bg-[var(--color-border)]/50" />
        </div>
      </div>
    </div>
  )
}

function BudgetAlertSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--color-warning)]/20 bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 shrink-0 rounded-2xl bg-[var(--color-border)]/50" />
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-5 w-32 rounded-lg bg-[var(--color-border)]/50" />
          <div className="h-2 w-full rounded-full bg-[var(--color-border)]/50" />
          <div className="h-4 w-24 rounded-lg bg-[var(--color-border)]/50" />
        </div>
      </div>
    </div>
  )
}

function RecentTransactionsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 border-b border-[var(--color-border)]/40 py-4 last:border-b-0">
          <div className="h-4 w-20 rounded-lg bg-[var(--color-border)]/50" />
          <div className="h-4 w-36 flex-1 rounded-lg bg-[var(--color-border)]/50" />
          <div className="h-6 w-20 rounded-full bg-[var(--color-border)]/50" />
          <div className="h-4 w-16 rounded-lg bg-[var(--color-border)]/50" />
          <div className="h-5 w-24 rounded-lg bg-[var(--color-border)]/50" />
        </div>
      ))}
    </div>
  )
}

function ExpensesChartSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center gap-8 lg:flex-row lg:gap-6">
      <div className="h-56 w-56 shrink-0 rounded-full bg-[var(--color-border)]/30" />
      <div className="w-full space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl p-2">
            <div className="h-3.5 w-3.5 shrink-0 rounded-full bg-[var(--color-border)]/50" />
            <div className="flex flex-1 items-center justify-between gap-3">
              <div className="h-4 w-24 rounded-lg bg-[var(--color-border)]/50" />
              <div className="flex items-center gap-4">
                <div className="h-4 w-20 rounded-lg bg-[var(--color-border)]/50" />
                <div className="h-5 w-14 rounded-full bg-[var(--color-border)]/50" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function BudgetCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--color-border)]/70 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-5 w-28 rounded-lg bg-[var(--color-border)]/50" />
        <div className="h-6 w-16 rounded-full bg-[var(--color-border)]/50" />
      </div>
      <div className="h-3 w-full rounded-full bg-[var(--color-border)]/50" />
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-3 w-12 rounded-lg bg-[var(--color-border)]/50" />
            <div className="h-4 w-16 rounded-lg bg-[var(--color-border)]/50" />
          </div>
        ))}
      </div>
    </div>
  )
}

function GoalSkeleton() {
  return (
    <div className="animate-pulse rounded-xl p-2">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="h-4 w-28 rounded-lg bg-[var(--color-border)]/50" />
        <div className="h-4 w-10 rounded-lg bg-[var(--color-border)]/50" />
      </div>
      <div className="h-3 w-full rounded-full bg-[var(--color-border)]/50" />
      <div className="mt-2 h-3 w-32 rounded-lg bg-[var(--color-border)]/50" />
    </div>
  )
}

function NoteCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--color-border)]/70 p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-[var(--color-border)]/50" />
        <div className="h-4 w-32 rounded-lg bg-[var(--color-border)]/50" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded-lg bg-[var(--color-border)]/50" />
        <div className="h-3 w-3/4 rounded-lg bg-[var(--color-border)]/50" />
        <div className="h-3 w-1/2 rounded-lg bg-[var(--color-border)]/50" />
      </div>
      <div className="mt-3 h-3 w-20 rounded-lg bg-[var(--color-border)]/50" />
    </div>
  )
}

function DashboardPage() {
  const { user } = useAuth()
  const { categories, isLoading: isCategoriesLoading } = useCategories()
  const { transactions, isLoading: isTransactionsLoading } = useTransactions()
  const { budgets, isLoading: isBudgetsLoading } = useBudgets()
  const { savingsGoals, isLoading: isSavingsLoading } = useSavingsGoals()
  const { debts, isLoading: isDebtsLoading } = useDebts()
  const { notes, isLoading: isNotesLoading } = useNotes()
  const { dateFilter, transactionSearch, t, language } = usePreferences()

  const isLoading = isCategoriesLoading || isTransactionsLoading || isBudgetsLoading || isSavingsLoading || isDebtsLoading || isNotesLoading

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, dateFilter, transactionSearch),
    [dateFilter, transactionSearch, transactions],
  )

  const categoryMap = useMemo(
    () => new Map(categories.map((category) => [category.id, category.name])),
    [categories],
  )

  const totals = useMemo(() => {
    const income = filteredTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((total, transaction) => total + Number(transaction.amount), 0)

    const expense = filteredTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((total, transaction) => total + Number(transaction.amount), 0)

    const savings = savingsGoals.reduce((total, goal) => total + Number(goal.current_amount), 0)

    return {
      balance: income - expense,
      income,
      expense,
      savings,
    }
  }, [filteredTransactions, savingsGoals])

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .filter((transaction) => filteredTransactions.some((item) => item.id === transaction.id))
        .sort(
          (left, right) =>
            new Date(right.transaction_date).getTime() -
            new Date(left.transaction_date).getTime(),
        )
        .slice(0, 5),
    [filteredTransactions, transactions],
  )

  const expenseByCategory = useMemo(() => {
    const totalsByCategory = new Map<string, number>()

    filteredTransactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        const label = categoryMap.get(transaction.category_id ?? '') ?? 'Others'
        totalsByCategory.set(label, (totalsByCategory.get(label) ?? 0) + Number(transaction.amount))
      })

    return Array.from(totalsByCategory.entries()).map(([label, amount], index) => ({
      label,
      amount,
      color: chartColors[index % chartColors.length],
      percent: totals.expense > 0 ? (amount / totals.expense) * 100 : 0,
    }))
  }, [categoryMap, filteredTransactions, totals.expense])

  const budgetCards = useMemo(
    () =>
      budgets.slice(0, 5).map((budget, index) => {
        const spent =
          expenseByCategory.find(
            (item) => item.label === categoryMap.get(budget.category_id ?? ''),
          )?.amount ?? 0

        const limit = Number(budget.limit_amount)
        const remaining = Math.max(limit - spent, 0)
        const progress = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0

        const gradientClasses = [
          'from-[#4f46e5] to-[#818cf8]',
          'from-[#22c55e] to-[#4ade80]',
          'from-[#f59e0b] to-[#fbbf24]',
          'from-[#8b5cf6] to-[#a78bfa]',
          'from-[#06b6d4] to-[#22d3ee]',
        ]

        return {
          id: budget.id,
          label: categoryMap.get(budget.category_id ?? '') ?? formatMonthYear(budget.month, budget.year),
          limit,
          spent,
          remaining,
          progress,
          gradient: gradientClasses[index % gradientClasses.length],
        }
      }),
    [budgets, categoryMap, expenseByCategory],
  )

  const budgetAlerts = useMemo(
    () =>
      budgetCards
        .filter((item) => item.progress >= 80)
        .map((item) => ({
          id: item.id,
          title: item.label,
          progress: item.progress,
          spent: item.spent,
          limit: item.limit,
        })),
    [budgetCards],
  )

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString(getLocale(language), {
        month: 'long',
        day: 'numeric',
      }),
    [language],
  )

  const firstName = user?.full_name?.trim().split(/\s+/)[0] ?? 'Planner'
  const greeting = useMemo(() => {
    const hour = new Date().getHours()

    if (hour < 12) {
      return t('page.dashboard.greeting_morning', { name: firstName })
    }

    if (hour < 18) {
      return t('page.dashboard.greeting_afternoon', { name: firstName })
    }

    return t('page.dashboard.greeting_evening', { name: firstName })
  }, [firstName, t])

  if (isLoading) {
    return (
      <div className="space-y-8 p-3 md:p-6 lg:p-8">
        {/* Stat Cards Skeleton */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        {/* Budget Alerts Skeleton */}
        <div className="animate-pulse relative overflow-hidden rounded-[28px] border border-[var(--color-warning)]/20 bg-[var(--color-warning-soft)]/40 p-5 shadow-[var(--shadow-soft)] md:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/50" />
            <div className="space-y-1">
              <div className="h-5 w-40 rounded-lg bg-[var(--color-border)]/50" />
              <div className="h-4 w-56 rounded-lg bg-[var(--color-border)]/50" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <BudgetAlertSkeleton />
            <BudgetAlertSkeleton />
          </div>
        </div>

        {/* Transactions & Chart Skeleton */}
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <GlassCard>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/50" />
              <div className="space-y-1">
                <div className="h-5 w-44 rounded-lg bg-[var(--color-border)]/50" />
                <div className="h-3 w-28 rounded-lg bg-[var(--color-border)]/50" />
              </div>
            </div>
            <RecentTransactionsSkeleton />
          </GlassCard>

          <GlassCard>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/50" />
              <div className="space-y-1">
                <div className="h-5 w-48 rounded-lg bg-[var(--color-border)]/50" />
                <div className="h-3 w-32 rounded-lg bg-[var(--color-border)]/50" />
              </div>
            </div>
            <ExpensesChartSkeleton />
          </GlassCard>
        </div>

        {/* Budgets, Savings, Debts Skeleton */}
        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr_0.75fr]">
          <GlassCard>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/50" />
                <div className="space-y-1">
                  <div className="h-5 w-20 rounded-lg bg-[var(--color-border)]/50" />
                  <div className="h-3 w-36 rounded-lg bg-[var(--color-border)]/50" />
                </div>
              </div>
              <div className="h-6 w-20 rounded-full bg-[var(--color-border)]/50" />
            </div>
            <div className="space-y-4">
              <BudgetCardSkeleton />
              <BudgetCardSkeleton />
              <BudgetCardSkeleton />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/50" />
                <div className="space-y-1">
                  <div className="h-5 w-28 rounded-lg bg-[var(--color-border)]/50" />
                  <div className="h-3 w-24 rounded-lg bg-[var(--color-border)]/50" />
                </div>
              </div>
              <div className="h-6 w-20 rounded-full bg-[var(--color-border)]/50" />
            </div>
            <div className="space-y-5">
              <GoalSkeleton />
              <GoalSkeleton />
              <GoalSkeleton />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/50" />
                <div className="space-y-1">
                  <div className="h-5 w-16 rounded-lg bg-[var(--color-border)]/50" />
                  <div className="h-3 w-32 rounded-lg bg-[var(--color-border)]/50" />
                </div>
              </div>
              <div className="h-6 w-20 rounded-full bg-[var(--color-border)]/50" />
            </div>
            <div className="space-y-5">
              <GoalSkeleton />
              <GoalSkeleton />
              <GoalSkeleton />
            </div>
          </GlassCard>
        </div>

        {/* Notes Skeleton */}
        <GlassCard>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/50" />
              <div className="space-y-1">
                <div className="h-5 w-16 rounded-lg bg-[var(--color-border)]/50" />
                <div className="h-3 w-36 rounded-lg bg-[var(--color-border)]/50" />
              </div>
            </div>
            <div className="h-6 w-20 rounded-full bg-[var(--color-border)]/50" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <NoteCardSkeleton />
            <NoteCardSkeleton />
            <NoteCardSkeleton />
            <NoteCardSkeleton />
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-4 p-2 sm:space-y-6 sm:p-3 md:p-6 lg:p-8">
      <div className="space-y-4 lg:hidden">
        <HomeHero
          greeting={greeting}
          dateLabel={todayLabel}
          balance={formatCurrency(totals.balance)}
          notesCount={notes.length}
          alertsCount={budgetAlerts.length}
          balanceLabel={t('page.dashboard.total_balance')}
          t={t}
        />

        <div className="mobile-surface-card overflow-hidden rounded-[28px] p-2">
          {[
            {
              title: t('page.dashboard.total_balance'),
              value: formatCurrency(totals.balance),
              icon: HiOutlineWallet,
              tone: 'bg-[var(--color-primary-pale)] text-[var(--color-primary)]',
            },
            {
              title: t('page.transactions.total_income'),
              value: formatCurrency(totals.income),
              icon: HiOutlineArrowTrendingUp,
              tone: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
            },
            {
              title: t('page.transactions.total_expenses'),
              value: formatCurrency(totals.expense),
              icon: HiOutlineArrowTrendingDown,
              tone: 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
            },
            {
              title: t('page.dashboard.total_savings'),
              value: formatCurrency(totals.savings),
              icon: HiOutlineBanknotes,
              tone: 'bg-[var(--color-purple-soft)] text-[var(--color-purple)]',
            },
          ].map((item, index, list) => {
            const Icon = item.icon

            return (
              <div
                key={item.title}
                className={`flex items-center gap-3 px-3 py-3 ${
                  index < list.length - 1 ? 'border-b border-[var(--color-border)]/70' : ''
                }`}
              >
                <div className={`mobile-icon-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}>
                  <Icon className="text-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xl font-extrabold tracking-tight text-[var(--color-text)]">
                    {item.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div>
          <MobileSectionHeading title={t('page.dashboard.recent_transactions')} to="/transactions" t={t} />
          <div className="mobile-surface-card rounded-[28px] p-2">
            {recentTransactions.length === 0 ? (
              <div className="p-3">
                <EmptyState
                  icon={HiOutlineChartBarSquare}
                  title={t('page.transactions.empty_title')}
                  description={t('page.dashboard.no_transactions_description')}
                />
              </div>
            ) : (
              recentTransactions.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-3 py-3 ${
                    index < recentTransactions.length - 1 ? 'border-b border-[var(--color-border)]/60' : ''
                  }`}
                >
                  <div
                    className={`mobile-icon-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      item.type === 'income'
                        ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                        : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
                    }`}
                  >
                    {item.type === 'income' ? (
                      <HiOutlineArrowTrendingUp className="text-lg" />
                    ) : (
                      <HiOutlineReceiptPercent className="text-lg" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[var(--color-text)]">{item.title}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                      {formatShortDate(item.transaction_date)}
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-sm font-extrabold ${
                      item.type === 'income'
                        ? 'text-[var(--color-success)]'
                        : 'text-[var(--color-danger)]'
                    }`}
                  >
                    {item.type === 'income' ? '+' : '-'}
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <MobileSectionHeading title={t('budgets')} to="/budgets" t={t} />
          <div className="mobile-surface-card rounded-[28px] p-4">
            {budgetCards.length === 0 ? (
              <EmptyState
                icon={HiOutlineShieldCheck}
                title={t('page.budgets.empty_title')}
                description={t('page.dashboard.no_budgets_description')}
              />
            ) : (
              <div className="space-y-4">
                {budgetCards.slice(0, 4).map((item) => (
                  <div key={item.id}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-bold text-[var(--color-text)]">{item.label}</p>
                      <p className="shrink-0 text-sm font-bold text-[var(--color-text-muted)]">
                        {item.progress}%
                      </p>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {formatCurrency(item.spent)} / {formatCurrency(item.limit)}
                    </p>
                    <AnimatedProgressBar progress={item.progress} color={item.gradient} className="mt-2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <QuickAction
            to="/analytics"
            label={t('analytics')}
            icon={HiOutlineChartBarSquare}
            tone="bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
          />
          <QuickAction
            to="/notes"
            label={t('notes')}
            icon={HiOutlineClipboardDocumentList}
            tone="bg-[var(--color-purple-soft)] text-[var(--color-purple)]"
          />
        </div>
      </div>

      <div className="hidden lg:block">
        <HomeHero
          greeting={greeting}
          dateLabel={todayLabel}
          balance={formatCurrency(totals.balance)}
          notesCount={notes.length}
          alertsCount={budgetAlerts.length}
          balanceLabel={t('page.dashboard.total_balance')}
          t={t}
        />

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                {t('page.dashboard.quick_access')}
              </p>
              <h3 className="mt-1 text-lg font-extrabold text-[var(--color-text)]">{t('page.dashboard.move_faster')}</h3>
            </div>
            <span className="rounded-full bg-[var(--color-primary-pale)] px-3 py-1 text-xs font-bold text-[var(--color-primary)]">
              {t('page.dashboard.shortcuts_count', { count: 4 })}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            <QuickAction
              to="/transactions"
              label={t('transactions')}
              icon={HiOutlineBars3}
              tone="bg-[var(--color-primary-pale)] text-[var(--color-primary)]"
            />
            <QuickAction
              to="/budgets"
              label={t('budgets')}
              icon={HiOutlineShieldCheck}
              tone="bg-[var(--color-success-soft)] text-[var(--color-success)]"
            />
            <QuickAction
              to="/analytics"
              label={t('analytics')}
              icon={HiOutlineChartBarSquare}
              tone="bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
            />
            <QuickAction
              to="/notes"
              label={t('notes')}
              icon={HiOutlineClipboardDocumentList}
              tone="bg-[var(--color-purple-soft)] text-[var(--color-purple)]"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 md:gap-5">
          <StatCard
            title={t('page.dashboard.total_balance')}
            value={formatCurrency(totals.balance)}
            accent="blue"
            icon={HiOutlineBanknotes}
          />
          <StatCard
            title={t('page.transactions.total_income')}
            value={formatCurrency(totals.income)}
            accent="green"
            icon={HiOutlineArrowTrendingUp}
          />
          <StatCard
            title={t('page.transactions.total_expenses')}
            value={formatCurrency(totals.expense)}
            accent="red"
            icon={HiOutlineArrowTrendingDown}
          />
          <StatCard
            title={t('page.dashboard.total_savings')}
            value={formatCurrency(totals.savings)}
            accent="purple"
            icon={HiOutlineWallet}
          />
        </div>
      </div>

      {budgetAlerts.length > 0 && (
        <div className="relative hidden overflow-hidden rounded-[30px] border border-[var(--color-warning)]/18 bg-[linear-gradient(145deg,rgba(255,251,235,0.98),rgba(255,247,237,0.95))] p-5 shadow-[var(--shadow-soft)] md:p-6 lg:block">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] text-white shadow-lg shadow-[#f59e0b]/20">
              <HiOutlineBellAlert className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--color-text)]">{t('page.dashboard.budget_alerts')}</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                {t('page.dashboard.budget_alerts_subtitle')}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {budgetAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-2xl border border-[var(--color-warning)]/20 bg-[var(--color-surface)] p-5 shadow-sm transition hover:border-[var(--color-warning)]/40"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ef4444] to-[#f87171] text-white">
                    <HiOutlineFire className="text-xl" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-[var(--color-text)]">
                      {alert.title}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-[var(--color-border)]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#ef4444] to-[#f87171]"
                          style={{ width: `${alert.progress}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-sm font-bold text-[#ef4444]">
                        {alert.progress}%
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-semibold text-[var(--color-text-muted)]">
                      <span className="text-[#ef4444]">{formatCurrency(alert.spent)}</span>
                      {' / '}
                      {formatCurrency(alert.limit)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="hidden gap-4 xl:grid-cols-[1.15fr_0.85fr] xl:gap-8 lg:grid">
        <GlassCard className="p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4f46e5] to-[#818cf8] text-white shadow-lg shadow-[#4f46e5]/20">
                <HiOutlineChartBarSquare className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[var(--color-text)]">
                  {t('page.dashboard.recent_transactions')}
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">{t('page.dashboard.latest_activity')}</p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-[var(--color-primary-pale)] px-4 py-1.5 text-sm font-bold text-[var(--color-primary)]">
              {t('page.dashboard.shown_count', { count: recentTransactions.length })}
            </span>
          </div>

          {recentTransactions.length === 0 ? (
            <EmptyState
              icon={HiOutlineChartBarSquare}
              title={t('page.transactions.empty_title')}
              description={t('page.dashboard.no_transactions_description')}
            />
          ) : (
            <>
              <div className="space-y-3 sm:hidden">
                {recentTransactions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-base font-bold text-[var(--color-text)]">{item.title}</p>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                          {formatShortDate(item.transaction_date)}
                        </p>
                      </div>
                      <p
                        className={`shrink-0 text-right text-base font-extrabold ${
                          item.type === 'income'
                            ? 'text-[var(--color-success)]'
                            : 'text-[var(--color-danger)]'
                        }`}
                      >
                        {item.type === 'income' ? '+' : '-'}
                        {formatCurrency(item.amount)}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          item.type === 'income'
                            ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                            : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
                        }`}
                      >
                        {categoryMap.get(item.category_id ?? '') ?? t('common.no_category')}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          item.type === 'income'
                            ? 'bg-[var(--color-primary-pale)] text-[var(--color-success)]'
                            : 'bg-[var(--color-primary-pale)] text-[var(--color-danger)]'
                        }`}
                      >
                        {item.type === 'income' ? t('common.income') : t('common.expense')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto sm:block">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)]/70">
                      <th className="pb-4 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{t('page.dashboard.table_date')}</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{t('page.dashboard.table_description')}</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{t('page.dashboard.table_category')}</th>
                      <th className="pb-4 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{t('page.dashboard.table_type')}</th>
                      <th className="pb-4 text-right text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{t('page.dashboard.table_amount')}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentTransactions.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-[var(--color-border)]/40 transition-colors last:border-b-0 hover:bg-[var(--color-surface-soft)]"
                      >
                        <td className="py-4 text-[var(--color-text-muted)]">
                          {formatShortDate(item.transaction_date)}
                        </td>

                        <td className="py-4 font-bold text-[var(--color-text)]">
                          {item.title}
                        </td>

                        <td className="py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
                              item.type === 'income'
                                ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                                : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
                            }`}
                          >
                            {categoryMap.get(item.category_id ?? '') ?? t('common.no_category')}
                          </span>
                        </td>

                        <td
                          className={`py-4 font-bold ${
                            item.type === 'income'
                              ? 'text-[var(--color-success)]'
                              : 'text-[var(--color-danger)]'
                          }`}
                        >
                          {item.type === 'income' ? t('common.income') : t('common.expense')}
                        </td>

                        <td
                          className={`py-4 text-right text-base font-extrabold ${
                            item.type === 'income'
                              ? 'text-[var(--color-success)]'
                              : 'text-[var(--color-danger)]'
                          }`}
                        >
                          {item.type === 'income' ? '+' : '-'}
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] text-white shadow-lg shadow-[#f59e0b]/20">
              <HiOutlineArrowTrendingDown className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--color-text)]">
                {t('page.dashboard.expenses_by_category')}
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">{t('page.dashboard.where_money_goes')}</p>
            </div>
          </div>

          {expenseByCategory.length === 0 ? (
            <EmptyState
              icon={HiOutlineArrowTrendingDown}
              title={t('page.dashboard.no_expense_categories')}
              description={t('page.dashboard.no_expense_categories_description')}
            />
          ) : (
            <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-6">
              <div className="h-56 w-56 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      dataKey="amount"
                      nameKey="label"
                      innerRadius={68}
                      outerRadius={110}
                      paddingAngle={3}
                      stroke="none"
                      animationBegin={200}
                      animationDuration={1000}
                      animationEasing="ease-out"
                    >
                      {expenseByCategory.map((item) => (
                        <Cell key={item.label} fill={item.color} />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) => formatTooltipCurrency(value)}
                      contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid var(--color-border)',
                        boxShadow: 'var(--shadow-soft)',
                        backdropFilter: 'blur(12px)',
                        background: 'var(--color-surface)',
                      }}
                    />

                    <text
                      x="50%"
                      y="48%"
                      textAnchor="middle"
                      className="fill-[var(--color-text)] text-[20px] font-extrabold"
                    >
                      {formatCurrency(totals.expense)}
                    </text>

                    <text
                      x="50%"
                      y="59%"
                      textAnchor="middle"
                      className="fill-[var(--color-text-muted)] text-[12px]"
                    >
                      {t('common.total')}
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="w-full space-y-3">
                {expenseByCategory.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-[var(--color-surface-soft)]"
                  >
                    <span
                      className="h-3.5 w-3.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />

                    <div className="flex flex-1 items-center justify-between gap-3">
                      <span className="text-sm font-bold text-[var(--color-text)]">
                        {item.label}
                      </span>

                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-[var(--color-text)]">
                          {formatCurrency(item.amount)}
                        </span>

                        <span className="min-w-[3.5rem] rounded-full bg-[var(--color-surface-soft)] px-2.5 py-0.5 text-center text-xs font-bold text-[var(--color-text-muted)]">
                          {item.percent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="hidden gap-4 xl:grid-cols-[1.25fr_0.75fr_0.75fr] xl:gap-8 lg:grid">
        <GlassCard className="p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22c55e] to-[#4ade80] text-white shadow-lg shadow-[#22c55e]/20">
                <HiOutlineShieldCheck className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[var(--color-text)]">{t('budgets')}</h2>
                <p className="text-xs text-[var(--color-text-muted)]">{t('page.dashboard.track_spending_limits')}</p>
              </div>
            </div>

            <span className="rounded-full bg-[var(--color-success-soft)] px-4 py-1.5 text-sm font-bold text-[var(--color-success)]">
              {t('common.items_count', { count: budgets.length })}
            </span>
          </div>

          <div className="space-y-4">
            {budgetCards.length === 0 ? (
              <EmptyState
                icon={HiOutlineShieldCheck}
                title={t('page.budgets.empty_title')}
                description={t('page.dashboard.no_budgets_description')}
              />
            ) : (
              budgetCards.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[var(--color-border)]/70 p-5 transition hover:bg-[var(--color-surface-soft)]"
                >
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-base font-extrabold text-[var(--color-text)]">
                      {item.label}
                    </p>
                    <GradientBadge label={`${item.progress}%`} gradient={item.gradient} />
                  </div>

                  <AnimatedProgressBar progress={item.progress} color={item.gradient} />

                  <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
                    <div>
                      <p className="text-[var(--color-text-muted)]">{t('budgets')}</p>
                      <p className="mt-0.5 font-bold text-[var(--color-text)]">
                        {formatCurrency(item.limit)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[var(--color-text-muted)]">{t('page.dashboard.spent')}</p>
                      <p className="mt-0.5 font-bold text-[var(--color-danger)]">
                        {formatCurrency(item.spent)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[var(--color-text-muted)]">{t('page.dashboard.remaining')}</p>
                      <p
                        className={`mt-0.5 font-bold ${
                          item.remaining > 0
                            ? 'text-[var(--color-success)]'
                            : 'text-[var(--color-danger)]'
                        }`}
                      >
                        {formatCurrency(item.remaining)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] text-white shadow-lg shadow-[#8b5cf6]/20">
                <HiOutlineWallet className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[var(--color-text)]">
                  {t('savings_goals')}
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">{t('page.dashboard.saving_targets')}</p>
              </div>
            </div>

            <span className="rounded-full bg-[var(--color-purple-soft)] px-4 py-1.5 text-sm font-bold text-[var(--color-purple)]">
              {t('common.items_count', { count: savingsGoals.length })}
            </span>
          </div>

          {savingsGoals.length === 0 ? (
            <EmptyState
              icon={HiOutlineWallet}
              title={t('page.savings.empty_title')}
              description={t('page.dashboard.no_savings_description')}
            />
          ) : (
            <div className="space-y-5">
              {savingsGoals.slice(0, 3).map((goal) => {
                const progress =
                  Number(goal.target_amount) > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (Number(goal.current_amount) / Number(goal.target_amount)) * 100,
                        ),
                      )
                    : 0

                return (
                  <div
                    key={goal.id}
                    className="rounded-xl p-2 transition hover:bg-[var(--color-purple-soft)]/40"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-[var(--color-text)]">
                        {goal.title}
                      </p>
                      <span className="shrink-0 text-sm font-bold text-[var(--color-purple)]">
                        {progress}%
                      </span>
                    </div>

                    <AnimatedProgressBar progress={progress} color="from-[#8b5cf6] to-[#a78bfa]" />

                    <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                      <span className="font-bold text-[var(--color-text)]">
                        {formatCurrency(goal.current_amount)}
                      </span>
                      {' / '}
                      {formatCurrency(goal.target_amount)}
                    </p>

                    {goal.deadline && (
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        {t('page.dashboard.target_date')}: {formatShortDate(goal.deadline)}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ef4444] to-[#f87171] text-white shadow-lg shadow-[#ef4444]/20">
                <HiOutlineArrowTrendingDown className="text-xl" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[var(--color-text)]">{t('debts')}</h2>
                <p className="text-xs text-[var(--color-text-muted)]">{t('page.dashboard.outstanding_payments')}</p>
              </div>
            </div>

            <span className="rounded-full bg-[var(--color-danger-soft)] px-4 py-1.5 text-sm font-bold text-[var(--color-danger)]">
              {t('common.items_count', { count: debts.length })}
            </span>
          </div>

          {debts.length === 0 ? (
            <EmptyState
              icon={HiOutlineArrowTrendingDown}
              title={t('page.dashboard.no_active_debts')}
              description={t('page.dashboard.no_active_debts_description')}
            />
          ) : (
            <div className="space-y-5">
              {debts.slice(0, 3).map((debt) => {
                const progress =
                  Number(debt.total_amount) > 0
                    ? Math.min(
                        100,
                        Math.round(
                          (Number(debt.paid_amount) / Number(debt.total_amount)) * 100,
                        ),
                      )
                    : 0

                return (
                  <div
                    key={debt.id}
                    className="rounded-xl p-2 transition hover:bg-[var(--color-danger-soft)]/40"
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-bold text-[var(--color-text)]">
                        {debt.title}
                      </p>
                      <span className="shrink-0 text-sm font-bold text-[var(--color-danger)]">
                        {progress}%
                      </span>
                    </div>

                    <AnimatedProgressBar progress={progress} color="from-[#ef4444] to-[#f87171]" />

                    <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                      <span className="font-bold text-[var(--color-text)]">
                        {formatCurrency(debt.paid_amount)}
                      </span>
                      {' / '}
                      {formatCurrency(debt.total_amount)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard className="hidden p-4 sm:p-6 lg:block">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#06b6d4] to-[#22d3ee] text-white shadow-lg shadow-[#06b6d4]/20">
              <HiOutlineSparkles className="text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[var(--color-text)]">{t('notes')}</h2>
              <p className="text-xs text-[var(--color-text-muted)]">{t('page.dashboard.recent_quick_notes')}</p>
            </div>
          </div>

          <span className="rounded-full bg-[#06b6d4]/10 px-4 py-1.5 text-sm font-bold text-[#06b6d4]">
            {t('common.items_count', { count: notes.length })}
          </span>
        </div>

        {notes.length === 0 ? (
          <EmptyState
            icon={HiOutlineSparkles}
            title={t('page.notes.empty_title')}
            description={t('page.dashboard.no_notes_description')}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {notes.slice(0, 4).map((note) => (
              <div
                key={note.id}
                className="rounded-2xl border border-[var(--color-border)]/70 p-5 transition hover:border-[#06b6d4]/30 hover:bg-[var(--color-surface-soft)]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#06b6d4]" />
                  <p className="truncate text-sm font-bold text-[var(--color-text)]">
                    {note.title}
                  </p>
                </div>

                {note.content && (
                  <p className="line-clamp-3 text-sm leading-6 text-[var(--color-text-muted)]">
                    {note.content}
                  </p>
                )}

                {note.created_at && (
                  <p className="mt-3 text-xs font-medium text-[var(--color-text-muted)]">
                    {formatShortDate(note.created_at)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}

export default DashboardPage
