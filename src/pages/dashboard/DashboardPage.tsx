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
  HiOutlineCalendarDays,
  HiOutlineCreditCard,
  HiOutlineArrowRight,
  HiOutlinePresentationChartBar,
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

/* ───── Color Palette ───── */
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

/* ───── Gradient Presets ───── */
const GRADIENTS = {
  primary: 'from-[#4f46e5] via-[#6366f1] to-[#818cf8]',
  green: 'from-[#059669] via-[#10b981] to-[#34d399]',
  amber: 'from-[#d97706] via-[#f59e0b] to-[#fbbf24]',
  purple: 'from-[#7c3aed] via-[#8b5cf6] to-[#a78bfa]',
  cyan: 'from-[#0891b2] via-[#06b6d4] to-[#22d3ee]',
  red: 'from-[#dc2626] via-[#ef4444] to-[#f87171]',
  rose: 'from-[#e11d48] via-[#f43f5e] to-[#fb7185]',
  teal: 'from-[#0d9488] via-[#14b8a6] to-[#2dd4bf]',
}

/* ───── Helper ───── */
function formatTooltipCurrency(value: number | string | readonly (number | string)[] | undefined) {
  const normalized = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)
  return formatCurrency(normalized)
}

/* ───── GlassCard ───── */
function GlassCard({
  children,
  className = '',
  gradient = 'from-[var(--color-surface-strong)] to-[var(--color-surface-muted)]',
  glowColor = 'rgba(79,70,229,0.06)',
}: {
  children: React.ReactNode
  className?: string
  gradient?: string
  glowColor?: string
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/80 bg-gradient-to-br ${gradient} p-5 shadow-[var(--shadow-soft)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[var(--shadow-card)] sm:p-6 ${className}`}
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute -inset-0.5 rounded-[30px] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), ${glowColor}, transparent 40%)` }}
      />

      {/* Inner highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" />

      {/* Shine overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2)_0%,transparent_50%)] transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10">{children}</div>
    </div>
  )
}

/* ───── Animated Progress Bar with Shimmer ───── */
function AnimatedProgressBar({
  progress,
  gradient,
  className = '',
  height = 'h-3',
}: {
  progress: number
  gradient: string
  className?: string
  height?: string
}) {
  const [width, setWidth] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(Math.min(progress, 100)), 300)
    return () => clearTimeout(timer)
  }, [progress])

  return (
    <div className={`relative overflow-hidden rounded-full bg-[var(--color-border)]/50 p-0.5 ${height} ${className}`}>
      <div
        ref={barRef}
        className={`relative h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      >
        {/* Shimmer */}
        <div className="absolute inset-0 animate-[shimmer_2s_infinite] bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.35)_50%,transparent_75%)] bg-[length:200%_100%]" />
      </div>
    </div>
  )
}

/* ───── Gradient Badge ───── */
function GradientBadge({ label, gradient, className = '' }: { label: string; gradient: string; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gradient-to-r ${gradient} px-3.5 py-1 text-xs font-bold text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] ${className}`}
    >
      {label}
    </span>
  )
}

/* ───── Glass Icon Container ───── */
function GlassIcon({
  gradient,
  icon: Icon,
  size = 'h-11 w-11',
  className = '',
}: {
  gradient: string
  icon: React.ComponentType<{ className?: string }>
  size?: string
  className?: string
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${size} ${className}`}
    >
      <Icon className="text-lg" />
    </div>
  )
}

/* ───── Section Header ───── */
function SectionHeader({
  icon,
  gradient,
  title,
  subtitle,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        <GlassIcon icon={icon} gradient={gradient} />
        <div>
          <h2 className="text-lg font-extrabold tracking-tight text-[var(--color-text)]">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/* ───── Mobile Action Button ───── */
function QuickAction({
  to,
  label,
  icon: Icon,
  gradient,
  className = '',
}: {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  gradient: string
  className?: string
}) {
  return (
    <Link
      to={to}
      className={`group relative flex min-h-[100px] flex-col justify-between overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface-strong)] p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)] active:scale-[0.97] ${className}`}
    >
      {/* Decorative gradient blob */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30" />

      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-white shadow-[0_8px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]`}>
        <Icon className="text-xl" />
      </div>
      <span className="mt-4 text-sm font-bold leading-5 tracking-tight text-[var(--color-text)] transition-colors duration-200 group-hover:text-[var(--color-primary)]">
        {label}
      </span>
      <HiOutlineArrowRight className="absolute bottom-5 right-5 text-sm text-[var(--color-text-muted)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" />
    </Link>
  )
}

/* ───── Mobile Section Heading ───── */
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
      <h3 className="text-[15px] font-extrabold tracking-tight text-[var(--color-text)]">{title}</h3>
      {to && (
        <Link
          to={to}
          className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-soft)]"
        >
          {t('common.view_all')}
          <HiOutlineChevronRight className="text-sm" />
        </Link>
      )}
    </div>
  )
}

/* ───── Home Hero with decorative elements ───── */
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
    <div className="relative overflow-hidden rounded-[32px] border border-[var(--color-border)]/70 bg-gradient-to-br from-[var(--color-surface-strong)] to-[var(--color-surface-muted)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-2xl sm:p-6">
      {/* Decorative background patterns */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#4f46e5]/8 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-gradient-to-tr from-[#10b981]/6 to-transparent blur-3xl" />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--color-success)]" />
            <p className="text-sm font-bold text-[var(--color-text)]">{greeting}</p>
          </div>
          <div className="mt-2 inline-flex items-center gap-2.5 text-xs font-medium text-[var(--color-text-muted)]">
            <HiOutlineCalendarDays className="text-sm" />
            <span>{dateLabel}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--color-border-strong)]" />
            <span>{t('page.dashboard.notes_count', { count: notesCount })}</span>
          </div>
        </div>

        <Link
          to="/notifications"
          aria-label={t('page.dashboard.open_notifications')}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary-pale)] to-[var(--color-primary-pale)] text-[var(--color-primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
        >
          <HiOutlineBellAlert className="text-xl" />
          {alertsCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#ef4444] to-[#f87171] text-[10px] font-bold text-white shadow-[0_2px_8px_rgba(239,68,68,0.4)]">
              {alertsCount > 9 ? '9+' : alertsCount}
            </span>
          )}
        </Link>
      </div>

      {/* Balance Card */}
      <div className="relative mt-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#4f46e5] via-[#6366f1] to-[#7b83ff] px-6 py-6 shadow-[0_20px_48px_rgba(79,70,229,0.32)]">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
        <div className="pointer-events-none absolute right-1/3 top-1/3 h-16 w-16 rounded-full bg-white/5 blur-xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-white/60" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">{balanceLabel}</p>
          </div>
          <p className="mt-2 text-[2.2rem] font-extrabold tracking-[-0.05em] text-white sm:text-[2.6rem]">
            {balance}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-1.5 backdrop-blur-sm">
              <HiOutlineSparkles className="text-sm text-yellow-200" />
              <span className="text-xs font-bold text-white/85">
                {t('page.dashboard.active_alerts', { count: alertsCount })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ───── Skeleton Components ───── */

function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-[shimmer_2s_infinite] bg-[linear-gradient(90deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:200%_100%] ${className}`} />
  )
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-[var(--color-border)]/40 ${className}`}>
      <Shimmer className="h-full w-full rounded-xl" />
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[28px] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface-strong)] to-[var(--color-surface-muted)] p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-14 w-14 rounded-2xl" />
        <div className="flex-1 space-y-3">
          <SkeletonBlock className="h-4 w-24 rounded-lg" />
          <SkeletonBlock className="h-8 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function RecentTransactionsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-3 border-b border-[var(--color-border)]/40 py-4 last:border-b-0">
          <SkeletonBlock className="h-4 w-20 rounded-lg" />
          <SkeletonBlock className="h-4 flex-1 rounded-lg" />
          <SkeletonBlock className="h-6 w-20 rounded-full" />
          <SkeletonBlock className="h-4 w-16 rounded-lg" />
          <SkeletonBlock className="h-5 w-24 rounded-lg" />
        </div>
      ))}
    </div>
  )
}

function ExpensesChartSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center gap-8 lg:flex-row lg:gap-6">
      <SkeletonBlock className="h-60 w-60 shrink-0 rounded-full" />
      <div className="w-full space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonBlock className="h-4 w-4 shrink-0 rounded-full" />
            <div className="flex flex-1 items-center justify-between gap-3">
              <SkeletonBlock className="h-4 w-28 rounded-lg" />
              <div className="flex items-center gap-4">
                <SkeletonBlock className="h-4 w-20 rounded-lg" />
                <SkeletonBlock className="h-5 w-14 rounded-full" />
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
      <div className="mb-4 flex items-center justify-between">
        <SkeletonBlock className="h-5 w-32 rounded-lg" />
        <SkeletonBlock className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonBlock className="h-3 w-full rounded-full" />
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <SkeletonBlock className="h-3 w-14 rounded-lg" />
            <SkeletonBlock className="h-4 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

function GoalSkeleton() {
  return (
    <div className="animate-pulse rounded-xl p-2">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <SkeletonBlock className="h-4 w-32 rounded-lg" />
        <SkeletonBlock className="h-4 w-12 rounded-lg" />
      </div>
      <SkeletonBlock className="h-3 w-full rounded-full" />
      <SkeletonBlock className="mt-2 h-3 w-40 rounded-lg" />
    </div>
  )
}

/* ───── Main Dashboard Component ───── */
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

  // Track mouse position for card glow effect
  useEffect(() => {
    const cards = document.querySelectorAll('[data-glow-card]')
    const handleMouseMove = (e: Event) => {
      const card = e.currentTarget as HTMLElement
      const rect = card.getBoundingClientRect()
      const x = ((e as MouseEvent).clientX - rect.left) / rect.width * 100
      const y = ((e as MouseEvent).clientY - rect.top) / rect.height * 100
      card.style.setProperty('--mx', `${x}%`)
      card.style.setProperty('--my', `${y}%`)
    }
    cards.forEach((c) => c.addEventListener('mousemove', handleMouseMove))
    return () => cards.forEach((c) => c.removeEventListener('mousemove', handleMouseMove))
  }, [])

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

    return { balance: income - expense, income, expense, savings }
  }, [filteredTransactions, savingsGoals])

  const recentTransactions = useMemo(
    () =>
      [...transactions]
        .filter((transaction) => filteredTransactions.some((item) => item.id === transaction.id))
        .sort(
          (left, right) =>
            new Date(right.transaction_date).getTime() - new Date(left.transaction_date).getTime(),
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

        const gradientKeys: Array<keyof typeof GRADIENTS> = ['primary', 'green', 'amber', 'purple', 'cyan']

        return {
          id: budget.id,
          label: categoryMap.get(budget.category_id ?? '') ?? formatMonthYear(budget.month, budget.year),
          limit,
          spent,
          remaining,
          progress,
          gradient: GRADIENTS[gradientKeys[index % gradientKeys.length]],
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
      new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
        month: 'long',
        day: 'numeric',
      }),
    [language],
  )

  const firstName = user?.full_name?.trim().split(/\s+/)[0] ?? 'Planner'
  const greeting = useMemo(() => {
    const hour = new Date().getHours()

    if (hour < 12) return t('page.dashboard.greeting_morning', { name: firstName })
    if (hour < 18) return t('page.dashboard.greeting_afternoon', { name: firstName })
    return t('page.dashboard.greeting_evening', { name: firstName })
  }, [firstName, t])

  /* ───── Loading State ───── */
  if (isLoading) {
    return (
      <div className="space-y-6 p-3 md:p-6 lg:p-8">
        {/* Hero Skeleton */}
        <div className="animate-pulse rounded-[32px] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface-strong)] to-[var(--color-surface-muted)] p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3">
              <SkeletonBlock className="h-4 w-48 rounded-lg" />
              <SkeletonBlock className="h-3 w-64 rounded-lg" />
            </div>
            <SkeletonBlock className="h-12 w-12 rounded-2xl" />
          </div>
          <SkeletonBlock className="mt-5 h-44 w-full rounded-[28px]" />
        </div>

        {/* Grid Skeletons */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <GlassCard><SectionHeaderSkeleton /><RecentTransactionsSkeleton /></GlassCard>
          <GlassCard><SectionHeaderSkeleton /><ExpensesChartSkeleton /></GlassCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr_0.75fr]">
          <GlassCard><div className="space-y-4"><BudgetCardSkeleton /><BudgetCardSkeleton /><BudgetCardSkeleton /></div></GlassCard>
          <GlassCard><div className="space-y-4"><GoalSkeleton /><GoalSkeleton /><GoalSkeleton /></div></GlassCard>
          <GlassCard><div className="space-y-4"><GoalSkeleton /><GoalSkeleton /><GoalSkeleton /></div></GlassCard>
        </div>
      </div>
    )
  }

  /* ───── Rendered Content ───── */

  const statCards = [
    {
      title: t('page.dashboard.total_balance'),
      value: formatCurrency(totals.balance),
      accent: 'blue' as const,
      icon: HiOutlineWallet,
    },
    {
      title: t('page.transactions.total_income'),
      value: formatCurrency(totals.income),
      accent: 'green' as const,
      icon: HiOutlineArrowTrendingUp,
    },
    {
      title: t('page.transactions.total_expenses'),
      value: formatCurrency(totals.expense),
      accent: 'red' as const,
      icon: HiOutlineArrowTrendingDown,
    },
    {
      title: t('page.dashboard.total_savings'),
      value: formatCurrency(totals.savings),
      accent: 'purple' as const,
      icon: HiOutlineBanknotes,
    },
  ]

  const quickActions = [
    { to: '/transactions', label: t('transactions'), icon: HiOutlineBars3, gradient: GRADIENTS.primary },
    { to: '/budgets', label: t('budgets'), icon: HiOutlineShieldCheck, gradient: GRADIENTS.green },
    { to: '/analytics', label: t('analytics'), icon: HiOutlinePresentationChartBar, gradient: GRADIENTS.amber },
    { to: '/notes', label: t('notes'), icon: HiOutlineClipboardDocumentList, gradient: GRADIENTS.purple },
  ]

  return (
    <div className="mx-auto max-w-[1400px] space-y-5 p-3 sm:space-y-7 sm:p-4 md:p-6 lg:p-8">

      {/* ═══════════════ MOBILE LAYOUT ═══════════════ */}
      <div className="space-y-5 lg:hidden">
        {/* Hero */}
        <HomeHero
          greeting={greeting}
          dateLabel={todayLabel}
          balance={formatCurrency(totals.balance)}
          notesCount={notes.length}
          alertsCount={budgetAlerts.length}
          balanceLabel={t('page.dashboard.total_balance')}
          t={t}
        />

        {/* Mobile Quick Stats */}
        <div className="rounded-[28px] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface-strong)] to-[var(--color-surface-muted)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-2xl">
          {statCards.map((item, index) => {
            const Icon = item.icon
            const accentColor = {
              blue: { bg: 'bg-[var(--color-primary-pale)]', text: 'text-[var(--color-primary)]' },
              green: { bg: 'bg-[var(--color-success-soft)]', text: 'text-[var(--color-success)]' },
              red: { bg: 'bg-[var(--color-danger-soft)]', text: 'text-[var(--color-danger)]' },
              purple: { bg: 'bg-[var(--color-purple-soft)]', text: 'text-[var(--color-purple)]' },
            }[item.accent]

            return (
              <div
                key={item.title}
                className={`flex items-center gap-3.5 px-4 py-4 transition-colors duration-200 hover:bg-[var(--color-surface-soft)]/50 ${
                  index < statCards.length - 1 ? 'border-b border-[var(--color-border)]/60' : ''
                }`}
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accentColor.bg} ${accentColor.text} shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]`}>
                  <Icon className="text-lg" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{item.title}</p>
                  <p className="mt-1 text-xl font-extrabold tracking-tight text-[var(--color-text)]">{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Transactions (Mobile) */}
        <div>
          <MobileSectionHeading title={t('page.dashboard.recent_transactions')} to="/transactions" t={t} />
          <div className="rounded-[28px] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface-strong)] to-[var(--color-surface-muted)] p-3 shadow-[var(--shadow-soft)] backdrop-blur-2xl">
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
                  className={`flex items-center gap-3.5 px-4 py-4 transition-all duration-200 hover:bg-[var(--color-surface-soft)]/50 ${
                    index < recentTransactions.length - 1 ? 'border-b border-[var(--color-border)]/60' : ''
                  }`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${
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
                      item.type === 'income' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                    }`}
                  >
                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Mobile Budgets */}
        <div>
          <MobileSectionHeading title={t('budgets')} to="/budgets" t={t} />
          <div className="rounded-[28px] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface-strong)] to-[var(--color-surface-muted)] p-4 shadow-[var(--shadow-soft)] backdrop-blur-2xl">
            {budgetCards.length === 0 ? (
              <EmptyState
                icon={HiOutlineShieldCheck}
                title={t('page.budgets.empty_title')}
                description={t('page.dashboard.no_budgets_description')}
              />
            ) : (
              <div className="space-y-5">
                {budgetCards.slice(0, 4).map((item) => (
                  <div key={item.id}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-bold text-[var(--color-text)]">{item.label}</p>
                      <p className="shrink-0 text-sm font-bold text-[var(--color-text-muted)]">{item.progress}%</p>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {formatCurrency(item.spent)} / {formatCurrency(item.limit)}
                    </p>
                    <AnimatedProgressBar progress={item.progress} gradient={item.gradient} className="mt-2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {quickActions.slice(2).map((action) => (
            <QuickAction key={action.to} {...action} />
          ))}
        </div>
      </div>

      {/* ═══════════════ DESKTOP LAYOUT ═══════════════ */}
      <div className="hidden lg:block space-y-7">

        {/* Hero */}
        <HomeHero
          greeting={greeting}
          dateLabel={todayLabel}
          balance={formatCurrency(totals.balance)}
          notesCount={notes.length}
          alertsCount={budgetAlerts.length}
          balanceLabel={t('page.dashboard.total_balance')}
          t={t}
        />

        {/* Quick Access */}
        <div>
          <div className="mb-4 flex items-center justify-between px-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">{t('page.dashboard.quick_access')}</p>
              <h3 className="mt-1 text-lg font-extrabold tracking-tight text-[var(--color-text)]">{t('page.dashboard.move_faster')}</h3>
            </div>
            <GradientBadge label={t('page.dashboard.shortcuts_count', { count: 4 })} gradient={GRADIENTS.primary} />
          </div>
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {quickActions.map((action) => (
              <QuickAction key={action.to} {...action} />
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 xl:grid-cols-4 md:gap-5">
          {statCards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        {/* Budget Alerts */}
        {budgetAlerts.length > 0 && (
          <GlassCard
            className="border-[var(--color-warning)]/15"
            gradient="from-[rgba(255,251,235,0.98)] to-[rgba(255,247,237,0.95)]"
            glowColor="rgba(245,158,11,0.08)"
            data-glow-card
          >
            <SectionHeader
              icon={HiOutlineBellAlert}
              gradient={GRADIENTS.amber}
              title={t('page.dashboard.budget_alerts')}
              subtitle={t('page.dashboard.budget_alerts_subtitle')}
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {budgetAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="group/alert rounded-2xl border border-[var(--color-warning)]/18 bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-300 hover:border-[var(--color-warning)]/35 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ef4444] to-[#f87171] text-white shadow-lg shadow-[#ef4444]/20">
                      <HiOutlineFire className="text-xl" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-[var(--color-text)]">{alert.title}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-[var(--color-border)]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#ef4444] to-[#f87171] transition-all duration-700"
                            style={{ width: `${alert.progress}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-sm font-bold text-[#ef4444]">{alert.progress}%</span>
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
          </GlassCard>
        )}

        {/* Transactions & Chart Row */}
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          {/* Recent Transactions */}
          <GlassCard data-glow-card glowColor="rgba(79,70,229,0.06)">
            <SectionHeader
              icon={HiOutlineChartBarSquare}
              gradient={GRADIENTS.primary}
              title={t('page.dashboard.recent_transactions')}
              subtitle={t('page.dashboard.latest_activity')}
              action={
                <GradientBadge
                  label={t('page.dashboard.shown_count', { count: recentTransactions.length })}
                  gradient={GRADIENTS.primary}
                />
              }
            />

            {recentTransactions.length === 0 ? (
              <EmptyState
                icon={HiOutlineChartBarSquare}
                title={t('page.transactions.empty_title')}
                description={t('page.dashboard.no_transactions_description')}
              />
            ) : (
              <>
                {/* Mobile transaction cards (within table container on hover) */}
                <div className="space-y-3 sm:hidden">
                  {recentTransactions.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-4 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-base font-bold text-[var(--color-text)]">{item.title}</p>
                          <p className="mt-1 text-xs text-[var(--color-text-muted)]">{formatShortDate(item.transaction_date)}</p>
                        </div>
                        <p
                          className={`shrink-0 text-right text-base font-extrabold ${
                            item.type === 'income' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                          }`}
                        >
                          {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
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

                {/* Desktop Table */}
                <div className="hidden overflow-x-auto sm:block">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border)]/60">
                        <th className="pb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{t('page.dashboard.table_date')}</th>
                        <th className="pb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{t('page.dashboard.table_description')}</th>
                        <th className="pb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{t('page.dashboard.table_category')}</th>
                        <th className="pb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{t('page.dashboard.table_type')}</th>
                        <th className="pb-4 text-right text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">{t('page.dashboard.table_amount')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((item) => (
                        <tr
                          key={item.id}
                          className="group/row border-b border-[var(--color-border)]/30 transition-all duration-150 last:border-b-0 hover:bg-[var(--color-surface-soft)]/60"
                        >
                          <td className="py-4 text-[var(--color-text-muted)] text-sm">{formatShortDate(item.transaction_date)}</td>
                          <td className="py-4 font-bold text-[var(--color-text)]">{item.title}</td>
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
                          <td className={`py-4 font-bold text-sm ${
                            item.type === 'income' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                          }`}>
                            {item.type === 'income' ? t('common.income') : t('common.expense')}
                          </td>
                          <td className={`py-4 text-right text-base font-extrabold ${
                            item.type === 'income' ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                          }`}>
                            {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </GlassCard>

          {/* Expenses by Category Pie Chart */}
          <GlassCard data-glow-card glowColor="rgba(245,158,11,0.06)">
            <SectionHeader
              icon={HiOutlineArrowTrendingDown}
              gradient={GRADIENTS.amber}
              title={t('page.dashboard.expenses_by_category')}
              subtitle={t('page.dashboard.where_money_goes')}
            />

            {expenseByCategory.length === 0 ? (
              <EmptyState
                icon={HiOutlineArrowTrendingDown}
                title={t('page.dashboard.no_expense_categories')}
                description={t('page.dashboard.no_expense_categories_description')}
              />
            ) : (
              <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-5">
                {/* Donut Chart */}
                <div className="h-56 w-56 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {expenseByCategory.map((_, idx) => (
                          <filter key={`glow-${idx}`} id={`glow-${idx}`} x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        ))}
                      </defs>
                      <Pie
                        data={expenseByCategory}
                        dataKey="amount"
                        nameKey="label"
                        innerRadius={70}
                        outerRadius={112}
                        paddingAngle={4}
                        stroke="none"
                        animationBegin={200}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      >
                        {expenseByCategory.map((item, idx) => (
                          <Cell key={item.label} fill={item.color} filter={`url(#glow-${idx})`} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => formatTooltipCurrency(value)}
                        contentStyle={{
                          borderRadius: '18px',
                          border: '1px solid var(--color-border)',
                          boxShadow: 'var(--shadow-card)',
                          backdropFilter: 'blur(16px)',
                          background: 'rgba(255,255,255,0.85)',
                          padding: '10px 14px',
                        }}
                      />
                      <text x="50%" y="46%" textAnchor="middle" className="fill-[var(--color-text)] text-[20px] font-extrabold">
                        {formatCurrency(totals.expense)}
                      </text>
                      <text x="50%" y="58%" textAnchor="middle" className="fill-[var(--color-text-muted)] text-[12px] font-medium">
                        {t('common.total')}
                      </text>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="w-full space-y-2.5">
                  {expenseByCategory.map((item) => (
                    <div
                      key={item.label}
                      className="group/legend flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-[var(--color-surface-soft)]/70"
                    >
                      <span className="h-3.5 w-3.5 shrink-0 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                      <div className="flex flex-1 items-center justify-between gap-3">
                        <span className="truncate text-sm font-bold text-[var(--color-text)]">{item.label}</span>
                        <div className="flex items-center gap-3.5 shrink-0">
                          <span className="text-sm font-bold text-[var(--color-text)]">{formatCurrency(item.amount)}</span>
                          <GradientBadge
                            label={`${item.percent.toFixed(1)}%`}
                            gradient={GRADIENTS.primary}
                            className="min-w-[3.5rem] justify-center text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Budgets, Savings, Debts Row */}
        <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr_0.75fr] xl:gap-6">
          {/* Budgets */}
          <GlassCard data-glow-card glowColor="rgba(34,197,94,0.06)">
            <SectionHeader
              icon={HiOutlineShieldCheck}
              gradient={GRADIENTS.green}
              title={t('budgets')}
              subtitle={t('page.dashboard.track_spending_limits')}
              action={
                <GradientBadge
                  label={t('common.items_count', { count: budgets.length })}
                  gradient={GRADIENTS.green}
                />
              }
            />

            <div className="space-y-4">
              {budgetCards.length === 0 ? (
                <EmptyState
                  icon={HiOutlineShieldCheck}
                  title={t('page.budgets.empty_title')}
                  description={t('page.dashboard.no_budgets_description')}
                />
              ) : (
                budgetCards.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className="group/budget rounded-2xl border border-[var(--color-border)]/60 p-5 transition-all duration-200 hover:border-[var(--color-border)] hover:shadow-sm hover:bg-[var(--color-surface-soft)]/40"
                  >
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-base font-extrabold text-[var(--color-text)]">{item.label}</p>
                      <GradientBadge label={`${item.progress}%`} gradient={item.gradient} />
                    </div>
                    <AnimatedProgressBar progress={item.progress} gradient={item.gradient} />
                    <div className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
                      <div>
                        <p className="text-[var(--color-text-muted)]">{t('budgets')}</p>
                        <p className="mt-0.5 font-bold text-[var(--color-text)]">{formatCurrency(item.limit)}</p>
                      </div>
                      <div>
                        <p className="text-[var(--color-text-muted)]">{t('page.dashboard.spent')}</p>
                        <p className="mt-0.5 font-bold text-[var(--color-danger)]">{formatCurrency(item.spent)}</p>
                      </div>
                      <div>
                        <p className="text-[var(--color-text-muted)]">{t('page.dashboard.remaining')}</p>
                        <p className={`mt-0.5 font-bold ${item.remaining > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                          {formatCurrency(item.remaining)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>

          {/* Savings Goals */}
          <GlassCard data-glow-card glowColor="rgba(139,92,246,0.06)">
            <SectionHeader
              icon={HiOutlineSparkles}
              gradient={GRADIENTS.purple}
              title={t('savings_goals')}
              subtitle={t('page.dashboard.saving_targets')}
              action={
                <GradientBadge
                  label={t('common.items_count', { count: savingsGoals.length })}
                  gradient={GRADIENTS.purple}
                />
              }
            />

            {savingsGoals.length === 0 ? (
              <EmptyState
                icon={HiOutlineWallet}
                title={t('page.savings.empty_title')}
                description={t('page.dashboard.no_savings_description')}
              />
            ) : (
              <div className="space-y-4">
                {savingsGoals.slice(0, 3).map((goal) => {
                  const progress =
                    Number(goal.target_amount) > 0
                      ? Math.min(100, Math.round((Number(goal.current_amount) / Number(goal.target_amount)) * 100))
                      : 0

                  return (
                    <div
                      key={goal.id}
                      className="group/goal rounded-xl p-3 transition-all duration-200 hover:bg-[var(--color-purple-soft)]/30"
                    >
                      <div className="mb-2.5 flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold text-[var(--color-text)]">{goal.title}</p>
                        <span className="shrink-0 text-sm font-bold text-[var(--color-purple)]">{progress}%</span>
                      </div>
                      <AnimatedProgressBar progress={progress} gradient={GRADIENTS.purple} />
                      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                        <span className="font-bold text-[var(--color-text)]">{formatCurrency(goal.current_amount)}</span>
                        {' / '}
                        {formatCurrency(goal.target_amount)}
                      </p>
                      {goal.deadline && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                          <HiOutlineCalendarDays className="text-xs" />
                          {t('page.dashboard.target_date')}: {formatShortDate(goal.deadline)}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </GlassCard>

          {/* Debts */}
          <GlassCard data-glow-card glowColor="rgba(239,68,68,0.06)">
            <SectionHeader
              icon={HiOutlineCreditCard}
              gradient={GRADIENTS.red}
              title={t('debts')}
              subtitle={t('page.dashboard.outstanding_payments')}
              action={
                <GradientBadge
                  label={t('common.items_count', { count: debts.length })}
                  gradient={GRADIENTS.red}
                />
              }
            />

            {debts.length === 0 ? (
              <EmptyState
                icon={HiOutlineArrowTrendingDown}
                title={t('page.dashboard.no_active_debts')}
                description={t('page.dashboard.no_active_debts_description')}
              />
            ) : (
              <div className="space-y-4">
                {debts.slice(0, 3).map((debt) => {
                  const progress =
                    Number(debt.total_amount) > 0
                      ? Math.min(100, Math.round((Number(debt.paid_amount) / Number(debt.total_amount)) * 100))
                      : 0

                  return (
                    <div
                      key={debt.id}
                      className="group/debt rounded-xl p-3 transition-all duration-200 hover:bg-[var(--color-danger-soft)]/30"
                    >
                      <div className="mb-2.5 flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-bold text-[var(--color-text)]">{debt.title}</p>
                        <span className="shrink-0 text-sm font-bold text-[var(--color-danger)]">{progress}%</span>
                      </div>
                      <AnimatedProgressBar progress={progress} gradient={GRADIENTS.red} />
                      <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                        <span className="font-bold text-[var(--color-text)]">{formatCurrency(debt.paid_amount)}</span>
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

        {/* Notes */}
        <GlassCard data-glow-card glowColor="rgba(6,182,212,0.06)">
          <SectionHeader
            icon={HiOutlineSparkles}
            gradient={GRADIENTS.cyan}
            title={t('notes')}
            subtitle={t('page.dashboard.recent_quick_notes')}
            action={
              <GradientBadge
                label={t('common.items_count', { count: notes.length })}
                gradient={GRADIENTS.cyan}
              />
            }
          />

          {notes.length === 0 ? (
            <EmptyState
              icon={HiOutlineSparkles}
              title={t('page.notes.empty_title')}
              description={t('page.dashboard.no_notes_description')}
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {notes.slice(0, 4).map((note) => (
                <div
                  key={note.id}
                  className="group/note rounded-2xl border border-[var(--color-border)]/60 p-5 transition-all duration-300 hover:border-[#06b6d4]/25 hover:shadow-md hover:bg-[var(--color-surface-soft)]/50"
                >
                  <div className="mb-3 flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-[#06b6d4] shadow-[0_0_6px_rgba(6,182,212,0.4)]" />
                    <p className="truncate text-sm font-bold text-[var(--color-text)]">{note.title}</p>
                  </div>
                  {note.content && (
                    <p className="line-clamp-3 text-sm leading-6 text-[var(--color-text-muted)]">{note.content}</p>
                  )}
                  {note.created_at && (
                    <p className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--color-text-muted)]">
                      <HiOutlineCalendarDays className="text-xs" />
                      {formatShortDate(note.created_at)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

function SectionHeaderSkeleton() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <SkeletonBlock className="h-11 w-11 rounded-2xl" />
      <div className="space-y-1.5">
        <SkeletonBlock className="h-5 w-48 rounded-lg" />
        <SkeletonBlock className="h-3 w-32 rounded-lg" />
      </div>
    </div>
  )
}

export default DashboardPage