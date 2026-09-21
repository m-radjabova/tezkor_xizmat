import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined'
import SearchIcon from '@mui/icons-material/Search'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import TuneIcon from '@mui/icons-material/Tune'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Seo from '../components/Seo'
import { BusinessCard, BusinessSkeleton } from '../components/landing_page/Bussiness'
import { useBusinesses } from '../hooks/useBusinesses'
import { useCategories } from '../hooks/useCategories'
import { useDebounce } from '../hooks/useDebounce'

const PAGE_SIZE = 12

type SortOption = 'newest' | 'distance' | 'rating'

type LocationPoint = {
  latitude: number
  longitude: number
}

function BusinessesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState<string>(() => searchParams.get('search') ?? '')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    () => searchParams.get('category_id') ?? '',
  )
  const [sortBy, setSortBy] = useState<SortOption>(() =>
    ['distance', 'rating'].includes(searchParams.get('sort') ?? '')
      ? (searchParams.get('sort') as SortOption)
      : 'newest',
  )
  const [minRating, setMinRating] = useState<number>(() => {
    const rating = Number(searchParams.get('min_rating') ?? 0)
    return [3, 4, 5].includes(rating) ? rating : 0
  })
  const [userLocation, setUserLocation] = useState<LocationPoint | null>(null)
  const debouncedSearch = useDebounce(search)
  const { categories } = useCategories()

  const effectiveSortBy: SortOption = sortBy === 'distance' && !userLocation ? 'newest' : sortBy

  const {
    businesses,
    isLoadingBusinesses,
    isFetchingBusinesses,
    isLoadingMoreBusinesses,
    hasMoreBusinesses,
    loadMoreBusinesses,
  } = useBusinesses({
    categoryId: selectedCategoryId,
    search: debouncedSearch,
    limit: PAGE_SIZE,
    latitude: effectiveSortBy === 'distance' ? userLocation?.latitude : undefined,
    longitude: effectiveSortBy === 'distance' ? userLocation?.longitude : undefined,
    sortBy: effectiveSortBy,
    minRating: minRating || undefined,
  })

  useEffect(() => {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 5 * 60 * 1000 },
    )
  }, [])

  useEffect(() => {
    const next = new URLSearchParams()

    if (debouncedSearch.trim()) next.set('search', debouncedSearch.trim())
    if (selectedCategoryId) next.set('category_id', selectedCategoryId)
    if (sortBy !== 'newest') next.set('sort', sortBy)
    if (minRating) next.set('min_rating', String(minRating))

    setSearchParams(next, { replace: true })
  }, [debouncedSearch, selectedCategoryId, sortBy, minRating, setSearchParams])

  const hasActiveFilters = Boolean(
    search.trim() || selectedCategoryId || sortBy !== 'newest' || minRating,
  )
  const selectedCategoryName = categories.find(
    (category) => category.id === selectedCategoryId,
  )?.name

  const resetFilters = () => {
    setSearch('')
    setSelectedCategoryId('')
    setSortBy('newest')
    setMinRating(0)
  }

  return (
    <main className="min-h-screen bg-[#f7faf9] text-slate-950">
      <Seo
        title="Barcha xizmatlar"
        description="Kategoriya, qidiruv va joylashuv bo'yicha barcha xizmatlarni ko'ring va o'zingizga mosini tanlang."
        canonicalPath="/businesses"
      />
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#04241f] py-14 text-white lg:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_10%_0%,#0a5f4a_0%,#04241f_55%,#021713_100%)]" />
          <div className="absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-teal-400/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm sm:text-xs">
            <StorefrontOutlinedIcon sx={{ fontSize: 16 }} />
            Barcha xizmatlar
          </span>

          <h1 className="mt-6 max-w-4xl text-[34px] font-black leading-[1.08] tracking-tight sm:text-[44px] lg:text-[56px]">
            Barcha xizmatlarni{' '}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              bir joyda
            </span>{' '}
            ko&apos;ring
          </h1>

          <p className="mt-5 max-w-2xl text-[15px] font-medium leading-relaxed text-white/75 sm:text-[17px]">
            Qidiruv, kategoriya va joylashuv bo&apos;yicha filtrlab, o&apos;zingizga mos
            xizmatni tanlang.
          </p>

          {/* Qidiruv */}
          <div className="mt-9 max-w-2xl">
            <div className="group flex h-[60px] items-center gap-3 rounded-2xl border border-white/10 bg-white/95 px-5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] backdrop-blur transition-all duration-200 focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-400/20">
              <SearchIcon className="shrink-0 text-[#0a7a5e]" sx={{ fontSize: 24 }} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Xizmat, kategoriya yoki biznes nomi..."
                aria-label="Xizmatlarni qidirish"
                className="h-full w-full bg-transparent text-[15px] font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700"
                >
                  Tozalash
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Filtrlar */}
      <section className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto max-w-[1380px] px-5 py-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3 text-[#0a7a5e]">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50">
                <TuneIcon sx={{ fontSize: 20 }} />
              </div>
              <span className="text-[13px] font-black uppercase tracking-[0.14em]">
                Filtrlar
              </span>
              {selectedCategoryName && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                  {selectedCategoryName}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <SelectField
                icon={<NearMeOutlinedIcon sx={{ fontSize: 18 }} />}
                value={sortBy}
                onChange={(value) =>
                  setSortBy(
                    ['distance', 'rating'].includes(value) ? (value as SortOption) : 'newest',
                  )
                }
                ariaLabel="Saralash"
                options={[
                  { value: 'newest', label: "Yangi qo'shilganlar" },
                  { value: 'distance', label: 'Yaqin atrofda' },
                  { value: 'rating', label: 'Yuqori reyting' },
                ]}
              />

              <SelectField
                value={String(minRating)}
                onChange={(value) => setMinRating(Number(value))}
                ariaLabel="Reyting bo'yicha filter"
                options={[
                  { value: '0', label: 'Barcha reytinglar' },
                  { value: '5', label: '5 reyting' },
                  { value: '4', label: '4+ reyting' },
                  { value: '3', label: '3+ reyting' },
                ]}
              />

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition-colors duration-150 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                >
                  Tozalash
                </button>
              )}
            </div>
          </div>

          {/* Kategoriyalar */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <CategoryPill
              active={selectedCategoryId === ''}
              onClick={() => setSelectedCategoryId('')}
            >
              Hammasi
            </CategoryPill>

            {categories.map((category) => {
              const isSelected = selectedCategoryId === category.id
              return (
                <CategoryPill
                  key={category.id}
                  active={isSelected}
                  onClick={() => setSelectedCategoryId(isSelected ? '' : category.id)}
                >
                  {category.name}
                </CategoryPill>
              )
            })}
          </div>
        </div>
      </section>

      {/* Natijalar */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-[1380px] px-5 sm:px-8 lg:px-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[26px] font-black leading-tight tracking-tight text-[#071126] sm:text-[32px]">
                {selectedCategoryName ?? 'Barcha xizmatlar'}
              </h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                {isLoadingBusinesses
                  ? 'Yuklanmoqda...'
                  : `${businesses.length} ta xizmat topildi`}
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {isLoadingBusinesses
              ? Array.from({ length: 8 }).map((_, index) => (
                  <BusinessSkeleton key={`business-skeleton-${index}`} />
                ))
              : businesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
          </div>

          {!isLoadingBusinesses && businesses.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-[#0a7a5e] ring-1 ring-emerald-100">
                <LocationOnOutlinedIcon sx={{ fontSize: 32 }} />
              </div>
              <p className="mt-6 text-xl font-extrabold tracking-tight text-slate-900">
                Hozircha xizmat topilmadi
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500">
                Qidiruv so&apos;zini o&apos;zgartiring yoki boshqa kategoriyani tanlang.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-7 h-12 rounded-xl bg-[#0a7a5e] px-6 text-sm font-bold text-white shadow-sm transition-colors duration-150 hover:bg-[#065f49]"
                >
                  Filtrlarni tozalash
                </button>
              )}
            </div>
          )}

          {!isLoadingBusinesses && hasMoreBusinesses && (
            <div className="mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => void loadMoreBusinesses()}
                disabled={isLoadingMoreBusinesses || isFetchingBusinesses}
                className="inline-flex h-[54px] items-center gap-3 rounded-2xl bg-[#0a7a5e] px-7 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(10,122,94,0.6)] transition-all duration-150 hover:bg-[#065f49] hover:shadow-[0_16px_36px_-12px_rgba(10,122,94,0.7)] focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-wait disabled:opacity-60 disabled:shadow-none"
              >
                {isLoadingMoreBusinesses ? 'Yuklanmoqda...' : "Yana ko'rsatish"}
                {!isLoadingMoreBusinesses && <ExpandMoreIcon sx={{ fontSize: 22 }} />}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

/* ---------- Yordamchi komponentlar ---------- */

type SelectFieldProps = {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  ariaLabel: string
  icon?: React.ReactNode
}

function SelectField({ value, onChange, options, ariaLabel, icon }: SelectFieldProps) {
  return (
    <label className="group relative flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 text-slate-700 transition-colors duration-150 hover:border-emerald-300 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100">
      {icon && <span className="shrink-0 text-slate-400">{icon}</span>}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="h-full w-full cursor-pointer appearance-none bg-transparent pr-1 text-sm font-bold text-slate-700 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ExpandMoreIcon
        className="pointer-events-none absolute right-2.5 text-slate-400 transition-transform duration-150 group-focus-within:rotate-180"
        sx={{ fontSize: 20 }}
      />
    </label>
  )
}

type CategoryPillProps = {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function CategoryPill({ active, onClick, children }: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-10 shrink-0 rounded-full px-5 text-sm font-bold transition-all duration-150 ${
        active
          ? 'bg-[#0a7a5e] text-white shadow-[0_8px_20px_-8px_rgba(10,122,94,0.7)]'
          : 'border border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-700'
      }`}
    >
      {children}
    </button>
  )
}

export default BusinessesPage
