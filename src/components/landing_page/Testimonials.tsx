import StarIcon from '@mui/icons-material/Star'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import VerifiedIcon from '@mui/icons-material/Verified'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useFiveStarReviews } from '../../hooks/useFiveStarReviews'
import { motion, type Variants } from 'framer-motion'

const avatarGradients = [
  'from-emerald-400 to-teal-500 shadow-emerald-500/30',
  'from-blue-400 to-indigo-500 shadow-blue-500/30',
  'from-rose-400 to-pink-500 shadow-rose-500/30',
  'from-amber-400 to-orange-500 shadow-amber-500/30',
  'from-violet-400 to-purple-500 shadow-violet-500/30',
  'from-cyan-400 to-sky-500 shadow-cyan-500/30',
]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

function Testimonials() {
  const { reviews, isLoadingReviews } = useFiveStarReviews()

  return (
    <section
      id="fikrlar"
      className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-amber-100/40 blur-[120px]" 
        />
        <motion.div 
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-0 left-1/4 h-80 w-80 rounded-full bg-emerald-100/40 blur-[120px]" 
        />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
        className="mb-14 flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-200/60 bg-amber-50/80 px-4 py-1.5 backdrop-blur-sm">
            <StarIcon
              sx={{ fontSize: 14 }}
              className="text-amber-500"
            />
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

        <div className="hidden items-center gap-2.5 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-5 py-2.5 shadow-sm backdrop-blur-sm sm:inline-flex">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} sx={{ fontSize: 16 }} />
            ))}
          </div>
          <span className="text-sm font-extrabold text-emerald-800">
            Faqat 5 yulduzli
          </span>
        </div>
      </motion.div>

      {/* Reviews grid */}
      <motion.div 
        variants={containerVariants}
        initial="visible"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {isLoadingReviews
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="relative h-64 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50/50 backdrop-blur-sm"
              >
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
                <div className="p-8">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-slate-200/70" />
                    <div className="flex-1 space-y-2.5 pt-2">
                      <div className="h-3.5 w-32 rounded-full bg-slate-200/70" />
                      <div className="h-3 w-24 rounded-full bg-slate-200/70" />
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="h-3 w-full rounded-full bg-slate-200/70" />
                    <div className="h-3 w-5/6 rounded-full bg-slate-200/70" />
                    <div className="h-3 w-2/3 rounded-full bg-slate-200/70" />
                  </div>
                </div>
              </div>
            ))
          : reviews.map((review, index) => {
              const gradient = avatarGradients[index % avatarGradients.length]
              const initial = (review.user?.full_name || 'M')
                .slice(0, 1)
                .toUpperCase()

              return (
                <motion.article
                  variants={itemVariants}
                  key={review.id}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_15px_40px_-15px_rgba(15,23,42,0.1)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.15)]"
                >
                  {/* Hover gradient overlay */}
                  <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-50/0 via-white/0 to-emerald-50/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Quote icon (background) */}
                  <FormatQuoteIcon
                    className="pointer-events-none absolute -right-4 -top-4 text-slate-100/80 transition-colors duration-500 group-hover:text-emerald-50"
                    sx={{ fontSize: 120 }}
                  />

                  {/* Rating badge */}
                  <div className="absolute right-6 top-6 z-10 flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50/90 px-3 py-1 shadow-sm backdrop-blur-sm">
                    <StarIcon
                      sx={{ fontSize: 14 }}
                      className="text-amber-500"
                    />
                    <span className="text-xs font-black text-amber-700">
                      5.0
                    </span>
                  </div>

                  {/* Header: avatar + name */}
                  <div className="relative flex items-start gap-4 pr-20">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      {/* Glow behind avatar */}
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70`}
                      />
                      <div
                        className={`relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${gradient} text-xl font-black text-white shadow-xl ring-4 ring-white`}
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
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                      >
                         <StarIcon sx={{ fontSize: 18 }} />
                      </motion.div>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="relative mt-4 text-[15px] font-medium leading-relaxed text-slate-600">
                    "
                    {review.comment ||
                      `${review.businessName} xizmati juda yoqdi. Albatta hammaga tavsiya qilaman!`}
                    "
                  </p>

                  {/* Bottom decorative line */}
                  <div
                    className={`mt-6 h-1 w-12 rounded-full bg-gradient-to-r ${gradient} opacity-60 transition-all duration-500 group-hover:w-24 group-hover:opacity-100`}
                  />
                </motion.article>
              )
            })}
      </motion.div>

      {/* Empty state */}
      {!isLoadingReviews && reviews.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center backdrop-blur-sm"
        >
          {/* Decorative dots */}
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute left-[15%] top-[25%] h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
            <div className="absolute right-[20%] top-[35%] h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
            <div className="absolute bottom-[30%] left-[25%] h-2 w-2 rounded-full bg-teal-300 animate-bounce" />
          </div>

          <div className="relative mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100 shadow-inner">
            <StarIcon className="text-amber-500" sx={{ fontSize: 36 }} />
          </div>

          <p className="relative text-xl font-black text-slate-800">
            Hozircha fikrlar yo'q
          </p>
          <p className="relative mx-auto mt-3 max-w-md text-base font-medium text-slate-500">
            Foydalanuvchilar baho qoldirganidan keyin ularning fikrlari shu
            yerda ko'rinadi.
          </p>

          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="#kategoriyalar"
            className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:from-emerald-400 hover:to-teal-400 hover:shadow-xl hover:shadow-emerald-400/40"
          >
            Xizmatlarni ko'rish
            <ArrowForwardIcon
              fontSize="small"
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </motion.a>
        </motion.div>
      )}

      {/* Custom shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  )
}

export default Testimonials
