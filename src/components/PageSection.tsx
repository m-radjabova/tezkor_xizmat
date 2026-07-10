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
      className={`mobile-surface-card lift-hover rounded-[28px] p-4 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] sm:rounded-[32px] sm:p-5 lg:p-6 ${className}`.trim()}
    >
      {(title || action) && (
        <div className="mb-4 flex flex-col gap-2 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <div>
            {title && (
              <h3 className="text-base font-extrabold tracking-tight text-[var(--color-text)] sm:text-lg">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-text-muted)] sm:mt-1 sm:text-sm">
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
