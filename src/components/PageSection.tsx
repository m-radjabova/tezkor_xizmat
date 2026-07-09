import type { ReactNode } from 'react'

interface PageSectionProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

function PageSection({ title, subtitle, action, children, className = '' }: PageSectionProps) {
  return (
    <section
      className={`rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-6 shadow-[var(--shadow-soft)] backdrop-blur transition-all duration-200 hover:shadow-[var(--shadow-card)] ${className}`.trim()}
    >
      {(title || action) && (
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-extrabold tracking-tight text-[var(--color-text)]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div className="shrink-0 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
              {action}
            </div>
          )}
        </div>
      )}
      <div className="space-y-3">
        {children}
      </div>
    </section>
  )
}

export default PageSection
