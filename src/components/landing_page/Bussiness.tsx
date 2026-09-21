import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined'
import StarRoundedIcon from '@mui/icons-material/StarRounded'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Business } from '../../types'
import { getBusinessStatus } from '../../utils/business'

interface BussinessProps {
  businesses: Business[]
  isLoading: boolean
  isLoadingMore?: boolean
  hasMore: boolean
  onLoadMore?: () => void
  /** Berilsa, tugma bosilganda shu amal bajariladi (masalan /businesses sahifasiga o'tish) va doim ko'rinadi */
  onViewAll?: () => void
  title?: string
  subtitle?: string
  badge?: string
}

function BusinessImage({ src, name }: { src?: string; name: string }) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>()
  const failed = Boolean(src && failedSrc === src)

  if (!src || failed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[#eaf4f0] text-[#08785d]">
        <StorefrontOutlinedIcon sx={{ fontSize: 76 }} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
      onError={() => setFailedSrc(src)}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
    />
  )
}

function BusinessLogo({ business }: { business: Business }) {
  const [failedSrc, setFailedSrc] = useState<string | null>()
  const failed = Boolean(business.logo_url && failedSrc === business.logo_url)

  return (
    <div className="grid h-[62px] w-[62px] shrink-0 place-items-center overflow-hidden rounded-full border-2 border-white/80 bg-white p-1.5 shadow-md sm:h-[68px] sm:w-[68px]">
      {business.logo_url && !failed ? (
        <img
          src={business.logo_url}
          alt={`${business.name} logosi`}
          loading="lazy"
          decoding="async"
          onError={() => setFailedSrc(business.logo_url)}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <StorefrontOutlinedIcon className="text-[#08785d]" sx={{ fontSize: 34 }} />
      )}
    </div>
  )
}

export function BusinessCard({ business }: { business: Business }) {
  const images = useMemo(() => {
    const gallery = (business.images || []).filter(Boolean)
    if (gallery.length) return gallery.slice(0, 5)
    return business.logo_url ? [business.logo_url] : []
  }, [business.images, business.logo_url])

  const [activeImage, setActiveImage] = useState(0)
  const ratingAverage = business.rating_average ?? business.reviewStats?.ratingAverage
  const ratingCount = business.rating_count ?? business.reviewStats?.ratingCount ?? 0
  const status = getBusinessStatus(business.open_time, business.close_time)
  const isOpen = status.label.toLowerCase().includes('ochiq')
  const safeActiveImage = activeImage < images.length ? activeImage : 0

  return (
    <article className="business-card group relative isolate min-h-[490px] overflow-hidden rounded-[18px] bg-[#07382d] shadow-lg ring-1 ring-black/5 transition-shadow duration-200 hover:shadow-xl sm:min-h-[530px]">
      <BusinessImage src={images[safeActiveImage]} name={business.name} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,12,15,0.05)_18%,rgba(3,20,19,0.26)_43%,rgba(2,31,25,0.88)_70%,rgba(2,48,37,0.98)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-[radial-gradient(circle_at_80%_100%,rgba(0,119,83,0.42),transparent_62%)]" />

      <Link
        to={`/businesses/${business.id}`}
        aria-label={`${business.name} xizmatini ko'rish`}
        className="absolute inset-0 z-10 rounded-[20px] outline-none focus-visible:ring-4 focus-visible:ring-emerald-300 focus-visible:ring-offset-2"
      />

      <div className="pointer-events-none relative z-20 flex min-h-[490px] flex-col p-4 sm:min-h-[530px] sm:p-5">
        <div className="flex min-h-10 items-start justify-between gap-3">
          {business.is_verified ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-bold text-[#08785d] shadow-md sm:text-sm">
              <CheckCircleIcon sx={{ fontSize: 19 }} />
              Tasdiqlangan
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-black/40 px-3.5 py-2 text-[13px] font-bold text-white">
              Tekshiruvda
            </span>
          )}
        </div>

        <div className="mt-auto">
          {images.length > 0 && (
            <div
              className="pointer-events-auto relative z-30 mb-4 flex min-h-3 items-center gap-1.5"
              aria-label="Xizmat rasmlari"
            >
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`${index + 1}-rasmni ko'rish`}
                  aria-current={safeActiveImage === index}
                  className={`h-2.5 w-2.5 rounded-full border border-white/35 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                    safeActiveImage === index ? 'bg-white' : 'bg-white/45 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-1 text-[20px] font-extrabold leading-tight text-white sm:text-[22px]">
                {business.name}
              </h3>
              <p className="mt-1 text-[13px] font-medium text-white/90 sm:text-sm">
                {business.category?.name ?? 'Xizmat'}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-white">
              <StarRoundedIcon className="text-[#ffbd17]" sx={{ fontSize: 21 }} />
              <span className="text-base font-extrabold">
                {ratingAverage === null || ratingAverage === undefined
                  ? '—'
                  : ratingAverage.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-white/85">({ratingCount})</span>
            </div>
          </div>

          <div className="mt-3 flex min-w-0 items-center gap-2 text-white">
            <LocationOnOutlinedIcon className="shrink-0" sx={{ fontSize: 20 }} />
            <span className="line-clamp-1 text-[13px] font-medium sm:text-sm">
              {business.address}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-white">
            <ScheduleOutlinedIcon className="shrink-0" sx={{ fontSize: 20 }} />
            <span
              className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                isOpen ? 'bg-[#07855c] text-white' : 'bg-white/20 text-white'
              }`}
            >
              {isOpen ? 'Ochiq' : 'Yopiq'}
            </span>
            <span className="text-xs font-medium text-white/95 sm:text-[13px]">
              {status.timeLabel}
            </span>
            {business.working_days && (
              <span className="ml-auto max-w-full truncate text-xs font-medium text-white/90 sm:text-[13px]">
                {business.working_days}
              </span>
            )}
          </div>

          <p className="mt-3 line-clamp-2 min-h-[40px] text-[13px] font-medium leading-[1.5] text-white/90 sm:text-sm">
            {business.description || "Xizmat haqida batafsil ma'lumotni ko'rish uchun kartani bosing."}
          </p>

          <div className="mt-3 flex items-end justify-between gap-3">
            <BusinessLogo business={business} />
            <Link
              to={`/businesses/${business.id}`}
              aria-label={`${business.name} sahifasiga o'tish`}
              className="pointer-events-auto relative z-30 grid h-12 w-[64px] place-items-center rounded-[16px] bg-[#e9faf4] text-[#08785d] shadow-md outline-none transition-colors duration-150 hover:bg-white hover:text-[#055f49] focus-visible:ring-4 focus-visible:ring-emerald-300 sm:h-14 sm:w-[68px]"
            >
              <ArrowForwardIcon
                className="transition-transform duration-150 group-hover:translate-x-0.5"
                sx={{ fontSize: 26 }}
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

export function BusinessSkeleton() {
  return (
    <div className="relative min-h-[490px] overflow-hidden rounded-[18px] bg-slate-300 sm:min-h-[530px]">
      <div className="absolute inset-x-4 bottom-4 space-y-3 sm:inset-x-5 sm:bottom-5">
        <div className="h-3 w-16 rounded-full bg-white/50" />
        <div className="h-7 w-3/5 rounded bg-white/65" />
        <div className="h-4 w-2/5 rounded bg-white/45" />
        <div className="h-4 w-4/5 rounded bg-white/45" />
        <div className="h-10 w-full rounded bg-white/25" />
        <div className="flex items-end justify-between">
          <div className="h-[62px] w-[62px] rounded-full bg-white/70" />
          <div className="h-12 w-16 rounded-[16px] bg-white/70" />
        </div>
      </div>
    </div>
  )
}

function Bussiness({
  businesses,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onViewAll,
  title = 'Sizga eng yaqin xizmatlar',
  subtitle = "Shahringizdagi sifatli va ishonchli xizmatlarni toping.",
  badge = 'Sizga yaqin xizmatlar',
}: BussinessProps) {
  return (
    <section id="xizmatlar" className="scroll-mt-20 bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="business-header mb-9 flex flex-col items-start justify-between gap-6 sm:mb-10 md:flex-row md:items-end">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-4 text-[#08785d]">
              <span className="h-[3px] w-10 rounded-full bg-[#0a8a65]" />
              <span className="text-xs font-bold uppercase sm:text-sm">{badge}</span>
            </div>
            <h2 className="max-w-4xl text-[38px] font-black leading-[1.05] text-[#071126] sm:text-[48px] lg:text-[54px]">
              {title}
            </h2>
            <p className="mt-3 max-w-3xl text-[16px] font-medium leading-relaxed text-[#34415e] sm:text-[18px]">
              {subtitle}
            </p>
          </div>

          {(hasMore || onViewAll) && (
            <button
              type="button"
              onClick={onViewAll ?? onLoadMore}
              disabled={!onViewAll && isLoadingMore}
              className="group inline-flex h-[54px] shrink-0 items-center gap-4 rounded-[22px] bg-[#eef7f4] px-6 text-[15px] font-semibold text-[#123f34] outline-none transition-colors duration-200 hover:bg-[#dff2ec] focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-wait disabled:opacity-60"
            >
              {!onViewAll && isLoadingMore ? 'Yuklanmoqda...' : "Boshqalarini ko'rish"}
              <ArrowForwardIcon
                className="transition-transform duration-200 group-hover:translate-x-1"
                sx={{ fontSize: 24 }}
              />
            </button>
          )}
        </div>

        {/* Grid */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <BusinessSkeleton key={index} />
              ))
            : businesses.map((business )  => (
                <BusinessCard key={business.id} business={business} />
              ))}
        </div>

        {/* Empty state */}
        {!isLoading && businesses.length === 0 && (
          <div className="rounded-[20px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e4f4ef] text-[#08785d]">
              <LocationOnOutlinedIcon sx={{ fontSize: 34 }} />
            </div>
            <p className="mt-5 text-xl font-extrabold text-slate-900">
              Hozircha xizmat topilmadi
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
              Qidiruv so'zini o'zgartiring yoki boshqa kategoriyani tanlang.
            </p>
          </div>
        )}

        {/* Mobile load more */}
        {!isLoading && (hasMore || onViewAll) && (
          <div className="mt-10 flex justify-center md:hidden">
            <button
              type="button"
              onClick={onViewAll ?? onLoadMore}
              disabled={!onViewAll && isLoadingMore}
              className="inline-flex h-13 items-center gap-3 rounded-[20px] bg-[#08785d] px-7 text-sm font-bold text-white shadow-md outline-none transition-colors duration-200 focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:opacity-60"
            >
              {!onViewAll && isLoadingMore ? 'Yuklanmoqda...' : "Boshqalarini ko'rish"}
              {(!isLoadingMore || onViewAll) && <ArrowForwardIcon sx={{ fontSize: 21 }} />}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Bussiness