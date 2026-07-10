import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  HiOutlineArrowTrendingDown,
  HiOutlineArrowTrendingUp,
  HiOutlineChartBarSquare,
  HiOutlineWallet,
  HiOutlineShieldCheck,
  HiOutlineBanknotes,
} from 'react-icons/hi2'
import { useBudgets } from '../../hooks/useBudgets'
import { useCategories } from '../../hooks/useCategories'
import { usePreferences } from '../../hooks/usePreferences'
import { useSavingsGoals } from '../../hooks/useSavingsGoals'
import { useTransactions } from '../../hooks/useTransactions'
import { filterTransactions } from '../../utils/filters'
import { formatCurrency, formatShortDate } from '../../utils/format'

const chartColors = ['#e5a4b8', '#22c55e', '#fb923c', '#8b5cf6', '#ec4899', '#14b8a6', '#facc15', '#cbd5e1']

function formatTooltipCurrency(value: number | string | readonly (number | string)[] | undefined) {
  const normalized = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0)
  return formatCurrency(normalized)
}

// ─── Glass Card ─────────────────────────────────────────────
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-surface-strong)] to-[var(--color-surface-muted)] p-6 shadow-[var(--shadow-soft)] backdrop-blur-xl transition-all duration-500 hover:shadow-[var(--shadow-card)] hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </div>
  )
}

// ─── Section Header ─────────────────────────────────────────
function SectionHeader({ icon: Icon, title, subtitle, gradient, count }: { icon: React.ComponentType<{ className?: string }>; title: string; subtitle: string; gradient: string; count?: string }) {
  const gradientColors: Record<string, string> = {
    red: 'from-[#ef4444] to-[#f87171]',
    green: 'from-[#22c55e] to-[#4ade80]',
    purple: 'from-[#8b5cf6] to-[#a78bfa]',
    blue: 'from-[var(--color-primary)] to-[var(--color-primary-soft)]',
    orange: 'from-[#fb923c] to-[#fbbf24]',
    teal: 'from-[#14b8a6] to-[#2dd4bf]',
  }
  const shadowColors: Record<string, string> = {
    red: 'shadow-[#ef4444]/20',
    green: 'shadow-[#22c55e]/20',
    purple: 'shadow-[#8b5cf6]/20',
    blue: 'shadow-[var(--color-primary)]/20',
    orange: 'shadow-[#fb923c]/20',
    teal: 'shadow-[#14b8a6]/20',
  }
  const bgColors: Record<string, string> = {
    red: 'from-[#ef4444]/10 to-[#f87171]/10',
    green: 'from-[#22c55e]/10 to-[#4ade80]/10',
    purple: 'from-[#8b5cf6]/10 to-[#a78bfa]/10',
    blue: 'from-[var(--color-primary)]/10 to-[var(--color-primary-soft)]/10',
    orange: 'from-[#fb923c]/10 to-[#fbbf24]/10',
    teal: 'from-[#14b8a6]/10 to-[#2dd4bf]/10',
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientColors[gradient] || gradientColors.blue} text-white shadow-lg ${shadowColors[gradient] || shadowColors.blue}`}>
          <Icon className="text-xl" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-[var(--color-text)]">{title}</h2>
          <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>
        </div>
      </div>
      {count && (
        <span className={`w-fit rounded-full bg-gradient-to-r ${bgColors[gradient] || bgColors.blue} px-4 py-1.5 text-sm font-bold text-[var(--color-primary)]`}>
          {count}
        </span>
      )}
    </div>
  )
}

// ─── Empty Analytics State ──────────────────────────────────
function AnalyticsEmptyState({ icon: Icon, title, description }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary-pale)] to-[var(--color-purple-soft)] mb-4">
        <Icon className="text-3xl text-[var(--color-primary)]" />
      </div>
      <p className="text-lg font-extrabold text-[var(--color-text)]">{title}</p>
      <p className="mt-1 max-w-[280px] text-center text-sm text-[var(--color-text-muted)]">{description}</p>
    </div>
  )
}

function AnalyticsPage() {
  const { t } = usePreferences()
  const { transactions } = useTransactions()
  const { budgets } = useBudgets()
  const { categories } = useCategories()
  const { savingsGoals } = useSavingsGoals()
  const { dateFilter, transactionSearch } = usePreferences()

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, dateFilter, transactionSearch),
    [dateFilter, transactionSearch, transactions],
  )

  const expenseTrend = useMemo(
    () =>
      filteredTransactions
        .filter((item) => item.type === 'expense')
        .slice(0, 6)
        .reverse()
        .map((item) => ({
          id: item.id,
          label: formatShortDate(item.transaction_date),
          title: item.title,
          amount: Number(item.amount),
        })),
    [filteredTransactions],
  )

  const incomeTrend = useMemo(
    () =>
      filteredTransactions
        .filter((item) => item.type === 'income')
        .slice(0, 6)
        .reverse()
        .map((item) => ({
          id: item.id,
          label: formatShortDate(item.transaction_date),
          title: item.title,
          amount: Number(item.amount),
        })),
    [filteredTransactions],
  )

  const savingsTrend = useMemo(
    () =>
      savingsGoals.map((item) => ({
        label: item.title,
        value: Number(item.current_amount),
        target: Number(item.target_amount),
      })),
    [savingsGoals],
  )

  const budgetUsage = useMemo(() => {
    const categoryMap = new Map(categories.map((category) => [category.id, category.name]))

    return budgets.map((budget) => {
      const spent = filteredTransactions
        .filter(
          (transaction) =>
            transaction.type === 'expense' &&
            transaction.category_id === budget.category_id,
        )
        .reduce((total, transaction) => total + Number(transaction.amount), 0)

      const limit = Number(budget.limit_amount)
      return {
        id: budget.id,
        label: categoryMap.get(budget.category_id ?? '') ?? t('common.no_category'),
        spent,
        limit,
        percent: limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0,
        fill: limit > 0 && spent / limit >= 0.8 ? '#ef4444' : '#e5a4b8',
      }
    })
  }, [budgets, categories, filteredTransactions, t])

  const hasExpenseData = expenseTrend.length > 0
  const hasIncomeData = incomeTrend.length > 0
  const hasSavingsData = savingsTrend.length > 0
  const hasBudgetData = budgetUsage.length > 0

  return (
    <div className="mobile-page space-y-6 p-2 sm:p-3 md:space-y-8 md:p-6 lg:p-8">
      <div className="mobile-surface-card overflow-hidden rounded-[28px] p-2 sm:hidden">
        {[
          { label: t('page.analytics.transactions'), value: String(filteredTransactions.length), icon: HiOutlineBanknotes, tone: 'text-[var(--color-primary)] bg-[var(--color-primary-pale)]' },
          { label: t('page.analytics.budgets'), value: String(budgets.length), icon: HiOutlineArrowTrendingUp, tone: 'text-[var(--color-success)] bg-[var(--color-success-soft)]' },
          { label: t('savings_goals'), value: String(savingsGoals.length), icon: HiOutlineWallet, tone: 'text-[var(--color-purple)] bg-[var(--color-purple-soft)]' },
          { label: t('categories'), value: String(categories.length), icon: HiOutlineChartBarSquare, tone: 'text-[var(--color-danger)] bg-[var(--color-danger-soft)]' },
        ].map((item, index, list) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className={`flex items-center gap-3 px-3 py-3 ${index < list.length - 1 ? 'border-b border-[var(--color-border)]/70' : ''}`}
            >
              <div className={`mobile-icon-chip flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${item.tone}`}>
                <Icon className="text-lg" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
                  {item.label}
                </p>
                <p className="mt-1 text-xl font-extrabold tracking-tight text-[var(--color-text)]">{item.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-4 md:gap-5">
        <div className="mobile-surface-card group relative overflow-hidden rounded-[28px] p-5 transition-all duration-300 hover:shadow-[var(--shadow-card)] sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-pale)] text-[var(--color-primary)] ring-1 ring-[var(--color-primary)]/10">
              <HiOutlineBanknotes className="text-xl" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{t('page.analytics.transactions')}</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--color-text)]">{filteredTransactions.length}</p>
          </div>
        </div>

        <div className="mobile-surface-card group relative overflow-hidden rounded-[28px] p-5 transition-all duration-300 hover:shadow-[var(--shadow-card)] sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-success)]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-success-soft)] text-[var(--color-success)] ring-1 ring-[var(--color-success)]/10">
              <HiOutlineArrowTrendingUp className="text-xl" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{t('page.analytics.budgets')}</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--color-text)]">{budgets.length}</p>
          </div>
        </div>

        <div className="mobile-surface-card group relative overflow-hidden rounded-[28px] p-5 transition-all duration-300 hover:shadow-[var(--shadow-card)] sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-purple)]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-purple-soft)] text-[var(--color-purple)] ring-1 ring-[var(--color-purple)]/10">
              <HiOutlineWallet className="text-xl" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{t('savings_goals')}</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--color-text)]">{savingsGoals.length}</p>
          </div>
        </div>

        <div className="mobile-surface-card group relative overflow-hidden rounded-[28px] p-5 transition-all duration-300 hover:shadow-[var(--shadow-card)] sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-danger)]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-danger-soft)] text-[var(--color-danger)] ring-1 ring-[var(--color-danger)]/10">
              <HiOutlineChartBarSquare className="text-xl" />
            </div>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{t('categories')}</p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--color-text)]">{categories.length}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2 xl:gap-8">
        <GlassCard className="p-4 sm:p-6">
          <div className="mb-5">
            <SectionHeader
              icon={HiOutlineArrowTrendingDown}
              title={t('page.analytics.expense_trend')}
              subtitle={t('page.analytics.expense_trend_subtitle')}
              gradient="red"
              count={hasExpenseData ? t('page.analytics.items_count', { count: expenseTrend.length }) : undefined}
            />
          </div>
          {!hasExpenseData ? (
            <AnalyticsEmptyState
              icon={HiOutlineArrowTrendingDown}
              title={t('page.analytics.no_expense_data')}
              description={t('page.analytics.no_expense_data_description')}
            />
          ) : (
            <div className="h-[220px] w-full sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseTrend} margin={{ top: 12, right: 8, left: 12, bottom: 4 }}>
                  <defs>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#f87171" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <YAxis width={96} tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} tickFormatter={(value) => formatCurrency(value).replace('.00', '')} />
                  <Tooltip
                    formatter={(value) => formatTooltipCurrency(value)}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.title ?? ''}
                    contentStyle={{
                      borderRadius: '18px',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-soft)',
                      backdropFilter: 'blur(12px)',
                      background: 'rgba(255,255,255,0.9)',
                    }}
                  />
                  <Bar dataKey="amount" radius={[18, 18, 0, 0]} fill="url(#expenseGradient)" animationBegin={200} animationDuration={1200} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="mb-5">
            <SectionHeader
              icon={HiOutlineArrowTrendingUp}
              title={t('page.analytics.income_trend')}
              subtitle={t('page.analytics.income_trend_subtitle')}
              gradient="green"
              count={hasIncomeData ? t('page.analytics.items_count', { count: incomeTrend.length }) : undefined}
            />
          </div>
          {!hasIncomeData ? (
            <AnalyticsEmptyState
              icon={HiOutlineArrowTrendingUp}
              title={t('page.analytics.no_income_data')}
              description={t('page.analytics.no_income_data_description')}
            />
          ) : (
            <div className="h-[220px] w-full sm:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeTrend} margin={{ top: 12, right: 8, left: 12, bottom: 4 }}>
                  <defs>
                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                      <stop offset="100%" stopColor="#4ade80" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
                  <YAxis width={96} tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} tickFormatter={(value) => formatCurrency(value).replace('.00', '')} />
                  <Tooltip
                    formatter={(value) => formatTooltipCurrency(value)}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.title ?? ''}
                    contentStyle={{
                      borderRadius: '18px',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-soft)',
                      backdropFilter: 'blur(12px)',
                      background: 'rgba(255,255,255,0.9)',
                    }}
                  />
                  <Bar dataKey="amount" radius={[18, 18, 0, 0]} fill="url(#incomeGradient)" animationBegin={400} animationDuration={1200} animationEasing="ease-out" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2 xl:gap-8">
        <GlassCard className="p-4 sm:p-6">
          <div className="mb-5">
            <SectionHeader
              icon={HiOutlineWallet}
              title={t('page.analytics.savings_trend')}
              subtitle={t('page.analytics.savings_trend_subtitle')}
              gradient="purple"
              count={hasSavingsData ? t('page.analytics.goals_count', { count: savingsTrend.length }) : undefined}
            />
          </div>
          {!hasSavingsData ? (
            <AnalyticsEmptyState
              icon={HiOutlineWallet}
              title={t('page.analytics.no_savings_data')}
              description={t('page.analytics.no_savings_data_description')}
            />
          ) : (
            <div className="h-[240px] w-full sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={savingsTrend} layout="vertical" margin={{ top: 8, right: 18, left: 18, bottom: 8 }}>
                  <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} tickFormatter={(value) => formatCurrency(value).replace('.00', '')} />
                  <YAxis dataKey="label" type="category" width={100} tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text)', fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, _name, item) => [`${formatTooltipCurrency(value)} / ${formatCurrency(Number(item.payload.target ?? 0))}`, t('common.saved')]}
                    contentStyle={{
                      borderRadius: '18px',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-soft)',
                      backdropFilter: 'blur(12px)',
                      background: 'rgba(255,255,255,0.9)',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 14, 14, 0]} animationBegin={200} animationDuration={1200} animationEasing="ease-out">
                    {savingsTrend.map((_, index) => {
                      const gradientId = `savingsCellGradient${index}`
                      return (
                        <defs key={gradientId}>
                          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor={chartColors[index % chartColors.length]} stopOpacity={0.7} />
                            <stop offset="100%" stopColor={chartColors[index % chartColors.length]} stopOpacity={1} />
                          </linearGradient>
                        </defs>
                      )
                    })}
                    {savingsTrend.map((item, index) => (
                      <Cell key={item.label} fill={`url(#savingsCellGradient${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <div className="mb-5">
            <SectionHeader
              icon={HiOutlineShieldCheck}
              title={t('page.analytics.budget_usage')}
              subtitle={t('page.analytics.budget_usage_subtitle')}
              gradient="blue"
              count={hasBudgetData ? t('page.analytics.budgets_count', { count: budgetUsage.length }) : undefined}
            />
          </div>
          {!hasBudgetData ? (
            <AnalyticsEmptyState
              icon={HiOutlineShieldCheck}
              title={t('page.budgets.empty_title')}
              description={t('page.analytics.no_budgets_description')}
            />
          ) : (
            <div className="h-[240px] w-full sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={budgetUsage} layout="vertical" margin={{ top: 8, right: 18, left: 18, bottom: 8 }}>
                  <CartesianGrid horizontal={false} stroke="var(--color-border)" strokeDasharray="3 3" strokeOpacity={0.5} />
                  <XAxis type="number" domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
                  <YAxis dataKey="label" type="category" width={100} tickLine={false} axisLine={false} tick={{ fill: 'var(--color-text)', fontSize: 12 }} />
                  <Tooltip
                    formatter={(value, _name, item) => [`${Number(Array.isArray(value) ? value[0] ?? 0 : value ?? 0)}%`, `${formatCurrency(Number(item.payload.spent ?? 0))} / ${formatCurrency(Number(item.payload.limit ?? 0))}`]}
                    contentStyle={{
                      borderRadius: '18px',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-soft)',
                      backdropFilter: 'blur(12px)',
                      background: 'rgba(255,255,255,0.9)',
                    }}
                  />
                  <Bar dataKey="percent" radius={[0, 14, 14, 0]} animationBegin={400} animationDuration={1200} animationEasing="ease-out">
                    {budgetUsage.map((item) => (
                      <Cell key={item.id} fill={item.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

export default AnalyticsPage
