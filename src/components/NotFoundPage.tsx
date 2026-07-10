import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi2'
import { translate } from '../utils/i18n'

function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="group relative overflow-hidden rounded-[24px] border border-dashed border-[var(--color-border-strong)]/70 bg-[linear-gradient(170deg,var(--color-surface-strong)_0%,var(--color-surface-muted)_100%)] px-4 py-10 text-center shadow-[var(--shadow-soft)] transition-all duration-300 hover:shadow-[var(--shadow-card)] sm:rounded-[32px] sm:px-8 sm:py-16 md:py-20">
        {/* Decorative elements */}
        <div className="absolute inset-x-0 top-0 h-32 rounded-b-[50px] bg-[radial-gradient(circle_at_center,rgba(79,124,255,0.12)_0%,transparent_70%)]" />
        <div className="absolute -right-12 top-8 h-32 w-32 rounded-full bg-[var(--color-primary)]/6 blur-3xl transition-all duration-500 group-hover:scale-110" />
        <div className="absolute -left-10 bottom-6 h-28 w-28 rounded-full bg-[var(--color-error)]/6 blur-3xl transition-all duration-500 group-hover:scale-110" />

        {/* Icon container */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-[var(--color-surface)] text-[var(--color-error)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--color-error)]/12 transition-all duration-300 group-hover:shadow-[var(--shadow-card)] sm:h-[88px] sm:w-[88px] sm:rounded-[28px]">
          <div className="absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_70%)]" />
          <HiOutlineExclamationCircle className="relative text-[36px] sm:text-[40px]" />
        </div>

        {/* Text content */}
        <div className="relative mx-auto mt-6 max-w-lg">
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-[40px]">
            {translate('notfound.title', {}, { fallback: '404' })}
          </h1>
          <h2 className="mt-3 text-xl font-bold text-[var(--color-text)] sm:text-2xl">
            {translate('notfound.heading', {}, { fallback: 'Page Not Found' })}
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)] sm:leading-7">
            {translate('notfound.description', {}, { fallback: 'Sorry, we couldn\'t find the page you\'re looking for. It might have been removed, renamed, or doesn\'t exist.' })}
          </p>
        </div>

        {/* Action buttons */}
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition-all duration-200 hover:bg-[var(--color-primary-soft)] hover:shadow-[var(--shadow-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:ring-offset-2"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            {translate('notfound.go_home', {}, { fallback: 'Go to Dashboard' })}
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-3 text-sm font-semibold text-[var(--color-text)] shadow-[var(--shadow-soft)] transition-all duration-200 hover:bg-[var(--color-surface-muted)] hover:shadow-[var(--shadow-card)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:ring-offset-2"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {translate('notfound.go_back', {}, { fallback: 'Go Back' })}
          </button>
        </div>

        {/* Help text */}
        <p className="relative mt-6 text-xs text-[var(--color-text-muted)]">
          {translate('notfound.help_text', {}, { fallback: 'If you believe this is an error, please contact support.' })}
        </p>
      </div>
    </div>
  )
}

export default NotFoundPage