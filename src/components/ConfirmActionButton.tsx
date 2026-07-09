import { useState, useEffect, type ReactNode } from 'react'
import type { IconType } from 'react-icons'
import { usePreferences } from '../hooks/usePreferences'

interface ConfirmActionButtonProps {
  icon: IconType
  label: string
  confirmTitle: string
  confirmText: string
  onConfirm: () => void
  disabled?: boolean
  variant?: 'danger' | 'neutral'
  className?: string
  children?: ReactNode
}

function ConfirmActionButton({
  icon: Icon,
  label,
  confirmTitle,
  confirmText,
  onConfirm,
  disabled = false,
  variant = 'danger',
  className = '',
  children,
}: ConfirmActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = usePreferences()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const isDanger = variant === 'danger'

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className={`rounded-2xl p-3 transition-all duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-40 ${className} ${
          isDanger
            ? 'bg-[var(--color-danger-soft)] text-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white active:scale-95'
            : 'border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-text)] active:scale-95'
        }`}
        aria-label={label}
        title={label}
      >
        {children ?? <Icon className="text-lg" />}
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-sm transition-all duration-300 ease-out ${
          isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      >
        {/* Modal */}
        <div
          className={`w-full max-w-md rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-6 shadow-[0_32px_64px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-all duration-300 ease-out ${
            isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
          }`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              isDanger
                ? 'bg-gradient-to-br from-[var(--color-danger-soft)] to-[#ffd4d4] text-[var(--color-danger)]'
                : 'bg-[var(--color-surface-soft)] text-[var(--color-text-muted)]'
            }`}
          >
            <Icon className="text-2xl" />
          </div>

          <h4
            id="confirm-title"
            className="mt-4 text-xl font-extrabold tracking-tight text-[var(--color-text)]"
          >
            {confirmTitle}
          </h4>

          <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{confirmText}</p>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] transition-all duration-200 ease-out hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)] active:scale-[0.97]"
            >
              {t('cancel')}
            </button>

            <button
              type="button"
              onClick={() => {
                onConfirm()
                setIsOpen(false)
              }}
              className={`flex-1 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-sm transition-all duration-200 ease-out active:scale-[0.97] ${
                isDanger
                  ? 'bg-gradient-to-br from-[var(--color-danger)] to-[#ff6b6b] hover:from-[#ff3b3b] hover:to-[#ff5252]'
                  : 'bg-gradient-to-br from-[var(--color-text)] to-[var(--color-text-muted)] hover:opacity-92'
              }`}
            >
              {t('confirm')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ConfirmActionButton
