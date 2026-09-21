import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckIcon from '@mui/icons-material/Check'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CloseIcon from '@mui/icons-material/Close'
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import HomeIcon from '@mui/icons-material/Home'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import PhoneIcon from '@mui/icons-material/Phone'
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarIcon from '@mui/icons-material/Star'
import StorefrontIcon from '@mui/icons-material/Storefront'
import TripOriginIcon from '@mui/icons-material/TripOrigin'
import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import IsLoading from '../components/isLoading'
import Skeleton, { SkeletonText } from '../components/Skeleton'
import { useBusiness } from '../hooks/useBusiness'
import { useBusinessReviews } from '../hooks/useBusinessReviews'
import { useBusinesses } from '../hooks/useBusinesses'
import useContextPro from '../hooks/useContextPro'
import type { Business } from '../types'
import { getBusinessStatus, getReviewStats } from '../utils/business'
import { getErrorMessage } from '../utils/error'
import { showErrorToast, showSuccessToast } from '../utils/toast'
import { WorkOutlined } from '@mui/icons-material'
import InteractiveRouteMap from '../components/InteractiveRouteMap'

type Coords = { lat: number; lng: number }

const MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr']
const WEEK_DAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba']
const DAY_PREFIXES = ['du', 'se', 'ch', 'pa', 'ju', 'sha', 'ya']

const CARD_SHADOW = 'shadow-[0_10px_30px_rgba(15,23,42,0.05)]'
const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

function dayIndex(token: string) {
  const normalized = token.trim().toLowerCase().replace(/[.ʼ'’`]/g, '')
  return DAY_PREFIXES.findIndex((prefix) => normalized.startsWith(prefix))
}

function parseWorkingDays(value?: string | null): boolean[] | null {
  if (!value) return null
  const text = value.trim()
  const open: boolean[] = Array(7).fill(false)

  const range = text.split(/\s*[-–—]\s*/)
  if (range.length === 2) {
    const start = dayIndex(range[0])
    const end = dayIndex(range[1])
    if (start >= 0 && end >= 0) {
      for (let i = start; ; i = (i + 1) % 7) {
        open[i] = true
        if (i === end) break
      }
      return open
    }
  }

  const list = text.split(/\s*[,;/]\s*/).map(dayIndex)
  if (list.length > 0 && list.every((i) => i >= 0)) {
    list.forEach((i) => {
      open[i] = true
    })
    return open
  }
  return null
}

function osmEmbedUrl({ lat, lng }: Coords, span: number) {
  const dLng = span
  const dLat = span * 0.66
  const bbox = [lng - dLng, lat - dLat, lng + dLng, lat + dLat].join('%2C')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`
}

function useDialog(onClose: () => void) {
  const focusRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    focusRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [])

  return focusRef
}

function scrollToSection(id: string) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
}

function Stars({ value, size = 18 }: { value: number; size?: number }) {
  const rounded = Math.round(value)
  return (
    <span className="inline-flex" role="img" aria-label={`5 balldan ${value.toFixed(1)}`}>
      {[1, 2, 3, 4, 5].map((n) =>
        n <= rounded ? (
          <StarIcon key={n} className="text-amber-400" sx={{ fontSize: size }} />
        ) : (
          <StarBorderIcon key={n} className="text-slate-300" sx={{ fontSize: size }} />
        ),
      )}
    </span>
  )
}

function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-slate-950 sm:text-2xl">{title}</h2>
      {action}
    </div>
  )
}

function TextAction({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-emerald-800 transition hover:text-emerald-950 ${FOCUS}`}
    >
      {children}
    </button>
  )
}

function StatTile({
  icon,
  tone,
  title,
  subtitle,
}: {
  icon: ReactNode
  tone: string
  title: string
  subtitle?: string | null
}) {
  return (
    <div className={`flex min-w-0 items-center gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 ${CARD_SHADOW}`}>
      <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tone}`}>{icon}</span>
      <div className="min-w-0">
        <p className="truncate text-[15px] font-bold leading-5 text-slate-950" title={title}>{title}</p>
        {subtitle && <p className="mt-0.5 truncate text-[13px] font-medium leading-4 text-slate-500" title={subtitle}>{subtitle}</p>}
      </div>
    </div>
  )
}

function MapPreview({
  coords,
  title,
  span,
  className = '',
  children,
}: {
  coords: Coords | null
  title: string
  span: number
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={`relative isolate overflow-hidden bg-[#e9f0eb] ${className}`}>
      {coords ? (
        <>
          <iframe
            title={title}
            src={osmEmbedUrl(coords, span)}
            loading="lazy"
            tabIndex={-1}
            className="pointer-events-none absolute inset-0 h-full w-full border-0"
          />
          <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[88%] drop-shadow-[0_6px_8px_rgba(4,120,87,0.35)]">
            <LocationOnIcon className="text-emerald-700" sx={{ fontSize: 48 }} />
          </span>
        </>
      ) : (
        <div className="grid h-full min-h-[120px] place-items-center px-4 text-center text-sm font-medium text-slate-400">
          <span>
            <MapOutlinedIcon sx={{ fontSize: 32 }} />
            <span className="mt-1 block">Xarita mavjud emas</span>
          </span>
        </div>
      )}
      {children}
    </div>
  )
}

function CategoryGlyph({ name, ...props }: { name?: string; sx?: object; className?: string }) {
  return /avto|mashina|car|auto/i.test(name ?? '') ? <DirectionsCarIcon {...props} /> : <CategoryOutlinedIcon {...props} />
}

/* -------------------------------------------------------------------------- */
/*  Gallery                                                                   */
/* -------------------------------------------------------------------------- */

function Lightbox({
  images,
  index,
  name,
  onChange,
  onClose,
}: {
  images: string[]
  index: number
  name: string
  onChange: (index: number) => void
  onClose: () => void
}) {
  const closeRef = useDialog(onClose)
  const activeThumb = useRef<HTMLButtonElement>(null)
  const touchStartX = useRef<number | null>(null)
  const total = images.length

  const step = useCallback((d: number) => onChange((index + d + total) % total), [index, total, onChange])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') step(-1)
      if (event.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  useEffect(() => {
    activeThumb.current?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [index])

  const onTouchEnd = (event: ReactTouchEvent) => {
    if (touchStartX.current === null || total < 2) return
    const delta = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) > 50) step(delta < 0 ? 1 : -1)
  }

  const stop = (event: { stopPropagation: () => void }) => event.stopPropagation()
  const navButton = 'absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 ' + FOCUS

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} rasmlari`}
      className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-4 py-3 text-white" onClick={stop}>
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold tabular-nums">{index + 1} / {total}</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          className={`grid h-11 w-11 place-items-center rounded-full bg-white/15 transition hover:bg-white/25 ${FOCUS}`}
        >
          <CloseIcon />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20"
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX }}
        onTouchEnd={onTouchEnd}
      >
        {total > 1 && (
          <>
            <button type="button" aria-label="Oldingi rasm" onClick={(event) => { stop(event); step(-1) }} className={`${navButton} left-3 sm:left-6`}><ChevronLeftIcon /></button>
            <button type="button" aria-label="Keyingi rasm" onClick={(event) => { stop(event); step(1) }} className={`${navButton} right-3 sm:right-6`}><ChevronRightIcon /></button>
          </>
        )}
        <img src={images[index]} alt={`${name} — ${index + 1}-rasm`} onClick={stop} className="max-h-full max-w-full rounded-2xl object-contain" />
      </div>

      {total > 1 && (
        <div className="overflow-x-auto px-4 py-4" onClick={stop}>
          <div className="mx-auto flex w-max gap-2">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                ref={i === index ? activeThumb : undefined}
                type="button"
                onClick={() => onChange(i)}
                aria-label={`${i + 1}-rasm`}
                aria-current={i === index}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl ring-2 transition sm:h-16 sm:w-16 ${i === index ? 'ring-white' : 'opacity-60 ring-transparent hover:opacity-100'}`}
              >
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Gallery({ images, name, isVerified }: { images: string[]; name: string; isVerified: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const total = images.length
  const activeImage = images[activeIndex]

  const go = useCallback((d: number) => {
    if (total < 2) return
    setActiveIndex((current) => (current + d + total) % total)
  }, [total])

  if (!images.length) return null

  const others = images.map((src, index) => ({ src, index })).filter((item) => item.index !== activeIndex)
  const thumbs = others.slice(0, 2)
  const more = others.length >= 3 ? others[2] : null
  const hasSide = others.length > 0

  const onTouchEnd = (event: ReactTouchEvent) => {
    if (touchStartX.current === null) return
    const delta = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1)
  }

  const arrow = 'absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white text-slate-900 shadow-[0_6px_18px_rgba(15,23,42,0.22)] transition hover:scale-105 active:scale-95 ' + FOCUS
  const tile = 'group relative overflow-hidden rounded-[16px] bg-slate-100 h-[84px] sm:h-[112px] lg:h-auto lg:min-h-0 lg:flex-1 ' + FOCUS

  return (
    <>
      <div id="rasmlar" className={`grid min-w-0 scroll-mt-24 gap-3 ${hasSide ? 'lg:grid-cols-[minmax(0,1fr)_250px]' : ''}`}>
        <div
          className="relative h-[300px] min-w-0 overflow-hidden rounded-[20px] bg-emerald-50 shadow-[0_18px_50px_rgba(15,23,42,0.10)] sm:h-[400px] lg:h-[482px]"
          onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX }}
          onTouchEnd={onTouchEnd}
        >
          {activeImage ? (
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label={`${name} rasmini kattalashtirish`}
              className="group absolute inset-0 block h-full w-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-emerald-500/70"
            >
              <img src={activeImage} alt={name} decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none" />
            </button>
          ) : (
            <div className="grid h-full place-items-center text-emerald-700"><StorefrontIcon sx={{ fontSize: 72 }} /></div>
          )}

          {activeImage && (
            <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-950/70 px-3.5 py-2 text-sm font-semibold tabular-nums text-white backdrop-blur">
              <CameraAltOutlinedIcon sx={{ fontSize: 17 }} /> {activeIndex + 1} / {total}
            </span>
          )}

          {total > 1 && (
            <>
              <button type="button" aria-label="Oldingi rasm" onClick={() => go(-1)} className={`${arrow} left-4`}><ChevronLeftIcon /></button>
              <button type="button" aria-label="Keyingi rasm" onClick={() => go(1)} className={`${arrow} right-4`}><ChevronRightIcon /></button>
            </>
          )}

          {isVerified && (
            <span className="pointer-events-none absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-2 text-sm font-semibold text-emerald-800 shadow-md backdrop-blur">
              <CheckCircleIcon sx={{ fontSize: 18 }} /> Tasdiqlangan
            </span>
          )}
        </div>

        {hasSide && (
          <div className="grid grid-cols-3 gap-2.5 lg:flex lg:flex-col lg:gap-3">
            {thumbs.map(({ src, index }) => (
              <button key={`${src}-${index}`} type="button" onClick={() => setActiveIndex(index)} aria-label={`${index + 1}-rasmni ko'rsatish`} className={tile}>
                <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none" />
              </button>
            ))}
            {more && (
              <button type="button" onClick={() => setLightboxOpen(true)} aria-label={`Barcha rasmlar (${total})`} className={`${tile} bg-slate-900`}>
                <img src={more.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover brightness-[0.45] transition duration-300 group-hover:brightness-[0.35] motion-reduce:transition-none" />
                <span className="relative flex h-full flex-col items-center justify-center gap-1.5 px-2 text-center text-white">
                  <PhotoLibraryOutlinedIcon sx={{ fontSize: 28 }} />
                  <span className="text-[13px] font-semibold leading-4 sm:text-sm sm:leading-5">Barcha rasmlar<br />({total})</span>
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {lightboxOpen && activeImage && (
        <Lightbox images={images} index={activeIndex} name={name} onChange={setActiveIndex} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*  Direction modal                                                           */
/* -------------------------------------------------------------------------- */

function DirectionModal({ business, coords, onClose }: { business: Business; coords: Coords | null; onClose: () => void }) {
  const closeRef = useDialog(onClose)

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/65 p-3 backdrop-blur-[2px] sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${business.name} yo'nalishi`}
        className="relative h-[min(760px,92vh)] w-full max-w-[980px] overflow-hidden rounded-[22px] bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {coords ? <InteractiveRouteMap endCoords={coords} /> : (
          <div className="grid h-full place-items-center px-6 text-center text-slate-500">Xizmat koordinatalari mavjud emas.</div>
        )}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Yopish"
          className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-700 shadow-lg transition hover:bg-slate-50 ${FOCUS}`}
        >
          <CloseIcon />
        </button>
        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-[18px] bg-white/95 p-4 shadow-2xl backdrop-blur-sm sm:inset-x-4 sm:bottom-4">
          <p className="text-lg font-extrabold text-slate-950">{business.name}</p>
          <p className="mt-1 text-sm font-medium text-slate-500">{business.address}</p>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Similar businesses                                                        */
/* -------------------------------------------------------------------------- */

function SimilarCard({ business }: { business: Business }) {
  const image = business.images?.[0] || business.logo_url
  const rating = business.rating_average ?? business.reviewStats?.ratingAverage
  const count = business.reviewStats?.ratingCount
  const isTop = typeof rating === 'number' && rating >= 4.9

  return (
    <Link
      to={`/businesses/${business.id}`}
      className={`group flex min-w-0 flex-col overflow-hidden rounded-[18px] border border-slate-100 bg-white transition hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)] ${CARD_SHADOW} ${FOCUS}`}
    >
      <div className="relative h-36 overflow-hidden bg-slate-100">
        {image ? (
          <img src={image} alt={business.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none" />
        ) : (
          <div className="grid h-full place-items-center text-emerald-700"><StorefrontIcon sx={{ fontSize: 40 }} /></div>
        )}
        {isTop && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-emerald-800 shadow-sm">
            <CheckCircleIcon sx={{ fontSize: 15 }} /> Top tanlov
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[15px] font-extrabold text-slate-950">{business.name}</p>
          {typeof rating === 'number' && (
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-slate-800">
              <StarIcon className="text-amber-400" sx={{ fontSize: 17 }} />
              {rating.toFixed(1)}
              {typeof count === 'number' && <span className="font-medium text-slate-500">({count})</span>}
            </span>
          )}
        </div>
        {business.category?.name && (
          <p className="flex items-center gap-1.5 truncate text-[13px] font-medium text-slate-500">
            <WorkOutlined sx={{ fontSize: 16 }} /> <span className="truncate">{business.category.name}</span>
          </p>
        )}
        <p className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
          <LocationOnIcon className="shrink-0 text-emerald-700" sx={{ fontSize: 16 }} /> <span className="truncate">{business.address}</span>
        </p>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

function BusinessDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const { user, isAuthenticated, isLoading: isAuthLoading } = useContextPro()
  const [directionOpen, setDirectionOpen] = useState(false)
  const [shareCopied, setShareCopied] = useState(false)
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [activeTab, setActiveTab] = useState('sharhlar')
  const [hideBar, setHideBar] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  
  const actionsRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const shareTimer = useRef<number | undefined>(undefined)

  const { business, isLoadingBusiness, isErrorBusiness } = useBusiness(id)
  const { reviews, isLoadingReviews, createReview, isCreatingReview } = useBusinessReviews(id)
  const stats = getReviewStats(reviews)
  const { businesses: similarBusinesses, isLoadingBusinesses } = useBusinesses({ categoryId: business?.category_id ?? '', limit: 5 })

  const similar = useMemo(
    () => similarBusinesses.filter((item) => item.id !== business?.id).slice(0, 4),
    [similarBusinesses, business?.id],
  )
  const showSimilar = isLoadingBusinesses || similar.length > 0

  const coords = useMemo<Coords | null>(() => {
    if (!business || business.latitude == null || business.longitude == null) return null
    const lat = Number(business.latitude)
    const lng = Number(business.longitude)
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null
  }, [business])

  // Sahifa almashganda (masalan, "o'xshash xizmatlar"dan) yuqoriga qaytish
  useEffect(() => {
    window.scrollTo({ top: 0 })
    const frame = window.requestAnimationFrame(() => {
      setScheduleOpen(false)
      setShowAllReviews(false)
      setActiveTab('sharhlar')
      setReviewRating(5)
      setReviewComment('')
      setReviewSubmitted(false)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [id])

  useEffect(() => {
    if (!business) return
    const previous = document.title
    document.title = `${business.name} — Yaqin Xizmat`
    return () => {
      document.title = previous
    }
  }, [business])

  useEffect(() => () => window.clearTimeout(shareTimer.current), [])

  // Tab'larni scroll bilan sinxronlash
  useEffect(() => {
    if (!business?.id) return
    const ids = ['rasmlar', 'sharhlar', 'manzil', ...(showSimilar ? ['oxshash'] : [])]
    const sections = ids.map((sectionId) => document.getElementById(sectionId)).filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (top) setActiveTab(top.target.id)
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [business?.id, showSimilar])

  // Mobil pastki panelni asosiy tugmalar yoki footer ko'ringanda yashirish
  useEffect(() => {
    const nodes = [actionsRef.current, footerRef.current].filter((node): node is HTMLDivElement => node !== null)
    if (!nodes.length) return
    const visible = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target)))
      setHideBar(visible.size > 0)
    })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [business?.id])

  if (isLoadingBusiness) return <IsLoading />

  if (isErrorBusiness || !business) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-5 pb-20 pt-36 text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-50 text-emerald-700"><StorefrontIcon sx={{ fontSize: 40 }} /></span>
          <h1 className="mt-6 text-3xl font-black">Xizmat topilmadi</h1>
          <p className="mt-2 text-slate-500">Havola noto'g'ri yoki xizmat olib tashlangan bo'lishi mumkin.</p>
          <Link to="/" className={`mt-6 inline-flex rounded-[12px] bg-emerald-700 px-5 py-3 font-bold text-white transition hover:bg-emerald-800 ${FOCUS}`}>
            Bosh sahifaga qaytish
          </Link>
        </div>
      </main>
    )
  }

  /* ---- derived data ---- */
  const galleryImages = (business.images ?? []).filter(Boolean)
  const images = galleryImages.length ? galleryImages : business.logo_url ? [business.logo_url] : []
  const status = getBusinessStatus(business.open_time, business.close_time)
  const categoryName = business.category?.name
  const phoneHref = business.phone ? `tel:${business.phone.replace(/\s/g, '')}` : undefined
  const ratingAverage = stats.ratingCount > 0 ? stats.ratingAverage : (business.rating_average ?? business.reviewStats?.ratingAverage ?? null)
  const ratingCount = stats.ratingCount > 0 ? stats.ratingCount : (business.reviewStats?.ratingCount ?? 0)
  const ratingLabel = typeof ratingAverage === 'number' ? ratingAverage.toFixed(1) : null

  const [city, ...restAddress] = business.address.split(',')
  const locationTitle = restAddress.length ? city.trim() : business.address
  const locationSubtitle = restAddress.length ? restAddress.join(',').trim() : null

  const openDays = parseWorkingDays(business.working_days)
  const todayIndex = (new Date().getDay() + 6) % 7
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2)
  const canWriteReview = isAuthenticated && user?.role === 'customer'
  const reviewCommentLength = reviewComment.length
  const currentUserReview = user
    ? reviews.find((review) => review.user_id === user.id)
    : undefined

  const tabs = [
    ...(images.length ? [{ id: 'rasmlar', label: 'Rasmlar' }] : []),
    { id: 'sharhlar', label: `Sharhlar (${ratingCount})` },
    { id: 'manzil', label: 'Manzil' },
    ...(showSimilar ? [{ id: 'oxshash', label: "O'xshash xizmatlar" }] : []),
  ]

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: business.name, text: business.description || business.name, url: window.location.href })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShareCopied(true)
        window.clearTimeout(shareTimer.current)
        shareTimer.current = window.setTimeout(() => setShareCopied(false), 2000)
      }
    } catch {
      // foydalanuvchi bekor qildi yoki clipboard ruxsati yo'q
    }
  }

  const handleReviewSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!id || isCreatingReview) return

    try {
      await createReview({
        rating: reviewRating,
        comment: reviewComment.trim() || null,
      })
      setReviewRating(5)
      setReviewComment('')
      setReviewSubmitted(true)
      showSuccessToast("Sharhingiz yuborildi. Tasdiqlangach sahifada ko'rinadi.")
    } catch (error) {
      const message = getErrorMessage(error, 'Sharh yuborishda xatolik yuz berdi')
      if (message.toLowerCase().includes('already reviewed')) {
        showErrorToast('Siz bu xizmatga allaqachon sharh qoldirgansiz.')
        return
      }
      if (message.toLowerCase().includes('customer access')) {
        showErrorToast('Sharh qoldirish uchun mijoz hisobi bilan kiring.')
        return
      }
      showErrorToast(message)
    }
  }

  const primaryButton = `flex h-14 w-full items-center justify-center gap-2.5 rounded-[14px] bg-emerald-700 text-base font-bold text-white shadow-[0_10px_24px_rgba(4,120,87,0.22)] transition hover:bg-emerald-800 active:scale-[.99] ${FOCUS}`
  const secondaryButton = `flex h-14 w-full items-center justify-center gap-2.5 rounded-[14px] bg-[#edf3ef] text-base font-bold text-slate-900 transition hover:bg-[#e2ebe5] active:scale-[.99] ${FOCUS}`
  const outlineButton = `flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white text-sm font-semibold text-slate-800 transition hover:border-slate-300 hover:bg-slate-50 active:scale-[.99] ${FOCUS}`

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.06),transparent_28%),#f7faf8] text-[#071126]">
      <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-6 sm:px-6 lg:px-10 lg:pt-7">
        <nav aria-label="Sahifa yo'li" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-[13px] font-medium text-slate-500">
            <li>
              <Link to="/" className={`inline-flex items-center gap-1.5 rounded-md text-emerald-800 hover:underline ${FOCUS}`}><HomeIcon sx={{ fontSize: 17 }} /> Bosh sahifa</Link>
            </li>
            <li aria-hidden="true"><NavigateNextIcon sx={{ fontSize: 17 }} /></li>
            {categoryName && <><li>{categoryName}</li><li aria-hidden="true"><NavigateNextIcon sx={{ fontSize: 17 }} /></li></>}
            <li aria-current="page" className="font-semibold text-slate-900">{business.name}</li>
          </ol>
        </nav>

        {/* ---------------- Yuqori qism: asosiy ustun + yon karta ---------------- */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
          <div className="min-w-0">
            <Gallery key={business.id} images={images} name={business.name} isVerified={Boolean(business.is_verified)} />

            <section className="mt-7">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-[38px] lg:text-[42px]">{business.name}</h1>
                {business.is_verified && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3.5 py-1.5 text-sm font-semibold text-emerald-700">
                    <CheckCircleIcon sx={{ fontSize: 18 }} /> Tasdiqlangan
                  </span>
                )}
              </div>
              {business.description && (
                <p className="mt-3 line-clamp-2 max-w-3xl text-base font-medium leading-7 text-slate-600">{business.description}</p>
              )}
            </section>

            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {ratingLabel && <StatTile icon={<StarIcon sx={{ fontSize: 24 }} />} tone="bg-amber-50 text-amber-500" title={ratingLabel} subtitle={`${ratingCount} ta baho`} />}
              <StatTile icon={<LocationOnIcon sx={{ fontSize: 24 }} />} tone="bg-emerald-50 text-emerald-800" title={locationTitle} subtitle={locationSubtitle} />
              {status.timeLabel && <StatTile icon={<AccessTimeIcon sx={{ fontSize: 24 }} />} tone="bg-emerald-50 text-emerald-800" title={status.timeLabel} subtitle={business.working_days} />}
              {categoryName && <StatTile icon={<CategoryGlyph name={categoryName} sx={{ fontSize: 24 }} />} tone="bg-emerald-50 text-emerald-800" title={categoryName} subtitle="Kategoriyasi" />}
            </div>

            <nav aria-label="Sahifa bo'limlari" className="mt-8 border-b border-slate-200/80">
              <ul className="-mb-px flex gap-7 overflow-x-auto [scrollbar-width:none] sm:gap-9 [&::-webkit-scrollbar]:hidden">
                {tabs.map((tab) => {
                  const active = activeTab === tab.id
                  return (
                    <li key={tab.id} className="shrink-0">
                      <button
                        type="button"
                        onClick={() => { setActiveTab(tab.id); scrollToSection(tab.id) }}
                        aria-current={active ? 'true' : undefined}
                        className={`relative rounded-t-md border-b-2 px-1 pb-3.5 pt-2 text-[15px] font-semibold transition-colors ${FOCUS} ${active ? 'border-emerald-700 text-emerald-800' : 'border-transparent text-slate-600 hover:text-slate-950'}`}
                      >
                        {tab.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          {/* ---------------- Yon karta ---------------- */}
          <aside className="xl:sticky xl:top-24 xl:self-start">
            <div className="rounded-[22px] border border-slate-100 bg-white p-3 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                {/* Identifikatsiya + tugmalar */}
                <div className="px-3 pb-2 pt-3">
                  <div className="relative">
                    <div className="mx-auto grid h-[132px] w-[132px] place-items-center overflow-hidden rounded-full bg-slate-950 text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)]">
                      {business.logo_url ? (
                        <img src={business.logo_url} alt={`${business.name} logosi`} className="h-full w-full object-cover" />
                      ) : (
                        <StorefrontIcon sx={{ fontSize: 52 }} />
                      )}
                    </div>
                  </div>

                  <p className="mt-5 text-[26px] font-extrabold leading-8 tracking-[-0.025em] text-slate-950">{business.name}</p>
                  {business.is_verified && (
                    <p className="mt-2 flex items-center gap-2 text-[15px] font-semibold text-emerald-700"><CheckCircleIcon sx={{ fontSize: 20 }} /> Tasdiqlangan</p>
                  )}
                  {ratingLabel && (
                    <p className="mt-2 flex items-center gap-2 text-[15px] text-slate-500">
                      <StarIcon className="text-amber-400" sx={{ fontSize: 21 }} />
                      <b className="font-bold text-slate-900">{ratingLabel}</b> ({ratingCount} ta baho)
                    </p>
                  )}
                  {categoryName && <p className="mt-2 flex items-center gap-2 text-[15px] font-medium text-slate-600"><WorkOutlined sx={{ fontSize: 20 }} /> {categoryName}</p>}

                  <div ref={actionsRef} className="mt-5 space-y-3">
                    {phoneHref ? (
                      <a href={phoneHref} className={primaryButton}><PhoneIcon /> Bog'lanish</a>
                    ) : (
                      <button type="button" disabled className="flex h-14 w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-[14px] bg-slate-200 text-base font-bold text-slate-500"><PhoneIcon /> Telefon yo'q</button>
                    )}
                    <button type="button" onClick={() => setDirectionOpen(true)} className={secondaryButton}><TripOriginIcon sx={{ fontSize: 22 }} /> Yo'nalish</button>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => void handleShare()} className={outlineButton}>
                        {shareCopied ? <CheckIcon className="text-emerald-700" sx={{ fontSize: 20 }} /> : <ShareOutlinedIcon sx={{ fontSize: 20 }} />}
                        {shareCopied ? 'Nusxalandi' : 'Ulashish'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Ma'lumotlar paneli + xarita */}
                <div className="min-w-0">
                  <div className="mx-1.5 rounded-2xl bg-[#f1f6f3] p-3 text-sm">
                    <button
                      type="button"
                      onClick={() => setScheduleOpen((open) => !open)}
                      aria-expanded={scheduleOpen}
                      aria-controls="hafta-jadvali"
                      className={`flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left ${FOCUS}`}
                    >
                      <AccessTimeIcon className="text-emerald-700" sx={{ fontSize: 22 }} />
                      <span className={`font-bold ${status.tone}`}>{status.label}</span>
                      {status.timeLabel && <span className="font-medium text-slate-800">{status.timeLabel}</span>}
                      <ExpandMoreIcon className={`ml-auto text-slate-400 transition-transform motion-reduce:transition-none ${scheduleOpen ? 'rotate-180' : ''}`} sx={{ fontSize: 22 }} />
                    </button>
                    {business.working_days && (
                    <button
                      type="button"
                      onClick={() => setScheduleOpen((open) => !open)}
                      aria-expanded={scheduleOpen}
                      aria-controls="hafta-jadvali"
                      className={`flex w-full items-center gap-3 rounded-lg px-1 py-2 text-left ${FOCUS}`}
                    >
                      <CalendarMonthOutlinedIcon className="text-emerald-700" sx={{ fontSize: 22 }} />
                      <span className="font-bold text-slate-900">Ish kunlari</span>
                      <span className="min-w-0 truncate font-medium text-slate-500">{business.working_days}</span>
                      <ExpandMoreIcon className={`ml-auto shrink-0 text-slate-400 transition-transform motion-reduce:transition-none ${scheduleOpen ? 'rotate-180' : ''}`} sx={{ fontSize: 22 }} />
                    </button>
                    )}

                    <div
                      id="hafta-jadvali"
                      aria-hidden={!scheduleOpen}
                      className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${scheduleOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                    >
                      <ul className="min-h-0 space-y-0.5 overflow-hidden">
                        {WEEK_DAYS.map((day, index) => {
                          const isOpen = openDays ? openDays[index] : true
                          const isToday = index === todayIndex
                          return (
                            <li key={day} className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${isToday ? 'bg-white font-bold text-emerald-800 shadow-sm' : 'font-medium text-slate-600'}`}>
                              <span>{day}{isToday && <span className="ml-2 text-[11px] font-semibold text-emerald-700">bugun</span>}</span>
                              <span className={isOpen ? '' : 'text-slate-400'}>{isOpen ? status.timeLabel : 'Dam olish'}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    <div className="flex items-start gap-3 px-1 py-2">
                      <LocationOnIcon className="mt-0.5 shrink-0 text-emerald-700" sx={{ fontSize: 22 }} />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">Manzil</p>
                        <p className="mt-0.5 leading-5 text-slate-600">{business.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 px-1 py-2">
                      <PhoneIcon className="mt-0.5 shrink-0 text-emerald-700" sx={{ fontSize: 22 }} />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900">Telefon</p>
                        {phoneHref && <a href={phoneHref} className={`mt-0.5 block rounded font-medium text-slate-600 transition hover:text-emerald-700 ${FOCUS}`}>{business.phone}</a>}
                      </div>
                    </div>
                  </div>

                  <MapPreview coords={coords} title={`${business.name} xaritada`} span={0.01} className="mt-3 h-[228px] rounded-2xl">
                    <button
                      onClick={() => setDirectionOpen(true)}
                      className={`absolute bottom-3 right-3 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-900 shadow-[0_6px_18px_rgba(15,23,42,0.16)] transition hover:bg-slate-50 ${FOCUS}`}
                    >
                      <MapOutlinedIcon sx={{ fontSize: 18 }} /> Xaritada ko'rish
                    </button>
                  </MapPreview>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ---------------- To'liq kenglikdagi bo'limlar ---------------- */}
        <section id="sharhlar" className="scroll-mt-24 pt-10 xl:relative xl:z-10 xl:-mt-40">
          <SectionHeader
            title="Mijozlar sharhlari"
            action={
              reviews.length > 2 ? (
                <TextAction onClick={() => setShowAllReviews((open) => !open)} aria-expanded={showAllReviews}>
                  {showAllReviews ? "Yig'ish" : "Barchasini ko'rish"} <ArrowForwardIcon className={showAllReviews ? '-rotate-90' : ''} sx={{ fontSize: 18 }} />
                </TextAction>
              ) : undefined
            }
          />
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(320px,1fr)_minmax(0,1.6fr)]">
            <div className="space-y-4">
              <div className={`rounded-[18px] border border-slate-100 bg-white p-6 ${CARD_SHADOW}`}>
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center lg:flex-col lg:items-start 2xl:flex-row 2xl:items-center">
                  <div className="shrink-0">
                    {typeof ratingAverage === 'number' ? (
                      <>
                        <p className="text-[52px] font-black leading-none tracking-tight">{ratingAverage.toFixed(1)}</p>
                        <div className="mt-3"><Stars value={ratingAverage} size={22} /></div>
                        <p className="mt-2 text-sm font-medium text-slate-500">{ratingCount} ta baho</p>
                      </>
                    ) : (
                      <>
                        <p className="text-[42px] font-black leading-none tracking-tight">0.0</p>
                        <div className="mt-3"><Stars value={0} size={22} /></div>
                        <p className="mt-2 text-sm font-medium text-slate-500">Hali baho yo'q</p>
                      </>
                    )}
                  </div>
                  <div className="w-full flex-1 space-y-2.5">
                    {stats.distribution.map((item) => (
                      <div key={item.rating} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <span className="w-2 text-right tabular-nums">{item.rating}</span>
                        <StarIcon className="text-amber-400" sx={{ fontSize: 15 }} />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100" role="presentation">
                          <div className="h-full rounded-full bg-emerald-600 transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${item.percent}%` }} />
                        </div>
                        <span className="w-9 text-right tabular-nums text-slate-500">{item.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`rounded-[18px] border border-slate-100 bg-white p-5 ${CARD_SHADOW}`}>
                <h3 className="text-lg font-extrabold text-slate-950">Sharh qoldiring</h3>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
                  Sizning fikringiz boshqa mijozlarga xizmat sifati va tezligini baholashda yordam beradi.
                </p>

                {reviewSubmitted && (
                  <div className="mt-4 rounded-[14px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                    Sharhingiz qabul qilindi va tasdiqlashga yuborildi.
                  </div>
                )}

                {isAuthLoading ? (
                  <div className="mt-4 space-y-3">
                    <SkeletonText className="w-40" />
                    <Skeleton className="h-24 rounded-[14px]" />
                  </div>
                ) : !isAuthenticated ? (
                  <div className="mt-4 rounded-[14px] bg-slate-50 p-4">
                    <p className="text-sm font-semibold leading-6 text-slate-600">
                      Sharh qoldirish uchun mijoz hisobi bilan tizimga kiring.
                    </p>
                    <Link
                      to="/login"
                      state={{ from: location.pathname }}
                      className={`mt-3 inline-flex h-11 items-center justify-center rounded-[12px] bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800 ${FOCUS}`}
                    >
                      Kirish
                    </Link>
                  </div>
                ) : user?.role !== 'customer' ? (
                  <div className="mt-4 rounded-[14px] bg-amber-50 px-4 py-3 text-sm font-semibold leading-6 text-amber-800">
                    Sharhni faqat mijoz hisobi orqali qoldirish mumkin.
                  </div>
                ) : currentUserReview ? (
                  <div className="mt-4 rounded-[14px] bg-slate-50 p-4">
                    <p className="text-sm font-bold text-slate-900">Siz bu xizmatga sharh qoldirgansiz.</p>
                    <div className="mt-2"><Stars value={currentUserReview.rating} size={18} /></div>
                    {currentUserReview.comment && (
                      <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{currentUserReview.comment}</p>
                    )}
                  </div>
                ) : (
                  <form onSubmit={(event) => void handleReviewSubmit(event)} className="mt-4 space-y-4">
                    <fieldset disabled={!canWriteReview || isCreatingReview} className="space-y-2">
                      <legend className="text-sm font-bold text-slate-800">Baholang</legend>
                      <div className="flex gap-1.5" role="radiogroup" aria-label="Reyting">
                        {[1, 2, 3, 4, 5].map((rating) => {
                          const active = rating <= reviewRating
                          return (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => setReviewRating(rating)}
                              className={`grid h-10 w-10 place-items-center rounded-[10px] transition ${FOCUS} ${
                                active ? 'bg-amber-50 text-amber-400' : 'bg-slate-50 text-slate-300 hover:text-amber-300'
                              }`}
                              aria-label={`${rating} baho`}
                              aria-pressed={reviewRating === rating}
                            >
                              {active ? <StarIcon sx={{ fontSize: 24 }} /> : <StarBorderIcon sx={{ fontSize: 24 }} />}
                            </button>
                          )
                        })}
                      </div>
                    </fieldset>

                    <label className="block">
                      <span className="text-sm font-bold text-slate-800">Izoh</span>
                      <textarea
                        value={reviewComment}
                        onChange={(event) => setReviewComment(event.target.value.slice(0, 2000))}
                        rows={4}
                        placeholder="Xizmat sifati, tezligi yoki umumiy taassurotingiz..."
                        className={`mt-2 w-full resize-none rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium leading-6 text-slate-800 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100 ${FOCUS}`}
                        disabled={isCreatingReview}
                      />
                      <span className="mt-1 block text-right text-xs font-semibold text-slate-400">
                        {reviewCommentLength}/2000
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isCreatingReview}
                      className={`h-12 w-full rounded-[14px] bg-emerald-700 px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(4,120,87,0.18)] transition hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60 ${FOCUS}`}
                    >
                      {isCreatingReview ? 'Yuborilmoqda...' : 'Sharh yuborish'}
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="grid content-start gap-4 md:grid-cols-2">
              {isLoadingReviews ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="rounded-[18px] border border-slate-100 bg-white p-5">
                    <div className="flex items-center gap-3"><Skeleton className="h-11 w-11 rounded-full" /><SkeletonText className="w-32" /></div>
                    <SkeletonText className="mt-5 w-full" />
                    <SkeletonText className="mt-2 w-2/3" />
                  </div>
                ))
              ) : visibleReviews.length ? (
                visibleReviews.map((review) => {
                          const author = review.user?.full_name
                  return (
                    <article key={review.id} className={`rounded-[18px] border border-slate-100 bg-white p-5 ${CARD_SHADOW}`}>
                      <header className="flex items-center gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-800 font-bold text-white" aria-hidden="true">{author ? Array.from(author)[0].toUpperCase() : <StorefrontIcon sx={{ fontSize: 22 }} />}</div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-slate-950">{author}</p>
                          <p className="text-xs font-medium text-slate-500">{formatDate(review.created_at)}</p>
                        </div>
                      </header>
                      <div className="mt-3"><Stars value={review.rating} size={17} /></div>
                      {review.comment && <p className="mt-2.5 text-sm leading-6 text-slate-600">{review.comment}</p>}
                    </article>
                  )
                })
              ) : (
                <div className="col-span-full rounded-[18px] border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500">Hozircha sharhlar yo'q</div>
              )}
            </div>
          </div>
        </section>

        <section id="manzil" className="scroll-mt-24 pt-10">
          <h2 className="text-[22px] font-extrabold tracking-[-0.02em] sm:text-2xl">Manzil</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <MapPreview coords={coords} title={`${business.name} xaritada`} span={0.02} className="h-[240px] rounded-[18px] sm:h-[260px] lg:h-full lg:min-h-[246px]" />
            <div className="flex flex-col justify-between gap-6 rounded-[18px] bg-[#f1f6f3] p-6">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-emerald-700 shadow-sm"><LocationOnIcon sx={{ fontSize: 20 }} /></span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">Manzil</p>
                  <p className="mt-1 text-sm font-medium leading-6 text-slate-600">{business.address}</p>
                  {coords && <p className="text-sm font-medium tabular-nums text-slate-500">({coords.lat.toFixed(4)}, {coords.lng.toFixed(4)})</p>}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDirectionOpen(true)}
                className={`flex h-12 items-center justify-center gap-2 rounded-[12px] bg-white text-sm font-bold text-emerald-800 shadow-sm transition hover:bg-emerald-50 active:scale-[.99] ${FOCUS}`}
              >
                Yo'nalishni ko'rish <ArrowForwardIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
          </div>
        </section>

        {showSimilar && (
          <section id="oxshash" className="scroll-mt-24 pt-10">
            <SectionHeader
              title="Shunga o'xshash xizmatlar"
              action={<Link to="/" className={`inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-emerald-800 hover:text-emerald-950 ${FOCUS}`}>Barchasini ko'rish <ArrowForwardIcon sx={{ fontSize: 18 }} /></Link>}
            />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {isLoadingBusinesses
                ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-[250px] rounded-[18px]" />)
                : similar.map((item) => <SimilarCard key={item.id} business={item} />)}
            </div>
          </section>
        )}
      </div>

      {/* Mobil / planshet: doimiy amal paneli */}
      <div
        aria-hidden={hideBar}
        className={`fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex gap-2 rounded-[16px] bg-white p-2 shadow-[0_10px_40px_rgba(15,23,42,0.22)] transition duration-300 motion-reduce:transition-none xl:hidden ${hideBar ? 'pointer-events-none translate-y-24 opacity-0' : ''}`}
      >
        {phoneHref && (
          <a href={phoneHref} tabIndex={hideBar ? -1 : undefined} className={`flex h-12 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-emerald-700 px-2 text-sm font-bold text-white transition active:scale-[.98] ${FOCUS}`}>
            <PhoneIcon sx={{ fontSize: 20 }} /> Bog'lanish
          </a>
        )}
        <button type="button" tabIndex={hideBar ? -1 : undefined} onClick={() => setDirectionOpen(true)} className={`flex h-12 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[12px] bg-[#edf3ef] px-2 text-sm font-bold text-slate-900 transition active:scale-[.98] ${FOCUS}`}>
          <TripOriginIcon sx={{ fontSize: 20 }} /> Yo'nalish
        </button>
      </div>

      {directionOpen && <DirectionModal business={business} coords={coords} onClose={() => setDirectionOpen(false)} />}

      <div ref={footerRef} className="h-px" aria-hidden="true" />
    </main>
  )
}

export default BusinessDetailPage
