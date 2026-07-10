import type { IconType } from 'react-icons'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: IconType
  title: string
  description: string
  action?: ReactNode
}

function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="group relative overflow-hidden rounded-[24px] border border-dashed border-[var(--color-border-strong)]/70 bg-[linear-gradient(170deg,var(--color-surface-strong)_0%,var(--color-surface-muted)_100%)] px-4 py-8 text-center shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-card)] sm:rounded-[32px] sm:px-6 sm:py-14">
      {/* Decorative elements */}
      <div className="absolute inset-x-0 top-0 h-28 rounded-b-[50px] bg-[radial-gradient(circle_at_center,rgba(79,124,255,0.12)_0%,transparent_70%)]" />
      <div className="absolute -right-12 top-8 h-28 w-28 rounded-full bg-[var(--color-primary)]/6 blur-3xl transition-all duration-500 group-hover:scale-110" />
      <div className="absolute -left-10 bottom-6 h-24 w-24 rounded-full bg-[var(--color-success)]/6 blur-3xl transition-all duration-500 group-hover:scale-110" />

      {/* Icon container */}
      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[var(--color-surface)] text-[var(--color-primary)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--color-primary)]/12 transition-all duration-300 group-hover:shadow-[var(--shadow-card)] sm:h-[72px] sm:w-[72px] sm:rounded-[24px]">
        <div className="absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(126,162,255,0.18),transparent_70%)]" />
        <Icon className="relative text-[26px] sm:text-[30px]" />
      </div>

      {/* Text content */}
      <div className="relative mx-auto mt-5 max-w-md">
        <h4 className="text-xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-[22px]">
          {title}
        </h4>
        <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)] sm:leading-7">
          {description}
        </p>
      </div>

      {/* Action */}
      {action && (
        <div className="relative mt-6 flex justify-center">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState
