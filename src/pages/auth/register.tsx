import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { HiOutlineArrowRight, HiOutlineSparkles } from 'react-icons/hi2'
import { useAuth } from '../../hooks/useAuth'
import { usePreferences } from '../../hooks/usePreferences'
import type { RegisterPayload } from '../../types'
import { showErrorToast } from '../../utils/toast'

function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const { t } = usePreferences()
  const [errorMessage, setErrorMessage] = useState('')
  const registerSchema = z.object({
    full_name: z.string().min(2, t('auth.validation.full_name')),
    email: z.email(t('auth.validation.email')),
    password: z.string().min(6, t('auth.validation.password')),
  })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterPayload) => {
    try {
      setErrorMessage('')
      await registerUser(values)
      navigate('/dashboard', { replace: true })
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.detail : t('auth.registration_failed')
      const nextMessage = typeof message === 'string' ? message : t('auth.registration_failed')
      setErrorMessage(nextMessage)
      showErrorToast(nextMessage)
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl" aria-labelledby="register-title">
      <article className="rounded-[36px] border border-[var(--color-border)] bg-[var(--color-surface-strong)] p-6 shadow-[var(--shadow-card)] backdrop-blur sm:p-8 lg:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--color-primary-pale)] text-[var(--color-primary)]">
            <HiOutlineSparkles className="text-3xl" />
          </div>
          <h1 id="register-title" className="text-3xl font-extrabold text-[var(--color-text)]">
            {t('auth.create_account')}
          </h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">{t('auth.register_subtitle')}</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">{t('auth.full_name')}</label>
            <input
              type="text"
              {...register('full_name')}
              placeholder={t('auth.full_name_placeholder')}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 outline-none transition focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)]"
            />
            {errors.full_name && <p className="mt-2 text-sm text-[var(--color-danger)]">{errors.full_name.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">{t('auth.email')}</label>
            <input
              type="email"
              {...register('email')}
              placeholder={t('auth.email_placeholder')}
              className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] px-4 py-3 outline-none transition focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)]"
            />
            {errors.email && <p className="mt-2 text-sm text-[var(--color-danger)]">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">{t('auth.password')}</label>
            <input
              type="password"
              {...register('password')}
              placeholder={t('auth.create_password')}
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
            {isSubmitting ? t('auth.creating_account') : t('auth.register')}
            <HiOutlineArrowRight className="text-lg" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          {t('auth.have_account')}{' '}
          <Link to="/login" className="font-semibold text-[var(--color-primary)]">
            {t('auth.login_here')}
          </Link>
        </p>
      </article>
    </section>
  )
}

export default RegisterPage
