import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HiOutlineArrowPath,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineEnvelope,
  HiOutlineGlobeAlt,
  HiOutlineIdentification,
  HiOutlineLockClosed,
  HiOutlineMagnifyingGlass,
  HiOutlineMoon,
  HiOutlinePhoto,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineTrash,
  HiOutlineUsers,
  HiOutlineXMark,
  HiOutlineCog6Tooth,
  HiOutlineKey,
} from 'react-icons/hi2'
import ConfirmActionButton from '../../components/ConfirmActionButton'
import EmptyState from '../../components/EmptyState'
import { useAuth } from '../../hooks/useAuth'
import { usePreferences } from '../../hooks/usePreferences'
import { useProfile } from '../../hooks/useProfile'
import { useUsers } from '../../hooks/useUsers'

const roleSchema = z.object({
  nextRole: z.enum(['user', 'admin']),
})

type RoleFormValues = z.infer<typeof roleSchema>
type ProfileFormValues = {
  full_name: string
  email: string
}

type PasswordFormValues = {
  current_password: string
  new_password: string
  confirm_new_password: string
}

type Accent = 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'pink' | 'indigo'

const ACCENTS: Record<Accent, { solid: string; text: string; soft: string; ring: string; hover: string }> = {
  blue: {
    solid: 'bg-[var(--color-primary)]',
    text: 'text-[var(--color-primary)]',
    soft: 'bg-[var(--color-primary-pale)]',
    ring: 'ring-[var(--color-primary)]/15',
    hover: 'hover:bg-[var(--color-primary-dark)]',
  },
  green: {
    solid: 'bg-emerald-500',
    text: 'text-emerald-600',
    soft: 'bg-emerald-50',
    ring: 'ring-emerald-500/15',
    hover: 'hover:bg-emerald-600',
  },
  purple: {
    solid: 'bg-violet-500',
    text: 'text-violet-600',
    soft: 'bg-violet-50',
    ring: 'ring-violet-500/15',
    hover: 'hover:bg-violet-600',
  },
  orange: {
    solid: 'bg-orange-500',
    text: 'text-orange-600',
    soft: 'bg-orange-50',
    ring: 'ring-orange-500/15',
    hover: 'hover:bg-orange-600',
  },
  teal: {
    solid: 'bg-teal-500',
    text: 'text-teal-600',
    soft: 'bg-teal-50',
    ring: 'ring-teal-500/15',
    hover: 'hover:bg-teal-600',
  },
  pink: {
    solid: 'bg-pink-500',
    text: 'text-pink-600',
    soft: 'bg-pink-50',
    ring: 'ring-pink-500/15',
    hover: 'hover:bg-pink-600',
  },
  indigo: {
    solid: 'bg-indigo-500',
    text: 'text-indigo-600',
    soft: 'bg-indigo-50',
    ring: 'ring-indigo-500/15',
    hover: 'hover:bg-indigo-600',
  },
}

const inputClass =
  'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/50 hover:border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 shadow-sm'

const glassCardClass =
  'backdrop-blur-sm bg-[var(--color-surface)]/80 border border-[var(--color-border)] shadow-xl shadow-black/5'

function initials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
}

function Card({ children, className = '', glass = false }: { children: React.ReactNode; className?: string; glass?: boolean }) {
  return (
    <div
      className={`min-w-0 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl ${
        glass ? glassCardClass : 'bg-[var(--color-surface)] shadow-lg shadow-black/5'
      } ${className}`}
    >
      {children}
    </div>
  )
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  accent,
  count,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  accent: Accent
  count?: string
}) {
  const a = ACCENTS[accent]
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${a.soft} ${a.text}`}>
          <Icon className="text-xl" />
          <div className={`absolute -right-1 -top-1 h-3 w-3 rounded-full ${a.solid} ring-2 ring-[var(--color-surface)]`} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text)]">
            {title}
          </h2>
          <p className="text-sm text-[var(--color-text-muted)]">{subtitle}</p>
        </div>
      </div>
      {count && (
        <span className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold ${a.soft} ${a.text} shadow-sm`}>
          {count}
        </span>
      )}
    </div>
  )
}

function PreferenceRow({
  icon: Icon,
  title,
  accent = 'blue',
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  accent?: Accent
  children: React.ReactNode
}) {
  const a = ACCENTS[accent]
  return (
    <div className="group flex min-w-0 flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-300 hover:border-[var(--color-primary)]/30 hover:shadow-md 2xl:flex-row 2xl:items-center 2xl:justify-between 2xl:gap-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${a.soft} ${a.text} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="text-lg" />
        </div>
        <p className="min-w-0 text-sm font-semibold text-[var(--color-text)]">{title}</p>
      </div>
      <div className="min-w-0 w-full 2xl:w-[240px] 2xl:shrink-0">{children}</div>
    </div>
  )
}

function ThemeToggle({ value, onChange }: { value: 'light' | 'dark'; onChange: (v: 'light' | 'dark') => void }) {
  const { t } = usePreferences()
  const options: { key: 'light' | 'dark'; label: string; icon: typeof HiOutlineSun }[] = [
    { key: 'light', label: t('common.light'), icon: HiOutlineSun },
    { key: 'dark', label: t('common.dark'), icon: HiOutlineMoon },
  ]
  return (
    <div className="relative flex rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1 shadow-inner">
      <div
        className={`absolute top-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-xl bg-[var(--color-primary)] transition-all duration-300 ${
          value === 'light' ? 'left-1' : 'left-[calc(50%+4px)]'
        }`}
      />
      {options.map(({ key, label, icon: Icon }) => {
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={`relative z-10 inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
              active
                ? 'text-white'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <Icon className={`text-lg ${active ? 'drop-shadow-lg' : ''}`} />
            <span className="truncate">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

function UserSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-[var(--color-border)]" />
        <div className="space-y-2.5 flex-1">
          <div className="h-4 w-32 rounded-lg bg-[var(--color-border)]" />
          <div className="h-3 w-44 rounded-lg bg-[var(--color-border)]/70" />
        </div>
      </div>
    </div>
  )
}

function SettingsPage() {
  const navigate = useNavigate()
  const { user, setCurrentUser, logout } = useAuth()
  const { language, currency, themeMode, setLanguage, setCurrency, setThemeMode, t } = usePreferences()
  const {
    updateMe,
    uploadAvatar,
    deleteAvatar,
    changePassword,
    isUpdating: isUpdatingProfile,
    isUploadingAvatar,
    isDeletingAvatar,
    isChangingPassword,
  } = useProfile()
  const { users, isLoading, updateUser, deleteUser, isUpdating, isDeleting } = useUsers(
    user?.role === 'admin',
  )
  const [userQuery, setUserQuery] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  
  const profileSchema = useMemo(
    () =>
      z.object({
        full_name: z.string().min(2, t('page.settings.validation.full_name')),
        email: z.string().email(t('page.settings.validation.email')),
      }),
    [t],
  )

  const passwordSchema = useMemo(
    () =>
      z
        .object({
          current_password: z.string().min(1, t('page.settings.validation.current_password_required')),
          new_password: z.string().min(6, t('auth.validation.password')),
          confirm_new_password: z.string().min(1, t('page.settings.validation.confirm_new_password_required')),
        })
        .refine((data) => data.new_password === data.confirm_new_password, {
          path: ['confirm_new_password'],
          message: t('auth.validation.password_mismatch'),
        }),
    [t],
  )

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors, isDirty: isProfileDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name ?? '',
      email: user?.email ?? '',
    },
  })

  const { register: registerRole, control: roleControl } = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      nextRole: 'user',
    },
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_new_password: '',
    },
  })

  const nextRole = useWatch({ control: roleControl, name: 'nextRole' })

  useEffect(() => {
    resetProfile({
      full_name: user?.full_name ?? '',
      email: user?.email ?? '',
    })
  }, [resetProfile, user?.email, user?.full_name])

  const onSubmitProfile = async (values: ProfileFormValues) => {
    const updatedUser = await updateMe(values)
    setCurrentUser(updatedUser)
    resetProfile(values)
  }

  const handleDeleteAvatar = async () => {
    const updatedUser = await deleteAvatar()
    setCurrentUser(updatedUser)
  }

  const onSubmitPassword = async (values: PasswordFormValues) => {
    await changePassword({
      current_password: values.current_password,
      new_password: values.new_password,
    })
    resetPassword({
      current_password: '',
      new_password: '',
      confirm_new_password: '',
    })
    setShowPasswordForm(false)
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90
        }
        return prev + 10
      })
    }, 100)
    
    try {
      const updatedUser = await uploadAvatar(file)
      setCurrentUser(updatedUser)
      setUploadProgress(100)
      setTimeout(() => setUploadProgress(0), 1000)
    } finally {
      clearInterval(interval)
      event.target.value = ''
    }
  }

  const filteredUsers = useMemo(() => {
    const query = userQuery.trim().toLowerCase()
    if (!query) return users
    return users.filter(
      (item) => item.full_name.toLowerCase().includes(query) || item.email.toLowerCase().includes(query),
    )
  }, [userQuery, users])

  const adminCount = useMemo(() => users.filter((item) => item.role === 'admin').length, [users])

  return (
    <div className="min-h-screen bg-[var(--color-surface)] p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex justify-end">
          
          <button
            onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-all duration-300 hover:bg-red-600 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95"
          >
            <HiOutlineArrowRightOnRectangle className="text-lg" />
            {t('logout')}
          </button>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* Profile Card */}
          <Card className="order-2 xl:order-1 xl:col-span-2">
            <SectionHeader
              icon={HiOutlineIdentification}
              title={t('page.settings.profile_title')}
              subtitle={t('page.settings.profile_subtitle')}
              accent="blue"
            />

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* Avatar column */}
              <div className="flex flex-col items-center gap-4 rounded-2xl bg-[var(--color-surface-muted)] p-5 lg:col-span-1 border border-[var(--color-border)]">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-3xl bg-[var(--color-primary)] opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl" />
                  <label className="relative block cursor-pointer">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={t('page.settings.avatar_alt')}
                        className="h-32 w-32 rounded-3xl border-2 border-[var(--color-border)] object-cover shadow-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                      />
                    ) : (
                      <div className="flex h-32 w-32 items-center justify-center rounded-3xl border-2 border-dashed border-[var(--color-primary)]/30 bg-[var(--color-primary-pale)] text-4xl font-black text-[var(--color-primary)] transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                        {initials(user?.full_name)}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                      <HiOutlinePhoto className="text-lg" />
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>
                </div>

                {uploadProgress > 0 && (
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                      <span>{t('page.settings.uploading')}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-[var(--color-border)] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex w-full flex-col gap-2">
                  <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/30 transition-all duration-300 hover:bg-[var(--color-primary-dark)] hover:shadow-xl hover:shadow-[var(--color-primary)]/40 hover:scale-105 active:scale-95">
                    <HiOutlinePhoto className="text-lg" />
                    {isUploadingAvatar ? t('page.settings.uploading') : user?.avatar_url ? t('page.settings.change_photo') : t('page.settings.upload_photo')}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  </label>

                  {user?.avatar_url && (
                    <ConfirmActionButton
                      icon={HiOutlineTrash}
                      label={t('page.settings.remove_photo')}
                      confirmTitle={t('page.settings.delete_avatar')}
                      confirmText={t('page.settings.delete_avatar_text')}
                      onConfirm={handleDeleteAvatar}
                      disabled={isDeletingAvatar}
                      className="self-center px-5 text-red-600 hover:bg-red-50"
                    />
                  )}
                </div>
              </div>

              {/* Form column */}
              <div className="min-w-0 lg:col-span-2">
                <div className="mb-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary-pale)] px-4 py-2 text-sm font-bold text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                    <HiOutlineShieldCheck className="text-base" />
                    {user?.role === 'admin' ? t('role_admin') : t('role_user')}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-surface-soft)] px-4 py-2 text-sm font-medium text-[var(--color-text-muted)] border border-[var(--color-border)]">
                    <HiOutlineEnvelope className="text-base" />
                    {user?.email ?? '—'}
                  </span>
                </div>

                <form onSubmit={handleProfileSubmit(onSubmitProfile)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="group">
                      <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
                        {t('auth.full_name')}
                      </label>
                      <input 
                        {...registerProfile('full_name')} 
                        placeholder={t('page.settings.full_name_placeholder')} 
                        className={`${inputClass} transition-all duration-300 group-hover:border-[var(--color-primary)]/30`}
                      />
                      {profileErrors.full_name && (
                        <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-red-500" />
                          {profileErrors.full_name.message}
                        </p>
                      )}
                    </div>

                    <div className="group">
                      <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
                        {t('page.settings.email_address')}
                      </label>
                      <input 
                        {...registerProfile('email')} 
                        placeholder={t('auth.email_placeholder')} 
                        className={`${inputClass} transition-all duration-300 group-hover:border-[var(--color-primary)]/30`}
                      />
                      {profileErrors.email && (
                        <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-red-500" />
                          {profileErrors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile || !isProfileDirty}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--color-primary)]/30 transition-all duration-300 hover:bg-[var(--color-primary-dark)] hover:shadow-xl hover:shadow-[var(--color-primary)]/40 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                      >
                        <HiOutlineCheckCircle className="text-lg" />
                        {isUpdatingProfile ? t('common.saving') : t('page.settings.save_changes')}
                      </button>

                      {isProfileDirty && !isUpdatingProfile && (
                        <button
                          type="button"
                          onClick={() =>
                            resetProfile({
                              full_name: user?.full_name ?? '',
                              email: user?.email ?? '',
                            })
                          }
                          className="inline-flex items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-semibold text-[var(--color-text-muted)] transition-all duration-300 hover:bg-[var(--color-surface-soft)] hover:border-[var(--color-danger)]/30 hover:text-[var(--color-danger)] active:scale-95"
                        >
                          <HiOutlineXMark className="text-lg" />
                          {t('cancel')}
                        </button>
                      )}
                    </div>

                    {isProfileDirty && !isUpdatingProfile && (
                      <span className="rounded-xl bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-700 border border-yellow-200">
                        {t('page.settings.unsaved_changes')}
                      </span>
                    )}
                  </div>
                </form>

                {/* Password Section */}
                <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                        <HiOutlineKey className="text-lg" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[var(--color-text)]">{t('page.settings.password_title')}</h3>
                        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{t('page.settings.password_subtitle')}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition-all duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-md"
                    >
                      {showPasswordForm ? (
                        <HiOutlineXMark className="text-base" />
                      ) : (
                        <HiOutlineLockClosed className="text-base" />
                      )}
                      {showPasswordForm ? t('cancel') : t('page.settings.change_password')}
                    </button>
                  </div>

                  {showPasswordForm && (
                    <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="mt-4 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
                            {t('page.settings.current_password')}
                          </label>
                          <input
                            type="password"
                            {...registerPassword('current_password')}
                            placeholder={t('page.settings.current_password')}
                            className={inputClass}
                          />
                          {passwordErrors.current_password && (
                            <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
                              <span className="h-1 w-1 rounded-full bg-red-500" />
                              {passwordErrors.current_password.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
                            {t('page.settings.new_password')}
                          </label>
                          <input
                            type="password"
                            {...registerPassword('new_password')}
                            placeholder={t('page.settings.new_password')}
                            className={inputClass}
                          />
                          {passwordErrors.new_password && (
                            <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
                              <span className="h-1 w-1 rounded-full bg-red-500" />
                              {passwordErrors.new_password.message}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">
                          {t('page.settings.confirm_new_password')}
                        </label>
                        <input
                          type="password"
                          {...registerPassword('confirm_new_password')}
                          placeholder={t('page.settings.confirm_new_password')}
                          className={inputClass}
                        />
                        {passwordErrors.confirm_new_password && (
                          <p className="mt-2 text-xs font-medium text-red-500 flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-red-500" />
                            {passwordErrors.confirm_new_password.message}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="inline-flex items-center gap-2 rounded-2xl bg-purple-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/30 transition-all duration-300 hover:bg-purple-600 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <HiOutlineLockClosed className="text-lg" />
                        {isChangingPassword ? t('common.saving') : t('page.settings.change_password')}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Preferences Card */}
          <Card className="order-1 xl:order-2 xl:min-w-0" glass>
            <SectionHeader
              icon={HiOutlineCog6Tooth}
              title={t('settings')}
              subtitle={t('page.settings.preferences_subtitle')}
              accent="purple"
            />

            <div className="mt-6 space-y-4">
              <PreferenceRow icon={HiOutlineGlobeAlt} title={t('language')} accent="blue">
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as 'en' | 'ru')}
                  className={`${inputClass} min-w-0 cursor-pointer bg-[var(--color-surface)]`}
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="ru">🇷🇺 Русский</option>
                </select>
              </PreferenceRow>

              <PreferenceRow icon={HiOutlineCurrencyDollar} title={t('currency')} accent="green">
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value as 'USD' | 'UZS' | 'EUR' | 'RUB')}
                  className={`${inputClass} min-w-0 cursor-pointer bg-[var(--color-surface)]`}
                >
                  <option value="USD">💵 {t('page.settings.currency_usd')}</option>
                  <option value="UZS">💰 {t('page.settings.currency_uzs')}</option>
                  <option value="EUR">💶 {t('page.settings.currency_eur')}</option>
                  <option value="RUB">₽ {t('page.settings.currency_rub')}</option>
                </select>
              </PreferenceRow>

              <PreferenceRow icon={HiOutlineMoon} title={t('theme')} accent="purple">
                <ThemeToggle value={themeMode} onChange={setThemeMode} />
              </PreferenceRow>

              
            </div>
          </Card>
        </div>

        {/* Admin Panel */}
        {user?.role === 'admin' && (
          <Card>
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <SectionHeader
                icon={HiOutlineUsers}
                title={t('page.settings.users_title')}
                subtitle={t('page.settings.users_subtitle', { users: users.length, admins: adminCount })}
                accent="indigo"
                count={`${users.length} ${t('page.settings.users_count')}`}
              />

              <div className="flex w-full items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 sm:w-auto shadow-sm">
                <HiOutlineSparkles className="text-lg text-[var(--color-text-muted)]" />
                <select
                  {...registerRole('nextRole')}
                  className="cursor-pointer bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none"
                >
                  <option value="user">👤 {t('page.settings.set_as_user')}</option>
                  <option value="admin">👑 {t('page.settings.set_as_admin')}</option>
                </select>
              </div>
            </div>

            <div className="relative mb-6 max-w-xl">
              <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[var(--color-text-muted)]" />
              <input
                value={userQuery}
                onChange={(event) => setUserQuery(event.target.value)}
                placeholder={t('page.settings.search_users')}
                className={`${inputClass} pl-12 bg-[var(--color-surface)]`}
              />
              {userQuery && (
                <button
                  onClick={() => setUserQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                >
                  <HiOutlineXMark className="text-lg" />
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <UserSkeleton key={i} />
                ))}
              </div>
            ) : users.length === 0 ? (
              <EmptyState
                icon={HiOutlineUsers}
                title={t('page.settings.no_users_title')}
                description={t('page.settings.no_users_description')}
              />
            ) : filteredUsers.length === 0 ? (
              <EmptyState
                icon={HiOutlineMagnifyingGlass}
                title={t('page.settings.no_matches_title')}
                description={t('page.settings.no_matches_description', { query: userQuery })}
              />
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((item) => {
                  const isAdmin = item.role === 'admin'
                  const a = ACCENTS[isAdmin ? 'purple' : 'blue']
                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 transition-all duration-300 hover:border-[var(--color-primary)]/30 hover:shadow-lg hover:bg-[var(--color-surface)] md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${a.soft} ${a.text} transition-transform duration-300 group-hover:scale-110`}>
                          {initials(item.full_name)}
                          {isAdmin && (
                            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-purple-500 ring-2 ring-[var(--color-surface)]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[var(--color-text)]">{item.full_name}</p>
                          <p className="truncate text-xs text-[var(--color-text-muted)]">{item.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-xl px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${a.soft} ${a.text} border border-current/20`}>
                          {item.role === 'admin' ? '👑 ' + t('role_admin') : '👤 ' + t('role_user')}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateUser({ id: item.id, payload: { role: nextRole } })}
                          disabled={isUpdating}
                          title={t('page.settings.set_role_to', { role: nextRole })}
                          className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition-all duration-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:shadow-md disabled:opacity-40"
                        >
                          <HiOutlineArrowPath className={`text-base ${isUpdating ? 'animate-spin' : ''}`} />
                          {t('page.settings.update_role')}
                        </button>

                        <ConfirmActionButton
                          icon={HiOutlineTrash}
                          label={t('page.settings.delete_user_label')}
                          confirmTitle={t('page.settings.delete_user_title')}
                          confirmText={t('page.settings.delete_user_text', { name: item.full_name })}
                          onConfirm={() => deleteUser(item.id)}
                          disabled={isDeleting}
                          className="text-red-600 hover:bg-red-50"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  )
}

export default SettingsPage