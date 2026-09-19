import {
  HiArrowRight,
  HiBell,
  HiBriefcase,
  HiChartBar,
  HiChatBubbleLeftRight,
  HiChevronDown,
  HiCog6Tooth,
  HiEye,
  HiMagnifyingGlass,
  HiMapPin,
  HiPlus,
  HiShieldCheck,
  HiSparkles,
} from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import AdminSidebar from '../AdminSidebar'
import useContextPro from '../../hooks/useContextPro'
import { useProviderBusinesses } from '../../hooks/useProviderBusinesses'
import { useProviderReviews } from '../../hooks/useProviderReviews'
import Skeleton, { SkeletonText } from '../../components/Skeleton'
import bgImage from '../../assets/bg_image.png'

const actions = [
  { label: 'Xizmatlarim', icon: HiBriefcase, to: '/provider/services', color: 'emerald' },
  { label: 'Statistika', icon: HiChartBar, to: '/provider/statistics', color: 'blue' },
  { label: 'Sharhlar', icon: HiChatBubbleLeftRight, to: '/provider/reviews', color: 'amber' },
  { label: 'Sozlamalar', icon: HiCog6Tooth, to: '/provider/profile', color: 'slate' },
]

const chartColors = ['#059669', '#0ea5e9', '#f59e0b', '#ef4444', '#8b5cf6']

const actionColorClasses: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white',
  blue: 'bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white',
  amber: 'bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white',
  slate: 'bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white',
}

function ProviderCabinet() {
  const { user } = useContextPro()
  const { businesses, isLoadingBusinesses } = useProviderBusinesses()
  const { reviews } = useProviderReviews()
  const navigate = useNavigate()

  const displayName = user?.full_name || 'Dilshod A.'
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const approvedReviews = reviews.filter((review) => review.is_approved)
  const totalReviews = approvedReviews.length
  const verifiedCount = businesses.filter((business) => business.is_verified).length
  const activeBusiness = businesses[0]

  const averageRating = approvedReviews.length
    ? (
        approvedReviews.reduce((total, review) => total + review.rating, 0) /
        approvedReviews.length
      ).toFixed(1)
    : '0.0'

  const stats = [
    {
      label: 'Xizmatlar',
      value: businesses.length.toString(),
      change: `${verifiedCount} tasdiqlangan`,
      icon: HiEye,
      accent: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Sharhlar',
      value: totalReviews.toString(),
      change: `${averageRating} ★ o'rtacha`,
      icon: HiChatBubbleLeftRight,
      accent: 'from-amber-500 to-orange-500',
    },
    {
      label: "Yo'nalishlar",
      value: businesses.length.toString(),
      change: 'Manzillar',
      icon: HiMapPin,
      accent: 'from-blue-500 to-indigo-500',
    },
  ]

  const businessChartData = businesses.map((business) => {
    const businessReviews = approvedReviews.filter(
      (review) => review.business_id === business.id,
    )
    const avg = businessReviews.length
      ? businessReviews.reduce((total, review) => total + review.rating, 0) /
        businessReviews.length
      : 0
    return {
      name: business.name.length > 14 ? `${business.name.slice(0, 14)}...` : business.name,
      sharh: businessReviews.length,
      reyting: Number(avg.toFixed(1)),
    }
  })

  const statusChartData = [
    { name: 'Tasdiqlangan', value: verifiedCount },
    { name: 'Tekshiruvda', value: Math.max(0, businesses.length - verifiedCount) },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 text-slate-950 lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-4 pb-10 pt-20 sm:px-6 lg:px-10 lg:pt-0">
        {/* HEADER */}
        <header className="sticky top-0 z-20 -mx-4 mb-6 flex min-h-[76px] items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
          <div className="mr-auto">
            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              Kabinet
            </h1>
            <p className="hidden text-xs font-semibold text-slate-500 sm:block">
              Xizmatlaringizni boshqaring
            </p>
          </div>

          <div className="hidden h-11 w-full max-w-[400px] items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-slate-400 transition focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 md:flex">
            <HiMagnifyingGlass className="h-5 w-5" />
            <input
              type="text"
              placeholder="Xizmatlar, mijozlar yoki ma'lumotlarni qidiring..."
              className="w-full bg-transparent text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <button
            type="button"
            className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md"
            aria-label="Bildirishnomalar"
          >
            <HiBell className="h-5 w-5" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 animate-pulse rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          <button
            type="button"
            className="hidden items-center gap-3 rounded-xl bg-white px-2.5 py-1.5 text-left shadow-sm ring-1 ring-slate-200 transition hover:ring-emerald-300 md:flex"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-black text-white shadow-sm">
              {initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-black text-slate-900">
                {displayName}
              </span>
              <span className="block truncate text-xs font-semibold text-slate-500">
                {activeBusiness?.name || 'Shifo Farm'}
              </span>
            </span>
            <HiChevronDown className="h-5 w-5 text-slate-400" />
          </button>
        </header>

        {/* HERO */}
        <section
          className="relative overflow-hidden rounded-2xl bg-emerald-700 px-6 py-8 text-white shadow-lg shadow-emerald-900/10 sm:px-10 sm:py-10"
          style={{
            backgroundImage: `linear-gradient(115deg, rgba(4,120,87,0.97) 0%, rgba(5,150,105,0.85) 45%, rgba(16,185,129,0.35) 100%), url(${bgImage})`,
            backgroundPosition: 'left center, center',
            backgroundSize: 'cover',
          }}
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-24 right-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
                <HiSparkles className="h-4 w-4" />
                Bugungi holat
              </div>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Assalomu alaykum, {displayName.split(' ')[0]}!
              </h2>
              <p className="mt-3 max-w-md text-sm font-semibold leading-6 text-white/90 sm:text-base">
                Mijozlar hayotini osonlashtirishda sizning xizmatlaringiz muhim.
                Bugun ham muvaffaqiyatli kun bo'lsin!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/provider/statistics')}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-black text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <HiChartBar className="h-5 w-5" />
                Statistikani ko'rish
              </button>
              <button
                type="button"
                onClick={() => navigate('/provider/services?new=1')}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-900/40 px-4 py-2.5 text-sm font-black text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-emerald-900/60"
              >
                <HiPlus className="h-5 w-5" />
                Yangi xizmat
              </button>
            </div>
          </div>
        </section>

        {/* STATS + BIZNES HOLATI */}
        <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1.4fr]">
          <article className="group flex min-h-[170px] items-center gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="relative grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50">
              <span className="grid h-16 w-16 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md transition group-hover:scale-105">
                <HiBriefcase className="h-9 w-9" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Biznesingiz holati
              </p>
              <h3 className="mt-1 text-xl font-black">{activeBusiness?.name || 'Xizmat qo\'shilmagan'}</h3>
              <div
                className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-black ${
                  activeBusiness?.is_verified
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                <HiShieldCheck className="h-5 w-5" />
                {activeBusiness?.is_verified ? 'Tasdiqlangan' : 'Tekshiruv kutilmoqda'}
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {activeBusiness
                  ? `${activeBusiness.name} xizmati faol holatda.`
                  : "Hali xizmat qo'shilmagan."}
              </p>
            </div>
            <HiArrowRight className="hidden h-6 w-6 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600 sm:block" />
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black">Haftalik ko'rsatkichlar</h3>
                <p className="text-xs font-semibold text-slate-500">
                  Asosiy metrikalar bir joyda
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Bu hafta
                <HiChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {stats.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="group rounded-xl bg-slate-50/70 p-4 ring-1 ring-transparent transition hover:bg-white hover:ring-slate-100 hover:shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${item.accent} text-white shadow-sm`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        {isLoadingBusinesses ? (
                          <div className="min-w-24 space-y-2">
                            <SkeletonText className="w-16" />
                            <Skeleton className="h-7 w-20" />
                            <SkeletonText className="w-24" />
                          </div>
                        ) : (
                          <>
                            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                              {item.label}
                            </p>
                            <p className="mt-1 text-2xl font-black text-slate-900">
                              {item.value}
                            </p>
                            <p className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                              {item.change}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </article>
        </section>

        {/* CTA + TEZKOR AMALLAR */}
        <section className="mt-6 grid gap-5 xl:grid-cols-[1fr_1.4fr]">
          <button
            type="button"
            onClick={() => navigate('/provider/services?new=1')}
            className="group relative flex min-h-[130px] items-center justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 px-7 text-left text-white shadow-lg shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl transition group-hover:bg-white/20" />
            <span className="relative flex items-center gap-5">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur transition group-hover:bg-white group-hover:text-emerald-700">
                <HiPlus className="h-7 w-7" />
              </span>
              <span className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wide text-white/80">
                  Tezkor harakat
                </span>
                <span className="text-xl font-black">Yangi xizmat qo'shish</span>
              </span>
            </span>
            <HiArrowRight className="relative h-7 w-7 transition group-hover:translate-x-1" />
          </button>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5">
              <h3 className="text-lg font-black">Tezkor amallar</h3>
              <p className="text-xs font-semibold text-slate-500">
                Eng ko'p ishlatiladigan bo'limlar
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {actions.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => item.to && navigate(item.to)}
                    className="group flex min-h-[90px] flex-col items-center justify-center gap-2 rounded-xl bg-slate-50 text-sm font-bold text-slate-600 ring-1 ring-transparent transition hover:bg-white hover:ring-slate-100 hover:shadow-sm"
                  >
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-xl transition ${actionColorClasses[item.color]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    {item.label}
                  </button>
                )
              })}
            </div>
          </article>
        </section>

        {/* CHARTS */}
        <section className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_0.9fr]">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black">Xizmatlar bo'yicha sharhlar</h3>
                <p className="text-xs font-semibold text-slate-500">
                  Har bir xizmat uchun sharh va reyting
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/provider/statistics')}
                className="inline-flex items-center gap-1 text-sm font-black text-emerald-700 transition hover:gap-2"
              >
                To'liq ko'rish
                <HiArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="h-72">
              {businessChartData.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                  <HiChartBar className="h-10 w-10" />
                  <p className="text-sm font-semibold">Ma'lumot mavjud emas</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={businessChartData} barGap={6}>
                    <defs>
                      <linearGradient id="barSharh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                      <linearGradient id="barReyting" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tick={{ fill: '#64748b', fontWeight: 600 }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                      tick={{ fill: '#64748b', fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px -10px rgba(0,0,0,0.15)',
                        fontWeight: 600,
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 12, fontWeight: 700, paddingTop: 8 }}
                    />
                    <Bar
                      dataKey="sharh"
                      name="Sharhlar"
                      fill="url(#barSharh)"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={36}
                    />
                    <Bar
                      dataKey="reyting"
                      name="Reyting"
                      fill="url(#barReyting)"
                      radius={[8, 8, 0, 0]}
                      maxBarSize={36}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-5">
              <h3 className="text-lg font-black">Tasdiqlanish holati</h3>
              <p className="text-xs font-semibold text-slate-500">
                Xizmatlaringizning tasdiqlanish darajasi
              </p>
            </div>
            <div className="relative h-72">
              {businesses.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                  <HiShieldCheck className="h-10 w-10" />
                  <p className="text-sm font-semibold">Ma'lumot mavjud emas</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusChartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={62}
                        outerRadius={95}
                        paddingAngle={3}
                        stroke="none"
                      >
                        {statusChartData.map((item, index) => (
                          <Cell
                            key={item.name}
                            fill={chartColors[index % chartColors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 10px 25px -10px rgba(0,0,0,0.15)',
                          fontWeight: 600,
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: 12, fontWeight: 700, paddingTop: 8 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-900">
                      {businesses.length}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Jami
                    </span>
                  </div>
                </>
              )}
            </div>
          </article>
        </section>
      </main>
    </div>
  )
}

export default ProviderCabinet
