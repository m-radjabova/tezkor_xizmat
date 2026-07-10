import { useMemo } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  HiOutlineDocumentPlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCalendarDays,
  HiOutlineDocumentText,
  HiOutlineSparkles,
  HiOutlineHashtag,
  HiOutlineCheckCircle,
} from 'react-icons/hi2'
import ConfirmActionButton from '../../components/ConfirmActionButton'
import EmptyState from '../../components/EmptyState'
import PageSection from '../../components/PageSection'
import { useNotes } from '../../hooks/useNotes'
import { usePreferences } from '../../hooks/usePreferences'
import { formatShortDate } from '../../utils/format'
type NoteFormValues = {
  title: string
  content: string
  note_date: string
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

function NoteSkeleton() {
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

function NotesPage() {
  const { t } = usePreferences()
  const { notes, isLoading, createNote, updateNote, deleteNote, isCreating, isUpdating, isDeleting } = useNotes()
  const noteSchema = z.object({
    title: z.string().min(2, t('page.notes.validation.title')),
    content: z.string(),
    note_date: z.string(),
  })
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      note_date: '',
    },
  })

  const watchedTitle = useWatch({ control, name: 'title' })
  const watchedContent = useWatch({ control, name: 'content' })

  const totalNotes = notes.length
  const notesWithContent = useMemo(
    () => notes.filter((n) => n.content && n.content.trim().length > 0).length,
    [notes],
  )
  const notesWithDate = useMemo(
    () => notes.filter((n) => n.note_date).length,
    [notes],
  )

  const onSubmit = (values: NoteFormValues) => {
    createNote({
      title: values.title,
      content: values.content,
      note_date: values.note_date || null,
    })
    reset()
  }

  return (
    <div className="mobile-page space-y-4 p-2 sm:space-y-5 sm:p-3 md:space-y-6 md:p-6 lg:p-8">
      {isLoading ? (
        <SummarySkeleton />
      ) : notes.length > 0 ? (
        <>
        <div className="mobile-surface-card overflow-hidden rounded-[28px] p-2 sm:hidden">
          {[
            { label: t('page.notes.total_notes'), value: String(totalNotes), tone: 'text-[var(--color-primary)]' },
            { label: t('page.notes.with_content'), value: `${notesWithContent} / ${totalNotes}`, tone: 'text-[var(--color-success)]' },
            { label: t('page.notes.with_date'), value: String(notesWithDate), tone: 'text-[var(--color-purple)]' },
          ].map((item, index, list) => (
            <div key={item.label} className={`px-3 py-3 ${index < list.length - 1 ? 'border-b border-[var(--color-border)]/70' : ''}`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">{item.label}</p>
              <p className={`mt-1 text-xl font-extrabold tracking-tight ${item.tone}`}>{item.value}</p>
            </div>
          ))}
        </div>
        <div className="hidden gap-4 sm:grid sm:grid-cols-2 xl:grid-cols-3">
          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-primary)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.notes.total_notes')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-primary)]">
              {totalNotes}
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-success)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.notes.with_content')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-success)]">
              {notesWithContent} <span className="text-base font-semibold text-[var(--color-text-muted)]">/ {totalNotes}</span>
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-[28px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-6 shadow-sm transition-all duration-200 hover:shadow-[var(--shadow-card)]">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--color-purple)]/5 blur-2xl transition-all duration-500 group-hover:scale-125" />
            <p className="relative text-sm font-semibold text-[var(--color-text-muted)]">{t('page.notes.with_date')}</p>
            <p className="relative mt-3 text-3xl font-extrabold text-[var(--color-purple)]">
              {notesWithDate}
            </p>
          </div>
        </div>
        </>
      ) : null}

      <div className="grid items-start gap-4 sm:gap-6 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
        <PageSection title={t('page.notes.form_title')} subtitle={t('page.notes.form_subtitle')} className="order-2 xl:order-1 xl:sticky xl:top-28">
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Title */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineSparkles className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  {...register('title')}
                  placeholder={t('page.notes.title_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                />
                {errors.title && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Content */}
              <div className="group relative">
                <div className="pointer-events-none absolute left-0 top-0 flex items-start pt-4 pl-4">
                  <HiOutlineDocumentText className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <textarea
                  {...register('content')}
                  placeholder={t('page.notes.content_placeholder')}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                />
              </div>

              {/* Date */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineCalendarDays className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  type="date"
                  {...register('note_date')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(79,70,229,0.12)]"
                />
              </div>

              {/* Live preview */}
              {(watchedTitle || watchedContent) && (
                <div className="rounded-2xl bg-[var(--color-primary-pale)] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[var(--color-primary)]">{t('page.notes.preview')}</span>
                    <span className="text-[10px] font-medium text-[var(--color-primary)]/60">
                      {watchedContent ? t('page.notes.chars', { count: watchedContent.length }) : t('page.notes.no_content')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-[var(--color-primary)]">
                    {watchedTitle || t('page.notes.untitled')}
                  </p>
                  {watchedContent && (
                    <p className="mt-1 text-xs leading-6 text-[var(--color-primary)]/70 line-clamp-2">
                      {watchedContent}
                    </p>
                  )}
                  {!watchedContent && (
                    <p className="mt-1 text-xs italic text-[var(--color-primary)]/50">
                      {t('page.notes.no_content_yet')}
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
                <HiOutlineDocumentPlus className="relative text-lg" />
                <span className="relative">
                  {isCreating ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {t('common.saving')}
                    </span>
                  ) : (
                    t('page.notes.add')
                  )}
                </span>
              </button>
            </form>
          )}
        </PageSection>

        <PageSection title={t('notes')} subtitle={t('page.notes.list_subtitle')} className="order-1 xl:order-2">
          {isLoading ? (
            <div className="mt-5 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <NoteSkeleton key={i} />
              ))}
            </div>
          ) : notes.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={HiOutlineDocumentPlus}
                title={t('page.notes.empty_title')}
                description={t('page.notes.empty_description')}
              />
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="mobile-summary-bar mb-5 rounded-2xl px-4 py-3">
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                  {notes.length} {notes.length === 1 ? t('page.notes.note_singular') : t('page.notes.note_plural')}
                </span>
                <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <HiOutlineDocumentText className="text-sm text-[var(--color-primary)]" />
                  <span className="text-[var(--color-primary)]">{notesWithContent} {t('page.notes.with_content_lc')}</span>
                </span>
                <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <HiOutlineCalendarDays className="text-sm text-[var(--color-purple)]" />
                  <span className="text-[var(--color-purple)]">{notesWithDate} {t('page.notes.dated')}</span>
                </span>
              </div>

              {/* Notes list */}
              <div className="space-y-3 sm:space-y-4">
                {notes.map((note, index) => {
                  const hasContent = note.content && note.content.trim().length > 0
                  const hasDate = !!note.note_date

                  return (
                    <div
                      key={note.id}
                      className="group relative overflow-hidden rounded-[24px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-4 shadow-sm transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:border-[var(--color-border-strong)]/70 sm:p-5"
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      {/* Gradient accent */}
                      <div className="absolute inset-x-0 top-0 h-0.5 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                        style={{
                          background: hasContent
                            ? 'linear-gradient(90deg, var(--color-primary), var(--color-primary-soft), transparent)'
                            : 'linear-gradient(90deg, var(--color-warning), var(--color-warning-soft), transparent)',
                        }}
                      />

                      <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        {/* Left content */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                                hasContent
                                  ? 'bg-[var(--color-primary-pale)]'
                                  : 'bg-[var(--color-warning-soft)]'
                              }`}
                            >
                              <HiOutlineDocumentText
                                className={`text-lg ${
                                  hasContent
                                    ? 'text-[var(--color-primary)]'
                                    : 'text-[var(--color-warning)]'
                                }`}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-base font-bold text-[var(--color-text)] sm:text-lg">
                                {note.title}
                              </p>
                              <div className="flex flex-wrap items-center gap-2">
                                {hasContent && (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-success)]">
                                    <HiOutlineCheckCircle className="text-xs" />
                                    {t('page.notes.has_content')}
                                  </span>
                                )}
                                {!hasContent && (
                                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-warning)]">
                                    <HiOutlineDocumentText className="text-xs" />
                                    {t('page.notes.empty')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Content preview */}
                          {hasContent && (
                            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)] line-clamp-3">
                              {note.content}
                            </p>
                          )}
                          {!hasContent && (
                            <p className="mt-3 text-sm italic leading-7 text-[var(--color-text-muted)]/50">
                              {t('page.notes.no_content_written')}
                            </p>
                          )}

                          {/* Meta chips */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            {hasDate && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-pale)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary)]">
                                <HiOutlineCalendarDays className="text-xs" />
                                {formatShortDate(note.note_date!)}
                              </span>
                            )}
                            {!hasDate && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-muted)]">
                                <HiOutlineCalendarDays className="text-xs" />
                                {t('common.no_date')}
                              </span>
                            )}
                            {hasContent && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-text-muted)]">
                                <HiOutlineHashtag className="text-xs" />
                                {note.content!.length} chars
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 justify-end gap-2">
                          <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                              updateNote({
                                id: note.id,
                                payload: { content: `${note.content || ''} (updated)` },
                              })
                            }
                            className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-pale)] hover:text-[var(--color-primary)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <HiOutlinePencilSquare className="text-lg" />
                          </button>
                          <ConfirmActionButton
                            icon={HiOutlineTrash}
                            label={t('page.notes.delete_label')}
                            confirmTitle={t('page.notes.delete_title')}
                            confirmText={t('page.notes.delete_text', { title: note.title })}
                            onConfirm={() => deleteNote(note.id)}
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

export default NotesPage
