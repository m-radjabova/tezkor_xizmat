import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { HiOutlineArrowRight, HiOutlineLockClosed, HiOutlineWallet } from 'react-icons/hi2'
import { AxiosError } from 'axios'
import { useAuth } from '../../hooks/useAuth'
import { usePreferences } from '../../hooks/usePreferences'
import type { LoginPayload } from '../../types'
import { showErrorToast } from '../../utils/toast'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { t } = usePreferences()
  const [errorMessage, setErrorMessage] = useState('')
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
    <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="login-title">
      <aside className="hidden rounded-[36px] border border-white/60 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-soft)] p-10 text-white shadow-[var(--shadow-card)] lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-extrabold">B</div>
          <div>
            <h2 className="text-2xl font-extrabold">{t('app_name')}</h2>
            <p className="mt-1 text-sm text-white/80">{t('auth.hero_tagline')}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold leading-tight">{t('auth.login_hero_title')}</h1>
            <p className="mt-4 text-base leading-7 text-white/85">
              {t('auth.login_hero_description')}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-white/14 p-5 backdrop-blur">
              <p className="text-sm text-white/75">{t('auth.this_month_balance')}</p>
              <p className="mt-2 text-3xl font-extrabold">$2,450.00</p>
            </div>
            <div className="rounded-3xl bg-white/14 p-5 backdrop-blur">
              <p className="text-sm text-white/75">{t('auth.saved_so_far')}</p>
              <p className="mt-2 text-3xl font-extrabold">$1,200.00</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl bg-white/14 px-5 py-4 backdrop-blur">
          <HiOutlineWallet className="text-2xl" />
          <p className="text-sm leading-6 text-white/85">{t('auth.hero_footer')}</p>
        </div>
      </aside>

      <article className="rounded-[36px] border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-6 shadow-[var(--shadow-card)] backdrop-blur sm:p-8 lg:p-10">
        <div className="mb-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-pale)] text-[var(--color-primary)]">
            <HiOutlineLockClosed className="text-2xl" />
          </div>
          <h1 id="login-title" className="text-3xl font-extrabold text-[var(--color-text)]">{t('auth.welcome_back')}</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{t('auth.login_subtitle')}</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">{t('auth.email')}</label>
            <input
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 outline-none transition focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)]"
            />
            {errors.email && <p className="mt-2 text-sm text-[var(--color-danger)]">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">{t('auth.password')}</label>
            <input
              type="password"
              {...register('password')}
              placeholder={t('auth.password_placeholder')}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 outline-none transition focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)]"
            />
            {errors.password && <p className="mt-2 text-sm text-[var(--color-danger)]">{errors.password.message}</p>}
          </div>

          {errorMessage && <div className="rounded-2xl bg-[var(--color-danger-soft)] px-4 py-3 text-sm font-medium text-[var(--color-danger)]">{errorMessage}</div>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-soft)] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? t('auth.signing_in') : t('auth.login')}
            <HiOutlineArrowRight className="text-lg" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          {t('auth.no_account')}{' '}
          <Link to="/register" className="font-semibold text-[var(--color-primary)]">
            {t('auth.create_one')}
          </Link>
        </p>
      </article>
    </section>
  )
}

export default LoginPage
