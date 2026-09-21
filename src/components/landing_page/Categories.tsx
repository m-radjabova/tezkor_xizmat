import { useEffect, useMemo, useRef, useState } from 'react'
import CategoryIcon from '@mui/icons-material/Category'
import TuneIcon from '@mui/icons-material/Tune'
import type { UIEvent } from 'react'
import type { Category } from '../../types'

const INITIAL_VISIBLE_CATEGORIES = 9
const CATEGORY_LOAD_BATCH = 6
const SCROLL_LOAD_THRESHOLD = 260

interface CategoriesProps {
  categories: Category[]
  selectedCategoryId: string
  isLoading: boolean
  onSelect: (id: string) => void
}

function CategoryImage({
  src,
  alt,
  className,
}: {
  src?: string | null
  alt: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return <CategoryIcon className={className} />
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-contain"
    />
  )
}

function CategorySkeleton() {
  return (
    <div className="h-[90px] w-[120px] shrink-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:w-[130px]">
      <div className="flex h-full items-center gap-3">
        <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-100" />
        <div className="h-3 w-2/3 rounded-full bg-slate-100" />
      </div>
    </div>
  )
}

function Categories({
  categories,
  selectedCategoryId,
  isLoading,
  onSelect,
}: CategoriesProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_CATEGORIES)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadMoreTimerRef = useRef<number | null>(null)

  const selectedCategoryIndex = categories.findIndex(
    (category) => category.id === selectedCategoryId,
  )
  const safeVisibleCount = Math.max(
    visibleCount,
    selectedCategoryIndex >= 0 ? selectedCategoryIndex + 1 : INITIAL_VISIBLE_CATEGORIES,
  )
  const visibleCategories = useMemo(
    () => categories.slice(0, safeVisibleCount),
    [categories, safeVisibleCount],
  )
  const hasMoreCategories = visibleCategories.length < categories.length

  const handleSelect = (id: string) => {
    onSelect(selectedCategoryId === id ? '' : id)
  }

  const loadMoreCategories = () => {
    if (isLoadingMore || !hasMoreCategories) return

    setIsLoadingMore(true)
    loadMoreTimerRef.current = window.setTimeout(() => {
      setVisibleCount((current) =>
        Math.min(current + CATEGORY_LOAD_BATCH, categories.length),
      )
      setIsLoadingMore(false)
      loadMoreTimerRef.current = null
    }, 350)
  }

  const handleCategoryScroll = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget
    const distanceToEnd =
      element.scrollWidth - element.scrollLeft - element.clientWidth

    if (distanceToEnd <= SCROLL_LOAD_THRESHOLD) {
      loadMoreCategories()
    }
  }

  useEffect(() => {
    return () => {
      if (loadMoreTimerRef.current) {
        window.clearTimeout(loadMoreTimerRef.current)
      }
    }
  }, [])

  return (
    <section
      id="kategoriyalar"
      className="w-full border-y border-slate-100 bg-[#f7faf8] py-8 sm:py-10 lg:py-12"
    >
      <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-14">
        {/* Header */}
        <div className="mb-5 flex items-end justify-between gap-4 sm:mb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">
              Xizmatlar katalogi
            </p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Kategoriyani tanlang
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onSelect('')}
            disabled={!selectedCategoryId}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-bold text-slate-700 shadow-sm transition-colors duration-200 hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <TuneIcon sx={{ fontSize: 18 }} /> Barchasi
          </button>
        </div>

        {/* Categories scroll */}
        <div
          className="category-scrollbar flex touch-pan-x snap-x gap-3 overflow-x-auto pb-2 pt-1 sm:gap-4"
          onScroll={handleCategoryScroll}
        >
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CategorySkeleton key={index} />
            ))
          ) : categories.length ? (
            <>
              {visibleCategories.map((category) => {
                const isSelected = selectedCategoryId === category.id

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleSelect(category.id)}
                    className={`
                      group relative mt-8 flex h-[90px] w-[120px] shrink-0 snap-start
                      flex-col items-center justify-end
                      rounded-2xl border px-2 pb-3 pt-9 text-center
                      transition-colors duration-200
                      sm:w-[130px]
                      ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg'
                          : 'border-slate-200 bg-white text-slate-800 shadow-sm hover:border-emerald-300'
                      }
                    `}
                  >
                    {/* Icon */}
                    <div
                      className={`
                        absolute left-1/2 top-0
                        flex h-14 w-14
                        -translate-x-1/2 -translate-y-1/2
                        items-center justify-center
                        rounded-2xl border
                        transition-colors duration-200
                        ${
                          isSelected
                            ? 'border-emerald-400 bg-emerald-500 shadow-lg'
                            : 'border-slate-200 bg-white shadow-md group-hover:border-emerald-300'
                        }
                      `}
                    >
                      <div className="h-8 w-8">
                        <CategoryImage
                          src={category.icon}
                          alt={category.name}
                          className={
                            isSelected
                              ? 'text-white'
                              : 'text-slate-600 group-hover:text-emerald-600'
                          }
                        />
                      </div>
                    </div>

                    {/* Category name */}
                    <span
                      className={`
                        line-clamp-2 w-full text-[12px] font-bold leading-snug
                        transition-colors duration-200
                        sm:text-[13px]
                        ${
                          isSelected
                            ? 'text-white'
                            : 'text-slate-700 group-hover:text-emerald-700'
                        }
                      `}
                    >
                      {category.name}
                    </span>
                  </button>
                )
              })}

              {(isLoadingMore || hasMoreCategories) &&
                Array.from({ length: isLoadingMore ? 3 : 1 }).map((_, index) => (
                  <CategorySkeleton key={`more-${index}`} />
                ))}
            </>
          ) : (
            <div className="w-full shrink-0 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm font-semibold text-slate-500">
              Hozircha kategoriyalar mavjud emas.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Categories
