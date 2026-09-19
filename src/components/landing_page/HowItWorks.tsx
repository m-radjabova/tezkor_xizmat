import CheckIcon from '@mui/icons-material/Check'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SearchIcon from '@mui/icons-material/Search'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import type { SvgIconComponent } from '@mui/icons-material'
import { motion, type Variants } from 'framer-motion'

interface Step {
  icon: SvgIconComponent
  title: string
  text: string
  gradient: string
  ring: string
}

const steps: Step[] = [
  {
    icon: SearchIcon,
    title: 'Qidirish',
    text: 'Kerakli xizmatni yoki kategoriyani tanlang',
    gradient: 'from-emerald-400 to-teal-500 shadow-emerald-500/40',
    ring: 'ring-emerald-400/30',
  },
  {
    icon: FormatListBulletedIcon,
    title: 'Tanlash',
    text: "O'zingizga mos joyni tanlang va ma'lumot bilan tanishing",
    gradient: 'from-blue-400 to-indigo-500 shadow-blue-500/40',
    ring: 'ring-blue-400/30',
  },
  {
    icon: LocationOnIcon,
    title: 'Manzilni topish',
    text: "Xaritada joylashuvni ko'ring va yo'nalish oling",
    gradient: 'from-amber-400 to-orange-500 shadow-amber-500/40',
    ring: 'ring-amber-400/30',
  },
  {
    icon: CheckIcon,
    title: 'Foydalanish',
    text: 'Xizmatdan foydalaning va baho qoldiring',
    gradient: 'from-rose-400 to-pink-500 shadow-rose-500/40',
    ring: 'ring-rose-400/30',
  },
]

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

function HowItWorks() {
  return (
    <section
      id="biz-haqimizda"
      className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-20"
    >
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-emerald-100/50 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-teal-100/40 blur-[120px]" />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="mb-14 flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Qanday ishlaydi?
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Bu qanday{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
              ishlaydi?
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-slate-500 sm:text-lg">
            Atigi 4 ta oddiy qadamda kerakli xizmatni toping va ishingizni bitiring.
          </p>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-5 py-2.5 shadow-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-sm font-extrabold text-slate-700">
            Juda oson!
          </span>
        </div>
      </motion.div>

      {/* Steps grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative grid gap-5 sm:grid-cols-2 md:grid-cols-4 lg:gap-6"
      >
        {/* Connecting line (desktop) */}
        <div className="pointer-events-none absolute left-[12%] right-[12%] top-[72px] hidden md:block">
          <div className="relative h-[2px] w-full rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 via-teal-100 to-rose-100" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-emerald-400/80 to-emerald-400/0 animate-[dash_4s_linear_infinite]" />
          </div>
        </div>

        {steps.map((step, index) => (
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -10 }}
            key={step.title}
            className="group relative flex flex-col items-center rounded-[32px] border border-slate-100 bg-white/80 p-8 text-center shadow-[0_15px_40px_-15px_rgba(15,23,42,0.1)] backdrop-blur-xl transition-all duration-300 hover:border-emerald-100 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.2)]"
          >
            {/* Number badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br ${step.gradient} text-sm font-black text-white shadow-xl ring-4 ring-white transition-transform duration-300 group-hover:scale-110`}
              >
                {index + 1}
              </span>
            </div>

            {/* Icon */}
            <div className="relative mt-4 mb-6">
              {/* Glow behind */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.gradient} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-70`}
              />

              {/* Icon circle */}
              <div
                className={`relative grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br ${step.gradient} text-white shadow-xl ring-8 ${step.ring} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}
              >
                {/* Inner shine */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                <step.icon
                  sx={{ fontSize: 36 }}
                  className="relative drop-shadow-md"
                />
              </div>
            </div>

            {/* Title */}
            <h3 className="relative text-xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors duration-300">
              {step.title}
            </h3>

            {/* Text */}
            <p className="relative mt-3 text-sm font-medium leading-relaxed text-slate-500">
              {step.text}
            </p>

            {/* Arrow between steps (mobile/tablet) */}
            {index < steps.length - 1 && (
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 sm:hidden">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-white text-slate-300 shadow-md">
                  <ArrowForwardIcon className="rotate-90" fontSize="small" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-16 flex justify-center"
      >
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="#kategoriyalar"
          className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:from-emerald-400 hover:to-teal-400 hover:shadow-xl hover:shadow-emerald-500/40"
        >
          Hoziroq boshlash
          <ArrowForwardIcon
            fontSize="small"
            className="transition-transform duration-300 group-hover:translate-x-1.5"
          />
        </motion.a>
      </motion.div>

      {/* Custom keyframes */}
      <style>{`
        @keyframes dash {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  )
}

export default HowItWorks
