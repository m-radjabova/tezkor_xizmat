import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineEnvelope,
  HiOutlineMagnifyingGlass,
  HiOutlineMoon,
  HiOutlinePhoto,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineTrash,
  HiOutlineUsers,
  HiOutlineXMark,
  HiOutlineIdentification,
  HiOutlinePaintBrush,
  HiOutlineGlobeAlt,
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

type Accent = 'blue' | 'green' | 'purple' | 'orange' | 'teal'

const ACCENTS: Record<Accent, { solid: string; text: string; soft: string; ring: string }> = {
  blue: {
    solid: 'bg-[var(--color-primary)]',
    text: 'text-[var(--color-primary)]',
    soft: 'bg-[var(--color-primary-pale)]',
    ring: 'ring-[var(--color-primary)]/15',
  },
  green: {
    solid: 'bg-[#22c55e]',
    text: 'text-[#16a34a]',
    soft: 'bg-[#22c55e]/10',
    ring: 'ring-[#22c55e]/15',
  },
  purple: {
    solid: 'bg-[#8b5cf6]',
    text: 'text-[#7c3aed]',
    soft: 'bg-[#8b5cf6]/10',
    ring: 'ring-[#8b5cf6]/15',
  },
  orange: {
    solid: 'bg-[#fb923c]',
    text: 'text-[#ea580c]',
    soft: 'bg-[#fb923c]/10',
    ring: 'ring-[#fb923c]/15',
  },
  teal: {
    solid: 'bg-[#14b8a6]',
    text: 'text-[#0d9488]',
    soft: 'bg-[#14b8a6]/10',
    ring: 'ring-[#14b8a6]/15',
  },
}

const inputClass =
  'w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm font-medium text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-text-muted)]/50 hover:border-[var(--color-border-strong)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10'

function initials(name?: string) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
}

/* ────────────────────────────────────────────────────────────
   Layout primitives
   ──────────────────────────────────────────────────────────── */
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`mobile-surface-card min-w-0 rounded-[28px] p-4 shadow-[var(--shadow-soft)] sm:p-6 ${className}`}
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
      <div className="flex items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${a.soft} ${a.text}`}>
          <Icon className="text-lg" />
        </span>
        <div>
          <h2 className="text-base font-bold text-[var(--color-text)]">{title}</h2>
          <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>
        </div>
      </div>
      {count && (
        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${a.soft} ${a.text}`}>{count}</span>
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
    <div className="flex min-w-0 flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 2xl:flex-row 2xl:items-center 2xl:justify-between 2xl:gap-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${a.soft} ${a.text}`}>
          <Icon className="text-base" />
        </span>
        <p className="min-w-0 text-sm font-semibold text-[var(--color-text)]">{title}</p>
      </div>
      <div className="min-w-0 w-full 2xl:w-[220px] 2xl:shrink-0">{children}</div>
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
    <div className="grid grid-cols-2 gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
      {options.map(({ key, label, icon: Icon }) => {
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors sm:text-sm ${
              active
                ? 'bg-[var(--color-primary-pale)] text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-soft)]'
            }`}
          >
            <Icon className="text-base" />
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
        <div className="h-11 w-11 rounded-xl bg-[var(--color-border)]" />
        <div className="space-y-2">
          <div className="h-3.5 w-32 rounded bg-[var(--color-border)]" />
          <div className="h-3 w-44 rounded bg-[var(--color-border)]/70" />
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────── */
function SettingsPage() {
  const { user, setCurrentUser } = useAuth()
  const { language, currency, themeMode, setLanguage, setCurrency, setThemeMode, t } = usePreferences()
  const {
    updateMe,
    uploadAvatar,
    deleteAvatar,
    isUpdating: isUpdatingProfile,
    isUploadingAvatar,
    isDeletingAvatar,
  } = useProfile()
  const { users, isLoading, updateUser, deleteUser, isUpdating, isDeleting } = useUsers(
    user?.role === 'admin',
  )
  const [userQuery, setUserQuery] = useState('')
  const profileSchema = useMemo(
    () =>
      z.object({
        full_name: z.string().min(2, t('page.settings.validation.full_name')),
        email: z.string().email(t('page.settings.validation.email')),
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

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const updatedUser = await uploadAvatar(file)
    setCurrentUser(updatedUser)
    event.target.value = ''
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
    <div className="mobile-page space-y-4 p-2 sm:space-y-5 sm:p-3 md:space-y-6 md:p-6 lg:p-8">
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="order-2 xl:order-1 xl:col-span-2">
          <SectionHeader
            icon={HiOutlineIdentification}
            title={t('page.settings.profile_title')}
            subtitle={t('page.settings.profile_subtitle')}
            accent="blue"
          />

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Avatar column */}
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 lg:col-span-1 lg:p-5">
              <label className="group relative block cursor-pointer">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={t('page.settings.avatar_alt')}
                    className="h-28 w-28 rounded-2xl border border-[var(--color-border)] object-cover shadow-[var(--shadow-soft)] transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--color-primary)]/30 bg-[var(--color-primary-pale)] text-3xl font-black text-[var(--color-primary)] transition-transform duration-300 group-hover:scale-[1.03]">
                    {initials(user?.full_name)}
                  </div>
                )}
                <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-[var(--color-surface)] bg-[var(--color-primary)] text-white shadow-[var(--shadow-soft)] transition-transform group-hover:scale-110">
                  <HiOutlinePhoto className="text-base" />
                </span>
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>

              <div className="flex w-full flex-col gap-2">
                <label className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]">
                  <HiOutlinePhoto className="text-base" />
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
                    className="self-center px-5"
                  />
                )}
              </div>
            </div>

            {/* Form column */}
            <div className="min-w-0 lg:col-span-2">
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary-pale)] px-3 py-1.5 text-xs font-bold capitalize text-[var(--color-primary)]">
                  <HiOutlineShieldCheck className="text-sm" />
                  {user?.role === 'admin' ? t('role_admin') : t('role_user')}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-surface-soft)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)]">
                  <HiOutlineEnvelope className="text-sm" />
                  {user?.email ?? '—'}
                </span>
              </div>

              <form onSubmit={handleProfileSubmit(onSubmitProfile)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text)]">
                      {t('auth.full_name')}
                    </label>
                    <input {...registerProfile('full_name')} placeholder={t('page.settings.full_name_placeholder')} className={inputClass} />
                    {profileErrors.full_name && (
                      <p className="mt-1.5 text-xs font-medium text-[var(--color-danger)]">
                        {profileErrors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[var(--color-text)]">
                      {t('page.settings.email_address')}
                    </label>
                    <input {...registerProfile('email')} placeholder={t('auth.email_placeholder')} className={inputClass} />
                    {profileErrors.email && (
                      <p className="mt-1.5 text-xs font-medium text-[var(--color-danger)]">
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
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <HiOutlineCheckCircle className="text-base" />
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
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-soft)] active:scale-[0.98]"
                      >
                        <HiOutlineXMark className="text-base" />
                        {t('cancel')}
                      </button>
                    )}
                  </div>

                  {isProfileDirty && !isUpdatingProfile && (
                    <span className="rounded-lg bg-[var(--color-warning-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-warning)]">
                      {t('page.settings.unsaved_changes')}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </div>
        </Card>

        <Card className="order-1 xl:order-2 xl:min-w-0">
          <SectionHeader
            icon={HiOutlinePaintBrush}
            title={t('settings')}
            subtitle={t('page.settings.preferences_subtitle')}
            accent="purple"
          />

          <div className="mt-6 space-y-3">
            <PreferenceRow icon={HiOutlineGlobeAlt} title={t('language')} accent="blue">
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as 'en' | 'ru')}
                className={`${inputClass} min-w-0`}
              >
                <option value="en">English</option>
                <option value="ru">Русский</option>
              </select>
            </PreferenceRow>

            <PreferenceRow icon={HiOutlineCurrencyDollar} title={t('currency')} accent="green">
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as 'USD' | 'UZS' | 'EUR' | 'RUB')}
                className={`${inputClass} min-w-0`}
              >
                <option value="USD">{t('page.settings.currency_usd')}</option>
                <option value="UZS">{t('page.settings.currency_uzs')}</option>
                <option value="EUR">{t('page.settings.currency_eur')}</option>
                <option value="RUB">{t('page.settings.currency_rub')}</option>
              </select>
            </PreferenceRow>

            <PreferenceRow icon={HiOutlineMoon} title={t('theme')} accent="purple">
              <ThemeToggle value={themeMode} onChange={setThemeMode} />
            </PreferenceRow>
          </div>
        </Card>
      </div>

      {user?.role === 'admin' && (
        <Card>
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <SectionHeader
              icon={HiOutlineUsers}
              title={t('page.settings.users_title')}
              subtitle={t('page.settings.users_subtitle', { users: users.length, admins: adminCount })}
              accent="green"
              count={`${users.length}`}
            />

            <div className="flex w-full items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 sm:w-auto">
              <HiOutlineSparkles className="text-base text-[var(--color-text-muted)]" />
              <select
                {...registerRole('nextRole')}
                className="cursor-pointer bg-transparent text-sm font-semibold text-[var(--color-text)] outline-none"
              >
                <option value="user">{t('page.settings.set_as_user')}</option>
                <option value="admin">{t('page.settings.set_as_admin')}</option>
              </select>
            </div>
          </div>

          <div className="relative mb-5 max-w-xl">
            <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-[var(--color-text-muted)]" />
            <input
              value={userQuery}
              onChange={(event) => setUserQuery(event.target.value)}
              placeholder={t('page.settings.search_users')}
              className={`${inputClass} pl-10`}
            />
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
            <div className="space-y-2.5">
              {filteredUsers.map((item) => {
                const isAdmin = item.role === 'admin'
                const a = ACCENTS[isAdmin ? 'purple' : 'blue']
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 transition-colors hover:bg-[var(--color-surface)] md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${a.soft} ${a.text}`}>
                        {initials(item.full_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--color-text)]">{item.full_name}</p>
                        <p className="truncate text-xs text-[var(--color-text-muted)]">{item.email}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide ${a.soft} ${a.text}`}>
                        {item.role === 'admin' ? t('role_admin') : t('role_user')}
                      </span>

                      <button
                        type="button"
                        onClick={() => updateUser({ id: item.id, payload: { role: nextRole } })}
                        disabled={isUpdating}
                        title={t('page.settings.set_role_to', { role: nextRole })}
                        className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2 text-sm font-semibold text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40"
                      >
                        <HiOutlineArrowPath className="text-base" />
                        {t('page.settings.update_role')}
                      </button>

                      <ConfirmActionButton
                        icon={HiOutlineTrash}
                        label={t('page.settings.delete_user_label')}
                        confirmTitle={t('page.settings.delete_user_title')}
                        confirmText={t('page.settings.delete_user_text', { name: item.full_name })}
                        onConfirm={() => deleteUser(item.id)}
                        disabled={isDeleting}
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
  )
}

export default SettingsPage
