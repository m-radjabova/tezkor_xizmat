import { useMemo, useRef, useState } from 'react'
import {
  HiBell,
  HiCheck,
  HiMagnifyingGlass,
  HiPencilSquare,
  HiPhoto,
  HiPlus,
  HiTag,
  HiTrash,
  HiXMark,
} from 'react-icons/hi2'
import Skeleton from '../../components/Skeleton'
import { useAdminCategories } from '../../hooks/useAdminCategories'
import type { Category } from '../../types'
import { getErrorMessage } from '../../utils/error'
import { showErrorToast, showSuccessToast } from '../../utils/toast'

type CategoryForm = {
  name: string
  icon: string
  file: File | null
  previewUrl: string
}

const EMPTY_FORM: CategoryForm = { name: '', icon: '', file: null, previewUrl: '' }

function revokePreviewUrl(value: string) {
  if (value.startsWith('blob:')) URL.revokeObjectURL(value)
}

function AdminCategories() {
  const {
    categories,
    isLoadingCategories,
    isFetchingCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryLogo,
  } = useAdminCategories()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)
  const [form, setForm] = useState<CategoryForm>(EMPTY_FORM)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase()
    if (!normalizedSearch) return categories
    return categories.filter((category) => category.name.toLocaleLowerCase().includes(normalizedSearch))
  }, [categories, search])

  const isSaving = createCategory.isPending || updateCategory.isPending || uploadCategoryLogo.isPending
  const isDeleting = deleteCategory.isPending

  const openCreate = () => {
    setEditingCategory(null)
    setForm(EMPTY_FORM)
    setFormOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditingCategory(category)
    setForm({ name: category.name, icon: category.icon ?? '', file: null, previewUrl: category.icon ?? '' })
    setFormOpen(true)
  }

  const closeForm = () => {
    if (isSaving) return
    revokePreviewUrl(form.previewUrl)
    setFormOpen(false)
    setEditingCategory(null)
    setForm(EMPTY_FORM)
  }

  const handleFileChange = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      showErrorToast('Faqat rasm faylini tanlang')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showErrorToast('Rasm hajmi 5 MB dan oshmasligi kerak')
      return
    }
    revokePreviewUrl(form.previewUrl)
    setForm((current) => ({ ...current, file, previewUrl: URL.createObjectURL(file) }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = form.name.trim()
    if (name.length < 2) {
      showErrorToast('Kategoriya nomi kamida 2 ta belgidan iborat bo‘lishi kerak')
      return
    }

    try {
      const icon = form.file ? await uploadCategoryLogo.mutateAsync(form.file) : form.icon.trim() || null
      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, payload: { name, icon } })
        showSuccessToast('Kategoriya yangilandi')
      } else {
        await createCategory.mutateAsync({ name, icon })
        showSuccessToast('Kategoriya qo‘shildi')
      }
      closeForm()
    } catch (error) {
      showErrorToast(getErrorMessage(error, 'Kategoriya saqlanmadi'))
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteCategory.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
      showSuccessToast('Kategoriya o‘chirildi')
    } catch (error) {
      showErrorToast(getErrorMessage(error, 'Kategoriya o‘chirilmadi. U xizmatlarda ishlatilayotgan bo‘lishi mumkin.'))
    }
  }

  return (
    <main className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-0">
      <header className="sticky top-0 z-20 -mx-4 mb-5 flex min-h-[70px] items-center gap-4 border-b border-slate-100 bg-white/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mr-auto">
          <h1 className="text-2xl font-black tracking-tight">Kategoriyalar</h1>
          <p className="mt-1 text-sm font-semibold text-slate-500">Xizmat kategoriyalarini va ularning logolarini boshqaring.</p>
        </div>
        <button type="button" aria-label="Bildirishnomalar" className="relative grid h-11 w-11 place-items-center rounded-[8px] bg-white text-slate-700 shadow-sm">
          <HiBell className="h-5 w-5" />
        </button>
        <button type="button" onClick={openCreate} className="inline-flex h-11 items-center gap-2 rounded-[8px] bg-emerald-700 px-4 text-sm font-black text-white shadow-sm transition hover:bg-emerald-800">
          <HiPlus className="h-5 w-5" /> Qo‘shish
        </button>
      </header>

      <section className="rounded-[8px] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black">Barcha kategoriyalar</h2>
            <p className="text-sm font-semibold text-slate-500">Jami {categories.length} ta kategoriya</p>
          </div>
          <label className="flex h-11 min-w-64 items-center gap-3 rounded-[8px] border border-slate-200 bg-white px-4">
            <HiMagnifyingGlass className="h-5 w-5 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Kategoriya qidirish" className="min-w-0 flex-1 text-sm font-bold outline-none" />
          </label>
        </div>

        <div className={`mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3 ${isFetchingCategories ? 'opacity-70' : ''}`}>
          {isLoadingCategories ? (
            Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-[8px]" />)
          ) : filteredCategories.length ? (
            filteredCategories.map((category) => (
              <article key={category.id} className="flex items-center gap-4 rounded-[8px] border border-slate-100 bg-slate-50/70 p-4">
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[8px] bg-white text-emerald-700 shadow-sm">
                  {category.icon ? <img src={category.icon} alt={`${category.name} logosi`} className="h-full w-full object-cover" /> : <HiTag className="h-8 w-8" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-black">{category.name}</h3>
                  <p className="mt-1 text-xs font-bold text-slate-400">ID: {category.id.slice(0, 8)}…</p>
                  <div className="mt-3 flex gap-2">
                    <button type="button" onClick={() => openEdit(category)} className="inline-flex h-9 items-center gap-1.5 rounded-[7px] border border-slate-200 bg-white px-3 text-xs font-black text-slate-700 hover:bg-slate-50"><HiPencilSquare className="h-4 w-4" /> Tahrirlash</button>
                    <button type="button" onClick={() => setDeleteTarget(category)} className="grid h-9 w-9 place-items-center rounded-[7px] border border-red-100 bg-white text-red-600 hover:bg-red-50" aria-label={`${category.name} kategoriyasini o‘chirish`}><HiTrash className="h-4 w-4" /></button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-full grid min-h-48 place-items-center rounded-[8px] bg-slate-50 text-center">
              <div><HiTag className="mx-auto h-12 w-12 text-slate-300" /><p className="mt-2 text-sm font-black text-slate-600">Kategoriya topilmadi</p></div>
            </div>
          )}
        </div>
      </section>

      {formOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm() }}>
          <form onSubmit={(event) => void handleSubmit(event)} className="max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto rounded-[8px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><h2 className="text-xl font-black">{editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}</h2><p className="mt-1 text-sm font-semibold text-slate-500">Nom va logo ma’lumotlarini kiriting.</p></div>
              <button type="button" onClick={closeForm} aria-label="Yopish" className="grid h-9 w-9 place-items-center rounded-[7px] text-slate-500 hover:bg-slate-100"><HiXMark className="h-5 w-5" /></button>
            </div>
            <label className="mt-6 block text-sm font-black text-slate-700">Kategoriya nomi<input autoFocus required minLength={2} maxLength={255} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-2 h-11 w-full rounded-[8px] border border-slate-200 px-3 text-sm font-bold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
            <div className="mt-5">
              <p className="text-sm font-black text-slate-700">Kategoriya logosi</p>
              <div className="mt-2 flex items-center gap-4 rounded-[8px] border border-dashed border-slate-300 p-4">
                <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[8px] bg-slate-50 text-emerald-700">{form.previewUrl ? <img src={form.previewUrl} alt="Logo preview" className="h-full w-full object-cover" /> : <HiPhoto className="h-8 w-8" />}</div>
                <div><button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 hover:bg-slate-50"><HiPhoto className="h-5 w-5" /> Rasm tanlash</button><p className="mt-2 text-xs font-semibold text-slate-400">PNG, JPG yoki WEBP. Maksimal 5 MB.</p><input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(event) => handleFileChange(event.target.files?.[0])} /></div>
              </div>
            </div>
            <label className="mt-5 block text-sm font-black text-slate-700">Yoki logo URL<input value={form.icon} onChange={(event) => { revokePreviewUrl(form.previewUrl); setForm((current) => ({ ...current, icon: event.target.value, file: null, previewUrl: event.target.value })) }} placeholder="https://..." className="mt-2 h-11 w-full rounded-[8px] border border-slate-200 px-3 text-sm font-bold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" /></label>
            <div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={closeForm} disabled={isSaving} className="h-11 rounded-[8px] border border-slate-200 text-sm font-black text-slate-700 disabled:opacity-60">Bekor qilish</button><button type="submit" disabled={isSaving} className="inline-flex h-11 items-center justify-center gap-2 rounded-[8px] bg-emerald-700 text-sm font-black text-white disabled:opacity-60">{isSaving ? 'Saqlanmoqda...' : <><HiCheck className="h-5 w-5" /> Saqlash</>}</button></div>
          </form>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[8px] bg-white p-6 shadow-2xl"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-600"><HiTrash className="h-7 w-7" /></div><h2 className="mt-4 text-center text-xl font-black">Kategoriyani o‘chirish</h2><p className="mt-2 text-center text-sm font-semibold leading-6 text-slate-500"><b>{deleteTarget.name}</b> kategoriyasi o‘chiriladi. Agar u xizmatlarda ishlatilayotgan bo‘lsa, backend o‘chirishga ruxsat bermaydi.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setDeleteTarget(null)} className="h-11 rounded-[8px] border border-slate-200 text-sm font-black text-slate-700">Bekor qilish</button><button type="button" onClick={() => void handleDelete()} disabled={isDeleting} className="h-11 rounded-[8px] bg-red-600 text-sm font-black text-white disabled:opacity-60">{isDeleting ? 'O‘chirilmoqda...' : 'O‘chirish'}</button></div></div>
        </div>
      )}
    </main>
  )
}

export default AdminCategories