import { HiBell, HiBriefcase, HiCheck, HiNoSymbol, HiUserGroup } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import Skeleton from '../components/Skeleton'
import { useAdminBusinesses } from '../hooks/useAdminBusinesses'
import useContextPro from '../hooks/useContextPro'
import { useUsers } from '../hooks/useUsers'

function Admin() {
  const { user } = useContextPro()
  const {
    users: providers,
    totalUsers: totalProviders,
    blockedUsersCount: blockedProvidersCount,
    isLoading: isLoadingProviders,
  } = useUsers({ role: 'provider', limit: 4 })
  const {
    totalUsers: totalCustomers,
    blockedUsersCount: blockedCustomersCount,
    isLoading: isLoadingCustomers,
  } = useUsers({ role: 'customer', limit: 1 })
  const { businesses, pendingBusinessesCount, verifiedBusinessesCount, isLoadingBusinesses } = useAdminBusinesses({
    limit: 4,
    filter: 'pending',
  })
  const isLoading = isLoadingProviders || isLoadingCustomers

  return (
    <main className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-0">
      <header className="sticky top-0 z-20 -mx-4 mb-5 flex min-h-[70px] items-center gap-4 border-b border-slate-100 bg-white/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mr-auto">
          <h1 className="text-2xl font-black tracking-tight">Admin panel</h1>
          <p className="text-sm font-semibold text-slate-500">{user?.full_name || 'Administrator'}</p>
        </div>
        <button className="relative grid h-11 w-11 place-items-center rounded-[8px] bg-white text-slate-700 shadow-sm">
          <HiBell className="h-5 w-5" />
          {pendingBusinessesCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
        </button>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: 'Providerlar', value: totalProviders, icon: HiUserGroup },
          { label: 'Foydalanuvchilar', value: totalCustomers, icon: HiUserGroup },
          { label: 'Bloklangan userlar', value: blockedProvidersCount + blockedCustomersCount, icon: HiNoSymbol },
          { label: 'Tasdiqlanmagan xizmat', value: pendingBusinessesCount, icon: HiBriefcase },
          { label: 'Tasdiqlangan xizmat', value: verifiedBusinessesCount, icon: HiCheck },
        ].map((item) => {
          const Icon = item.icon
          return (
            <article key={item.label} className="rounded-[8px] bg-white p-5 shadow-sm">
              <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-emerald-50 text-emerald-700">
                <Icon className="h-6 w-6" />
              </span>
              <p className="mt-4 text-sm font-bold text-slate-500">{item.label}</p>
              <p className="mt-1 text-3xl font-black text-slate-950">
                {isLoading || isLoadingBusinesses ? '...' : item.value}
              </p>
            </article>
          )
        })}
      </section>

      <section className="mt-5 grid gap-4 xl:grid-cols-2">
        <article className="rounded-[8px] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Tasdiqlash kutilayotgan xizmatlar</h2>
              <p className="text-sm font-semibold text-slate-500">Public sahifaga chiqarish uchun tekshiring.</p>
            </div>
            <Link to="/admin/services" className="rounded-[8px] bg-slate-950 px-4 py-2 text-sm font-black text-white">
              Ochish
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {isLoadingBusinesses ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-16" />)
            ) : businesses.slice(0, 4).map((business) => (
              <div key={business.id} className="rounded-[8px] bg-slate-50 p-3">
                <p className="text-sm font-black">{business.name}</p>
                <p className="text-xs font-bold text-slate-500">{business.category?.name || 'Kategoriya'}</p>
              </div>
            ))}
            {!isLoadingBusinesses && businesses.length === 0 && (
              <p className="rounded-[8px] bg-slate-50 p-4 text-sm font-bold text-slate-500">Kutilayotgan xizmat yo'q</p>
            )}
          </div>
        </article>

        <article className="rounded-[8px] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Providerlar</h2>
              <p className="text-sm font-semibold text-slate-500">Block, unblock yoki o'chirish amallari.</p>
            </div>
            <Link to="/admin/providers" className="rounded-[8px] bg-slate-950 px-4 py-2 text-sm font-black text-white">
              Ochish
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => <Skeleton key={index} className="h-16" />)
            ) : providers.map((provider) => (
              <div key={provider.id} className="rounded-[8px] bg-slate-50 p-3">
                <p className="text-sm font-black">{provider.organization_name || provider.full_name}</p>
                <p className="text-xs font-bold text-slate-500">{provider.is_blocked ? 'Bloklangan' : 'Faol'}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[8px] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Foydalanuvchilar</h2>
              <p className="text-sm font-semibold text-slate-500">Providerlardan tashqari customer hisoblar.</p>
            </div>
            <Link to="/admin/customers" className="rounded-[8px] bg-slate-950 px-4 py-2 text-sm font-black text-white">
              Ochish
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-[8px] bg-slate-50 p-4">
              <p className="text-xs font-bold text-slate-500">Jami</p>
              <p className="mt-1 text-2xl font-black">{isLoadingCustomers ? '...' : totalCustomers}</p>
            </div>
            <div className="rounded-[8px] bg-red-50 p-4">
              <p className="text-xs font-bold text-red-500">Bloklangan</p>
              <p className="mt-1 text-2xl font-black text-red-600">{isLoadingCustomers ? '...' : blockedCustomersCount}</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  )
}

export default Admin
