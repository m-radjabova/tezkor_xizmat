import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HiOutlineBellAlert,
  HiOutlineCheck,
  HiOutlineTrash,
  HiOutlineEnvelope,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineTag,
  HiOutlineCalendarDays,
  HiOutlineExclamationTriangle,
  HiOutlineBanknotes,
  HiOutlineScale,
  HiOutlineSparkles,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'
import ConfirmActionButton from '../../components/ConfirmActionButton'
import EmptyState from '../../components/EmptyState'
import PageSection from '../../components/PageSection'
import { usePreferences } from '../../hooks/usePreferences'
import { useNotifications } from '../../hooks/useNotifications'
import { formatShortDate } from '../../utils/format'
import type { NotificationType } from '../../types/notification'
type NotificationFormValues = {
  title: string
  message: string
  type: 'system' | 'budget' | 'debt' | 'saving'
}

const typeConfig: Record<NotificationType, { icon: typeof HiOutlineSparkles; labelKey: string; color: string; bg: string }> = {
  system: {
    icon: HiOutlineSparkles,
    labelKey: 'common.system',
    color: 'text-[var(--color-primary)]',
    bg: 'bg-[var(--color-primary-pale)]',
  },
  budget: {
    icon: HiOutlineBanknotes,
    labelKey: 'common.budget',
    color: 'text-[var(--color-success)]',
    bg: 'bg-[var(--color-success-soft)]',
  },
  debt: {
    icon: HiOutlineScale,
    labelKey: 'common.debt',
    color: 'text-[var(--color-danger)]',
    bg: 'bg-[var(--color-danger-soft)]',
  },
  saving: {
    icon: HiOutlineExclamationTriangle,
    labelKey: 'common.saving_goal_type',
    color: 'text-[var(--color-warning)]',
    bg: 'bg-[var(--color-warning-soft)]',
  },
}

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[50px] w-full rounded-2xl bg-[var(--color-border)]/30" />
      ))}
      <div className="h-[120px] w-full rounded-2xl bg-[var(--color-border)]/20" />
      <div className="h-[50px] w-full rounded-2xl bg-[var(--color-primary-soft)]/40" />
    </div>
  )
}

function NotificationSkeleton() {
  return (
    <div className="animate-pulse rounded-[24px] border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[var(--color-border)]/40" />
            <div className="flex-1 space-y-1.5">
              <div className="h-5 w-44 rounded-lg bg-[var(--color-border)]" />
              <div className="h-3.5 w-28 rounded-lg bg-[var(--color-border)]/60" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full rounded-lg bg-[var(--color-border)]/30" />
            <div className="h-3 w-3/4 rounded-lg bg-[var(--color-border)]/30" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/40" />
          <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/40" />
        </div>
      </div>
    </div>
  )
}

function SummarySkeleton() {
  return (
    <div className="animate-pulse grid gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-[28px] border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-6 shadow-sm"
        >
          <div className="h-3.5 w-24 rounded-lg bg-[var(--color-border)]/60" />
          <div className="mt-4 h-8 w-32 rounded-lg bg-[var(--color-border)]/50" />
        </div>
      ))}
    </div>
  )
}

function NotificationsPage() {
  const { t } = usePreferences()
  const { notifications, isLoading, createNotification, updateNotification, deleteNotification, markAllAsRead, isCreating, isUpdating, isDeleting, isMarkingAllRead } = useNotifications()
  const notificationSchema = z.object({
    title: z.string().min(2, t('page.notifications.validation.title')),
    message: z.string().min(4, t('page.notifications.validation.message')),
    type: z.enum(['system', 'budget', 'debt', 'saving']),
  })
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      message: '',
      type: 'system',
    },
  })

  const watchedTitle = useWatch({ control, name: 'title' })
  const watchedMessage = useWatch({ control, name: 'message' })
  const watchedType = useWatch({ control, name: 'type' })

  const totalNotifications = notifications.length
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications],
  )
  const readCount = useMemo(
    () => notifications.filter((n) => n.is_read).length,
    [notifications],
  )

  const onSubmit = (values: NotificationFormValues) => {
    createNotification({ ...values, is_read: false })
    reset({
      title: '',
      message: '',
      type: values.type,
    })
  }

  const getTypeConfig = (type: string | null) => {
    return typeConfig[type as NotificationType] ?? typeConfig.system
  }

  return (
    <div className="space-y-6 p-3 md:p-5">
      

      {/* Summary cards */}
      {isLoading ? (
        <SummarySkeleton />
      ) : notifications.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-primary)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.notifications.total')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-primary)]">
              {totalNotifications}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-danger)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('common.unread')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-danger)]">
              {unreadCount} <span className="text-base font-semibold text-[var(--color-text-muted)]">/ {totalNotifications}</span>
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-success)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('common.read')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-success)]">
              {readCount}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* ───── Form ───── */}
        <PageSection title={t('page.notifications.form_title')} subtitle={t('page.notifications.form_subtitle')}>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Title */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineBellAlert className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  {...register('title')}
                  placeholder={t('page.notifications.title_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                />
                {errors.title && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="group relative">
                <div className="pointer-events-none absolute left-0 top-0 flex items-start pt-4 pl-4">
                  <HiOutlineEnvelope className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <textarea
                  {...register('message')}
                  placeholder={t('page.notifications.message_placeholder')}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                />
                {errors.message && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.message.message}
                  </p>
                )}
              </div>

              {/* Type select */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineTag className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <select
                  {...register('type')}
                  className="w-full appearance-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-10 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                >
                  <option value="system">{t('common.system')}</option>
                  <option value="budget">{t('common.budget')}</option>
                  <option value="debt">{t('common.debt')}</option>
                  <option value="saving">{t('common.saving_goal_type')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="h-4 w-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Live preview */}
              {(watchedTitle || watchedMessage) && (
                <div className="rounded-2xl bg-[var(--color-primary-pale)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--color-primary)]">{t('page.notifications.preview')}</span>
                    <span className="text-[10px] font-medium text-[var(--color-primary)]/60">
                      {watchedMessage ? t('page.notes.chars', { count: watchedMessage.length }) : t('page.notifications.no_message')}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getTypeConfig(watchedType).bg} ${getTypeConfig(watchedType).color}`}>
                      {watchedType}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-[var(--color-primary)]">
                    {watchedTitle || t('page.notifications.untitled')}
                  </p>
                  {watchedMessage && (
                    <p className="mt-1 text-xs leading-6 text-[var(--color-primary)]/70 line-clamp-2">
                      {watchedMessage}
                    </p>
                  )}
                  {!watchedMessage && (
                    <p className="mt-1 text-xs italic text-[var(--color-primary)]/50">
                      {t('page.notifications.no_message_yet')}
                    </p>
                  )}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isCreating}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--color-primary)] px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--color-primary-soft)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 disabled:opacity-70 disabled:hover:shadow-none"
              >
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <HiOutlineBellAlert className="relative text-lg" />
                <span className="relative">
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {t('common.saving')}
                    </span>
                  ) : (
                    t('page.notifications.add')
                  )}
                </span>
              </button>
            </form>
          )}
        </PageSection>

        {/* ───── Notifications List ───── */}
        <PageSection title={t('notifications')} subtitle={t('page.notifications.list_subtitle')}>
          {isLoading ? (
            <div className="mt-5 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <NotificationSkeleton key={i} />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={HiOutlineBellAlert}
                title={t('page.notifications.empty_title')}
                description={t('page.notifications.empty_description')}
              />
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--color-surface-soft)] px-4 py-3">
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                  {notifications.length} {notifications.length === 1 ? t('page.notifications.single') : t('page.notifications.plural')}
                </span>
                <span className="h-3 w-px bg-[var(--color-border)]" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <HiOutlineEyeSlash className="text-sm text-[var(--color-danger)]" />
                  <span className="text-[var(--color-danger)]">{unreadCount} {t('common.unread_lc')}</span>
                </span>
                <span className="h-3 w-px bg-[var(--color-border)]" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <HiOutlineEye className="text-sm text-[var(--color-success)]" />
                  <span className="text-[var(--color-success)]">{readCount} {t('common.read_lc')}</span>
                </span>
                {unreadCount > 0 && (
                  <>
                    <span className="h-3 w-px bg-[var(--color-border)]" />
                    <button
                      type="button"
                      onClick={() => markAllAsRead()}
                      disabled={isMarkingAllRead}
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-bold text-[var(--color-primary)] transition-all duration-200 hover:bg-[var(--color-primary-pale)] disabled:opacity-50"
                    >
                      {isMarkingAllRead ? (
                        <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-[var(--color-primary)]/30 border-t-[var(--color-primary)]" />
                      ) : (
                        <HiOutlineCheckCircle className="text-sm" />
                      )}
                      {isMarkingAllRead ? t('page.notifications.marking') : t('page.notifications.mark_all')}
                    </button>
                  </>
                )}
              </div>

              {/* Notifications list */}
              <div className="space-y-4">
                {notifications.map((notification, index) => {
                  const type = notification.type ?? 'system'
                  const config = getTypeConfig(type)
                  const TypeIcon = config.icon

                  return (
                    <div
                      key={notification.id}
                      className="group relative overflow-hidden rounded-[24px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:border-[var(--color-border-strong)]/70"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {/* Gradient accent */}
                      <div
                        className="absolute inset-x-0 top-0 h-0.5 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: notification.is_read
                            ? 'linear-gradient(90deg, var(--color-success), var(--color-success-soft), transparent)'
                            : 'linear-gradient(90deg, var(--color-danger), var(--color-danger-soft), transparent)',
                        }}
                      />

                      <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        {/* Left content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${config.bg}`}
                            >
                              <TypeIcon className={`text-lg ${config.color}`} />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-lg font-bold text-[var(--color-text)]">
                                {notification.title}
                              </p>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${notification.is_read ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]' : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'}`}
                                >
                                  {notification.is_read ? (
                                    <HiOutlineEye className="text-[10px]" />
                                  ) : (
                                    <HiOutlineEyeSlash className="text-[10px]" />
                                  )}
                                  {notification.is_read ? t('common.read') : t('common.unread')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Message */}
                          <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)]">
                            {notification.message}
                          </p>

                          {/* Meta chips */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 rounded-full ${config.bg} px-2.5 py-1 text-[11px] font-medium ${config.color}`}>
                              <TypeIcon className="text-xs" />
                              {t(config.labelKey)}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-muted)]">
                              <HiOutlineCalendarDays className="text-xs" />
                              {formatShortDate(notification.created_at)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() => updateNotification({ id: notification.id, payload: { is_read: !notification.is_read } })}
                            className={`flex h-[42px] w-[42px] items-center justify-center rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface)] transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${
                              notification.is_read
                                ? 'text-[var(--color-text-muted)] hover:border-[var(--color-danger)] hover:bg-[var(--color-danger-soft)] hover:text-[var(--color-danger)]'
                                : 'text-[var(--color-text-muted)] hover:border-[var(--color-success)] hover:bg-[var(--color-success-soft)] hover:text-[var(--color-success)]'
                            }`}
                            title={notification.is_read ? t('page.notifications.mark_unread') : t('page.notifications.mark_read')}
                          >
                            {notification.is_read ? (
                              <HiOutlineEyeSlash className="text-lg" />
                            ) : (
                              <HiOutlineCheck className="text-lg" />
                            )}
                          </button>
                          <ConfirmActionButton
                            icon={HiOutlineTrash}
                            label={t('page.notifications.delete_label')}
                            confirmTitle={t('page.notifications.delete_title')}
                            confirmText={t('page.notifications.delete_text', { title: notification.title })}
                            onConfirm={() => deleteNotification(notification.id)}
                            disabled={isDeleting}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </PageSection>
      </div>
    </div>
  )
}

export default NotificationsPage
