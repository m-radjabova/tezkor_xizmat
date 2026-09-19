import {
  HiBell,
  HiBriefcase,
  HiCheckCircle,
  HiChartBar,
  HiStar,
  HiUserGroup,
} from 'react-icons/hi2'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import AdminSidebar from '../AdminSidebar'
import Skeleton from '../../components/Skeleton'
import { useProviderBusinesses } from '../../hooks/useProviderBusinesses'
import { useProviderReviews } from '../../hooks/useProviderReviews'

const colors = ['#047857', '#2563eb', '#f59e0b', '#dc2626', '#7c3aed', '#0f766e']

function ProviderStatistics() {
  const { businesses, isLoadingBusinesses } = useProviderBusinesses()
  const { reviews } = useProviderReviews()
  const approvedReviews = reviews.filter((review) => review.is_approved)
  const totalReviews = approvedReviews.length
  const verifiedCount = businesses.filter((business) => business.is_verified).length
  const averageRating = approvedReviews.length
    ? approvedReviews.reduce((total, review) => total + review.rating, 0) / approvedReviews.length
    : 0

  const chartData = businesses.map((business) => ({
    name: business.name.length > 16 ? `${business.name.slice(0, 16)}...` : business.name,
    sharh: approvedReviews.filter((review) => review.business_id === business.id).length,
    reyting: Number(
      (() => {
        const businessReviews = approvedReviews.filter((review) => review.business_id === business.id)
        if (!businessReviews.length) return 0
        return businessReviews.reduce((total, review) => total + review.rating, 0) / businessReviews.length
      })().toFixed(1),
    ),
  }))

  const categoryData = businesses.reduce<{ name: string; value: number }[]>((items, business) => {
    const name = business.category?.name || 'Kategoriya'
    const item = items.find((current) => current.name === name)
    if (item) item.value += 1
    else items.push({ name, value: 1 })
    return items
  }, [])

  const statusData = [
    { name: 'Tasdiqlangan', value: verifiedCount },
    { name: 'Tekshiruvda', value: Math.max(0, businesses.length - verifiedCount) },
  ]

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950 lg:flex">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-0">
        <header className="sticky top-0 z-20 -mx-4 mb-5 flex min-h-[70px] items-center gap-4 border-b border-slate-100 bg-white/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <h1 className="mr-auto text-2xl font-black tracking-tight">Statistika</h1>
          <button className="relative grid h-11 w-11 place-items-center rounded-[8px] bg-white text-slate-700 shadow-sm">
            <HiBell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
        </header>

        {isLoadingBusinesses ? (
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28" />
            ))}
          </div>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-4">
              {[
                { label: 'Jami xizmatlar', value: businesses.length, icon: HiBriefcase },
                { label: 'Tasdiqlangan', value: verifiedCount, icon: HiCheckCircle },
                { label: 'Sharhlar', value: totalReviews, icon: HiUserGroup },
                { label: "O'rtacha reyting", value: averageRating.toFixed(1), icon: HiStar },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <article key={item.label} className="rounded-[8px] bg-white p-5 shadow-sm">
                    <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-emerald-50 text-emerald-700">
                      <Icon className="h-6 w-6" />
                    </span>
                    <p className="mt-4 text-sm font-bold text-slate-500">{item.label}</p>
                    <p className="mt-1 text-3xl font-black text-slate-950">{item.value}</p>
                  </article>
                )
              })}
            </section>

            <section className="mt-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-[8px] bg-white p-5 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-black">
                  <HiChartBar className="h-5 w-5 text-emerald-700" />
                  Sharh va reyting dinamikasi
                </h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis tickLine={false} axisLine={false} fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sharh" name="Sharhlar" stroke="#047857" strokeWidth={3} />
                      <Line type="monotone" dataKey="reyting" name="Reyting" stroke="#2563eb" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="rounded-[8px] bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-black">Kategoriya ulushi</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={105}>
                        {categoryData.map((item, index) => (
                          <Cell key={item.name} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </section>

            <section className="mt-5 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
              <article className="rounded-[8px] bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-black">Xizmat holati</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={95}>
                        {statusData.map((item, index) => (
                          <Cell key={item.name} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="rounded-[8px] bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-black">Xizmatlar reytingi</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sharh" name="Sharhlar" fill="#047857" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

export default ProviderStatistics
