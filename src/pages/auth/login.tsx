import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { HiOutlineArrowRight, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2'
import { AxiosError } from 'axios'
import { useAuth } from '../../hooks/useAuth'
import { usePreferences } from '../../hooks/usePreferences'
import type { LoginPayload } from '../../types'
import { showErrorToast } from '../../utils/toast'
import authBg from '../../assets/images/auth-bg.jpg'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { t } = usePreferences()
  const [errorMessage, setErrorMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const loginSchema = z.object({
    email: z.email(t('auth.validation.email')),
    password: z.string().min(6, t('auth.validation.password')),
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  })

  const from = (location.state as { from?: string } | null)?.from || '/dashboard'

  const onSubmit = async (values: LoginPayload) => {
    try {
      setErrorMessage('')
      await login(values)
      navigate(from, { replace: true })
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.detail : t('auth.login_failed')
      const nextMessage = typeof message === 'string' ? message : t('auth.login_failed')
      setErrorMessage(nextMessage)
      showErrorToast(nextMessage)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Image */}
      <div className="relative hidden w-1/2 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/80 to-[var(--color-primary-soft)]/70 mix-blend-multiply" />
        <img
          src={authBg}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center bg-[var(--color-bg)] px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-pale)] text-[var(--color-primary)] shadow-sm">
              <HiOutlineLockClosed className="text-2xl" />
            </div>
            <h1 className="text-3xl font-extrabold text-[var(--color-text)]">{t('auth.welcome_back')}</h1>
            <p className="mt-2 text-[var(--color-text-muted)]">{t('auth.login_subtitle')}</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">{t('auth.email')}</label>
              <input
                type="email"
                {...register('email')}
                placeholder={t('auth.email_placeholder')}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 text-sm outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
              />
              {errors.email && <p className="mt-1.5 text-sm text-[var(--color-danger)]">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">{t('auth.password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder={t('auth.password_placeholder')}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 pr-11 text-sm outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/50 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text)]"
                >
                  {showPassword ? <HiOutlineEyeSlash className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-[var(--color-danger)]">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-sm text-[var(--color-text-muted)]">{t('auth.remember_me')}</span>
              </label>
              <a href="#" className="text-sm font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-soft)]">
                {t('auth.forgot_password')}
              </a>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-[var(--color-danger)]/20 bg-[var(--color-danger-soft)] px-4 py-3 text-sm font-medium text-[var(--color-danger)]">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20 transition-all duration-200 hover:bg-[var(--color-primary-soft)] hover:shadow-xl hover:shadow-[var(--color-primary)]/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t('auth.signing_in')}
                </span>
              ) : (
                <>
                  {t('auth.login')}
                  <HiOutlineArrowRight className="text-lg" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="text-sm text-[var(--color-text-muted)]">{t('auth.or_continue_with')}</span>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          {/* Social Buttons */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text)] transition-all duration-200 hover:bg-[var(--color-surface-soft)] active:scale-[0.98]"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google
          </button>

          {/* Footer Link */}
          <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-soft)]">
              {t('auth.create_one')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage