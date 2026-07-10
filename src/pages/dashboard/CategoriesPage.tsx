import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { HiOutlineFolderPlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineTag, HiOutlineSwatch, HiOutlineRectangleGroup, HiOutlineChevronDown, HiOutlineCheck } from 'react-icons/hi2'
import ConfirmActionButton from '../../components/ConfirmActionButton'
import EmptyState from '../../components/EmptyState'
import PageSection from '../../components/PageSection'
import { useCategories } from '../../hooks/useCategories'
import { usePreferences } from '../../hooks/usePreferences'
import type { Category } from '../../types'

type CategoryFormValues = {
  name: string
  icon: string
  color: string
  type: 'expense' | 'income'
}

const PRESET_COLORS = [
  '#e5a4b8', '#f4a6a6', '#f4c7a6', '#f4e4a6', '#b8d9a6',
  '#a6d4c7', '#a6c4d9', '#a6aed9', '#c4a6d9', '#d9a6c4',
]

function CategorySkeleton() {
  return (
    <div className="animate-pulse rounded-[24px] border border-[var(--color-border)]/50 bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded-full bg-[var(--color-border)]" />
            <div className="h-5 w-28 rounded-lg bg-[var(--color-border)]" />
          </div>
          <div className="h-3.5 w-36 rounded-lg bg-[var(--color-border)]/60" />
          <div className="h-4 w-20 rounded-lg bg-[var(--color-border)]/60" />
        </div>
        <div className="flex gap-2">
          <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/40" />
          <div className="h-11 w-11 rounded-2xl bg-[var(--color-border)]/40" />
        </div>
      </div>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-[50px] w-full rounded-2xl bg-[var(--color-border)]/30" />
      ))}
      <div className="h-[50px] w-full rounded-2xl bg-[var(--color-border)]/30" />
      <div className="h-[50px] w-full rounded-2xl bg-[var(--color-primary-soft)]/40" />
    </div>
  )
}

function CategoriesPage() {
  const { t } = usePreferences()
  const { categories, isLoading, createCategory, updateCategory, deleteCategory, isCreating, isUpdating, isDeleting } = useCategories()
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)
  const categorySchema = z.object({
    name: z.string().min(2, t('page.categories.validation.name')),
    icon: z.string().min(2, t('page.categories.validation.icon')),
    color: z.string().min(4, t('page.categories.validation.color')),
    type: z.enum(['expense', 'income']),
  })
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      icon: 'wallet',
      color: '#e5a4b8',
      type: 'expense',
    },
  })

  const selectedColor = watch('color')
  const selectedType = watch('type')

  const resetForm = () => {
    setEditingCategory(null)
    reset({
      name: '',
      icon: 'wallet',
      color: '#e5a4b8',
      type: 'expense',
    })
  }

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    reset({
      name: category.name,
      icon: category.icon || 'wallet',
      color: category.color || '#e5a4b8',
      type: category.type,
    })
    requestAnimationFrame(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const onSubmit = (values: CategoryFormValues) => {
    if (editingCategory) {
      updateCategory(
        {
          id: editingCategory.id,
          payload: values,
        },
        { onSuccess: resetForm },
      )
      return
    }

    createCategory(values, { onSuccess: resetForm })
  }

  return (
    <div className="mobile-page space-y-4 p-2 sm:space-y-5 sm:p-3 md:space-y-6 md:p-6 lg:p-8">

      <div className="grid items-start gap-4 sm:gap-6 xl:grid-cols-[minmax(320px,380px)_minmax(0,1fr)]">
        {/* ───── Form ───── */}
        <PageSection title={editingCategory ? `${t('common.edit')} ${editingCategory.name}` : t('page.categories.form_title')} subtitle={t('page.categories.form_subtitle')}>
          {isLoading ? (
            <FormSkeleton />
          ) : (
            <form ref={formRef} className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Name */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineTag className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  {...register('name')}
                  placeholder={t('page.categories.name_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
                {errors.name && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Icon */}
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineRectangleGroup className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                </div>
                <input
                  {...register('icon')}
                  placeholder={t('page.categories.icon_placeholder')}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                />
                {errors.icon && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.icon.message}
                  </p>
                )}
              </div>

              {/* Color picker */}
              <div>
                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <HiOutlineSwatch className="text-lg text-[var(--color-text-muted)] transition-colors group-focus-within:text-[var(--color-primary)]" />
                  </div>
                  <input
                    {...register('color')}
                    placeholder="#e5a4b8"
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-muted)]/60 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                  />
                </div>
                {errors.color && (
                  <p className="mt-1.5 flex items-center gap-1.5 px-1 text-xs font-semibold text-[var(--color-danger)]">
                    <span className="inline-block h-1 w-1 rounded-full bg-[var(--color-danger)]" />
                    {errors.color.message}
                  </p>
                )}
                {/* Preset swatches */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setValue('color', c, { shouldValidate: true })}
                      className={`relative flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-md active:scale-95 ${
                        selectedColor === c
                          ? 'scale-110 ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-surface)]'
                          : 'ring-1 ring-black/5'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {selectedColor === c && (
                        <HiOutlineCheck className="text-xs text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type selector */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HiOutlineRectangleGroup className="text-lg text-[var(--color-text-muted)]" />
                </div>
                <select
                  {...register('type')}
                  className="w-full appearance-none rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] py-3.5 pl-11 pr-10 text-sm font-semibold text-[var(--color-text)] outline-none transition-all duration-200 focus:border-[var(--color-primary)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_4px_rgba(229,164,184,0.12)]"
                >
                  <option value="expense">{t('common.expense')}</option>
                  <option value="income">{t('common.income')}</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <HiOutlineChevronDown className="text-sm text-[var(--color-text-muted)]" />
                </div>
              </div>

              {/* Type badge */}
              <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-surface-soft)] px-3 py-2">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    selectedType === 'expense' ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-success)]'
                  }`}
                />
                <span className="text-xs font-semibold text-[var(--color-text-muted)]">
                  {t('page.categories.type_hint_prefix')}{' '}
                  <span
                    className={
                      selectedType === 'expense'
                        ? 'text-[var(--color-danger)]'
                        : 'text-[var(--color-success)]'
                    }
                  >
                    {selectedType === 'expense' ? t('common.expenses') : t('common.income')}
                  </span>
                </span>
              </div>

              {/* Submit */}
              {editingCategory && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text-muted)] transition-all hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)]"
                >
                  {t('cancel')}
                </button>
              )}
              <button
                type="submit"
                disabled={isCreating || isUpdating}
                className="group cursor-pointer relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--color-primary)] px-4 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-[var(--color-primary-soft)] hover:shadow-lg hover:shadow-[var(--color-primary)]/20 disabled:opacity-70 disabled:hover:shadow-none"
              >
                {/* Shine effect */}
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <HiOutlineFolderPlus className="relative text-lg" />
                <span className="relative">
                  {isCreating || isUpdating ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {t('common.saving')}
                    </span>
                  ) : (
                    editingCategory ? t('common.save_changes') : t('page.categories.add')
                  )}
                </span>
              </button>
            </form>
          )}
        </PageSection>

        {/* ───── Category List ───── */}
        <PageSection title={t('page.categories.list_title')} subtitle={t('page.categories.list_subtitle')}>
          {isLoading ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <CategorySkeleton key={i} />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={HiOutlineFolderPlus}
                title={t('page.categories.empty_title')}
                description={t('page.categories.empty_description')}
              />
            </div>
          ) : (
            <>
              {/* Summary bar */}
              <div className="mobile-summary-bar mb-5 rounded-2xl px-4 py-3">
                <span className="text-sm font-semibold text-[var(--color-text-muted)]">
                  {categories.length} {categories.length === 1 ? t('page.categories.category_singular') : t('page.categories.category_plural')}
                </span>
                <span className="hidden h-3 w-px bg-[var(--color-border)] sm:block" />
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-danger)]" />
                  <span className="text-[var(--color-danger)]">
                    {categories.filter((c) => c.type === 'expense').length} {t('common.expense')}
                  </span>
                </span>
                <span className="flex items-center gap-1.5 text-sm font-semibold">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
                  <span className="text-[var(--color-success)]">
                    {categories.filter((c) => c.type === 'income').length} {t('common.income')}
                  </span>
                </span>
              </div>

              {/* Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {categories.map((category, index) => (
                  <div
                    key={category.id}
                    className="group relative overflow-hidden rounded-[24px] border border-[var(--color-border)]/70 bg-[var(--color-surface)] p-5 shadow-sm transition-all duration-300 hover:shadow-[var(--shadow-card)] hover:border-[var(--color-border-strong)]/70"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {/* Gradient accent line at top */}
                    <div
                      className="absolute inset-x-0 top-0 h-0.5 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(90deg, ${category.color ?? '#e5a4b8'}, ${category.color ?? '#e5a4b8'}88, transparent)`,
                      }}
                    />

                    {/* Color glow */}
                    <div
                      className="absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-0 blur-2xl transition-all duration-500 group-hover:opacity-20"
                      style={{ backgroundColor: category.color ?? '#e5a4b8' }}
                    />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3">
                          <span
                            className="relative inline-block h-3.5 w-3.5 rounded-full shadow-sm ring-2 ring-white/60"
                            style={{ backgroundColor: category.color ?? '#e5a4b8' }}
                          >
                            <span
                              className="absolute inset-0 animate-ping rounded-full opacity-25"
                              style={{ backgroundColor: category.color ?? '#e5a4b8' }}
                            />
                          </span>
                          <p className="truncate text-lg font-bold text-[var(--color-text)]">
                            {category.name}
                          </p>
                        </div>
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
                            <HiOutlineRectangleGroup className="text-xs" />
                            {category.icon || '-'}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] ${
                              category.type === 'expense'
                                ? 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'
                                : 'bg-[var(--color-success-soft)] text-[var(--color-success)]'
                            }`}
                          >
                            <span
                              className={`inline-block h-1.5 w-1.5 rounded-full ${
                                category.type === 'expense'
                                  ? 'bg-[var(--color-danger)]'
                                  : 'bg-[var(--color-success)]'
                              }`}
                            />
                            {category.type === 'expense' ? t('common.expense') : t('common.income')}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 justify-end gap-1.5">
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => openEdit(category)}
                          className="flex h-[42px] w-[42px] items-center justify-center rounded-2xl border border-[var(--color-border)]/70 bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-pale)] hover:text-[var(--color-primary)] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--color-border)]/70 disabled:hover:bg-transparent disabled:hover:text-[var(--color-text-muted)]"
                        >
                          <HiOutlinePencilSquare className="text-lg" />
                        </button>
                        <ConfirmActionButton
                          icon={HiOutlineTrash}
                          label={t('page.categories.delete_label')}
                          confirmTitle={t('page.categories.delete_title')}
                          confirmText={t('page.categories.delete_text', { name: category.name })}
                          onConfirm={() => deleteCategory(category.id)}
                          disabled={isDeleting}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </PageSection>
      </div>
    </div>
  )
}

export default CategoriesPage
