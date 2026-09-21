import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import AddIcon from '@mui/icons-material/Add'
import type { ReactNode } from 'react'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import SchoolIcon from '@mui/icons-material/School'
import StorefrontIcon from '@mui/icons-material/Storefront'
import BuildIcon from '@mui/icons-material/Build'
import StarIcon from '@mui/icons-material/Star'
import VerifiedIcon from '@mui/icons-material/Verified'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import { motion } from 'framer-motion'

interface FloatingPinProps {
  className: string
  children: ReactNode
  gradient?: string
  glowColor?: string
}

function FloatingPin({
  className,
  children,
  gradient = 'from-emerald-400/30 to-teal-500/20',
  glowColor = 'bg-emerald-400/40',
}: FloatingPinProps) {
  return (
    <div className={`absolute ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 45 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.12 }}
        className={`group relative grid h-16 w-14 cursor-pointer place-items-center rounded-[50%_50%_50%_12%] border border-white/25 bg-gradient-to-br ${gradient} text-white shadow-2xl shadow-black/30 transition-colors duration-300 hover:border-white/50`}
      >
        {/* Glow behind pin (hover only) */}
        <div
          className={`pointer-events-none absolute -inset-3 rounded-full ${glowColor} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100`}
        />

        {/* Inner highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-[50%_50%_50%_12%] bg-gradient-to-b from-white/30 to-transparent opacity-60" />

        {/* Content (counter-rotated) */}
        <div className="-rotate-45 drop-shadow-md">{children}</div>
      </motion.div>
    </div>
  )
}

/* ==================== MAIN COMPONENT ==================== */
function AuthVisual() {
  const stats = [
    { value: '10K+', label: 'Foydalanuvchi', icon: VerifiedIcon },
    { value: '500+', label: 'Bizneslar', icon: StorefrontIcon },
    { value: '4.9', label: 'Reyting', icon: StarIcon },
  ]

  const pins = [
    { className: 'right-[11%] top-[14%]', gradient: 'from-emerald-400/40 to-teal-500/30', glowColor: 'bg-emerald-400/50', icon: <AddIcon fontSize="large" /> },
    { className: 'right-[24%] top-[26%]', gradient: 'from-amber-400/40 to-orange-500/30', glowColor: 'bg-amber-400/50', icon: <BuildIcon /> },
    { className: 'left-[8%] top-[46%]', gradient: 'from-blue-400/40 to-indigo-500/30', glowColor: 'bg-blue-400/50', icon: <SchoolIcon /> },
    { className: 'left-[26%] top-[58%]', gradient: 'from-violet-400/40 to-purple-500/30', glowColor: 'bg-violet-400/50', icon: <BuildIcon /> },
    { className: 'left-[40%] top-[68%]', gradient: 'from-rose-400/40 to-pink-500/30', glowColor: 'bg-rose-400/50', icon: <StorefrontIcon /> },
    { className: 'left-[46%] top-[46%]', gradient: 'from-teal-400/40 to-cyan-500/30', glowColor: 'bg-teal-400/50', icon: <LocalHospitalIcon /> },
  ]

  return (
    <section className="relative hidden min-h-screen flex-1 overflow-hidden bg-[#021d18] text-white lg:block">
      {/* ==================== BACKGROUND IMAGE (no scale anim) ==================== */}
      <img
        src="https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=1400&q=85"
        alt="me'morchilik"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* ==================== GRADIENT OVERLAYS (static) ==================== */}
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(2,29,24,0.99)_0%,rgba(4,80,60,0.92)_35%,rgba(6,120,88,0.55)_70%,rgba(6,120,88,0.15)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.35),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#01120f] via-[#021d18]/75 to-transparent" />

      {/* ==================== STATIC GLOW ORBS (no animation) ==================== */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-[110px]" />
      <div className="pointer-events-none absolute top-1/3 right-0 h-96 w-96 rounded-full bg-teal-300/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-emerald-500/20 blur-[110px]" />

      {/* ==================== GRID PATTERN (static) ==================== */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />

      {/* ==================== CONCENTRIC CIRCLES (static) ==================== */}
      <div className="pointer-events-none absolute -right-32 top-24 h-[520px] w-[520px] rounded-full border border-white/10 bg-white/[0.02]" />
      <div className="pointer-events-none absolute -right-52 top-40 h-[620px] w-[620px] rounded-full border border-white/[0.08]" />
      <div className="pointer-events-none absolute -right-72 top-56 h-[720px] w-[720px] rounded-full border border-white/[0.05]" />

      {/* ==================== FLOATING PINS (static, entrance only) ==================== */}
      {pins.map((pin, i) => (
        <FloatingPin
          key={i}
          className={pin.className}
          gradient={pin.gradient}
          glowColor={pin.glowColor}
        >
          {pin.icon}
        </FloatingPin>
      ))}

      {/* ==================== CONTENT ==================== */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-14 py-11 xl:px-20">
        {/* ---------- LOGO ---------- */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex items-center gap-3"
        >
          <div className="group relative">
            <div className="absolute inset-0 rounded-full bg-emerald-400/60 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-white to-emerald-50 text-[#047857] shadow-xl shadow-emerald-900/40 transition-transform duration-300 group-hover:scale-105">
              <AccountBalanceIcon />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold leading-none tracking-tight">
              Yaqin
              <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                Xizmat
              </span>
            </span>
            <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
              Platform
            </span>
          </div>
        </motion.div>

        {/* ---------- MAIN CONTENT ---------- */}
        <div className="max-w-[600px] pb-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1.5"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <AutoAwesomeIcon sx={{ fontSize: 12 }} className="text-emerald-300" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/90">
              Biznes uchun platforma
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl font-black leading-[1.05] tracking-tight xl:text-[64px]"
          >
            Yaqin xizmatlar{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
                bir qadam
              </span>
              <span className="absolute inset-x-0 -bottom-2 h-3 rounded-full bg-emerald-400/30 blur-md" />
            </span>{' '}
            yaqinroq
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-6 max-w-[540px] text-lg font-medium leading-8 text-white/80 xl:text-xl xl:leading-9"
          >
            Shaharingizdagi ishonchli xizmatlarni toping va biznesingizni oson
            boshqaring.
          </motion.p>

          {/* ---------- STATS ROW ---------- */}
          <div className="mt-10 grid max-w-[520px] grid-cols-3 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06, duration: 0.35 }}
                className="group relative flex flex-col gap-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-3.5 transition-colors duration-300 hover:border-emerald-300/40 hover:bg-white/[0.1]"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-emerald-400/30 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

                <stat.icon
                  sx={{ fontSize: 16 }}
                  className="relative text-emerald-300 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="relative">
                  <p className="text-lg font-black leading-none text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/55">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ---------- FOOTER ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-5 text-sm font-semibold text-white/70">
            <span className="h-px w-10 bg-gradient-to-r from-emerald-400 to-transparent" />
            <span>Mahalliy bizneslar kuchli jamiyat sari</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-1.5">
            <TrendingUpIcon sx={{ fontSize: 14 }} className="text-emerald-300" />
            <span className="text-xs font-bold text-white/85">
              Har kuni o'smoqda
            </span>
          </div>
        </motion.div>
      </div>

      {/* ==================== CORNER ACCENT (static) ==================== */}
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.4),transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.3),transparent_70%)]" />
    </section>
  )
}

export default AuthVisual