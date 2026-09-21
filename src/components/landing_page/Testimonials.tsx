import StarIcon from '@mui/icons-material/Star'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import VerifiedIcon from '@mui/icons-material/Verified'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useFiveStarReviews } from '../../hooks/useFiveStarReviews'

const avatarGradients = [
  'from-emerald-400 to-teal-500',
  'from-blue-400 to-indigo-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
  'from-violet-400 to-purple-500',
  'from-cyan-400 to-sky-500',
]

function Testimonials() {
  const { reviews, isLoadingReviews } = useFiveStarReviews()

  return (
    <section
      id="fikrlar"
      className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20"
    >
      {/* Decorative background — statik */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-emerald-100/40 blur-3xl" />
      </div>

      {/* Header */}
      <div className="testimonials-fade mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-amber-50/80 px-4 py-1.5">
            <StarIcon sx={{ fontSize: 14 }} className="text-amber-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
              Mijozlar fikri
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-5xl">
            Foydalanuvchilar{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              fikri
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-base font-medium text-slate-500 sm:text-lg">
            Bizga ishonch bildirgan va xizmatlarimizdan rozi bo'lgan mijozlarning haqiqiy fikrlari.
          </p>
        </div>

        <div className="hidden items-center gap-2.5 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-5 py-2.5 shadow-sm sm:inline-flex">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} sx={{ fontSize: 16 }} />
            ))}
          </div>
          <span className="text-sm font-extrabold text-emerald-800">
            Faqat 5 yulduzli
          </span>
        </div>
      </div>

      {/* Reviews grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoadingReviews
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="relative h-64 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50"
              >
                <div className="p-8">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-slate-200" />
                    <div className="flex-1 space-y-2.5 pt-2">
                      <div className="h-3.5 w-32 rounded-full bg-slate-200" />
                      <div className="h-3 w-24 rounded-full bg-slate-200" />
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="h-3 w-full rounded-full bg-slate-200" />
                    <div className="h-3 w-5/6 rounded-full bg-slate-200" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            ))
          : reviews.map((review, index) => {
              const gradient = avatarGradients[index % avatarGradients.length]
              const initial = (review.user?.full_name || 'M').slice(0, 1).toUpperCase()

              return (
                <article
                  key={review.id}
                  className="testimonial-card group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-md transition-shadow duration-200 hover:shadow-lg"
                >
                  {/* Hover gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-50/0 via-white/0 to-emerald-50/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Quote icon */}
                  <FormatQuoteIcon
                    className="pointer-events-none absolute -right-4 -top-4 text-slate-100 transition-colors duration-300 group-hover:text-emerald-50"
                    sx={{ fontSize: 120 }}
                  />

                  {/* Rating badge */}
                  <div className="absolute right-6 top-6 z-10 flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 shadow-sm">
                    <StarIcon sx={{ fontSize: 14 }} className="text-amber-500" />
                    <span className="text-xs font-black text-amber-700">5.0</span>
                  </div>

                  {/* Header */}
                  <div className="relative flex items-start gap-4 pr-20">
                    <div className="relative shrink-0">
                      <div
                        className={`grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-xl font-black text-white shadow-md ring-4 ring-white`}
                      >
                        {initial}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1 pt-1.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="truncate text-base font-extrabold text-slate-900">
                          {review.user?.full_name || 'YaqinXizmat mijozi'}
                        </h3>
                        <VerifiedIcon
                          sx={{ fontSize: 16 }}
                          className="shrink-0 text-emerald-500"
                        />
                      </div>
                      <p className="mt-1 truncate text-xs font-bold text-slate-400">
                        {review.businessName}
                      </p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="relative mt-6 flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarIcon key={i} sx={{ fontSize: 18 }} />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="relative mt-4 text-[15px] font-medium leading-relaxed text-slate-600">
                    "
                    {review.comment ||
                      `${review.businessName} xizmati juda yoqdi. Albatta hammaga tavsiya qilaman!`}
                    "
                  </p>

                  {/* Bottom line */}
                  <div
                    className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-r ${gradient} opacity-60 transition-all duration-300 group-hover:w-24 group-hover:opacity-100`}
                  />
                </article>
              )
            })}
      </div>

      {/* Empty state */}
      {!isLoadingReviews && reviews.length === 0 && (
        <div className="testimonials-fade relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
          <div className="relative mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100">
            <StarIcon className="text-amber-500" sx={{ fontSize: 36 }} />
          </div>

          <p className="relative text-xl font-black text-slate-800">
            Hozircha fikrlar yo'q
          </p>
          <p className="relative mx-auto mt-3 max-w-md text-base font-medium text-slate-500">
            Foydalanuvchilar baho qoldirganidan keyin ularning fikrlari shu yerda ko'rinadi.
          </p>

          <a
            href="#kategoriyalar"
            className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-extrabold text-white shadow-md transition-colors duration-200 hover:from-emerald-400 hover:to-teal-400"
          >
            Xizmatlarni ko'rish
            <ArrowForwardIcon
              fontSize="small"
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
        </div>
      )}
    </section>
  )
}

export default Testimonials