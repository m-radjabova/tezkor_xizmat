import { useState } from 'react'
import { HiBell, HiMagnifyingGlass, HiNoSymbol, HiTrash, HiUserGroup } from 'react-icons/hi2'
import Skeleton, { SkeletonText } from '../../components/Skeleton'
import { useAdminBusinesses } from '../../hooks/useAdminBusinesses'
import { useDebounce } from '../../hooks/useDebounce'
import { useUsers } from '../../hooks/useUsers'
import type { User } from '../../types'
import { getErrorMessage } from '../../utils/error'
import { showErrorToast } from '../../utils/toast'

type ProviderFilter = 'active' | 'blocked' | 'all'

function AdminProviders() {
  const [filter, setFilter] = useState<ProviderFilter>('active')
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const debouncedSearch = useDebounce(search)
  const {
    users: providers,
    totalUsers,
    activeUsersCount,
    blockedUsersCount,
    isLoading,
    updateUser,
    deleteUser,
    isUpdating,
    isDeleting,
  } = useUsers({
    role: 'provider',
    filter,
    search: debouncedSearch,
    limit: 100,
  })
  const { businesses } = useAdminBusinesses()

  const handleToggleBlock = async (provider: User) => {
    try {
      await updateUser({
        id: provider.id,
        payload: { is_blocked: !provider.is_blocked },
      })
    } catch {
      // useUsers already shows toast.
    }
  }

  const confirmDelete = async () => {
    if (!deleteTarget) return

    try {
      await deleteUser(deleteTarget.id)
      setDeleteTarget(null)
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Providerni o'chirishda xatolik yuz berdi"))
    }
  }

  return (
    <main className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-0">
      <header className="sticky top-0 z-20 -mx-4 mb-5 flex min-h-[70px] items-center gap-4 border-b border-slate-100 bg-white/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <h1 className="mr-auto text-2xl font-black tracking-tight">Providerlar</h1>
        <button className="relative grid h-11 w-11 place-items-center rounded-[8px] bg-white text-slate-700 shadow-sm">
          <HiBell className="h-5 w-5" />
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
          {[
          { label: 'Jami provider', value: totalUsers },
          { label: 'Faol provider', value: activeUsersCount },
          { label: 'Bloklangan', value: blockedUsersCount },
        ].map((item) => (
          <article key={item.label} className="rounded-[8px] bg-white p-5 shadow-sm">
            <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-emerald-50 text-emerald-700">
              <HiUserGroup className="h-6 w-6" />
            </span>
            <p className="mt-4 text-sm font-bold text-slate-500">{item.label}</p>
            <p className="mt-1 text-3xl font-black">{isLoading ? '...' : item.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-5 rounded-[8px] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-xl font-black">Providerlarni boshqarish</h2>
            <p className="text-sm font-semibold text-slate-500">Block qilingan provider qayta tizimga kira olmaydi.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex h-11 min-w-[260px] items-center gap-3 rounded-[8px] border border-slate-200 bg-white px-4">
              <HiMagnifyingGlass className="h-5 w-5 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Provider qidirish"
                className="min-w-0 flex-1 text-sm font-bold outline-none"
              />
            </div>
            <div className="grid grid-cols-3 rounded-[8px] bg-slate-100 p-1">
              {[
                { value: 'active', label: 'Faol' },
                { value: 'blocked', label: 'Block' },
                { value: 'all', label: 'Hammasi' },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value as ProviderFilter)}
                  className={`h-9 rounded-[7px] px-3 text-xs font-black ${filter === item.value ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <article key={index} className="rounded-[8px] border border-slate-100 p-4">
                <SkeletonText className="w-52" />
                <Skeleton className="mt-3 h-10 w-full" />
              </article>
            ))
          ) : providers.length ? (
            providers.map((provider) => {
              const providerBusinesses = businesses.filter((business) => business.owner_id === provider.id)
              return (
                <article key={provider.id} className="rounded-[8px] border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-black">{provider.organization_name || provider.full_name}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${provider.is_blocked ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                          {provider.is_blocked ? 'Bloklangan' : 'Faol'}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-slate-500">Mas'ul: {provider.responsible_person || provider.full_name}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">{provider.email} {provider.phone ? `• ${provider.phone}` : ''}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-500">
                        Xizmatlari: {providerBusinesses.length} ta, tasdiqlangan: {providerBusinesses.filter((business) => business.is_verified).length} ta
                      </p>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 lg:w-60">
                      <button
                        type="button"
                        onClick={() => void handleToggleBlock(provider)}
                        disabled={isUpdating}
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-4 text-sm font-black text-white disabled:opacity-60 ${provider.is_blocked ? 'bg-emerald-700' : 'bg-slate-950'}`}
                      >
                        <HiNoSymbol className="h-5 w-5" />
                        {provider.is_blocked ? 'Ochish' : 'Block'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(provider)}
                        disabled={isDeleting}
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
                <HiUserGroup className="mx-auto h-12 w-12 text-slate-300" />
                <p className="mt-2 text-sm font-black text-slate-600">Provider topilmadi</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[8px] bg-white p-6 shadow-2xl">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-600">
              <HiTrash className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-center text-xl font-black">Providerni o'chirishni tasdiqlang</h3>
            <p className="mt-2 text-center text-sm font-semibold leading-6 text-slate-500">
              {deleteTarget.organization_name || deleteTarget.full_name} provideri va unga tegishli xizmatlar o'chiriladi.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setDeleteTarget(null)} className="h-11 rounded-[8px] border border-slate-200 text-sm font-black text-slate-700">Bekor qilish</button>
              <button type="button" onClick={() => void confirmDelete()} disabled={isDeleting} className="h-11 rounded-[8px] bg-red-600 text-sm font-black text-white disabled:opacity-60">O'chirish</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminProviders
