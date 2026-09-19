import { useState } from 'react'
import {
  HiBell,
  HiCheck,
  HiChatBubbleLeftRight,
  HiClock,
  HiStar,
  HiTrash,
  HiUserCircle,
} from 'react-icons/hi2'
import AdminSidebar from '../AdminSidebar'
import Skeleton, { SkeletonText } from '../../components/Skeleton'
import { useProviderReviews } from '../../hooks/useProviderReviews'
import { getErrorMessage } from '../../utils/error'
import { showErrorToast, showSuccessToast } from '../../utils/toast'

type ReviewFilter = 'pending' | 'approved' | 'all'

const filters: { value: ReviewFilter; label: string }[] = [
  { value: 'pending', label: 'Kutilmoqda' },
  { value: 'approved', label: 'Tasdiqlangan' },
  { value: 'all', label: 'Hammasi' },
]

function ProviderReviews() {
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>('pending')
  const {
    reviews,
    isLoadingReviews,
    approveReview,
    rejectReview,
    isApprovingReview,
    isRejectingReview,
  } = useProviderReviews({ statusFilter: activeFilter })
  const { reviews: allReviews } = useProviderReviews({ statusFilter: 'all' })

  const pendingCount = allReviews.filter((review) => !review.is_approved).length
  const approvedCount = allReviews.filter((review) => review.is_approved).length

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id)
      showSuccessToast('Sharh tasdiqlandi')
    } catch (error) {
      showErrorToast(getErrorMessage(error, 'Sharhni tasdiqlashda xatolik yuz berdi'))
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectReview(id)
      showSuccessToast("Sharh rad qilindi")
    } catch (error) {
      showErrorToast(getErrorMessage(error, "Sharhni rad qilishda xatolik yuz berdi"))
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-950 lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-6 lg:px-8 lg:pt-0">
        <header className="sticky top-0 z-20 -mx-4 mb-5 flex min-h-[70px] items-center gap-4 border-b border-slate-100 bg-white/90 px-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <h1 className="mr-auto text-2xl font-black tracking-tight">Sharhlar</h1>
          <button className="relative grid h-11 w-11 place-items-center rounded-[8px] bg-white text-slate-700 shadow-sm">
            <HiBell className="h-5 w-5" />
            {pendingCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
          </button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: 'Jami sharhlar', value: allReviews.length, icon: HiChatBubbleLeftRight },
            { label: 'Kutilayotgan', value: pendingCount, icon: HiClock },
            { label: 'Tasdiqlangan', value: approvedCount, icon: HiCheck },
          ].map((item) => {
            const Icon = item.icon
            return (
              <article key={item.label} className="rounded-[8px] bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-[8px] bg-emerald-50 text-emerald-700">
                  <Icon className="h-6 w-6" />
                </span>
                <p className="mt-4 text-sm font-bold text-slate-500">{item.label}</p>
                <p className="mt-1 text-3xl font-black">{item.value}</p>
              </article>
            )
          })}
        </section>

        <section className="mt-5 rounded-[8px] bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black">Xizmatlarga yozilgan sharhlar</h2>
              <p className="text-sm font-semibold text-slate-500">
                Tasdiqlangan sharhlar mijozlar ko'radigan xizmat sahifasida chiqadi.
              </p>
            </div>
            <div className="grid grid-cols-3 rounded-[8px] bg-slate-100 p-1">
              {filters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                  className={`h-9 rounded-[7px] px-3 text-xs font-black transition ${
                    activeFilter === filter.value ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4">
            {isLoadingReviews ? (
              Array.from({ length: 3 }).map((_, index) => (
                <article key={index} className="rounded-[8px] border border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-11 w-11 rounded-full" />
                    <div className="space-y-2">
                      <SkeletonText className="w-44" />
                      <SkeletonText className="w-28" />
                    </div>
                  </div>
                  <SkeletonText className="mt-4 w-full" />
                  <SkeletonText className="mt-2 w-3/4" />
                </article>
              ))
          ) : reviews.length ? (
            reviews.map((review) => (
                <article key={review.id} className="rounded-[8px] border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-emerald-700 shadow-sm">
                          <HiUserCircle className="h-7 w-7" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-950">
                            {review.user?.full_name || 'Mijoz'}
                          </p>
                          <p className="text-xs font-bold text-slate-500">
                            {review.user?.phone || review.user?.email || 'Kontakt kiritilmagan'}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-black ${
                            review.is_approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {review.is_approved ? 'Tasdiqlangan' : 'Kutilmoqda'}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600 md:grid-cols-3">
                        <p>
                          <span className="block text-xs font-black text-slate-400">Xizmat</span>
                          {review.business?.name || 'Xizmat nomi'}
                        </p>
                        <p>
                          <span className="block text-xs font-black text-slate-400">Kategoriya</span>
                          {review.business?.category?.name || 'Kategoriya'}
                        </p>
                        <p>
                          <span className="block text-xs font-black text-slate-400">Sana</span>
                          {new Date(review.created_at).toLocaleDateString('uz-UZ')}
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-amber-400">
                        {Array.from({ length: review.rating }).map((_, index) => (
                          <HiStar key={index} className="h-5 w-5" />
                        ))}
                        <span className="text-sm font-black text-slate-700">{review.rating}/5</span>
                      </div>
                      <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                        {review.comment || 'Izoh qoldirilmagan.'}
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:w-52 lg:grid-cols-1">
                      {!review.is_approved && (
                        <button
                          type="button"
                          onClick={() => void handleApprove(review.id)}
                          disabled={isApprovingReview}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] bg-emerald-700 px-4 text-sm font-black text-white disabled:opacity-60"
                        >
                          <HiCheck className="h-5 w-5" />
                          Tasdiqlash
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => void handleReject(review.id)}
                        disabled={isRejectingReview}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-[8px] border border-red-100 bg-white px-4 text-sm font-black text-red-600 disabled:opacity-60"
                      >
                        <HiTrash className="h-5 w-5" />
                        Rad qilish
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="grid min-h-60 place-items-center rounded-[8px] bg-slate-50 text-center">
                <div>
                  <HiChatBubbleLeftRight className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-3 text-lg font-black">Sharh topilmadi</h3>
                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Bu bo'limda hozircha sharh yo'q.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

export default ProviderReviews
