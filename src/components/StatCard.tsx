import type { IconType } from 'react-icons'

interface StatCardProps {
  title: string
  value: string
  accent: 'blue' | 'green' | 'red' | 'purple'
  icon: IconType
}

const accentStyles: Record<string, { bg: string; color: string; gradient: string; ring: string }> = {
  blue: {
    bg: 'bg-[var(--color-primary-pale)]',
    color: 'text-[var(--color-primary)]',
    gradient: 'from-[var(--color-primary)]/10 to-[var(--color-primary)]/5',
    ring: 'ring-[var(--color-primary)]/10',
  },
  green: {
    bg: 'bg-[var(--color-success-soft)]',
    color: 'text-[var(--color-success)]',
    gradient: 'from-[var(--color-success)]/10 to-[var(--color-success)]/5',
    ring: 'ring-[var(--color-success)]/10',
  },
  red: {
    bg: 'bg-[var(--color-danger-soft)]',
    color: 'text-[var(--color-danger)]',
    gradient: 'from-[var(--color-danger)]/10 to-[var(--color-danger)]/5',
    ring: 'ring-[var(--color-danger)]/10',
  },
  purple: {
    bg: 'bg-[var(--color-purple-soft)]',
    color: 'text-[var(--color-purple)]',
    gradient: 'from-[var(--color-purple)]/10 to-[var(--color-purple)]/5',
    ring: 'ring-[var(--color-purple)]/10',
  },
}

function StatCard({ title, value, accent, icon: Icon }: StatCardProps) {
  const style = accentStyles[accent]

  return (
    <div className="mobile-surface-card lift-hover group relative overflow-hidden rounded-[20px] p-4 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] sm:rounded-[28px] sm:p-6">
      {/* Animated gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="relative flex items-start gap-3 sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)] sm:text-sm">
            {title}
          </p>
          <p className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--color-text)] transition-colors duration-200 sm:mt-3 sm:text-3xl">
            {value}
          </p>
        </div>

        <div
          className={`mobile-icon-chip flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${style.bg} ${style.color} ring-1 ${style.ring} transition-all duration-300 group-hover:scale-[1.08] sm:h-14 sm:w-14`}
        >
          <Icon className="text-xl sm:text-2xl" />
        </div>
      </div>
    </div>
  )
}

export default StatCard
