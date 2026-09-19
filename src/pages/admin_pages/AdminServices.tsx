import { useMemo, useState } from 'react'
import { HiBell, HiBriefcase, HiCheck, HiMagnifyingGlass, HiShieldCheck, HiTrash, HiXMark } from 'react-icons/hi2'
import Skeleton from '../../components/Skeleton'
import { type AdminBusinessFilter, useAdminBusinesses } from '../../hooks/useAdminBusinesses'
import { useDebounce } from '../../hooks/useDebounce'
import { useUsers } from '../../hooks/useUsers'
import type { Business } from '../../types'
import { getErrorMessage } from '../../utils/error'
import { showErrorToast, showSuccessToast } from '../../utils/toast'

function AdminServices() {
  const { users } = useUsers({ role: 'provider', limit: 100 })
  const [filter, setFilter] = useState<AdminBusinessFilter>('pending')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const debouncedSearch = useDebounce(search)
  const {
    businesses,
    totalBusinesses,
    isLoadingBusinesses,
    isFetchingBusinesses,
    verifyBusiness,
    deleteBusiness,
    isVerifyingBusiness,
    isDeletingBusiness,
  } = useAdminBusinesses({ page, limit, filter, search: debouncedSearch })
  const [deleteTarget, setDeleteTarget] = useState<Business | null>(null)
  const providers = users.filter((user) => user.role === 'provider')
  const providerById = useMemo(() => new Map(providers.map((provider) => [provider.id, provider])), [providers])
  const totalPages = Math.max(1, Math.ceil(totalBusinesses / limit))
  const startItem = totalBusinesses === 0 ? 0 : (page - 1) * limit + 1
  const endItem = Math.min(page * limit, totalBusinesses)

  const handleVerify = async (business: Business, isVerified: boolean) => {
    try {
      await verifyBusiness({ id: business.id, is_verified: isVerified })
      showSuccessToast(isVerified ? 'Xizmat tasdiqlandi' : 'Xizmat tasdiqdan olib tashlandi')
    } catch (error) {
      showErrorToast(getErrorMessage(error, 'Xizmat holatini yangilashda xatolik yuz berdi'))
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteBusiness(deleteTarget.id)
      showSuccessToast("Xizmat o'chirildi")
      setDeleteTarget(null)
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Xizmatni o'chirishda xatolik yuz berdi"))
    }
  }

  return (
    <main className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-0">
      <header className="sticky top-0 z-20 -mx-4 mb-5 flex min-h-[70px] items-center gap-4 border-b border-slate-100 bg-white/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <h1 className="mr-auto text-2xl font-black tracking-tight">Xizmatlar</h1>
        <button className="relative grid h-11 w-11 place-items-center rounded-[8px] bg-white text-slate-700 shadow-sm">
          <HiBell className="h-5 w-5" />
        </button>
      </header>

      <section className="rounded-[8px] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-black">Xizmatlarni boshqarish</h2>
            <p className="text-sm font-semibold text-slate-500">Tasdiqlash, tasdiqdan olish yoki o'chirish.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex h-11 min-w-[260px] items-center gap-3 rounded-[8px] border border-slate-200 bg-white px-4">
              <HiMagnifyingGlass className="h-5 w-5 text-slate-400" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                placeholder="Xizmat yoki provider qidirish"
                className="min-w-0 flex-1 text-sm font-bold outline-none"
              />
            </div>
            <div className="grid grid-cols-3 rounded-[8px] bg-slate-100 p-1">
              {[
                { value: 'pending', label: 'Kutilmoqda' },
                { value: 'verified', label: 'Tasdiq' },
                { value: 'all', label: 'Hammasi' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setFilter(item.value as AdminBusinessFilter)
                    setPage(1)
                  }}
                  className={`h-9 rounded-[7px] px-3 text-xs font-black ${filter === item.value ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {isLoadingBusinesses ? (
            Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-24" />)
          ) : businesses.length ? (
            businesses.map((business) => {
              const provider = providerById.get(business.owner_id)
              return (
                <article key={business.id} className="rounded-[8px] border border-slate-100 bg-slate-50/60 p-4">
                  <div className={`flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${isFetchingBusinesses ? 'opacity-70' : ''}`}>
                    <div className="min-w-0 flex gap-4">
                      <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-[8px] bg-white text-emerald-700">
                        {business.logo_url ? <img src={business.logo_url} alt="" className="h-full w-full object-cover" /> : <HiBriefcase className="h-8 w-8" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-black">{business.name}</h3>
                          <span className={`rounded-full px-3 py-1 text-xs font-black ${business.is_verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {business.is_verified ? 'Tasdiqlangan' : 'Kutilmoqda'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{business.category?.name || 'Kategoriya'}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-500">Provider: {provider?.organization_name || provider?.full_name || 'Nomaʼlum'}</p>
                        <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-500">{business.address}</p>
                      </div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:w-64">
                      <button
                        type="button"
                        onClick={() => void handleVerify(business, !business.is_verified)}
                        disabled={isVerifyingBusiness}
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-4 text-sm font-black text-white disabled:opacity-60 ${business.is_verified ? 'bg-slate-950' : 'bg-emerald-700'}`}
                      >
                        {business.is_verified ? <HiXMark className="h-5 w-5" /> : <HiCheck className="h-5 w-5" />}
                        {business.is_verified ? 'Tasdiqdan olish' : 'Tasdiqlash'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(business)}
                        disabled={isDeletingBusiness}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-red-100 bg-white px-4 text-sm font-black text-red-600 disabled:opacity-60"
                      >
                        <HiTrash className="h-5 w-5" />
                        O'chirish
                      </button>
                    </div>
                  </div>
                </article>
              )
            })
          ) : (
            <div className="grid min-h-48 place-items-center rounded-[8px] bg-slate-50 text-center">
              <div>
                <HiShieldCheck className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-sm font-black text-slate-600">Xizmat topilmadi</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-bold text-slate-500">
            {startItem}-{endItem} ko'rsatilmoqda, jami {totalBusinesses} ta
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value))
                setPage(1)
              }}
              className="h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-sm font-bold outline-none"
            >
              {[10, 20, 50].map((item) => (
                <option key={item} value={item}>
                  {item} tadan
                </option>
              ))}
            </select>
            <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1 || isFetchingBusinesses}
                className="h-10 rounded-[8px] border border-slate-200 text-lg font-black text-slate-700 disabled:opacity-40"
              >
                {'<'}
              </button>
              <span className="min-w-28 text-center text-sm font-black text-slate-700">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page >= totalPages || isFetchingBusinesses}
                className="h-10 rounded-[8px] border border-slate-200 text-lg font-black text-slate-700 disabled:opacity-40"
              >
                {'>'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[8px] bg-white p-6 shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-600">
              <HiTrash className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-center text-xl font-black">Xizmatni o'chirishni tasdiqlang</h3>
            <p className="mt-2 text-center text-sm font-semibold leading-6 text-slate-500">
              {deleteTarget.name} xizmati o'chiriladi.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setDeleteTarget(null)} className="h-11 rounded-[8px] border border-slate-200 text-sm font-black text-slate-700">Bekor qilish</button>
              <button type="button" onClick={() => void confirmDelete()} disabled={isDeletingBusiness} className="h-11 rounded-[8px] bg-red-600 text-sm font-black text-white disabled:opacity-60">O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminServices
