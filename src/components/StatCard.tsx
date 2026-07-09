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
    <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-card)]">
      {/* Animated gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
            {title}
          </p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--color-text)] transition-colors duration-200">
            {value}
          </p>
        </div>

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${style.bg} ${style.color} ring-1 ${style.ring} transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
        >
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  )
}

export default StatCard
